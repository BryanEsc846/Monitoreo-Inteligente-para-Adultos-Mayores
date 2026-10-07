// Datos temporales en memoria para ejecutar la demostración sin backend.
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

const puntosPorPeriodo: Record<string, DatoPuntoHistorial[]> = {
  Hoy: [
    { dia: '8a', valor: 70 }, { dia: '10a', valor: 72 }, { dia: '12p', valor: 75 },
    { dia: '2p', valor: 73 }, { dia: '4p', valor: 71 }, { dia: '6p', valor: 72 },
  ],
  Semana: [
    { dia: 'L', valor: 72 }, { dia: 'M', valor: 75 }, { dia: 'Mi', valor: 68 },
    { dia: 'J', valor: 74 }, { dia: 'V', valor: 80 }, { dia: 'S', valor: 71 }, { dia: 'D', valor: 74 },
  ],
  Mes: [
    { dia: '1', valor: 70 }, { dia: '5', valor: 73 }, { dia: '10', valor: 75 },
    { dia: '15', valor: 69 }, { dia: '20', valor: 77 }, { dia: '25', valor: 72 }, { dia: '30', valor: 74 },
  ],
};

export const apiGetHistorial = async (
  _pacienteId: number,
  periodo: string = 'Semana'
): Promise<HistorialResponse> => {
  const puntos = puntosPorPeriodo[periodo] || puntosPorPeriodo.Semana;
  const valores = puntos.map(punto => punto.valor);
  return {
    periodo,
    puntos: puntos.map(punto => ({ ...punto })),
    estadisticas: {
      promedio: Math.round(valores.reduce((total, valor) => total + valor, 0) / valores.length),
      maximo: Math.max(...valores),
      minimo: Math.min(...valores),
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
  resuelta: boolean;
}

let alertasDemo: AlertaItem[] = [
  {
    id: 1,
    tipo: 'info',
    titulo: 'Monitoreo iniciado',
    descripcion: 'El seguimiento de María López está activo.',
    fecha: 'Hoy, 08:00',
    resuelta: false,
  },
];

export const apiGetAlertas = async (_pacienteId: number): Promise<AlertaItem[]> =>
  alertasDemo.map(alerta => ({ ...alerta }));

export const apiResolverAlerta = async (alertaId: number): Promise<{ mensaje: string }> => {
  alertasDemo = alertasDemo.map(alerta =>
    alerta.id === alertaId ? { ...alerta, resuelta: true } : alerta
  );
  return { mensaje: 'La alerta ha sido marcada como atendida.' };
};

export const apiEnviarSOS = async (
  _pacienteId: number,
  mensaje = 'Se generó una alerta SOS en la demostración local.'
): Promise<{ mensaje: string; alerta_id: number }> => {
  const alertaId = Date.now();
  alertasDemo = [{
    id: alertaId,
    tipo: 'danger',
    titulo: 'Emergencia SOS',
    descripcion: mensaje,
    fecha: 'Ahora',
    resuelta: false,
  }, ...alertasDemo];
  return { mensaje: 'Alerta registrada en esta demostración.', alerta_id: alertaId };
};

