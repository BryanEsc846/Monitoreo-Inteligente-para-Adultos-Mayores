from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import (
    String, Float, Boolean, DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    telefono: Mapped[Optional[str]] = mapped_column(String(30), nullable=True, default="+503 7000-0000")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    pacientes_asociados: Mapped[List["CuidadorPaciente"]] = relationship(back_populates="usuario", cascade="all, delete-orphan")


class Dispositivo(Base):
    __tablename__ = "dispositivos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    codigo_vinculacion: Mapped[str] = mapped_column(String(30), unique=True, index=True, nullable=False)
    modelo: Mapped[str] = mapped_column(String(80), default="Vitalia Band Pro")
    bateria: Mapped[int] = mapped_column(default=85)
    estado: Mapped[str] = mapped_column(String(30), default="activo")
    ultima_conexion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    pacientes: Mapped[List["Paciente"]] = relationship(back_populates="dispositivo")
    lecturas: Mapped[List["LecturaSensor"]] = relationship(back_populates="dispositivo", cascade="all, delete-orphan")


class Paciente(Base):
    __tablename__ = "pacientes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    iniciales: Mapped[str] = mapped_column(String(10), default="ML")
    edad: Mapped[int] = mapped_column(default=78)
    condiciones: Mapped[str] = mapped_column(String(255), default="Hipertensión, Diabetes Tipo 2")
    ubicacion_actual: Mapped[str] = mapped_column(String(100), default="En Casa")
    
    dispositivo_id: Mapped[Optional[int]] = mapped_column(ForeignKey("dispositivos.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    dispositivo: Mapped[Optional[Dispositivo]] = relationship(back_populates="pacientes")
    cuidadores: Mapped[List["CuidadorPaciente"]] = relationship(back_populates="paciente", cascade="all, delete-orphan")
    lecturas: Mapped[List["LecturaSensor"]] = relationship(back_populates="paciente", cascade="all, delete-orphan")
    alertas: Mapped[List["Alerta"]] = relationship(back_populates="paciente", cascade="all, delete-orphan")


class CuidadorPaciente(Base):
    __tablename__ = "cuidador_paciente"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    paciente_id: Mapped[int] = mapped_column(ForeignKey("pacientes.id"), nullable=False)
    parentesco: Mapped[str] = mapped_column(String(50), default="Familiar")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    usuario: Mapped[Usuario] = relationship(back_populates="pacientes_asociados")
    paciente: Mapped[Paciente] = relationship(back_populates="cuidadores")

    __table_args__ = (
        UniqueConstraint("usuario_id", "paciente_id", name="uq_usuario_paciente"),
    )


class LecturaSensor(Base):
    __tablename__ = "lecturas_sensores"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    dispositivo_id: Mapped[int] = mapped_column(ForeignKey("dispositivos.id"), nullable=False)
    paciente_id: Mapped[Optional[int]] = mapped_column(ForeignKey("pacientes.id"), nullable=True)
    ritmo_cardiaco: Mapped[int] = mapped_column(nullable=False)
    movimiento: Mapped[str] = mapped_column(String(50), default="Normal")
    ubicacion_nombre: Mapped[str] = mapped_column(String(100), default="En Casa")
    latitud: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=13.6929)
    longitud: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=-89.2182)
    bateria: Mapped[int] = mapped_column(default=85)
    fecha: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    dispositivo: Mapped[Dispositivo] = relationship(back_populates="lecturas")
    paciente: Mapped[Optional[Paciente]] = relationship(back_populates="lecturas")


class Alerta(Base):
    __tablename__ = "alertas"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    paciente_id: Mapped[int] = mapped_column(ForeignKey("pacientes.id"), nullable=False)
    tipo: Mapped[str] = mapped_column(String(20), default="warning")
    titulo: Mapped[str] = mapped_column(String(150), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(300), nullable=False)
    resuelta: Mapped[bool] = mapped_column(Boolean, default=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    paciente: Mapped[Paciente] = relationship(back_populates="alertas")
