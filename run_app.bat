@echo off
echo Starting AI Speech Synthesis Desktop App...
echo.

REM Check if virtual environment exists
if not exist "backend\venv" (
    echo Virtual environment not found. Please run setup first.
    echo.
    echo Run these commands:
    echo   cd backend
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

REM Check if frontend is built
if not exist "frontend\dist" (
    echo Frontend not built. Building now...
    cd frontend
    call npm install
    call npm run build
    cd ..
)

REM Activate virtual environment and run app
call backend\venv\Scripts\activate
python app.py

pause