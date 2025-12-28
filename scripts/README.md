# Deployment Scripts

Automated deployment, monitoring, and maintenance scripts for Valt Intellidoc.

---

## 📁 Scripts Overview

| Script | Purpose | Platform | Usage |
|--------|---------|----------|-------|
| `deploy.sh` | Full initial deployment | Linux/Mac/WSL | First-time setup |
| `deploy.bat` | Windows deployment wrapper | Windows | Deploy from Windows |
| `quick-update.bat` | Fast code updates | Windows | Quick redeploys |
| `backup.sh` | Automated backups | Server (Ubuntu) | Scheduled backups |
| `restore.sh` | Restore from backup | Server (Ubuntu) | Disaster recovery |
| `monitor.sh` | Health monitoring | Server (Ubuntu) | Scheduled monitoring |
| `setup-github-actions.bat` | GitHub Actions setup helper | Windows | CI/CD configuration |

---

## 🚀 Initial Deployment

### For Linux/Mac/WSL Users

Run the full automated deployment script:

```bash
bash scripts/deploy.sh
```

This will:
- Install all server dependencies (Node.js, PM2, Nginx)
- Upload application files
- Build the application
- Configure web server
- Set up firewall
- Start and verify application

### For Windows Users

Use the Windows deployment script:

```cmd
scripts\deploy.bat
```

This will:
- Copy files to temporary directory
- Upload via SCP
- Build on server
- Restart application

**First time?** Make sure:
1. SSH key `ubuntu-ky.pem` is in project root
2. You can connect: `ssh -i ubuntu-ky.pem root@91.98.19.163`

---

## 🔄 Updating Your Application

### Quick Update (Recommended for Code Changes)

```cmd
scripts\quick-update.bat
```

**When to use:**
- Changed code in `src/` directory
- Updated components or pages
- Modified styles
- Changed configuration files

**What it does:**
- Only uploads changed source files
- Skips dependency installation (faster)
- Rebuilds application
- Restarts PM2 process

**Time:** ~1-2 minutes

### Full Deployment

```cmd
scripts\deploy.bat
```

**When to use:**
- Updated dependencies in `package.json`
- Need to reinstall packages
- After major updates
- First deployment

**Time:** ~5-10 minutes

---

## 🤖 Automated CI/CD (GitHub Actions)

### Setup (One-Time)

1. Run the setup helper:

```cmd
scripts\setup-github-actions.bat
```

2. Follow the prompts to add GitHub secrets:
   - `SSH_PRIVATE_KEY` - Your ubuntu-ky.pem content
   - `SSH_HOST` - 91.98.19.163
   - `SSH_USER` - root

3. Push to GitHub:

```cmd
git add .
git commit -m "Enable CI/CD"
git push origin main
```

### How It Works

Every push to `main` branch triggers automatic deployment:

```
Push to GitHub → Build & Test → Deploy → Verify → ✅ Live!
```

**View deployment status:**
https://github.com/Harsh-d-lab/SHIVAM/actions

**Rollback:** If deployment fails, it automatically reverts to previous version.

---

## 💾 Backups

### Setting Up Automated Backups

**Upload backup script to server:**

```bash
scp -i ubuntu-ky.pem scripts/backup.sh root@91.98.19.163:/usr/local/bin/
ssh -i ubuntu-ky.pem root@91.98.19.163 "chmod +x /usr/local/bin/backup.sh"
```

**Schedule daily backups (2 AM):**

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
crontab -e
# Add line:
# 0 2 * * * /usr/local/bin/backup.sh
```

### Manual Backup

Run on server:

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "/usr/local/bin/backup.sh"
```

### What Gets Backed Up

- Application files (source code, configs)
- Uploaded files (`uploads/` directory)
- Environment variables (`.env.production`)
- PM2 configuration
- Nginx configuration

### Backup Location

Server: `/var/backups/valt-intellidoc/valt-backup-YYYYMMDD_HHMMSS/`

### Retention Policy

Backups older than 30 days are automatically deleted.

---

## 🔄 Restoring from Backup

### Setup Restore Script

**Upload to server:**

```bash
scp -i ubuntu-ky.pem scripts/restore.sh root@91.98.19.163:/usr/local/bin/
ssh -i ubuntu-ky.pem root@91.98.19.163 "chmod +x /usr/local/bin/restore.sh"
```

### Run Restore

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
/usr/local/bin/restore.sh
```

**Interactive process:**
1. Lists all available backups
2. Choose which backup to restore
3. Confirm restoration
4. Creates safety backup of current state
5. Restores selected backup
6. Rebuilds and verifies application

### Safety Features

- **Safety backup:** Current state is backed up before restore
- **Selective restore:** Choose which components to restore
- **Verification:** Health check after restore
- **Rollback:** Can revert to safety backup if restore fails

---

## 🔍 Monitoring

### Setting Up Health Monitoring

**Upload monitoring script:**

```bash
scp -i ubuntu-ky.pem scripts/monitor.sh root@91.98.19.163:/usr/local/bin/
ssh -i ubuntu-ky.pem root@91.98.19.163 "chmod +x /usr/local/bin/monitor.sh"
```

**Schedule monitoring (every 5 minutes):**

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
crontab -e
# Add line:
# */5 * * * * /usr/local/bin/monitor.sh
```

### What Gets Monitored

✓ **PM2 process status** - Is the app running?  
✓ **HTTP response** - Is the app responding?  
✓ **Response time** - Is it fast enough?  
✓ **CPU usage** - Below 80%?  
✓ **Memory usage** - Below 80%?  
✓ **Disk space** - Above 15% free?  
✓ **Nginx status** - Is web server running?

### Monitoring Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| CPU | >70% | >80% |
| Memory | >70% | >80% |
| Disk | <20% | <15% |
| Response Time | >3s | >5s |

### Auto-Recovery

If the application goes down, the monitor will:
1. Attempt to restart PM2 process
2. Wait 30 seconds
3. Verify recovery
4. Send alert (if configured)

### View Monitoring Logs

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "tail -f /var/log/valt-monitoring.log"
```

### Configure Alerts (Optional)

Edit monitoring script to enable email/Slack alerts:

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
nano /usr/local/bin/monitor.sh
```

Set:
```bash
ENABLE_EMAIL_ALERTS=true
ALERT_EMAIL="your-email@example.com"

# OR

ENABLE_SLACK_ALERTS=true
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

---

## 📊 Common Tasks

### Check Application Status

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 status"
```

### View Live Logs

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc"
```

### Restart Application

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 restart valt-intellidoc"
```

### View Last 50 Log Lines

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc --lines 50"
```

### Check Server Resources

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "top -bn1 | head -20"
```

### List All Backups

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "ls -lh /var/backups/valt-intellidoc/"
```

---

## 🐛 Troubleshooting

### Deployment Fails

**Check SSH connection:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "echo Connected"
```

**Check SCP works:**
```cmd
echo test > test.txt
scp -i ubuntu-ky.pem test.txt root@91.98.19.163:/tmp/
del test.txt
```

**Run deployment in verbose mode:**
```bash
bash -x scripts/deploy.sh
```

### Application Won't Start

**Check PM2 status:**
```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 status"
```

**View error logs:**
```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc --lines 100 --err"
```

**Rebuild application:**
```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "cd /var/www/valt-intellidoc && npm run build && pm2 restart valt-intellidoc"
```

### Monitoring Not Working

**Check if script is executable:**
```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "ls -l /usr/local/bin/monitor.sh"
```

**Test manually:**
```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "/usr/local/bin/monitor.sh"
```

**Check crontab:**
```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "crontab -l"
```

### Backup/Restore Issues

**Check backup directory:**
```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "ls -lh /var/backups/valt-intellidoc/"
```

**Check disk space:**
```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "df -h"
```

**Run backup manually to test:**
```bash
ssh -i ubuntu-ky.pem root@91.98.19.163 "/usr/local/bin/backup.sh"
```

---

## 📝 Script Details

### deploy.sh (380+ lines)

**Full deployment automation for Linux/Mac/WSL**

Features:
- SSH connection testing
- Package installation (Node.js 20.x, PM2, Nginx)
- File upload via rsync/scp
- Application build
- PM2 configuration and startup
- Nginx reverse proxy setup
- UFW firewall configuration
- Deployment verification
- Colored output with progress indicators

Usage:
```bash
bash scripts/deploy.sh
```

### deploy.bat (Windows)

**Windows-compatible deployment script**

Features:
- Creates temporary directory
- Copies files (excludes node_modules, .next, .git)
- Uploads via SCP
- Runs build on server
- Restarts PM2 process

Usage:
```cmd
scripts\deploy.bat
```

### quick-update.bat (Windows)

**Fast update script for code changes**

Features:
- Only uploads source files (src/, public/, configs)
- Skips full setup
- Faster than full deployment
- Perfect for development iterations

Usage:
```cmd
scripts\quick-update.bat
```

### backup.sh (Server)

**Automated backup creation**

Features:
- Application files backup (tar.gz)
- Uploads directory backup
- Environment configuration backup
- PM2 configuration backup
- Nginx configuration backup
- Backup manifest generation
- 30-day retention policy
- Timestamped backups

Backup format:
```
/var/backups/valt-intellidoc/valt-backup-20240115_140530/
├── app-files.tar.gz
├── uploads.tar.gz
├── environment.env
├── pm2-config.json
├── nginx-config.conf
└── backup-manifest.txt
```

### restore.sh (Server)

**Interactive backup restoration**

Features:
- Lists all available backups with details
- Interactive selection
- Safety backup before restore
- Selective component restoration
- Automatic rebuild
- Health verification
- Rollback on failure

Usage:
```bash
/usr/local/bin/restore.sh
```

### monitor.sh (Server - 250+ lines)

**Comprehensive health monitoring**

Features:
- PM2 process monitoring
- HTTP health checks
- Response time measurement
- CPU usage monitoring
- Memory usage monitoring
- Disk space monitoring
- Nginx status checks
- Auto-restart on failure
- Email alerts (configurable)
- Slack alerts (configurable)
- Detailed logging

Runs every 5 minutes via cron.

Log location: `/var/log/valt-monitoring.log`

### setup-github-actions.bat (Windows)

**GitHub Actions configuration helper**

Features:
- Extracts SSH key content
- Copies to clipboard
- Provides step-by-step instructions
- Shows GitHub repository URL
- Lists required secrets
- Test instructions

Usage:
```cmd
scripts\setup-github-actions.bat
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.production` on server:

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
nano /var/www/valt-intellidoc/.env.production
```

Required variables:
```env
NEXTAUTH_URL=http://91.98.19.163
NEXTAUTH_SECRET=your-secret-here
DATABASE_URL=postgresql://user:pass@localhost:5432/db
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Server Details

Configured in scripts:

```bash
SERVER_USER="root"
SERVER_IP="91.98.19.163"
SSH_KEY="ubuntu-ky.pem"
APP_DIR="/var/www/valt-intellidoc"
APP_NAME="valt-intellidoc"
```

---

## 📚 Additional Resources

- **Full Deployment Guide**: [DEPLOYMENT.md](../DEPLOYMENT.md)
- **Repository**: https://github.com/Harsh-d-lab/SHIVAM
- **Next.js Docs**: https://nextjs.org/docs
- **PM2 Docs**: https://pm2.keymetrics.io/docs
- **Nginx Docs**: https://nginx.org/en/docs/

---

## ✅ Deployment Checklist

### First Time Setup

- [ ] SSH key (`ubuntu-ky.pem`) in project root
- [ ] Can connect: `ssh -i ubuntu-ky.pem root@91.98.19.163`
- [ ] Run initial deployment: `scripts\deploy.bat`
- [ ] Verify site loads: http://91.98.19.163
- [ ] Configure environment variables on server
- [ ] Upload and schedule backup script
- [ ] Upload and schedule monitoring script
- [ ] Set up GitHub Actions (optional)

### After Each Update

- [ ] Commit changes: `git add . && git commit -m "message"`
- [ ] Push to GitHub: `git push origin main`
- [ ] Auto-deploy via GitHub Actions OR
- [ ] Manual deploy: `scripts\quick-update.bat`
- [ ] Verify deployment: http://91.98.19.163
- [ ] Check logs: `pm2 logs valt-intellidoc`

### Weekly Maintenance

- [ ] Check monitoring logs
- [ ] Review backup status
- [ ] Check disk space
- [ ] Review error logs
- [ ] Update dependencies (if needed)

### Monthly Maintenance

- [ ] Test backup restoration
- [ ] Review and clean old backups
- [ ] Update system packages: `apt-get update && apt-get upgrade`
- [ ] Review security updates
- [ ] Check SSL certificate expiry (if using HTTPS)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs**: `pm2 logs valt-intellidoc`
2. **Check monitoring**: `tail -f /var/log/valt-monitoring.log`
3. **Check Nginx**: `systemctl status nginx`
4. **Review DEPLOYMENT.md**: Comprehensive troubleshooting guide
5. **Check GitHub Actions**: If using CI/CD

---

## 🎉 You're All Set!

Your deployment automation is ready. Choose your workflow:

**Option 1: Manual Deployment**
```cmd
scripts\quick-update.bat
```

**Option 2: Automated CI/CD**
```cmd
git push origin main
# GitHub Actions deploys automatically
```

Both work great! Happy deploying! 🚀
