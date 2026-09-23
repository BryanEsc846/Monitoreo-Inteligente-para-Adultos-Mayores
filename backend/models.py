from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    telefono = Column(String(30), nullable=True, default="+503 7000-0000")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relación muchos a muchos con pacientes vía tabla asociativa
    pacientes_asociados = relationship("CuidadorPaciente", back_populates="usuario", cascade="all, delete-orphan")


class Dispositivo(Base):
    __tablename__ = "dispositivos"

    id = Column(Integer, primary_key=True, index=True)
    codigo_vinculacion = Column(String(30), unique=True, index=True, nullable=False) # Ej: VTL-101
    modelo = Column(String(80), default="Vitalia Band Pro")
    bateria = Column(Integer, default=85)
    estado = Column(String(30), default="activo") # "activo", "desconectado"
    ultima_conexion = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relación uno a uno / uno a muchos con paciente
    pacientes = relationship("Paciente", back_populates="dispositivo")
    lecturas = relationship("LecturaSensor", back_populates="dispositivo", cascade="all, delete-orphan")


class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False) # Ej: María López
    iniciales = Column(String(10), default="ML")
    edad = Column(Integer, default=78)
    condiciones = Column(String(255), default="Hipertensión, Diabetes Tipo 2")
    ubicacion_actual = Column(String(100), default="En Casa")
    
    dispositivo_id = Column(Integer, ForeignKey("dispositivos.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    dispositivo = relationship("Dispositivo", back_populates="pacientes")
    cuidadores = relationship("CuidadorPaciente", back_populates="paciente", cascade="all, delete-orphan")
    lecturas = relationship("LecturaSensor", back_populates="paciente", cascade="all, delete-orphan")
    alertas = relationship("Alerta", back_populates="paciente", cascade="all, delete-orphan")


class CuidadorPaciente(Base):
    __tablename__ = "cuidador_paciente"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    parentesco = Column(String(50), default="Familiar") # "Hijo", "Enfermero", "Tutor"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    usuario = relationship("Usuario", back_populates="pacientes_asociados")
    paciente = relationship("Paciente", back_populates="cuidadores")

    __table_args__ = (
        UniqueConstraint("usuario_id", "paciente_id", name="uq_usuario_paciente"),
    )


class LecturaSensor(Base):
    __tablename__ = "lecturas_sensores"

    id = Column(Integer, primary_key=True, index=True)
    dispositivo_id = Column(Integer, ForeignKey("dispositivos.id"), nullable=False)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=True)
    ritmo_cardiaco = Column(Integer, nullable=False) # bpm
    movimiento = Column(String(50), default="Normal") # "Normal", "Inactivo", "Caída detectada", "Movimiento brusco"
    ubicacion_nombre = Column(String(100), default="En Casa")
    latitud = Column(Float, nullable=True, default=13.6929) # San Salvador coord demo
    longitud = Column(Float, nullable=True, default=-89.2182)
    bateria = Column(Integer, default=85)
    fecha = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    dispositivo = relationship("Dispositivo", back_populates="lecturas")
    paciente = relationship("Paciente", back_populates="lecturas")


class Alerta(Base):
    __tablename__ = "alertas"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    tipo = Column(String(20), default="warning") # "danger", "warning", "info"
    titulo = Column(String(150), nullable=False)
    descripcion = Column(String(300), nullable=False)
    resuelta = Column(Boolean, default=False)
    fecha = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    paciente = relationship("Paciente", back_populates="alertas")
