# 🚀 Quick Reference - Valt Intellidoc Production

## 📍 Server Information
- **IP:** 91.98.19.163
- **URL:** http://91.98.19.163
- **SSH:** `ssh -i new-deploy-key root@91.98.19.163`
- **Location:** Hetzner Nuremberg (CX22)

## 🔑 SSH Key
- **Private:** `new-deploy-key` (keep secure!)
- **Public:** `new-deploy-key.pub`
- **Type:** ED25519
- **Status:** ✅ Active on server

## 🎯 Essential Commands

### Check Application Status
```bash
ssh -i new-deploy-key root@91.98.19.163 "pm2 status"
```

### View Logs
```bash
ssh -i new-deploy-key root@91.98.19.163 "pm2 logs valt-intellidoc --lines 100"
```

### Restart Application
```bash
ssh -i new-deploy-key root@91.98.19.163 "pm2 restart valt-intellidoc"
```

### Deploy Updates
```bash
# From d:\Valt Intellidoc directory
scripts\deploy.bat
```

### Health Check
```bash
ssh -i new-deploy-key root@91.98.19.163 "/usr/local/bin/valt-monitor.sh"
```

### Create Backup
```bash
ssh -i new-deploy-key root@91.98.19.163 "/usr/local/bin/valt-backup.sh"
```

### Generate Secrets
```bash
# From d:\Valt Intellidoc directory
scripts\generate-secrets.bat
```

## 📋 File Locations

### Local (Windows)
- **App:** `d:\Valt Intellidoc\`
- **SSH Key:** `d:\Valt Intellidoc\new-deploy-key`
- **Deploy Script:** `scripts\deploy.bat`
- **Docs:** `PRODUCTION_DEPLOYMENT.md`, `GITHUB_ACTIONS_SETUP.md`

### Server (Ubuntu)
- **App:** `/var/www/valt-intellidoc/`
- **Env:** `/var/www/valt-intellidoc/.env.production`
- **Backups:** `/var/backups/valt-intellidoc/`
- **Logs:** `/var/log/valt-monitoring.log`, `/var/log/valt-backup.log`
- **Scripts:** `/usr/local/bin/valt-monitor.sh`, `/usr/local/bin/valt-backup.sh`

## 🔧 Configuration Files

### Environment Variables
```bash
ssh -i new-deploy-key root@91.98.19.163 "nano /var/www/valt-intellidoc/.env.production"
```

### Nginx Config
```bash
ssh -i new-deploy-key root@91.98.19.163 "nano /etc/nginx/sites-available/valt-intellidoc"
```

### PM2 Config
```bash
ssh -i new-deploy-key root@91.98.19.163 "pm2 list && pm2 save"
```

## 🤖 GitHub Actions

### Required Secrets
1. **SSH_PRIVATE_KEY** - Content of `new-deploy-key`
2. **SSH_HOST** - `91.98.19.163`
3. **SSH_USER** - `root`

### Add Secrets Location
`GitHub Repo` → `Settings` → `Secrets and variables` → `Actions`

### Trigger Deployment
```bash
git add .
git commit -m "Deploy update"
git push origin main
```

## ⚠️ TODO - Action Required

1. **Add GitHub Secrets** (see above)
2. **Generate & Set Production Secrets:**
   ```bash
   scripts\generate-secrets.bat
   # Copy output to server .env.production
   ```
3. **Get Domain & SSL:**
   - Point domain to 91.98.19.163
   - Install Let's Encrypt certificate
   - Update NEXTAUTH_URL

## 📊 Monitoring

- **Health Checks:** Every 5 minutes (automatic)
- **Backups:** Daily at 2:00 AM (automatic)
- **Logs:** `/var/log/valt-monitoring.log`, `/var/log/valt-backup.log`

## 🆘 Troubleshooting

### App Not Responding
```bash
ssh -i new-deploy-key root@91.98.19.163
pm2 logs valt-intellidoc --err --lines 50
pm2 restart valt-intellidoc
```

### Nginx Issues
```bash
ssh -i new-deploy-key root@91.98.19.163
systemctl status nginx
systemctl restart nginx
```

### Restore from Backup
```bash
ssh -i new-deploy-key root@91.98.19.163
ls -lh /var/backups/valt-intellidoc/
# Extract and restore specific backup
```

## 📞 Documentation

- **Production Summary:** `PRODUCTION_DEPLOYMENT.md`
- **CI/CD Setup:** `GITHUB_ACTIONS_SETUP.md`
- **Main Docs:** `README.md`, `DEPLOYMENT.md`

---

**Status:** ✅ Deployed & Running  
**Last Updated:** October 10, 2025
