@echo off
echo ========================================
echo Starting AuraFit Backend Server
echo ========================================
echo.
echo Make sure MongoDB is running!
echo.
cd /d %~dp0
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo.
echo Starting server on http://localhost:5001
echo Press Ctrl+C to stop
echo.
call npm start

