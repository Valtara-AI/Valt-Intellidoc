@echo off
REM ============================================
REM Post-Deployment Verification
REM ============================================

echo.
echo Verifying deployment...
echo.

echo [1/4] Checking PM2 status...
ssh -i new-deploy-key root@91.98.19.163 "pm2 status"
echo.

echo [2/4] Testing application response...
ssh -i new-deploy-key root@91.98.19.163 "curl -I http://localhost:3000"
echo.

echo [3/4] Checking Nginx status...
ssh -i new-deploy-key root@91.98.19.163 "systemctl status nginx --no-pager | head -10"
echo.

echo [4/4] Testing public access...
curl -I http://91.98.19.163
echo.

echo ========================================================
echo Verification complete!
echo.
echo If all checks passed, your application is live at:
echo http://91.98.19.163
echo ========================================================
echo.

pause
