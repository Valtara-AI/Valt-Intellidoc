@echo off
REM ============================================
REM Setup Environment Variables on Server
REM ============================================

set "SERVER_USER=root"
set "SERVER_IP=91.98.19.163"
set "SSH_KEY=new-deploy-key"
set "APP_DIR=/var/www/valt-intellidoc"

echo.
echo ╔════════════════════════════════════════════╗
echo ║     Environment Setup                      ║
echo ╚════════════════════════════════════════════╝
echo.

if not exist "%SSH_KEY%" (
    echo [ERROR] SSH key not found!
    pause
    exit /b 1
)

echo Creating/updating .env.production on server...
echo.

ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cat > %APP_DIR%/.env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=http://91.98.19.163
NEXTAUTH_SECRET=%RANDOM%%RANDOM%%RANDOM%%RANDOM%
DATABASE_URL=file:./dev.db
EOF"

echo.
echo [✓] Environment file created/updated
echo.

echo Current .env.production contents:
echo ────────────────────────────────────────────
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cat %APP_DIR%/.env.production"
echo ────────────────────────────────────────────
echo.

echo.
echo To edit manually, run:
echo   ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "nano %APP_DIR%/.env.production"
echo.
echo After changes, restart with:
echo   ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 restart valt-intellidoc"
echo.

pause
