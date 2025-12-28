@echo off
REM Quick diagnostic check - runs faster than fix-server.bat

set "SERVER_USER=root"
set "SERVER_IP=91.98.19.163"
set "SSH_KEY=new-deploy-key"
set "APP_NAME=valt-intellidoc"

echo.
echo Quick Server Check
echo ==================
echo.

echo Testing SSH...
ssh -i %SSH_KEY% -o ConnectTimeout=5 %SERVER_USER%@%SERVER_IP% "echo OK" 2>nul
if errorlevel 1 (
    echo [ERROR] Cannot connect to server
    goto :end
)
echo [OK] Connected
echo.

echo PM2 Status:
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 list | grep -E 'id|%APP_NAME%'"
echo.

echo Port 3000 Status:
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "ss -tuln | grep :3000 || echo 'Port 3000 not listening'"
echo.

echo Nginx Status:
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "systemctl is-active nginx"
echo.

echo Testing HTTP:
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "curl -s -o /dev/null -w 'Status: %%{http_code}\n' --max-time 5 http://localhost:3000"
echo.

echo Recent Logs (last 10 lines):
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 logs %APP_NAME% --lines 10 --nostream 2>&1 | tail -15"
echo.

:end
echo ==================
echo.
echo To fix issues, run: scripts\fix-server.bat
echo.
pause
