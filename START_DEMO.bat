@echo off
title SkillPilot AI - SIH 2026 Hackathon Launcher
color 0B
echo ========================================================
echo   SKILLPILOT AI - MoSPI Capacity Building Platform
echo   Smart India Hackathon (SIH 2026) Demo Launcher
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting FastAPI Backend on Port 8000...
start "SkillPilot Backend (Port 8000)" cmd /k "cd /d "%~dp0backend" && .\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/3] Starting React Frontend on Port 5173...
start "SkillPilot Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host 0.0.0.0 --port 5173"

timeout /t 4 /nobreak >nul

echo [3/3] Opening SkillPilot in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo   ALL SERVICES ARE RUNNING!
echo.
echo   Local URL:    http://localhost:5173
echo   Network WiFi: http://192.168.205.143:5173
echo   Backend API:  http://192.168.205.143:8000/docs
echo.
echo   DEMO LOGIN ACCOUNTS:
echo   - Officer: officer@mospi.gov.in / password123
echo   - Admin:   admin@mospi.gov.in   / admin123
echo   - Trainee: trainee@mospi.gov.in / password123
echo ========================================================
echo.
pause
