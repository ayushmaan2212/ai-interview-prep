@echo off
REM Colors and setup for Windows
echo.
echo ========================================
echo    AI Interview Prep - Local Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo Node.js found: 
node --version
echo npm found:
npm --version
echo.

REM Setup Backend
echo Setting up Backend...
cd Backend

if not exist .env (
    if not exist .env.local (
        echo Creating .env file...
        (
            echo PORT=5000
            echo MONGO_URI=mongodb://localhost:27017/ai-interview-prep
            echo JWT_SECRET=dev_jwt_secret_key
            echo NODE_ENV=development
        ) > .env
    ) else (
        copy .env.local .env >nul
    )
)

call npm install
echo Backend dependencies installed
echo.

REM Setup Frontend
echo Setting up Frontend...
cd ..\Frontend\vite-project

if not exist .env.local (
    echo Creating .env.local file...
    (
        echo VITE_API_URL=http://localhost:5000
    ) > .env.local
)

call npm install
echo Frontend dependencies installed
echo.

cd ..\..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.

echo To start development servers, run:
echo.
echo Terminal 1 ^(Backend^):
echo   cd Backend ^&^& npm run dev
echo.
echo Terminal 2 ^(Frontend^):
echo   cd Frontend\vite-project ^&^& npm run dev
echo.
echo Then open: http://localhost:5173
echo.
