@echo off
REM ============================================
REM Valt Intellidoc - Server Fix Script
REM ============================================
REM This script will diagnose and fix common server issues
REM ============================================

setlocal enabledelayedexpansion

set "SERVER_USER=root"
set "SERVER_IP=91.98.19.163"
set "SSH_KEY=new-deploy-key"
set "APP_NAME=valt-intellidoc"
set "APP_DIR=/var/www/valt-intellidoc"

echo.
echo ╔════════════════════════════════════════════╗
echo ║     Valt Intellidoc - Server Fix          ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if SSH key exists
if not exist "%SSH_KEY%" (
    echo [ERROR] SSH key not found: %SSH_KEY%
    echo Please ensure ubuntu-ky.pem is in the current directory.
    pause
    exit /b 1
)

echo [Step 1/10] Testing SSH connection...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% -o ConnectTimeout=10 %SERVER_USER%@%SERVER_IP% "echo Connected" >nul 2>&1
if errorlevel 1 (
    echo [✗] FAILED: Cannot connect to server
    echo.
    echo Please check:
    echo   1. Server is running (91.98.19.163)
    echo   2. SSH key permissions are correct
    echo   3. Firewall allows SSH (port 22)
    echo.
    pause
    exit /b 1
) else (
    echo [✓] SUCCESS: SSH connection works
)
echo.

echo [Step 2/10] Checking if application directory exists...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "test -d %APP_DIR% && echo 'Directory exists' || echo 'Directory missing'"
echo.

echo [Step 3/10] Stopping any running instances...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 stop %APP_NAME% 2>/dev/null || echo 'No running instance found'"
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 delete %APP_NAME% 2>/dev/null || echo 'No PM2 instance to delete'"
echo.

echo [Step 4/10] Checking Node.js and npm...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "node --version && npm --version"
echo.

echo [Step 5/10] Installing/updating dependencies...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && npm install --production 2>&1 | tail -10"
echo.

echo [Step 6/10] Checking environment file...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "if [ -f %APP_DIR%/.env.production ]; then echo 'Environment file exists'; else echo 'WARNING: .env.production not found - creating default'; fi"
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "if [ ! -f %APP_DIR%/.env.production ]; then echo 'NODE_ENV=production' > %APP_DIR%/.env.production && echo 'PORT=3000' >> %APP_DIR%/.env.production; fi"
echo.

echo [Step 7/10] Building the application...
echo ────────────────────────────────────────────
echo This may take a few minutes...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && npm run build 2>&1 | tail -20"
if errorlevel 1 (
    echo [✗] Build failed - check errors above
    echo.
    echo Checking logs:
    ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && npm run build 2>&1 | tail -50"
    pause
    exit /b 1
) else (
    echo [✓] Build successful
)
echo.

echo [Step 8/10] Starting application with PM2...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && pm2 start npm --name '%APP_NAME%' -- start"
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 save"
echo.

echo [Step 9/10] Checking application status...
echo ────────────────────────────────────────────
timeout /t 5 >nul
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 status"
echo.

echo [Step 10/10] Testing application endpoint...
echo ────────────────────────────────────────────
timeout /t 3 >nul
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "curl -s -o /dev/null -w 'HTTP Status: %%{http_code}\n' http://localhost:3000"
echo.

echo ════════════════════════════════════════════
echo.
echo [Final Check] Verifying Nginx...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "systemctl status nginx --no-pager | head -5"
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "nginx -t"
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "systemctl restart nginx"
echo.

echo ════════════════════════════════════════════
echo Fix Complete!
echo ════════════════════════════════════════════
echo.
echo Your application should now be accessible at:
echo   http://%SERVER_IP%
echo.
echo View logs with:
echo   ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 logs %APP_NAME%"
echo.
echo Check status anytime with:
echo   scripts\health-check.bat
echo.

pause
