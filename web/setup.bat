@echo off
REM KindWorld Web Application Setup Script (Windows)
REM This script will install dependencies and start the development server

echo.
echo ========================================
echo   KindWorld Web Application Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo [OK] npm is installed
npm --version
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found
    echo Please run this script from the web directory
    pause
    exit /b 1
)

echo Installing dependencies...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed
    pause
    exit /b 1
)

echo.
echo [OK] Installation complete!
echo.
echo Starting development server...
echo.
echo The app will open at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
