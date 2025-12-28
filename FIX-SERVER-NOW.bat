@echo off
REM ============================================
REM CLICK THIS TO FIX SERVER ACCESS
REM ============================================
REM This is the easiest way to fix most issues
REM ============================================

echo.
echo ╔════════════════════════════════════════════╗
echo ║        FIX SERVER ACCESS - EASY MODE       ║
echo ╚════════════════════════════════════════════╝
echo.
echo This will fix most server access issues.
echo.
echo What this does:
echo   1. Checks SSH connection
echo   2. Restarts the application  
echo   3. Restarts Nginx
echo   4. Verifies everything works
echo.
echo Press any key to start...
pause >nul

call scripts\emergency-restart.bat

echo.
echo.
echo ════════════════════════════════════════════
echo.
echo ✓ Quick fix complete!
echo.
echo Try accessing your site now:
echo   http://91.98.19.163
echo.
echo If it's still not working:
echo   1. Run: scripts\fix-server.bat (full rebuild)
echo   2. See: SERVER_FIX_GUIDE.md (complete manual)
echo.

pause
