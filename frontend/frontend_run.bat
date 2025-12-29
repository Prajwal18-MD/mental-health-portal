@echo off
REM frontend_run.bat - placed in frontend\

chcp 65001 >nul
cd /d "%~dp0"
echo Frontend: working dir: %cd%

echo Installing frontend dependencies (if needed)...
npm install || (
  echo ERROR: npm install failed. Check Node/npm.
  pause
  exit /b 1
)

echo Starting Vite dev server...
npm run dev

echo Vite exited.
pause
