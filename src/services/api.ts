import { Platform } from 'react-native';

// Configuración de la URL del backend
// En Android Emulator: 10.0.2.2 apunta a localhost del host
// En dispositivo físico con Expo Go: usar la IP de tu PC en la red local
// En Web: localhost funciona directamente
const getBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8000';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  // iOS Simulator o dispositivo físico: usar IP local de tu PC
  // Cambiar esta IP por la de tu computadora en la red WiFi
  return 'http://192.168.1.100:8000';
};

export const API_BASE_URL = getBaseUrl();

// Token de autenticación almacenado en memoria (para demo)
let authToken: string | null = null;
let currentUserId: number | null = null;

export const setAuthToken = (token: string, userId: number) => {
  authToken = token;
  currentUserId = userId;
};

export const getAuthToken = () => authToken;
export const getCurrentUserId = () => currentUserId;
export const clearAuth = () => {
  authToken = null;
  currentUserId = null;
};

// Helper para hacer peticiones HTTP al backend
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error ${response.status}`);
  }

  return response.json();
}

// ========================
// API DE AUTENTICACIÓN
// ========================

export interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  token: string;
}

export const apiLogin = async (email: string, password: string): Promise<LoginResponse> => {
  const data = await fetchApi<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.token, data.id);
  return data;
};

export const apiRegister = async (
  nombre: string,
  email: string,
  password: string,
  telefono?: string
): Promise<LoginResponse> => {
  const data = await fetchApi<LoginResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password, telefono }),
  });
  setAuthToken(data.token, data.id);
  return data;
};

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

export const apiGetPacientes = async (usuarioId?: number): Promise<PacienteListItem[]> => {
  const query = usuarioId ? `?usuario_id=${usuarioId}` : '';
  return fetchApi<PacienteListItem[]>(`/api/pacientes${query}`);
};

export const apiGetEstadoPaciente = async (pacienteId: number): Promise<EstadoPaciente> => {
  return fetchApi<EstadoPaciente>(`/api/pacientes/${pacienteId}/estado`);
};

// ========================
// API DE HISTORIAL
// ========================

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

export const apiGetHistorial = async (
  pacienteId: number,
  periodo: string = 'Semana'
): Promise<HistorialResponse> => {
  return fetchApi<HistorialResponse>(
    `/api/pacientes/${pacienteId}/historial?periodo=${periodo}`
  );
};

// ========================
// API DE ALERTAS
// ========================

export interface AlertaItem {
  id: number;
  tipo: 'danger' | 'warning' | 'info';
  titulo: string;
  descripcion: string;
  fecha: string;
  resuelta: boolean;
}

export const apiGetAlertas = async (pacienteId: number): Promise<AlertaItem[]> => {
  return fetchApi<AlertaItem[]>(`/api/pacientes/${pacienteId}/alertas`);
};

export const apiResolverAlerta = async (alertaId: number): Promise<{ mensaje: string }> => {
  return fetchApi<{ mensaje: string }>(`/api/alertas/${alertaId}/resolver`, {
    method: 'PUT',
  });
};

export const apiEnviarSOS = async (
  pacienteId: number,
  mensaje?: string
): Promise<{ mensaje: string; alerta_id: number }> => {
  return fetchApi<{ mensaje: string; alerta_id: number }>('/api/alertas/sos', {
    method: 'POST',
    body: JSON.stringify({ paciente_id: pacienteId, mensaje }),
  });
};

// ========================
// API DE VINCULACIÓN
// ========================

export const apiVincularDispositivo = async (
  codigoVinculacion: string,
  nombrePaciente?: string,
  edad?: number,
  condiciones?: string,
  parentesco?: string
): Promise<{ mensaje: string; paciente_id: number; nombre_paciente: string }> => {
  return fetchApi('/api/dispositivos/vincular', {
    method: 'POST',
    body: JSON.stringify({
      codigo_vinculacion: codigoVinculacion,
      nombre_paciente: nombrePaciente,
      edad,
      condiciones,
      parentesco,
    }),
  });
};
