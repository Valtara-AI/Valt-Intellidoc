@echo off
REM Generate secure secrets for production environment

echo ========================================
echo   Generate Production Secrets
echo ========================================
echo.

echo Generating NEXTAUTH_SECRET (32 bytes base64)...
echo.
node -e "console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
echo.

echo.
echo Generating JWT_SECRET (32 bytes base64)...
echo.
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
echo.

echo.
echo Generating ENCRYPTION_KEY (32 bytes hex)...
echo.
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
echo.

echo.
echo ========================================
echo Copy these values to your .env.production file on the server
echo.
echo To update on server:
echo   ssh -i new-deploy-key root@91.98.19.163
echo   nano /var/www/valt-intellidoc/.env.production
echo   ^[Paste the values above^]
echo   pm2 restart valt-intellidoc
echo ========================================
echo.

pause
