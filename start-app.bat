@echo off
REM Start both Backend and Frontend servers for GearGuard Application
REM This batch file starts the complete application stack

setlocal enabledelayedexpansion

echo ========================================
echo    GearGuard - Equipment Maintenance
echo         Application Launcher
echo ========================================
echo.

REM Get the directory where the batch file is located
cd /d "%~dp0"

REM Check if node_modules exist in backend
if not exist "backend\node_modules" (
    echo.
    echo [INFO] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check if node_modules exist in frontend
if not exist "frontend\node_modules" (
    echo.
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Start Backend Server
echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
echo Port: 4000
echo Database: PostgreSQL (maintenance_db)
echo.
start "GearGuard Backend" cmd /k "cd backend && npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend App
echo.
echo ========================================
echo Starting Frontend App...
echo ========================================
echo Port: 9090
echo API URL: http://localhost:4000
echo.

start "GearGuard Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Application Startup Complete!
echo ========================================
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:9090
echo.
echo Waiting for frontend to be ready...
timeout /t 10 /nobreak >nul

REM Open frontend in default browser
start "" "http://localhost:9090"

echo.
echo Press any key to close this window...
pause > nul
