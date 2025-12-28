@echo off
REM ============================================
REM Emergency Server Restart
REM ============================================
REM Use this when server is completely down
REM ============================================

set "SERVER_USER=root"
set "SERVER_IP=91.98.19.163"
set "SSH_KEY=new-deploy-key"
set "APP_NAME=valt-intellidoc"
set "APP_DIR=/var/www/valt-intellidoc"

echo.
echo ╔════════════════════════════════════════════╗
echo ║     EMERGENCY SERVER RESTART               ║
echo ╚════════════════════════════════════════════╝
echo.

if not exist "%SSH_KEY%" (
    echo [ERROR] SSH key not found!
    pause
    exit /b 1
)

echo Connecting to server...
echo.

echo [1/5] Stopping all PM2 processes...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 stop all"
echo.

echo [2/5] Starting the application...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && pm2 start npm --name '%APP_NAME%' -- start || pm2 restart %APP_NAME%"
echo.

echo [3/5] Saving PM2 configuration...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 save"
echo.

echo [4/5] Restarting Nginx...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "systemctl restart nginx"
echo.

echo [5/5] Checking status...
timeout /t 5 >nul
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 status && echo '' && systemctl status nginx | head -3"
echo.

echo ════════════════════════════════════════════
echo Testing connection...
echo ════════════════════════════════════════════
timeout /t 3 >nul
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "curl -s -o /dev/null -w 'HTTP Status: %%{http_code}\n' http://localhost:3000"
echo.

echo ════════════════════════════════════════════
echo Restart Complete!
echo ════════════════════════════════════════════
echo.
echo Try accessing: http://%SERVER_IP%
echo.
echo If still not working, run: scripts\fix-server.bat
echo.

pause
