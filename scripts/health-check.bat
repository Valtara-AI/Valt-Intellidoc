@echo off
REM ============================================
REM Valt Intellidoc - Deployment Health Check
REM ============================================
REM Quickly verify your deployment status
REM from Windows
REM ============================================

setlocal enabledelayedexpansion

set "SERVER_USER=root"
set "SERVER_IP=91.98.19.163"
set "SSH_KEY=new-deploy-key"
set "APP_NAME=valt-intellidoc"

echo.
echo ╔════════════════════════════════════════════╗
echo ║     Valt Intellidoc - Health Check        ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if SSH key exists
if not exist "%SSH_KEY%" (
    echo [ERROR] SSH key not found: %SSH_KEY%
    echo Please ensure new-deploy-key is in the current directory.
    pause
    exit /b 1
)

echo [1/5] Testing SSH connection...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% -o ConnectTimeout=10 -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "echo Connection successful" >nul 2>&1
if errorlevel 1 (
    echo [✗] FAILED: Cannot connect to server
    echo.
    echo Troubleshooting:
    echo   1. Check if server is running
    echo   2. Verify SSH key permissions
    echo   3. Check firewall settings
    pause
    exit /b 1
) else (
    echo [✓] SUCCESS: SSH connection works
)
echo.

echo [2/5] Checking PM2 status...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 status %APP_NAME% 2>/dev/null | grep %APP_NAME%"
if errorlevel 1 (
    echo [✗] WARNING: Application not running in PM2
    echo.
    echo Try restarting:
    echo   ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 restart %APP_NAME%"
    echo.
) else (
    echo [✓] SUCCESS: Application is running in PM2
)
echo.

echo [3/5] Testing HTTP response...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "curl -s -o /dev/null -w '%%{http_code}' --max-time 10 http://localhost:3000" > temp_response.txt 2>&1
set /p HTTP_CODE=<temp_response.txt
del temp_response.txt

if "%HTTP_CODE%"=="200" (
    echo [✓] SUCCESS: Application responding ^(HTTP 200^)
) else if "%HTTP_CODE%"=="301" (
    echo [✓] SUCCESS: Application responding ^(HTTP 301 - Redirect^)
) else if "%HTTP_CODE%"=="302" (
    echo [✓] SUCCESS: Application responding ^(HTTP 302 - Redirect^)
) else (
    echo [✗] WARNING: Unexpected response code: %HTTP_CODE%
    echo.
    echo Check application logs:
    echo   ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 logs %APP_NAME% --lines 20"
    echo.
)
echo.

echo [4/5] Checking Nginx status...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "systemctl is-active nginx" >nul 2>&1
if errorlevel 1 (
    echo [✗] WARNING: Nginx not running
    echo.
    echo Try restarting:
    echo   ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "systemctl restart nginx"
    echo.
) else (
    echo [✓] SUCCESS: Nginx is active
)
echo.

echo [5/5] Checking server resources...
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "echo 'CPU Usage:' && top -bn1 | grep 'Cpu(s)' && echo 'Memory Usage:' && free -h | grep 'Mem:' && echo 'Disk Usage:' && df -h / | tail -1"
echo.

echo ════════════════════════════════════════════
echo Health Check Complete!
echo ════════════════════════════════════════════
echo.
echo Quick access URLs:
echo   Application:    http://%SERVER_IP%
echo   GitHub Actions: https://github.com/Harsh-d-lab/SHIVAM/actions
echo.
echo Useful commands:
echo   View logs:      ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 logs %APP_NAME%"
echo   Restart app:    ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 restart %APP_NAME%"
echo   PM2 status:     ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 status"
echo   Full deploy:    scripts\deploy.bat
echo   Quick update:   scripts\quick-update.bat
echo.

pause
