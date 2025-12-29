@echo off
REM start.bat - launches backend and frontend in separate windows
echo Starting Mental Health Portal...

REM Launch backend in a new cmd window
start "MHP Backend" cmd /k "%~dp0backend\backend_run.bat"

REM Launch frontend in a new cmd window
start "MHP Frontend" cmd /k "%~dp0frontend\frontend_run.bat"

echo Launched backend and frontend windows.
exit /b 0
