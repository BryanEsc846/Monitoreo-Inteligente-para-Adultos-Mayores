# 🏥 VITALIA - Guía de Ejecución y Simulación para el Equipo

Esta guía contiene las instrucciones exactas paso a paso para que cualquier miembro del equipo (**Iliana, Bryan, Romeo o Miguel**) pueda clonar, levantar y simular el proyecto completo en su propia computadora.

---

## 🏗️ Arquitectura del Sistema

* **Frontend:** React Native (Expo SDK 57) compatible con **Web (PC)** y **Android**.
* **Demo móvil:** login local; el nombre del cuidador queda guardado en el teléfono y la clave es fija (`123456`). No requiere backend ni Docker.
* **Backend opcional:** Python (FastAPI + Uvicorn) y PostgreSQL para el desarrollo legado.
* **IoT / Smartwatch:** el vínculo y telemetría del reloj usan Firebase; requieren internet y Firebase habilitado.

---

## ⚙️ 1. Requisitos Previos en tu Computadora

Cada miembro del equipo debe tener instalado:
1. **Node.js:** Versión 18 o superior ([Descargar](https://nodejs.org/)).
2. **Android Studio** *(Opcional)*: Solo para usar el emulador; también puedes abrir la demo en Google Chrome.
3. **Python y Docker Desktop** *(Opcionales)*: solo necesarios si vas a trabajar en el backend legado.

---

## 📥 2. Obtener los últimos cambios de Git

Abre tu terminal en la carpeta del repositorio y ejecuta:

```bash
git fetch origin
git checkout feature/demo-sin-login
git pull origin feature/demo-sin-login
```

La rama debe estar publicada en GitHub para que otros miembros puedan descargarla.

## 🗄️ 3. Backend y Base de Datos (opcional)

La app móvil de esta rama no llama al backend. Omite esta sección si solo quieres probar el login local y las pantallas. Para obtener telemetría del SmartWatch se requiere internet y Firebase; PostgreSQL/Docker no participa en ese flujo.

### Opción A (Recomendada con Docker):
En la raíz del proyecto, crea el archivo local de variables y genera valores nuevos para la contraseña y la clave secreta:
```powershell
Copy-Item .env.example .env
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Ejecuta el comando dos veces y reemplaza `POSTGRES_PASSWORD` y `SECRET_KEY` en `.env` por los valores generados. No subas `.env` a Git.

Luego levanta el sistema:
```bash
docker compose up -d --build
```
Compose espera a que PostgreSQL esté listo, crea las tablas y los datos de demostración, y después inicia FastAPI. La API quedará disponible en `http://localhost:8000` y Swagger en `http://localhost:8000/docs`.

> ⚠️ Si ya tienes un volumen de PostgreSQL de una ejecución anterior, cambiar `POSTGRES_USER` o `POSTGRES_PASSWORD` en `.env` no modifica las credenciales guardadas en ese volumen. Haz una copia antes de migrar o rotar credenciales; no elimines el volumen para resolver errores de conexión.

---

### Opción B (Manual en Windows):

1. **Configurar PostgreSQL y sus variables:** Sigue los pasos de `.env` de la opción A y luego inicia solo la base de datos:
   ```powershell
   docker compose up -d postgres
   ```
2. **Configurar el entorno de Python:** Desde la raíz del proyecto, entra en `backend` y crea su archivo de variables:
   ```powershell
   Set-Location backend
   Copy-Item .env.example .env
   ```
   Edita `backend/.env`: `DATABASE_URL` debe usar el mismo usuario, contraseña y nombre de base que el `.env` de la raíz; reemplaza también `SECRET_KEY` por una clave aleatoria.
3. **Instalar dependencias:**
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```
4. **Crear tablas y datos iniciales en la base de datos:**
   ```powershell
   python seed.py
   ```
   *(Esto creará las tablas `usuarios`, `pacientes`, `dispositivos`, `alertas` y el usuario demo).*

5. **Encender el servidor:**
   ```powershell
   python main.py
   ```
   *(O simplemente dale doble clic al archivo `start.bat`)*.

> ✅ El servidor estará escuchando en: `http://localhost:8000`  
> 📖 Documentación interactiva Swagger: `http://localhost:8000/docs`  
> ⌚ Simulador del Smartwatch: `http://localhost:8000/simulador`

---

## 📱 4. Levantar la Aplicación (Frontend)

Desde la raíz del repositorio (`Movil`):

```powershell
npm install
```

No necesitas iniciar Docker para usar la app de demo. Inicia Expo desde la raíz:

### 👉 Si quieres probarlo en tu PC (Navegador Web):
Es la forma más rápida y cómoda para cualquier integrante:
```powershell
npx expo start --web
```
Se abrirá automáticamente en tu navegador en `http://localhost:8081`.

---

### 👉 Si quieres probarlo en el Emulador de Android Studio:
1. Abre tu emulador en Android Studio (ej: Pixel 8).
2. En la terminal de `Movil`, ejecuta:
   ```powershell
   npx expo start -c
   ```
3. Cuando aparezca el menú en la terminal, presiona la tecla **`a`**.
4. Se descargará el bundle en el emulador y se abrirá la aplicación.

---

## 🧪 5. Guía de la Demostración en Vivo

Para demostrar el funcionamiento completo del sistema ante el docente:

### 1. Iniciar Sesión en la App
Escribe el nombre del cuidador y la contraseña fija de demo `123456`. El nombre queda guardado localmente en el teléfono.

### 2. Vincular el reloj
En Inicio, pulsa **Vincular reloj con QR** y escanea el código mostrado en el SmartWatch. BPM, batería, movimiento, ubicación y nombre del adulto mayor se muestran al sincronizar Firebase. En el reloj, pulsa **Activar ubicación** y concede el permiso; las coordenadas se actualizan mientras la app del reloj está abierta. Android puede entregar ubicación precisa o aproximada según el permiso. Si el reloj no manda el nombre, puedes ingresarlo desde la pantalla del QR.

### 3. Abrir el Smartwatch Simulado
El simulador web del backend es opcional. Para usarlo, inicia Docker y entra a:
👉 **`http://localhost:8000/simulador`**

Pon el Smartwatch a un lado de la pantalla y la aplicación al otro lado.

### 4. Probar Eventos en Tiempo Real:
* **Simular Caída Accidental (Botón Rojo):**
   El reloj emite telemetría por Firebase y la app muestra una alerta dentro de la aplicación.
* **Simular Taquicardia (Botón Naranja):**
  Envía un pulso de 135 bpm. La app actualiza el ritmo cardíaco en tiempo real y genera la alerta médica.
* **Restablecer Normalidad (Botón Verde):**
  Regresa los parámetros biométricos a 72 bpm y estado Estable.

### 4. Probar Funciones Médicas en la App:
* **Botón SOS:** agrega una alerta local de demo; no notifica a contactos reales ni se guarda en una base de datos.
* **Historial Médico:** cambia entre **Hoy**, **Semana** y **Mes** para ver los valores de muestra locales.
* **Resolver Alertas:** en la pestaña *"Alertas"*, haz un toque sostenido (*long press*) para marcar una alerta local como atendida.

---

## 👥 Datos del Equipo de Proyecto

* **Iliana Guadalupe Granados Hernández** (GH192121) — Líder de Proyecto
* **Bryan David Escalante Vanegas** (EV220676) — Frontend React Native
* **Miguel Ignacio Peña Ayala** (PA230856) — Backend & UI Support
* **Romeo Vladimir Martínez Pérez** (MP222850) — DevOps & Infraestructura
