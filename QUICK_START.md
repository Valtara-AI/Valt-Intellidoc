# 🚀 Deployment Quick Start Checklist

Follow these steps to deploy your application to production.

---

## ✅ Pre-Deployment Checklist

### 1. Prerequisites Ready?

- [ ] **SSH Key**: `ubuntu-ky.pem` is in project root directory
- [ ] **Git Configured**: Repository is up to date
- [ ] **Node.js Installed**: Node 18+ on local machine
- [ ] **Dependencies Installed**: Run `npm install` locally

### 2. Test SSH Connection

```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
```

✅ **Success**: You see Ubuntu welcome message  
❌ **Failed**: Check SSH key permissions or server status

### 3. Verify Local Build

```cmd
npm run build
```

✅ **Success**: Build completes without errors  
❌ **Failed**: Fix build errors before deploying

---

## 🎯 Deployment Steps

### Option A: First Time Deployment (Recommended)

**Run full deployment script:**

```cmd
scripts\deploy.bat
```

**What it does:**
- ✓ Uploads all files to server
- ✓ Installs dependencies
- ✓ Builds application
- ✓ Configures PM2 and Nginx
- ✓ Starts application
- ✓ Verifies deployment

**Expected time:** 5-10 minutes

**Success indicators:**
- ✓ Green checkmarks throughout process
- ✓ "Deployment completed successfully!" message
- ✓ Application URL displayed: http://91.98.19.163

---

### Option B: Quick Update (For Code Changes)

**Run quick update script:**

```cmd
scripts\quick-update.bat
```

**When to use:**
- After editing code in `src/` directory
- Changed components or pages
- Updated styles or configurations

**Expected time:** 1-2 minutes

---

## ⚙️ Post-Deployment Configuration

### 1. Configure Environment Variables

**Connect to server:**

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
```

**Edit environment file:**

```bash
nano /var/www/valt-intellidoc/.env.production
```

**Add your secrets:**

```env
NEXTAUTH_URL=http://91.98.19.163
NEXTAUTH_SECRET=<generate-random-string>
DATABASE_URL=<your-database-url>
OPENAI_API_KEY=<your-openai-key>
JWT_SECRET=<generate-random-string>
ENCRYPTION_KEY=<generate-random-string>
```

**Generate random secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Save and exit:** `Ctrl+O`, `Enter`, `Ctrl+X`

**Restart application:**

```bash
pm2 restart valt-intellidoc
```

✅ **Done**: Environment variables configured

---

### 2. Verify Application

**Open in browser:**

```
http://91.98.19.163
```

**Check status:**

```cmd
scripts\health-check.bat
```

✅ **Success**: Application loads correctly  
❌ **Failed**: Check logs: `ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc"`

---

## 🤖 Enable Automated CI/CD (Optional but Recommended)

### 1. Run GitHub Actions Setup

```cmd
scripts\setup-github-actions.bat
```

This will:
- Copy SSH key to clipboard
- Show you GitHub repository URL
- List required secrets

### 2. Add Secrets to GitHub

**Go to:**
```
https://github.com/Harsh-d-lab/SHIVAM/settings/secrets/actions
```

**Click "New repository secret" and add:**

| Name | Value |
|------|-------|
| `SSH_PRIVATE_KEY` | Paste from clipboard (includes BEGIN/END markers) |
| `SSH_HOST` | `91.98.19.163` |
| `SSH_USER` | `root` |

### 3. Test Automated Deployment

**Make a test change and push:**

```cmd
git add .
git commit -m "Test CI/CD deployment"
git push origin main
```

**Watch deployment:**
```
https://github.com/Harsh-d-lab/SHIVAM/actions
```

✅ **Success**: Workflow completes with green checkmark  
❌ **Failed**: Check workflow logs for details

---

## 🔍 Set Up Monitoring

### 1. Upload Monitoring Script

```bash
scp -i ubuntu-ky.pem scripts/monitor.sh root@91.98.19.163:/usr/local/bin/
ssh -i ubuntu-ky.pem root@91.98.19.163 "chmod +x /usr/local/bin/monitor.sh"
```

### 2. Test Monitoring

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "/usr/local/bin/monitor.sh"
```

✅ **Success**: See monitoring output with status checks

### 3. Schedule Monitoring (Every 5 Minutes)

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
crontab -e
```

**Add this line:**
```
*/5 * * * * /usr/local/bin/monitor.sh
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

✅ **Done**: Monitoring runs automatically every 5 minutes

---

## 💾 Set Up Automated Backups

### 1. Upload Backup Scripts

```bash
scp -i ubuntu-ky.pem scripts/backup.sh root@91.98.19.163:/usr/local/bin/
scp -i ubuntu-ky.pem scripts/restore.sh root@91.98.19.163:/usr/local/bin/
ssh -i ubuntu-ky.pem root@91.98.19.163 "chmod +x /usr/local/bin/backup.sh /usr/local/bin/restore.sh"
```

### 2. Test Backup

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "/usr/local/bin/backup.sh"
```

✅ **Success**: Backup created in `/var/backups/valt-intellidoc/`

### 3. Schedule Daily Backups (2 AM)

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
crontab -e
```

**Add this line:**
```
0 2 * * * /usr/local/bin/backup.sh
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

✅ **Done**: Backups run automatically every day at 2 AM

---

## 🎉 Deployment Complete!

### Your Application is Live

**Application URL:** http://91.98.19.163

### What's Working

- ✅ Application deployed and running
- ✅ PM2 managing application process
- ✅ Nginx serving as reverse proxy
- ✅ Firewall configured for security
- ✅ Environment variables set
- ✅ Monitoring enabled (if configured)
- ✅ Backups scheduled (if configured)
- ✅ CI/CD pipeline active (if configured)

---

## 📊 Daily Workflow

### Making Changes

```cmd
# 1. Edit code locally
# 2. Test: npm run dev

# 3. Deploy changes
git add .
git commit -m "Your changes"
git push origin main

# Deployment happens automatically via GitHub Actions
# OR manually: scripts\quick-update.bat
```

### Checking Status

```cmd
# Quick health check
scripts\health-check.bat

# View logs
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc --lines 50"

# Check PM2 status
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 status"
```

### Manual Operations

```bash
# Connect to server
ssh -i ubuntu-ky.pem root@91.98.19.163

# Restart application
pm2 restart valt-intellidoc

# View monitoring logs
tail -f /var/log/valt-monitoring.log

# List backups
ls -lh /var/backups/valt-intellidoc/

# Restore from backup
/usr/local/bin/restore.sh
```

---

## 🆘 Troubleshooting

### Application Not Loading

```bash
# Check PM2 status
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 status"

# View error logs
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc --err --lines 50"

# Restart application
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 restart valt-intellidoc"
```

### Deployment Failed

```cmd
# Test SSH connection
ssh -i ubuntu-ky.pem root@91.98.19.163 "echo Connected"

# Run health check
scripts\health-check.bat

# Check disk space
ssh -i ubuntu-ky.pem root@91.98.19.163 "df -h"
```

### Build Errors

```bash
# Rebuild on server
ssh -i ubuntu-ky.pem root@91.98.19.163
cd /var/www/valt-intellidoc
rm -rf .next node_modules
npm install
npm run build
pm2 restart valt-intellidoc
```

---

## 📚 Additional Resources

- **Full Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Script Documentation**: [scripts/README.md](scripts/README.md)
- **Architecture Diagram**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Deployment Summary**: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

---

## ✨ Next Steps

### Recommended Enhancements

- [ ] **Configure Domain**: Point your domain to 91.98.19.163
- [ ] **Enable HTTPS**: Install SSL certificate with Let's Encrypt
- [ ] **Set Up Alerts**: Configure email/Slack notifications in monitor.sh
- [ ] **Database Setup**: If your app needs a database
- [ ] **CDN Integration**: For better performance globally

### Optional Improvements

- [ ] **Log Rotation**: Configure logrotate for application logs
- [ ] **Performance Monitoring**: Set up APM (Application Performance Monitoring)
- [ ] **Error Tracking**: Integrate Sentry or similar service
- [ ] **Analytics**: Add Google Analytics or similar
- [ ] **Staging Environment**: Create a staging server for testing

---

## 🎊 You're All Set!

Your application is deployed and ready for production use!

**Quick Commands Reference:**

```cmd
Deploy:           scripts\deploy.bat
Update:           scripts\quick-update.bat
Health Check:     scripts\health-check.bat
View Logs:        ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs"
Restart:          ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 restart valt-intellidoc"
```

**Application URL:** http://91.98.19.163

Happy deploying! 🚀✨
