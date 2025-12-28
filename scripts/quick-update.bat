@echo off
REM Quick Update Script - For redeploying after code changes

setlocal enabledelayedexpansion

set SERVER_IP=91.98.19.163
set SERVER_USER=root
set SSH_KEY=new-deploy-key
set APP_DIR=/var/www/valt-intellidoc
set APP_NAME=valt-intellidoc

echo.
echo ========================================================
echo    Quick Update - Valt Intellidoc
echo ========================================================
echo.

REM Check if SSH key exists
if not exist "%SSH_KEY%" (
    echo Error: SSH key not found: %SSH_KEY%
    exit /b 1
)

echo [1/5] Creating deployment package...
set TEMP_DIR=%TEMP%\valt-update-%RANDOM%
mkdir "%TEMP_DIR%"

REM Copy only source files (faster update)
xcopy /E /I /Y /Q src "%TEMP_DIR%\src" >nul
xcopy /E /I /Y /Q public "%TEMP_DIR%\public" >nul
copy /Y package*.json "%TEMP_DIR%\" >nul
copy /Y tsconfig.json "%TEMP_DIR%\" >nul 2>nul
copy /Y next.config.* "%TEMP_DIR%\" >nul 2>nul
copy /Y vite.config.* "%TEMP_DIR%\" >nul 2>nul
copy /Y tailwind.config.* "%TEMP_DIR%\" >nul 2>nul
copy /Y postcss.config.* "%TEMP_DIR%\" >nul 2>nul

echo [2/5] Uploading updated files...
scp -i %SSH_KEY% -o StrictHostKeyChecking=no -r "%TEMP_DIR%\*" %SERVER_USER%@%SERVER_IP%:%APP_DIR%/
if errorlevel 1 (
    echo Error: Upload failed
    rmdir /S /Q "%TEMP_DIR%"
    exit /b 1
)

rmdir /S /Q "%TEMP_DIR%"

echo [3/5] Installing dependencies...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && npm install"

echo [4/5] Building application...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && npm run build"

echo [5/5] Restarting application...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 restart %APP_NAME%"

echo.
echo ========================================================
echo    Update Complete!
echo ========================================================
echo.
echo Your application has been updated at: http://%SERVER_IP%
echo.
echo To view logs: ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 logs %APP_NAME%"
echo.

pause
