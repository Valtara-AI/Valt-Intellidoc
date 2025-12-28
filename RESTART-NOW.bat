@echo off
echo.
echo ========================================
echo EXECUTING EMERGENCY SERVER FIX
echo ========================================
echo.

set "SERVER_USER=root"
set "SERVER_IP=91.98.19.163"
set "SSH_KEY=new-deploy-key"
set "APP_NAME=valt-intellidoc"

echo [1/4] Restarting PM2...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd /var/www/valt-intellidoc && pm2 restart %APP_NAME% || pm2 start npm --name '%APP_NAME%' -- start"

echo.
echo [2/4] Saving PM2 config...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 save"

echo.
echo [3/4] Restarting Nginx...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "systemctl restart nginx"

echo.
echo [4/4] Testing connection...
timeout /t 3 >nul
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "curl -s -o /dev/null -w 'HTTP %%{http_code}' http://localhost:3000 && echo ' - OK'"

echo.
echo ========================================
echo DONE! Try: http://91.98.19.163
echo ========================================
echo.
