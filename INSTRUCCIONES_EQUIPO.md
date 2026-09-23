# 🏥 VITALIA - Guía de Ejecución y Simulación para el Equipo

Esta guía contiene las instrucciones exactas paso a paso para que cualquier miembro del equipo (**Iliana, Bryan, Romeo o Miguel**) pueda clonar, levantar y simular el proyecto completo en su propia computadora.

---

## 🏗️ Arquitectura del Sistema

* **Frontend:** React Native (Expo SDK 57) compatible con **Web (PC)** y **Android**.
* **Backend:** Python (FastAPI + Uvicorn) con arquitectura RESTful y CORS habilitado.
* **Base de Datos:** PostgreSQL con ORM SQLAlchemy y relaciones Cuidador-Paciente (M:N).
* **IoT / Smartwatch:** Simulador biométrico interactivo que emite telemetría médica en tiempo real (código de fábrica: `VTL-101`).

---

## ⚙️ 1. Requisitos Previos en tu Computadora

Cada miembro del equipo debe tener instalado:
1. **Node.js:** Versión 18 o superior ([Descargar](https://nodejs.org/)).
2. **Python:** Versión 3.10 o superior ([Descargar](https://www.python.org/)).
3. **Docker Desktop:** Para correr PostgreSQL con un solo comando ([Descargar](https://www.docker.com/)).
4. **Android Studio** *(Opcional)*: Solo si deseas correrlo en el emulador de celular. Si no, puedes usar **Google Chrome en tu PC**.

---

## 📥 2. Obtener los últimos cambios de Git

Abre tu terminal en la carpeta del repositorio y ejecuta:

```bash
git fetch origin
git checkout feature/backend-vitalia
git pull origin feature/backend-vitalia
```

---

## 🗄️ 3. Levantar la Base de Datos y el Backend

### Opción A (Recomendada con Docker):
En la raíz del proyecto, ejecuta:
```bash
docker compose up -d
```
Esto levantará el contenedor de PostgreSQL y el Backend de FastAPI automáticamente.

---

### Opción B (Manual en Windows):

1. **Tener tu contenedor de PostgreSQL encendido** en el puerto `5432`.
2. **Configurar el entorno de Python:**
   Abre una terminal y entra a la carpeta `backend`:
   ```powershell
   cd AppMonitoreo\backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. **Crear tablas y datos iniciales en la base de datos:**
   ```powershell
   python seed.py
   ```
   *(Esto creará las tablas `usuarios`, `pacientes`, `dispositivos`, `alertas` y el usuario demo).*

4. **Encender el servidor:**
   ```powershell
   python main.py
   ```
   *(O simplemente dale doble clic al archivo `start.bat`)*.

> ✅ El servidor estará escuchando en: `http://localhost:8000`  
> 📖 Documentación interactiva Swagger: `http://localhost:8000/docs`  
> ⌚ Simulador del Smartwatch: `http://localhost:8000/simulador`

---

## 📱 4. Levantar la Aplicación (Frontend)

Abre **otra terminal** y ve a la carpeta principal `AppMonitoreo`:

```powershell
cd AppMonitoreo
npm install
```

### 👉 Si quieres probarlo en tu PC (Navegador Web):
Es la forma más rápida y cómoda para cualquier integrante:
```powershell
npx expo start --web
```
Se abrirá automáticamente en tu navegador en `http://localhost:8081`.

---

### 👉 Si quieres probarlo en el Emulador de Android Studio:
1. Abre tu emulador en Android Studio (ej: Pixel 8).
2. En la terminal de `AppMonitoreo`, ejecuta:
   ```powershell
   $env:REACT_NATIVE_PACKAGER_HOSTNAME="10.0.2.2"; npx expo start -c
   ```
3. Cuando aparezca el menú en la terminal, presiona la tecla **`a`**.
4. Se descargará el bundle en el emulador y se abrirá la aplicación.

---

## 🧪 5. Guía de la Demostración en Vivo

Para demostrar el funcionamiento completo del sistema ante el docente:

### 1. Iniciar Sesión en la App
* **Correo:** `juan@email.com`
* **Contraseña:** `123456`
* *(O puedes presionar "Registrarse" para crear una cuenta nueva).*

### 2. Abrir el Smartwatch Simulado
En tu navegador web, entra a:
👉 **`http://localhost:8000/simulador`**

Pon el Smartwatch a un lado de la pantalla y la aplicación al otro lado.

### 3. Probar Eventos en Tiempo Real:
* **Simular Caída Accidental (Botón Rojo):**
  Al presionarlo, el reloj emite la telemetría, el backend procesa la anomalía física, guarda la alerta en PostgreSQL y en pocos segundos la app del celular cambia el estado de María López a **"Crítico"** con advertencias rojas.
* **Simular Taquicardia (Botón Naranja):**
  Envía un pulso de 135 bpm. La app actualiza el ritmo cardíaco en tiempo real y genera la alerta médica.
* **Restablecer Normalidad (Botón Verde):**
  Regresa los parámetros biométricos a 72 bpm y estado Estable.

### 4. Probar Funciones Médicas en la App:
* **Botón SOS:** Presiona el botón rojo grande *"EMERGENCIA SOS"* en el celular; se registrará inmediatamente en la base de datos y en la lista de alertas.
* **Historial Médico:** Ve a la pestaña *"Historial"* y cambia entre **Hoy**, **Semana** y **Mes** para ver la gráfica de barras y los promedios dinámicos calculados por la API.
* **Resolver Alertas:** En la pestaña *"Alertas"*, haz un toque sostenido (*long press*) sobre cualquier alerta activa para marcarla como atendida.

---

## 👥 Datos del Equipo de Proyecto

* **Iliana Guadalupe Granados Hernández** (GH192121) — Líder de Proyecto
* **Bryan David Escalante Vanegas** (EV220676) — Frontend React Native
* **Miguel Ignacio Peña Ayala** (PA230856) — Backend & UI Support
* **Romeo Vladimir Martínez Pérez** (MP222850) — DevOps & Infraestructura
