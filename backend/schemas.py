from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Auth Schemas
class UsuarioRegistro(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    telefono: Optional[str] = "+503 7000-0000"

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str

class UsuarioRespuesta(BaseModel):
    id: int
    nombre: str
    email: str
    telefono: Optional[str]
    token: str

    class Config:
        from_attributes = True

# Vinculación Smartwatch
class VincularDispositivo(BaseModel):
    codigo_vinculacion: str # Ej: VTL-101
    nombre_paciente: Optional[str] = "Nuevo Paciente"
    edad: Optional[int] = 75
    condiciones: Optional[str] = "Ninguna reportada"
    parentesco: Optional[str] = "Familiar"

# Telemetría IoT desde el Smartwatch
class TelemetriaInput(BaseModel):
    codigo_vinculacion: str
    ritmo_cardiaco: int
    movimiento: Optional[str] = "Normal" # "Normal", "Caída detectada", "Movimiento brusco", "Inactivo"
    ubicacion_nombre: Optional[str] = "En Casa"
    latitud: Optional[float] = 13.6929
    longitud: Optional[float] = -89.2182
    bateria: Optional[int] = 85

# Estado de Paciente para Dashboard
class EstadoPacienteRespuesta(BaseModel):
    id: int
    nombre: str
    iniciales: str
    edad: int
    condiciones: List[str]
    estado: str # "Estable", "Alerta", "Crítico"
    ubicacion: str
    ultima_conexion: str
    dispositivo_codigo: Optional[str]
    signos_vitales: dict

# Alertas
class AlertaRespuesta(BaseModel):
    id: int
    tipo: str # "danger", "warning", "info"
    titulo: str
    descripcion: str
    fecha: str
    resuelta: bool

    class Config:
        from_attributes = True

class AlertaSOSInput(BaseModel):
    paciente_id: int
    mensaje: Optional[str] = "Emergencia SOS disparada desde la app"

# Historial
class DatoPuntoHistorial(BaseModel):
    dia: str
    valor: int

class EstadisticasHistorial(BaseModel):
    promedio: int
    maximo: int
    minimo: int

class HistorialRespuesta(BaseModel):
    periodo: str
    puntos: List[DatoPuntoHistorial]
    estadisticas: EstadisticasHistorial
