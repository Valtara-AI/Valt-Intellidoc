$SERVER_USER = "root"
$SERVER_IP = "91.98.19.163"
$SSH_KEY = "ubuntu-ky.pem"
$APP_NAME = "valt-intellidoc"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Valt Intellidoc - Server Diagnostics" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check SSH connection
Write-Host "[1/6] Testing SSH connection..." -ForegroundColor Yellow
$sshTest = & ssh -i $SSH_KEY -o ConnectTimeout=10 -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_IP}" "echo 'Connected'" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] SSH connection successful" -ForegroundColor Green
} else {
    Write-Host "[ERROR] SSH connection failed: $sshTest" -ForegroundColor Red
    exit 1
}

# Check PM2 status
Write-Host "`n[2/6] Checking PM2 status..." -ForegroundColor Yellow
$pm2Status = & ssh -i $SSH_KEY "${SERVER_USER}@${SERVER_IP}" "pm2 status" 2>&1
Write-Host $pm2Status

# Check if app is running
Write-Host "`n[3/6] Checking application process..." -ForegroundColor Yellow
$appStatus = & ssh -i $SSH_KEY "${SERVER_USER}@${SERVER_IP}" "pm2 describe $APP_NAME 2>&1"
Write-Host $appStatus

# Check application port
Write-Host "`n[4/6] Checking if application is listening on port 3000..." -ForegroundColor Yellow
$portCheck = & ssh -i $SSH_KEY "${SERVER_USER}@${SERVER_IP}" "netstat -tuln | grep :3000 || ss -tuln | grep :3000" 2>&1
if ($portCheck) {
    Write-Host "[OK] Application is listening on port 3000" -ForegroundColor Green
    Write-Host $portCheck
} else {
    Write-Host "[ERROR] Application is NOT listening on port 3000" -ForegroundColor Red
}

# Check Nginx status
Write-Host "`n[5/6] Checking Nginx status..." -ForegroundColor Yellow
$nginxStatus = & ssh -i $SSH_KEY "${SERVER_USER}@${SERVER_IP}" "systemctl status nginx | head -10" 2>&1
Write-Host $nginxStatus

# Test HTTP endpoint
Write-Host "`n[6/6] Testing HTTP endpoint..." -ForegroundColor Yellow
$httpTest = & ssh -i $SSH_KEY "${SERVER_USER}@${SERVER_IP}" "curl -s -I http://localhost:3000 2>&1 | head -5" 2>&1
Write-Host $httpTest

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Diagnostics Complete" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
