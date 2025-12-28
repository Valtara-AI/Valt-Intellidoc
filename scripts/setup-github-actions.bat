@echo off
REM ============================================
REM GitHub Actions CI/CD Setup Helper
REM ============================================
REM This script helps you set up GitHub secrets
REM for automated deployment
REM ============================================

echo.
echo ╔════════════════════════════════════════════╗
echo ║  GitHub Actions CI/CD Setup Helper        ║
echo ╚════════════════════════════════════════════╝
echo.

echo This script will help you configure GitHub Actions for automated deployment.
echo.
echo Step 1: Get your SSH private key content
echo ──────────────────────────────────────────────
echo.

REM Check if SSH key exists
if not exist "ubuntu-ky.pem" (
    echo [ERROR] SSH key file 'ubuntu-ky.pem' not found in current directory!
    echo Please make sure ubuntu-ky.pem is in the project root.
    pause
    exit /b 1
)

echo Your SSH private key is in: ubuntu-ky.pem
echo.
echo We'll copy the key content to your clipboard.
echo.

REM Display the key content
type ubuntu-ky.pem | clip
if errorlevel 1 (
    echo [ERROR] Failed to copy to clipboard.
    echo Please copy the content of ubuntu-ky.pem manually:
    echo.
    type ubuntu-ky.pem
    echo.
) else (
    echo [SUCCESS] SSH private key copied to clipboard!
    echo.
)

echo Step 2: Add secrets to GitHub repository
echo ──────────────────────────────────────────────
echo.
echo 1. Open your browser and go to:
echo    https://github.com/Harsh-d-lab/SHIVAM/settings/secrets/actions
echo.
echo 2. Click "New repository secret"
echo.
echo 3. Add the following secrets:
echo.
echo    ┌─────────────────┬───────────────────┐
echo    │ Secret Name     │ Value             │
echo    ├─────────────────┼───────────────────┤
echo    │ SSH_PRIVATE_KEY │ [Paste from clip] │
echo    │ SSH_HOST        │ 91.98.19.163      │
echo    │ SSH_USER        │ root              │
echo    └─────────────────┴───────────────────┘
echo.
echo    For SSH_PRIVATE_KEY:
echo    - The key is already in your clipboard
echo    - Make sure to include everything:
echo      -----BEGIN RSA PRIVATE KEY-----
echo      ...
echo      -----END RSA PRIVATE KEY-----
echo.

pause

echo.
echo Step 3: Test the CI/CD pipeline
echo ──────────────────────────────────────────────
echo.
echo After adding the secrets, test the deployment:
echo.
echo 1. Make a small change to your code
echo 2. Commit and push:
echo.
echo    git add .
echo    git commit -m "Test CI/CD deployment"
echo    git push origin main
echo.
echo 3. Watch the deployment:
echo    https://github.com/Harsh-d-lab/SHIVAM/actions
echo.
echo The deployment workflow will:
echo   ✓ Build your application
echo   ✓ Run tests
echo   ✓ Deploy to server (91.98.19.163)
echo   ✓ Verify the deployment
echo   ✓ Rollback if something fails
echo.

echo Step 4: Verify deployment
echo ──────────────────────────────────────────────
echo.
echo After the workflow completes, visit:
echo    http://91.98.19.163
echo.
echo If it doesn't work, check:
echo   - GitHub Actions logs (link above)
echo   - Server logs: ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs"
echo.

echo.
echo ═══════════════════════════════════════════════
echo Setup instructions complete!
echo ═══════════════════════════════════════════════
echo.
echo Quick reference:
echo.
echo Deploy manually:       scripts\deploy.bat
echo Quick update:          scripts\quick-update.bat
echo View server logs:      ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs"
echo Check PM2 status:      ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 status"
echo.
echo Full documentation: DEPLOYMENT.md
echo.

pause
