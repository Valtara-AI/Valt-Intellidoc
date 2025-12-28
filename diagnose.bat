@echo off
setlocal enabledelayedexpansion

set "SERVER_USER=root"
set "SERVER_IP=91.98.19.163"
set "SSH_KEY=ubuntu-ky.pem"
set "APP_NAME=valt-intellidoc"

echo.
echo ========================================
echo Valt Intellidoc - Server Diagnostics
echo ========================================
echo.

echo [1/8] Testing SSH connection...
ssh -i %SSH_KEY% -o ConnectTimeout=10 %SERVER_USER%@%SERVER_IP% "echo Connection OK" 2>nul
if errorlevel 1 (
    echo [ERROR] Cannot connect to server
    pause
    exit /b 1
) else (
    echo [OK] SSH connection successful
)
echo.

echo [2/8] Checking PM2 status...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 status"
echo.

echo [3/8] Checking if application exists in PM2...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 describe %APP_NAME%"
echo.

echo [4/8] Checking if port 3000 is listening...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "netstat -tuln | grep :3000 || ss -tuln | grep :3000 || echo 'Port 3000 not listening'"
echo.

echo [5/8] Checking Nginx status...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "systemctl status nginx --no-pager -l"
echo.

echo [6/8] Testing application endpoint...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "curl -I http://localhost:3000 2>&1"
echo.

echo [7/8] Checking application logs (last 20 lines)...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 logs %APP_NAME% --lines 20 --nostream"
echo.

echo [8/8] Checking if .env.production exists...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "ls -la /var/www/valt-intellidoc/.env.production 2>&1"
echo.

echo ========================================
echo Diagnostics Complete
echo ========================================
echo.
pause
