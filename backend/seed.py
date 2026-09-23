from datetime import datetime, timedelta, timezone
from database import engine, SessionLocal, Base
import models
from auth import hash_password

def run_seed():
    print("Creando tablas en la base de datos PostgreSQL 'vitalia'...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Verificar si ya existen datos
        usuario_existente = db.query(models.Usuario).filter_by(email="juan@email.com").first()
        if usuario_existente:
            print("Los datos iniciales ya existen en la base de datos.")
            return

        print("Insertando datos semilla para la demostración...")

        # 1. Crear Usuario Cuidador Demo
        cuidador = models.Usuario(
            nombre="Juan Pérez",
            email="juan@email.com",
            password_hash=hash_password("123456"),
            telefono="+503 7890-1234"
        )
        db.add(cuidador)
        db.flush()

        # 2. Crear Dispositivos Smartwatch
        smartwatch1 = models.Dispositivo(
            codigo_vinculacion="VTL-101",
            modelo="Vitalia Band Pro 2026",
            bateria=85,
            estado="activo",
            ultima_conexion=datetime.now(timezone.utc)
        )
        smartwatch2 = models.Dispositivo(
            codigo_vinculacion="VTL-202",
            modelo="Vitalia Band Lite",
            bateria=92,
            estado="activo",
            ultima_conexion=datetime.now(timezone.utc)
        )
        db.add_all([smartwatch1, smartwatch2])
        db.flush()

        # 3. Crear Pacientes
        paciente1 = models.Paciente(
            nombre="María López",
            iniciales="ML",
            edad=78,
            condiciones="Hipertensión, Diabetes Tipo 2",
            ubicacion_actual="En Casa",
            dispositivo_id=smartwatch1.id
        )
        paciente2 = models.Paciente(
            nombre="Carlos Gómez",
            iniciales="CG",
            edad=82,
            condiciones="Cardiopatía leve",
            ubicacion_actual="Jardín Principal",
            dispositivo_id=smartwatch2.id
        )
        db.add_all([paciente1, paciente2])
        db.flush()

        # 4. Vincular Cuidador con Pacientes (Relación M:N)
        relacion1 = models.CuidadorPaciente(
            usuario_id=cuidador.id,
            paciente_id=paciente1.id,
            parentesco="Hijo"
        )
        relacion2 = models.CuidadorPaciente(
            usuario_id=cuidador.id,
            paciente_id=paciente2.id,
            parentesco="Tutor Asignado"
        )
        db.add_all([relacion1, relacion2])

        # 5. Insertar Lecturas de la última semana para María López (Gráfica de Historial)
        ahora = datetime.now(timezone.utc)
        dias_semana_valores = [
            (6, 72), # Hace 6 días
            (5, 75),
            (4, 68),
            (3, 74),
            (2, 80),
            (1, 71),
            (0, 74), # Hoy
        ]

        for dias_atras, valor_bpm in dias_semana_valores:
            lectura = models.LecturaSensor(
                dispositivo_id=smartwatch1.id,
                paciente_id=paciente1.id,
                ritmo_cardiaco=valor_bpm,
                movimiento="Normal",
                ubicacion_nombre="En Casa",
                latitud=13.6929,
                longitud=-89.2182,
                bateria=max(20, 85 - (dias_atras * 2)),
                fecha=ahora - timedelta(days=dias_atras, hours=2)
            )
            db.add(lectura)

        # 6. Insertar Alertas Históricas de Demostración
        alertas_demo = [
            models.Alerta(
                paciente_id=paciente1.id,
                tipo="danger",
                titulo="Frecuencia cardíaca alta",
                descripcion="Se detectó 95 bpm durante 10 minutos continuos.",
                resuelta=True,
                fecha=ahora - timedelta(days=2)
            ),
            models.Alerta(
                paciente_id=paciente1.id,
                tipo="warning",
                titulo="Batería baja del dispositivo",
                descripcion="La pulsera tiene solo 15% de batería restante.",
                resuelta=True,
                fecha=ahora - timedelta(days=3)
            ),
            models.Alerta(
                paciente_id=paciente1.id,
                tipo="info",
                titulo="Salió de la zona segura",
                descripcion="María salió del perímetro configurado de su residencia.",
                resuelta=True,
                fecha=ahora - timedelta(days=5)
            )
        ]
        db.add_all(alertas_demo)

        db.commit()
        print("¡Base de datos sembrada con éxito! Usuario demo: juan@email.com / 123456")
    except Exception as e:
        db.rollback()
        print(f"Error al sembrar la base de datos: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
