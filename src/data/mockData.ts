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

// Medicamentos
export interface Medicamento {
  id: string;
  nombre: string;
  dosis: string;
  horario: string;
  tomado: boolean;
  icono: string;
}

export const medicamentos: Medicamento[] = [
  { id: '1', nombre: 'Losartán', dosis: '50mg', horario: '8:00 AM', tomado: true, icono: 'medical' },
  { id: '2', nombre: 'Metformina', dosis: '850mg', horario: '1:00 PM', tomado: false, icono: 'medical' },
  { id: '3', nombre: 'Aspirina', dosis: '100mg', horario: '9:00 PM', tomado: false, icono: 'medical' },
  { id: '4', nombre: 'Omeprazol', dosis: '20mg', horario: '8:00 AM', tomado: true, icono: 'medical' },
];

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

// Actividad del día
export interface ActividadItem {
  id: string;
  hora: string;
  descripcion: string;
  tipo: 'info' | 'warning' | 'success';
}

export const actividadDiaria: ActividadItem[] = [
  { id: '1', hora: '9:30 AM', descripcion: 'Caminó 500 pasos', tipo: 'success' },
  { id: '2', hora: '11:15 AM', descripcion: 'Frecuencia cardíaca alta (95 bpm)', tipo: 'warning' },
  { id: '3', hora: '2:00 PM', descripcion: 'Siesta detectada', tipo: 'info' },
  { id: '4', hora: '4:30 PM', descripcion: 'Caminó 300 pasos', tipo: 'success' },
];

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

// Contactos de emergencia
export interface ContactoEmergencia {
  id: string;
  nombre: string;
  relacion: string;
  telefono: string;
}

export const contactosEmergencia: ContactoEmergencia[] = [
  { id: '1', nombre: 'Dr. Rodríguez', relacion: 'Médico de cabecera', telefono: '+52 555 123 4567' },
  { id: '2', nombre: 'Juan López', relacion: 'Hijo', telefono: '+52 555 987 6543' },
  { id: '3', nombre: 'Ana López', relacion: 'Hija', telefono: '+52 555 456 7890' },
];
