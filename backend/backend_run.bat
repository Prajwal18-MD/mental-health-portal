@echo off
REM backend_run.bat - placed in backend\

chcp 65001 >nul
cd /d "%~dp0"
echo Backend: working dir: %cd%

REM Create venv if missing
if not exist venv (
  echo Creating virtualenv...
  python -m venv venv || (
    echo ERROR: Failed to create virtualenv. Is Python in PATH?
    pause
    exit /b 1
  )
)

REM Activate venv
call venv\Scripts\activate

REM Confirm activation
if "%VIRTUAL_ENV%"=="" (
  echo ERROR: Virtualenv activation failed.
  pause
  exit /b 1
)

echo Installing backend requirements...
pip install -r requirements.txt || (
  echo ERROR: pip install failed.
  pause
  exit /b 1
)

REM Download NLTK vader_lexicon
echo Downloading NLTK vader_lexicon...
python -c "import nltk; nltk.download('vader_lexicon'); print('vader_lexicon installed')" || (
  echo ERROR: Failed to download vader_lexicon.
  pause
  exit /b 1
)

echo Starting backend (uvicorn)...
REM Use python -m uvicorn to ensure venv Python is used
python -m uvicorn src.main:app --reload --host 127.0.0.1 --port 8000

echo Uvicorn exited.
pause
