// Cuidador info
export const cuidador = {
  nombre: 'Juan',
  email: 'juan@email.com',
};

// Paciente info 
export const paciente = {
  nombre: 'María López',
  iniciales: 'ML',
  edad: 78,
  condiciones: ['Hipertensión', 'Diabetes Tipo 2'],
  estado: 'Estable' as const,
  ubicacion: 'En Casa',
  ultimaConexion: 'Hace 5 min',
};

// Signos vitales actuales
export const signosVitales = {
  ritmoCardiaco: { valor: 74, unidad: 'bpm', estado: 'normal' as const },
  movimiento: { valor: 'Normal', estado: 'normal' as const },
  ubicacion: { valor: 'En Casa', estado: 'normal' as const },
  bateria: { valor: 85, unidad: '%', estado: 'normal' as const },
};

// Historial de ritmo cardíaco semanal
export const historialSemanal = [
  { dia: 'L', valor: 72 },
  { dia: 'M', valor: 75 },
  { dia: 'Mi', valor: 68 },
  { dia: 'J', valor: 74 },
  { dia: 'V', valor: 80 },
  { dia: 'S', valor: 71 },
  { dia: 'D', valor: 73 },
];

// Estadísticas
export const estadisticas = {
  promedio: 73,
  maximo: 80,
  minimo: 68,
};

// Alertas
export interface Alerta {
  id: string;
  tipo: 'danger' | 'warning' | 'info';
  titulo: string;
  descripcion: string;
  fecha: string;
  resuelta: boolean;
}

export const alertas: Alerta[] = [
  { id: '1', tipo: 'danger', titulo: 'Frecuencia cardíaca alta', descripcion: 'Se detectó 95 bpm durante 10 minutos', fecha: 'Hace 2 días', resuelta: true },
  { id: '2', tipo: 'warning', titulo: 'Batería baja del dispositivo', descripcion: 'La pulsera tiene solo 15% de batería', fecha: 'Hace 3 días', resuelta: true },
  { id: '3', tipo: 'info', titulo: 'Salió de la zona segura', descripcion: 'María salió del perímetro configurado', fecha: 'Hace 5 días', resuelta: true },
];
