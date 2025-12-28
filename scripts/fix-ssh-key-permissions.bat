@echo off
REM ============================================
REM Fix SSH Key Permissions
REM ============================================
REM This fixes the permissions on ubuntu-ky.pem
REM so SSH will accept it
REM ============================================

echo.
echo Fixing SSH key permissions...
echo.

REM Reset permissions
icacls ubuntu-ky.pem /reset

REM Remove inheritance
icacls ubuntu-ky.pem /inheritance:r

REM Grant current user read-only access
icacls ubuntu-ky.pem /grant:r "%USERNAME%:(R)"

REM Remove all other users
icacls ubuntu-ky.pem /remove "NT AUTHORITY\Authenticated Users"
icacls ubuntu-ky.pem /remove "BUILTIN\Users"

echo.
echo [SUCCESS] SSH key permissions fixed!
echo.
echo Current permissions:
icacls ubuntu-ky.pem

pause
