@echo off
title Vitalia - Android Launcher
echo ========================================================
echo   Configurando conexion con el emulador Pixel 8...
echo ========================================================
"%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" reverse tcp:8081 tcp:8081
"%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" reverse tcp:8000 tcp:8000
echo Puertos conectados con exito.
echo.
echo Iniciando Expo para Android...
npx expo start --localhost -c
pause
