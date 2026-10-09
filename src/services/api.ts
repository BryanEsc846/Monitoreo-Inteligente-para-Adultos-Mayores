import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WatchData } from '../types/WatchData';

// Persistencia local para la demostración sin backend.
export const DEMO_CAREGIVER_NAME = 'Juan Pérez';
export const getCurrentUserId = () => 1;

// ========================
// API DE PACIENTES
// ========================

export interface PacienteListItem {
  id: number;
  nombre: string;
  iniciales: string;
  edad: number;
  condiciones: string[];
  dispositivo_codigo: string;
}

export interface SignosVitales {
  ritmoCardiaco: { valor: number; unidad: string; estado: string };
  movimiento: { valor: string; estado: string };
  ubicacion: { valor: string; estado: string };
  bateria: { valor: number; unidad: string; estado: string };
}

export interface EstadoPaciente {
  id: number;
  nombre: string;
  iniciales: string;
  edad: number;
  condiciones: string[];
  estado: string; // "Estable", "Alerta", "Crítico"
  ubicacion: string;
  ultima_conexion: string;
  dispositivo_codigo: string | null;
  signos_vitales: SignosVitales;
}

const pacienteDemo: PacienteListItem = {
  id: 1,
  nombre: 'María López',
  iniciales: 'ML',
  edad: 72,
  condiciones: ['Hipertensión controlada'],
  dispositivo_codigo: 'VTL-101',
};

const estadoDemo: EstadoPaciente = {
  ...pacienteDemo,
  estado: 'Estable',
  ubicacion: 'En Casa',
  ultima_conexion: 'Hace 5 min',
  dispositivo_codigo: 'VTL-101',
  signos_vitales: {
    ritmoCardiaco: { valor: 72, unidad: 'bpm', estado: 'Normal' },
    movimiento: { valor: 'Moderado', estado: 'Normal' },
    ubicacion: { valor: 'En Casa', estado: 'Segura' },
    bateria: { valor: 85, unidad: '%', estado: 'Normal' },
  },
};

export const apiGetPacientes = async (_usuarioId?: number): Promise<PacienteListItem[]> => [
  { ...pacienteDemo },
];

export const apiGetEstadoPaciente = async (_pacienteId: number): Promise<EstadoPaciente> => ({
  ...estadoDemo,
  signos_vitales: { ...estadoDemo.signos_vitales },
});

export interface DatoPuntoHistorial {
  dia: string;
  valor: number;
}

export interface EstadisticasHistorial {
  promedio: number;
  maximo: number;
  minimo: number;
}

export interface HistorialResponse {
  periodo: string;
  puntos: DatoPuntoHistorial[];
  estadisticas: EstadisticasHistorial;
}

const ALERTS_STORAGE_KEY = 'vitalia.alertas';
const READINGS_STORAGE_KEY = 'vitalia.lecturas';
const LAST_READING_STORAGE_PREFIX = 'vitalia.ultimaLectura.';
const MAX_STORED_READINGS = 5000;
const processedReadingKeys = new Set<string>();

type StoredReading = WatchData & { watchId: string };

const readStored = async <T,>(key: string, fallback: T): Promise<T> => {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`No se pudo leer ${key}`, error);
    return fallback;
  }
};

const formatAlertDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

export const apiGuardarLectura = async (watchId: string, data: WatchData) => {
  const readings = await readStored<StoredReading[]>(READINGS_STORAGE_KEY, []);
  if (readings.some(reading => reading.watchId === watchId && reading.timestamp === data.timestamp)) {
    return;
  }
  const next = [...readings, { ...data, watchId }].slice(-MAX_STORED_READINGS);
  await AsyncStorage.setItem(READINGS_STORAGE_KEY, JSON.stringify(next));
};

export const apiCrearAlertasDesdeLectura = async (
  watchId: string,
  data: WatchData
): Promise<AlertaItem[]> => {
  const processedKey = `${watchId}:${data.timestamp}`;
  if (processedReadingKeys.has(processedKey)) return [];
  processedReadingKeys.add(processedKey);
  const processed = await readStored<string[]>('vitalia.alertasProcesadas', []);
  if (processed.includes(processedKey)) return [];

  const previous = await readStored<WatchData | null>(
    `${LAST_READING_STORAGE_PREFIX}${watchId}`,
    null
  );
  const alertas: AlertaItem[] = [];
  const agregar = (tipo: AlertaItem['tipo'], titulo: string, descripcion: string) => {
    alertas.push({
      id: Date.now() + alertas.length,
      tipo,
      titulo,
      descripcion,
      fecha: formatAlertDate(data.timestamp),
      timestamp: data.timestamp,
      resuelta: false,
    });
  };

  if (data.caidaDetectada && !previous?.caidaDetectada) {
    agregar('danger', 'Posible caída detectada', 'El acelerómetro del reloj detectó un impacto fuerte.');
  }
  if (
    data.frecuenciaCardiaca > 110 &&
    (!previous || previous.frecuenciaCardiaca <= 110)
  ) {
    agregar(
      'danger',
      'Frecuencia cardíaca elevada',
      `Se detectaron ${data.frecuenciaCardiaca} pulsaciones por minuto.`
    );
  }
  const fueraDeCasa = data.ubicacion?.startsWith('Fuera de casa') === true;
  const anteriormenteFuera = previous?.ubicacion?.startsWith('Fuera de casa') === true;
  if (fueraDeCasa && !anteriormenteFuera) {
    agregar('warning', 'Paciente fuera de casa', data.ubicacion || 'Se detectó salida del domicilio.');
  }

  if (alertas.length > 0) {
    const existing = await readStored<AlertaItem[]>(ALERTS_STORAGE_KEY, []);
    await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify([...alertas, ...existing]));
  }
  await AsyncStorage.setItem(
    'vitalia.alertasProcesadas',
    JSON.stringify([...processed, processedKey].slice(-200))
  );
  await AsyncStorage.setItem(`${LAST_READING_STORAGE_PREFIX}${watchId}`, JSON.stringify(data));
  return alertas;
};

const createPoints = (readings: StoredReading[], periodo: string): DatoPuntoHistorial[] => {
  const groups = new Map<string, number[]>();
  readings.forEach(reading => {
    const date = new Date(reading.timestamp);
    const key = periodo === 'Hoy'
      ? `${date.getHours().toString().padStart(2, '0')}:00`
      : periodo === 'Semana'
        ? date.toLocaleDateString([], { weekday: 'short' })
        : date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    groups.set(key, [...(groups.get(key) || []), reading.frecuenciaCardiaca]);
  });
  return Array.from(groups.entries()).map(([dia, values]) => ({
    dia,
    valor: Math.round(values.reduce((total, value) => total + value, 0) / values.length),
  }));
};

export const apiGetHistorial = async (
  _pacienteId: number,
  periodo: string = 'Semana'
): Promise<HistorialResponse> => {
  const now = Date.now();
  const start = periodo === 'Hoy'
    ? new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    : now - (periodo === 'Mes' ? 30 : 7) * 24 * 60 * 60 * 1000;
  const readings = (await readStored<StoredReading[]>(READINGS_STORAGE_KEY, []))
    .filter(reading => reading.timestamp >= start && reading.timestamp <= now);
  const puntos = createPoints(readings, periodo);
  const valores = puntos.map(punto => punto.valor);
  return {
    periodo,
    puntos,
    estadisticas: {
      promedio: valores.length ? Math.round(valores.reduce((total, valor) => total + valor, 0) / valores.length) : 0,
      maximo: valores.length ? Math.max(...valores) : 0,
      minimo: valores.length ? Math.min(...valores) : 0,
    },
  };
};

// ========================
// ALERTAS DE LA DEMOSTRACIÓN
// ========================

export interface AlertaItem {
  id: number;
  tipo: 'danger' | 'warning' | 'info';
  titulo: string;
  descripcion: string;
  fecha: string;
  timestamp?: number;
  resuelta: boolean;
}

export const apiGetAlertas = async (_pacienteId: number): Promise<AlertaItem[]> =>
  readStored<AlertaItem[]>(ALERTS_STORAGE_KEY, []);

export const apiResolverAlerta = async (alertaId: number): Promise<{ mensaje: string }> => {
  const alertas = await readStored<AlertaItem[]>(ALERTS_STORAGE_KEY, []);
  await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alertas.map(alerta =>
    alerta.id === alertaId ? { ...alerta, resuelta: true } : alerta
  )));
  return { mensaje: 'La alerta ha sido marcada como atendida.' };
};

export const apiEnviarSOS = async (
  _pacienteId: number,
  mensaje = 'Se generó una alerta SOS en la demostración local.'
): Promise<{ mensaje: string; alerta_id: number }> => {
  const alertaId = Date.now();
  const alertas = await readStored<AlertaItem[]>(ALERTS_STORAGE_KEY, []);
  await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify([{
    id: alertaId,
    tipo: 'danger',
    titulo: 'Emergencia SOS',
    descripcion: mensaje,
    fecha: formatAlertDate(alertaId),
    timestamp: alertaId,
    resuelta: false,
  }, ...alertas]));
  return { mensaje: 'Alerta registrada en esta demostración.', alerta_id: alertaId };
};
