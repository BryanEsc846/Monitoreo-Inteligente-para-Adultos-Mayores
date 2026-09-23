@echo off
title Vitalia Backend - FastAPI
echo ========================================================
echo   Iniciando Backend Vitalia (FastAPI + PostgreSQL)
echo ========================================================
echo Servidor en: http://localhost:8000
echo Documentacion Swagger en: http://localhost:8000/docs
echo Simulador Smartwatch en: http://localhost:8000/simulador
echo ========================================================
cd /d "%~dp0"
set PYTHONPATH=.
call venv\Scripts\activate.bat
python main.py
pause
