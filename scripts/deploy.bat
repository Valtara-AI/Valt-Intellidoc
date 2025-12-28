@echo off
REM Valt Intellidoc - Windows Deployment Script
REM This script deploys the application from Windows to Ubuntu server

setlocal enabledelayedexpansion

REM Configuration
set SERVER_IP=91.98.19.163
set SERVER_USER=root
set SSH_KEY=new-deploy-key
set APP_DIR=/var/www/valt-intellidoc
set APP_NAME=valt-intellidoc

REM Colors (using PowerShell for colored output)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

echo.
echo ========================================================
echo    Valt Intellidoc - Windows Deployment Script
echo ========================================================
echo.

REM Check if SSH key exists
if not exist "%SSH_KEY%" (
    echo %RED%Error: SSH key not found: %SSH_KEY%%NC%
    exit /b 1
)

echo %BLUE%Step 1: Testing SSH connection...%NC%
ssh -i %SSH_KEY% -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "echo Connection successful" >nul 2>&1
if errorlevel 1 (
    echo %RED%Error: Cannot connect to server%NC%
    exit /b 1
)
echo %GREEN%OK - SSH connection successful%NC%
echo.

echo %BLUE%Step 2: Creating temporary deployment package...%NC%
set TEMP_DIR=%TEMP%\valt-deploy-%RANDOM%
mkdir "%TEMP_DIR%"

REM Copy files excluding unnecessary items
xcopy /E /I /Y /Q . "%TEMP_DIR%" >nul
if exist "%TEMP_DIR%\node_modules" rmdir /S /Q "%TEMP_DIR%\node_modules"
if exist "%TEMP_DIR%\.next" rmdir /S /Q "%TEMP_DIR%\.next"
if exist "%TEMP_DIR%\.git" rmdir /S /Q "%TEMP_DIR%\.git"
if exist "%TEMP_DIR%\.env.local" del /Q "%TEMP_DIR%\.env.local"
if exist "%TEMP_DIR%\*.pem" del /Q "%TEMP_DIR%\*.pem"

echo %GREEN%OK - Package created%NC%
echo.

echo %BLUE%Step 3: Uploading files to server...%NC%
echo This may take a few minutes...

REM Use SCP to upload files
scp -i %SSH_KEY% -o StrictHostKeyChecking=no -r "%TEMP_DIR%\*" %SERVER_USER%@%SERVER_IP%:%APP_DIR%/
if errorlevel 1 (
    echo %RED%Error: Failed to upload files%NC%
    rmdir /S /Q "%TEMP_DIR%"
    exit /b 1
)
Y
REM Clean up temp directory
rmdir /S /Q "%TEMP_DIR%"
echo %GREEN%OK - Files uploaded%NC%
echo.

echo %BLUE%Step 4: Installing dependencies and building...%NC%
echo This may take several minutes...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && npm install && npm run build 2>&1"
if errorlevel 1 (
    echo %RED%Error: Build failed. Check the output above for details.%NC%
    echo %YELLOW%You may need to fix TypeScript errors and redeploy.%NC%
    pause
    exit /b 1
)
echo %GREEN%OK - Application built%NC%
echo.

echo %BLUE%Step 5: Restarting application...%NC%
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 restart %APP_NAME% || pm2 start npm --name %APP_NAME% -- start && pm2 save"
if errorlevel 1 (
    echo %RED%Error: Failed to restart application%NC%
    exit /b 1
)
echo %GREEN%OK - Application restarted%NC%
echo.

echo %BLUE%Step 6: Verifying deployment...%NC%
timeout /t 5 /nobreak >nul
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 status"
echo.

echo ========================================================
echo    Deployment Completed Successfully!
echo ========================================================
echo.
echo Your application is now running at: http://%SERVER_IP%
echo.
echo Useful Commands:
echo   View logs:   ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 logs %APP_NAME%"
echo   Check status: ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 status"
echo.

pause
