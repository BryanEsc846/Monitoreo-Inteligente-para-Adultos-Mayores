# 🏥 Vitalia - Monitoreo Inteligente para Adultos Mayores

Sistema integral de salud IoT y monitoreo biométrico en tiempo real para adultos mayores, desarrollado para la cátedra de **Diseño y Programación de Software Multiplataforma (DPS104)**.

---

## 👥 Equipo de Desarrollo

* **Iliana Guadalupe Granados Hernández** (GH192121) — Líder de Proyecto
* **Bryan David Escalante Vanegas** (EV220676) — Frontend React Native
* **Miguel Ignacio Peña Ayala** (PA230856) — Backend & UI Support
* **Romeo Vladimir Martínez Pérez** (MP222850) — DevOps & Infraestructura

---

## 🚀 Guía Rápida para el Equipo

La app de demostración usa un login local, sin backend ni Docker. El nombre del cuidador se guarda en el teléfono y las lecturas del reloj llegan por Firebase después de vincularlo con QR. Para instrucciones y limitaciones, consulta:

👉 **[INSTRUCCIONES_EQUIPO.md](./INSTRUCCIONES_EQUIPO.md)**

---

## 🏗️ Stack Tecnológico

* **Frontend:** React Native (Expo SDK 57), Expo Router, TypeScript
* **Datos de cuidador demo:** nombre almacenado localmente; contraseña fija de demostración
* **Datos del reloj:** Firebase Realtime Database después de vincular el QR
* **Backend opcional:** Python 3.11+, FastAPI, SQLAlchemy 2.0, Uvicorn, Bcrypt, PyJWT
* **Base de Datos opcional:** PostgreSQL en Docker para desarrollo del backend legado
* **IoT Hardware Emulado:** Smartwatch Vitalia (código `VTL-101`) con telemetría de ritmo cardíaco, detección de caídas y botón de pánico
* **Multiplataforma:** Web (PC / Escritorio) y Móvil (Android)
