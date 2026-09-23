import os
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import engine, get_db, Base
import models
import schemas
from auth import hash_password, verify_password, create_access_token, decode_access_token

app = FastAPI(
    title="Vitalia API - Monitoreo Inteligente de Adultos Mayores",
    description="API RESTful para telemetría IoT, detección de anomalías y gestión de cuidadores.",
    version="1.0.0"
)

# Configuración de CORS para permitir conexiones desde React Native (móvil y web)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------------
# RUTAS DE AUTENTICACIÓN
# -------------------------------------------------------------------------

@app.post("/api/auth/register", response_model=schemas.UsuarioRespuesta, status_code=status.HTTP_201_CREATED)
def registrar_usuario(datos: schemas.UsuarioRegistro, db: Session = Depends(get_db)):
    existente = db.query(models.Usuario).filter(models.Usuario.email == datos.email.lower()).first()
    if existente:
        raise HTTPException(status_code=400, detail="Este correo electrónico ya está registrado.")

    nuevo_usuario = models.Usuario(
        nombre=datos.nombre,
        email=datos.email.lower(),
        password_hash=hash_password(datos.password),
        telefono=datos.telefono
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    token = create_access_token({"sub": str(nuevo_usuario.id), "email": nuevo_usuario.email})
    return schemas.UsuarioRespuesta(
        id=nuevo_usuario.id,
        nombre=nuevo_usuario.nombre,
        email=nuevo_usuario.email,
        telefono=nuevo_usuario.telefono,
        token=token
    )

@app.post("/api/auth/login", response_model=schemas.UsuarioRespuesta)
def login_usuario(datos: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == datos.email.lower()).first()
    if not usuario or not verify_password(datos.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos."
        )

    token = create_access_token({"sub": str(usuario.id), "email": usuario.email})
    return schemas.UsuarioRespuesta(
        id=usuario.id,
        nombre=usuario.nombre,
        email=usuario.email,
        telefono=usuario.telefono,
        token=token
    )

# -------------------------------------------------------------------------
# RUTAS DE PACIENTES Y MONITOREO
# -------------------------------------------------------------------------

@app.get("/api/pacientes")
def listar_pacientes(usuario_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Lista todos los pacientes o los asignados a un cuidador específico."""
    if usuario_id:
        relaciones = db.query(models.CuidadorPaciente).filter_by(usuario_id=usuario_id).all()
        pacientes = [r.paciente for r in relaciones if r.paciente]
    else:
        pacientes = db.query(models.Paciente).all()

    resultado = []
    for p in pacientes:
        disp_codigo = p.dispositivo.codigo_vinculacion if p.dispositivo else "Sin asignar"
        resultado.append({
            "id": p.id,
            "nombre": p.nombre,
            "iniciales": p.iniciales,
            "edad": p.edad,
            "condiciones": [c.strip() for c in p.condiciones.split(",") if c.strip()],
            "dispositivo_codigo": disp_codigo
        })
    return resultado

@app.get("/api/pacientes/{paciente_id}/estado", response_model=schemas.EstadoPacienteRespuesta)
def obtener_estado_paciente(paciente_id: int, db: Session = Depends(get_db)):
    """Devuelve el estado en tiempo real del paciente según la última lectura del sensor."""
    paciente = db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado.")

    ultima_lectura = db.query(models.LecturaSensor)\
        .filter(models.LecturaSensor.paciente_id == paciente.id)\
        .order_by(desc(models.LecturaSensor.fecha))\
        .first()

    # Si no hay lecturas aún, valores por defecto
    if ultima_lectura:
        ritmo = ultima_lectura.ritmo_cardiaco
        movimiento = ultima_lectura.movimiento
        ubicacion = ultima_lectura.ubicacion_nombre
        bateria = ultima_lectura.bateria
        hace_cuanto = "En vivo"
    else:
        ritmo = 74
        movimiento = "Normal"
        ubicacion = paciente.ubicacion_actual
        bateria = 85
        hace_cuanto = "Hace 5 min"

    # Determinar estado de salud
    if movimiento == "Caída detectada" or ritmo > 120 or ritmo < 45:
        estado_salud = "Crítico"
    elif ritmo > 100 or ritmo < 55 or bateria <= 20:
        estado_salud = "Alerta"
    else:
        estado_salud = "Estable"

    condiciones_lista = [c.strip() for c in paciente.condiciones.split(",") if c.strip()]
    disp_cod = paciente.dispositivo.codigo_vinculacion if paciente.dispositivo else None

    return schemas.EstadoPacienteRespuesta(
        id=paciente.id,
        nombre=paciente.nombre,
        iniciales=paciente.iniciales,
        edad=paciente.edad,
        condiciones=condiciones_lista,
        estado=estado_salud,
        ubicacion=ubicacion,
        ultima_conexion=hace_cuanto,
        dispositivo_codigo=disp_cod,
        signos_vitales={
            "ritmoCardiaco": {"valor": ritmo, "unidad": "bpm", "estado": "danger" if (ritmo > 100 or ritmo < 50) else "normal"},
            "movimiento": {"valor": movimiento, "estado": "danger" if movimiento == "Caída detectada" else "normal"},
            "ubicacion": {"valor": ubicacion, "estado": "warning" if "Fuera" in ubicacion else "normal"},
            "bateria": {"valor": bateria, "unidad": "%", "estado": "warning" if bateria <= 20 else "normal"}
        }
    )

# -------------------------------------------------------------------------
# HISTORIAL Y ESTADÍSTICAS
# -------------------------------------------------------------------------

@app.get("/api/pacientes/{paciente_id}/historial", response_model=schemas.HistorialRespuesta)
def obtener_historial_paciente(
    paciente_id: int, 
    periodo: str = Query("Semana", pattern="^(Hoy|Semana|Mes)$"),
    db: Session = Depends(get_db)
):
    paciente = db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado.")

    lecturas = db.query(models.LecturaSensor)\
        .filter(models.LecturaSensor.paciente_id == paciente_id)\
        .order_by(desc(models.LecturaSensor.fecha))\
        .limit(30)\
        .all()

    puntos = []
    valores = [l.ritmo_cardiaco for l in lecturas] if lecturas else [74]

    dias_semana = ['D', 'S', 'V', 'J', 'Mi', 'M', 'L']
    if periodo == "Semana":
        # Formatear últimos 7 días
        for idx in range(min(7, len(lecturas))):
            l = lecturas[idx]
            dia_label = dias_semana[l.fecha.weekday()] if hasattr(l.fecha, 'weekday') else f"D{idx+1}"
            puntos.append(schemas.DatoPuntoHistorial(dia=dia_label, valor=l.ritmo_cardiaco))
        puntos.reverse()
        if not puntos:
            puntos = [
                schemas.DatoPuntoHistorial(dia="L", valor=72),
                schemas.DatoPuntoHistorial(dia="M", valor=75),
                schemas.DatoPuntoHistorial(dia="Mi", valor=68),
                schemas.DatoPuntoHistorial(dia="J", valor=74),
                schemas.DatoPuntoHistorial(dia="V", valor=80),
                schemas.DatoPuntoHistorial(dia="S", valor=71),
                schemas.DatoPuntoHistorial(dia="D", valor=74),
            ]
    elif periodo == "Hoy":
        puntos = [
            schemas.DatoPuntoHistorial(dia="6:00", valor=68),
            schemas.DatoPuntoHistorial(dia="9:00", valor=74),
            schemas.DatoPuntoHistorial(dia="12:00", valor=78),
            schemas.DatoPuntoHistorial(dia="15:00", valor=72),
            schemas.DatoPuntoHistorial(dia="18:00", valor=75),
            schemas.DatoPuntoHistorial(dia="Ahora", valor=valores[0] if valores else 74),
        ]
    else: # Mes
        puntos = [
            schemas.DatoPuntoHistorial(dia="Sem 1", valor=72),
            schemas.DatoPuntoHistorial(dia="Sem 2", valor=76),
            schemas.DatoPuntoHistorial(dia="Sem 3", valor=71),
            schemas.DatoPuntoHistorial(dia="Sem 4", valor=74),
        ]

    promedio = int(sum(valores) / len(valores)) if valores else 73
    maximo = max(valores) if valores else 80
    minimo = min(valores) if valores else 68

    return schemas.HistorialRespuesta(
        periodo=periodo,
        puntos=puntos,
        estadisticas=schemas.EstadisticasHistorial(
            promedio=promedio,
            maximo=maximo,
            minimo=minimo
        )
    )

# -------------------------------------------------------------------------
# ALERTAS Y GESTIÓN DE EMERGENCIAS
# -------------------------------------------------------------------------

@app.get("/api/pacientes/{paciente_id}/alertas", response_model=List[schemas.AlertaRespuesta])
def listar_alertas(paciente_id: int, db: Session = Depends(get_db)):
    alertas = db.query(models.Alerta)\
        .filter(models.Alerta.paciente_id == paciente_id)\
        .order_by(desc(models.Alerta.fecha))\
        .all()

    resultado = []
    ahora = datetime.now(timezone.utc)
    for a in alertas:
        diff_dias = (ahora - a.fecha.replace(tzinfo=timezone.utc)).days if a.fecha else 0
        if diff_dias == 0:
            fecha_str = "Hoy"
        elif diff_dias == 1:
            fecha_str = "Ayer"
        else:
            fecha_str = f"Hace {diff_dias} días"

        resultado.append(schemas.AlertaRespuesta(
            id=a.id,
            tipo=a.tipo,
            titulo=a.titulo,
            descripcion=a.descripcion,
            fecha=fecha_str,
            resuelta=a.resuelta
        ))
    return resultado

@app.put("/api/alertas/{alerta_id}/resolver")
def resolver_alerta(alerta_id: int, db: Session = Depends(get_db)):
    alerta = db.query(models.Alerta).filter(models.Alerta.id == alerta_id).first()
    if not alerta:
        raise HTTPException(status_code=404, detail="Alerta no encontrada.")
    alerta.resuelta = True
    db.commit()
    return {"mensaje": "Alerta marcada como resuelta", "alerta_id": alerta.id}

@app.post("/api/alertas/sos")
def disparar_sos(datos: schemas.AlertaSOSInput, db: Session = Depends(get_db)):
    """Dispara un evento de emergencia SOS desde la app móvil del cuidador."""
    paciente = db.query(models.Paciente).filter(models.Paciente.id == datos.paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado.")

    nueva_alerta = models.Alerta(
        paciente_id=paciente.id,
        tipo="danger",
        titulo="🚨 EMERGENCIA SOS ACTIVADA",
        descripcion=f"El cuidador o familiar activó una alerta de emergencia para {paciente.nombre}.",
        resuelta=False,
        fecha=datetime.now(timezone.utc)
    )
    db.add(nueva_alerta)
    db.commit()
    return {"mensaje": "Alerta SOS registrada y notificada con éxito.", "alerta_id": nueva_alerta.id}

# -------------------------------------------------------------------------
# VINCULACIÓN POR CÓDIGO (REQUERIMIENTO DEL EQUIPO)
# -------------------------------------------------------------------------

@app.post("/api/dispositivos/vincular")
def vincular_dispositivo(datos: schemas.VincularDispositivo, usuario_id: int = 1, db: Session = Depends(get_db)):
    """Vincula un Smartwatch a un cuidador mediante su código (ej: VTL-101)."""
    dispositivo = db.query(models.Dispositivo).filter(
        models.Dispositivo.codigo_vinculacion == datos.codigo_vinculacion.strip().upper()
    ).first()

    if not dispositivo:
        # Si no existe, lo creamos para permitir pruebas libres
        dispositivo = models.Dispositivo(
            codigo_vinculacion=datos.codigo_vinculacion.strip().upper(),
            modelo="Vitalia Smartwatch IoT",
            bateria=90,
            estado="activo"
        )
        db.add(dispositivo)
        db.flush()

    # Buscar si ya existe paciente con este reloj
    paciente = db.query(models.Paciente).filter(models.Paciente.dispositivo_id == dispositivo.id).first()
    if not paciente:
        iniciales = "".join([part[0] for part in datos.nombre_paciente.split()[:2]]).upper() or "AM"
        paciente = models.Paciente(
            nombre=datos.nombre_paciente,
            iniciales=iniciales,
            edad=datos.edad,
            condiciones=datos.condiciones,
            ubicacion_actual="En Casa",
            dispositivo_id=dispositivo.id
        )
        db.add(paciente)
        db.flush()

    # Crear relación cuidador-paciente si no existe
    relacion = db.query(models.CuidadorPaciente).filter_by(
        usuario_id=usuario_id, paciente_id=paciente.id
    ).first()

    if not relacion:
        relacion = models.CuidadorPaciente(
            usuario_id=usuario_id,
            paciente_id=paciente.id,
            parentesco=datos.parentesco
        )
        db.add(relacion)

    db.commit()
    return {
        "mensaje": f"Dispositivo {dispositivo.codigo_vinculacion} vinculado con éxito.",
        "paciente_id": paciente.id,
        "nombre_paciente": paciente.nombre
    }

# -------------------------------------------------------------------------
# INGESTA DE TELEMETRÍA IOT Y REGLAS DE DETECCIÓN INTELIGENTE
# -------------------------------------------------------------------------

@app.post("/api/sensor/telemetria")
def recibir_telemetria_iot(datos: schemas.TelemetriaInput, db: Session = Depends(get_db)):
    """
    Endpoint consumido por el Smartwatch / Pulsera IoT.
    Aplica reglas automáticas de detección de anomalías y genera alertas en tiempo real.
    """
    codigo = datos.codigo_vinculacion.strip().upper()
    dispositivo = db.query(models.Dispositivo).filter_by(codigo_vinculacion=codigo).first()

    if not dispositivo:
        # Auto-crear dispositivo si es nuevo
        dispositivo = models.Dispositivo(codigo_vinculacion=codigo, modelo="Vitalia Band", bateria=datos.bateria)
        db.add(dispositivo)
        db.flush()

    # Actualizar estado de batería y última conexión
    dispositivo.bateria = datos.bateria
    dispositivo.ultima_conexion = datetime.now(timezone.utc)

    # Buscar paciente asociado al dispositivo
    paciente = db.query(models.Paciente).filter_by(dispositivo_id=dispositivo.id).first()
    paciente_id = paciente.id if paciente else None

    # Guardar lectura
    nueva_lectura = models.LecturaSensor(
        dispositivo_id=dispositivo.id,
        paciente_id=paciente_id,
        ritmo_cardiaco=datos.ritmo_cardiaco,
        movimiento=datos.movimiento,
        ubicacion_nombre=datos.ubicacion_nombre,
        latitud=datos.latitud,
        longitud=datos.longitud,
        bateria=datos.bateria,
        fecha=datetime.now(timezone.utc)
    )
    db.add(nueva_lectura)

    alertas_generadas = []

    # 1. Regla de Detección de Caídas (Acelerómetro / Movimiento Brusco)
    if paciente and (datos.movimiento in ["Caída detectada", "Impacto"]):
        alerta_caida = models.Alerta(
            paciente_id=paciente.id,
            tipo="danger",
            titulo="🚨 ¡ALERTA DE CAÍDA DETECTADA!",
            descripcion=f"El acelerómetro de {dispositivo.codigo_vinculacion} detectó un impacto súbito e inmovilidad para {paciente.nombre}.",
            resuelta=False,
            fecha=datetime.now(timezone.utc)
        )
        db.add(alerta_caida)
        alertas_generadas.append("Caída detectada")

    # 2. Regla de Ritmo Cardíaco Crítico (Taquicardia / Bradicardia)
    if paciente and datos.ritmo_cardiaco > 105:
        alerta_pulso = models.Alerta(
            paciente_id=paciente.id,
            tipo="danger",
            titulo="💓 Taquicardia Detectada",
            descripcion=f"Ritmo cardíaco elevado a {datos.ritmo_cardiaco} bpm superando el umbral de reposo.",
            resuelta=False,
            fecha=datetime.now(timezone.utc)
        )
        db.add(alerta_pulso)
        alertas_generadas.append("Taquicardia")
    elif paciente and datos.ritmo_cardiaco < 50:
        alerta_pulso = models.Alerta(
            paciente_id=paciente.id,
            tipo="danger",
            titulo="💓 Bradicardia Detectada",
            descripcion=f"Ritmo cardíaco descendió a {datos.ritmo_cardiaco} bpm por debajo del límite seguro.",
            resuelta=False,
            fecha=datetime.now(timezone.utc)
        )
        db.add(alerta_pulso)
        alertas_generadas.append("Bradicardia")

    # 3. Regla de Batería Crítica
    if paciente and datos.bateria <= 15:
        alerta_bat = models.Alerta(
            paciente_id=paciente.id,
            tipo="warning",
            titulo="🔋 Batería Crítica del Smartwatch",
            descripcion=f"El dispositivo tiene solo {datos.bateria}% de energía. Conecte al cargador.",
            resuelta=False,
            fecha=datetime.now(timezone.utc)
        )
        db.add(alerta_bat)
        alertas_generadas.append("Batería baja")

    # 4. Regla de Perímetro Seguro
    if paciente and datos.ubicacion_nombre and "Fuera" in datos.ubicacion_nombre:
        alerta_geo = models.Alerta(
            paciente_id=paciente.id,
            tipo="warning",
            titulo="📍 Salida de Zona Segura",
            descripcion=f"{paciente.nombre} se encuentra fuera del perímetro seguro configurado.",
            resuelta=False,
            fecha=datetime.now(timezone.utc)
        )
        db.add(alerta_geo)
        alertas_generadas.append("Fuera de zona")

    db.commit()
    return {
        "status": "ok",
        "lectura_id": nueva_lectura.id,
        "alertas_disparadas": alertas_generadas
    }

# -------------------------------------------------------------------------
# SIMULADOR IOT WEB (INTERFAZ VISUAL DEL RELOJ PARA LA PRESENTACIÓN)
# -------------------------------------------------------------------------

SIMULADOR_HTML = """
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Vitalia - Simulador de Smartwatch IoT</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      margin: 0;
    }
    .watch-bezel {
      width: 320px;
      height: 380px;
      background: #1e293b;
      border: 8px solid #334155;
      border-radius: 40px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
      padding: 24px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justifyContent: space-between;
      position: relative;
    }
    .watch-header {
      display: flex;
      justifyContent: space-between;
      width: 100%;
      font-size: 13px;
      color: #94a3b8;
      font-weight: 600;
    }
    .heart-rate-box {
      text-align: center;
      margin: 10px 0;
    }
    .heart-rate-val {
      font-size: 56px;
      font-weight: 800;
      color: #ef4444;
      line-height: 1;
    }
    .heart-rate-label {
      font-size: 13px;
      color: #94a3b8;
      letter-spacing: 1px;
    }
    .pairing-code-badge {
      background: #2563eb;
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .status-text {
      font-size: 13px;
      color: #10b981;
      font-weight: 600;
    }
    .controls {
      width: 340px;
      margin-top: 25px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    button {
      padding: 12px 16px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-fall { background: #dc2626; color: white; }
    .btn-bpm-high { background: #ea580c; color: white; }
    .btn-normal { background: #059669; color: white; }
    .btn-geofence { background: #4f46e5; color: white; }
    .log-box {
      width: 320px;
      background: #1e293b;
      border-radius: 12px;
      padding: 12px;
      font-family: monospace;
      font-size: 11px;
      color: #cbd5e1;
      margin-top: 20px;
      max-height: 120px;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  <h2>⌚ Vitalia Smartwatch - Simulador IoT</h2>
  <p style="color:#94a3b8; margin-top:-10px; font-size:14px;">Emulador de sensores biométricos y cinemáticos</p>

  <div class="watch-bezel">
    <div class="watch-header">
      <span id="time-display">10:45 AM</span>
      <span id="battery-display">🔋 85%</span>
    </div>

    <div class="heart-rate-box">
      <div class="heart-rate-val" id="bpm-val">74</div>
      <div class="heart-rate-label">PULSO (BPM)</div>
    </div>

    <div class="pairing-code-badge" id="code-badge">CÓDIGO: VTL-101</div>

    <div class="status-text" id="status-display">● Movimiento: Normal</div>
  </div>

  <div class="controls">
    <button class="btn-fall" onclick="enviarEvento('Caída detectada', 85, 'En Casa')">🚨 Simular Caída Accidental</button>
    <button class="btn-bpm-high" onclick="enviarEvento('Normal', 135, 'En Casa')">💓 Simular Taquicardia (135 bpm)</button>
    <button class="btn-geofence" onclick="enviarEvento('Normal', 78, 'Fuera de Perímetro Seguro')">📍 Simular Salida de Perímetro</button>
    <button class="btn-normal" onclick="enviarEvento('Normal', 72, 'En Casa')">🟢 Restablecer Valores Normales</button>
  </div>

  <div class="log-box" id="log-box">
    [INFO] Simulador iniciado. Conectado a Vitalia API.
  </div>

  <script>
    function updateClock() {
      const now = new Date();
      document.getElementById('time-display').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    function log(msg) {
      const box = document.getElementById('log-box');
      box.innerHTML = `<div>[${new Date().toLocaleTimeString()}] ${msg}</div>` + box.innerHTML;
    }

    async function enviarEvento(movimiento, bpm, ubicacion) {
      document.getElementById('bpm-val').innerText = bpm;
      document.getElementById('status-display').innerText = `● Movimiento: ${movimiento}`;
      
      const payload = {
        codigo_vinculacion: "VTL-101",
        ritmo_cardiaco: bpm,
        movimiento: movimiento,
        ubicacion_nombre: ubicacion,
        bateria: 85
      };

      try {
        const res = await fetch('/api/sensor/telemetria', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        log(`Enviado: ${bpm} bpm | ${movimiento}. Alertas: ${data.alertas_disparadas.length ? data.alertas_disparadas.join(', ') : 'Ninguna'}`);
      } catch (err) {
        log(`Error enviando telemetría: ${err}`);
      }
    }
  </script>
</body>
</html>
"""

@app.get("/simulador", response_class=HTMLResponse)
def get_simulador():
    return HTMLResponse(content=SIMULADOR_HTML)

@app.get("/")
def home():
    return {
        "sistema": "Vitalia API",
        "version": "1.0.0",
        "estado": "Online",
        "docs": "/docs",
        "simulador_iot": "/simulador"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
