# Valt Intellidoc - Deployment Guide

Complete deployment guide for deploying Valt Intellidoc to your Ubuntu server.

---

## 📋 Prerequisites

### Local Machine (Windows)
- Git installed
- SSH client (OpenSSH - included in Windows 10/11)
- SSH private key: `ubuntu-ky.pem` (in project root)

### Server Details
- **IP Address**: `91.98.19.163`
- **OS**: Ubuntu 22.04 LTS
- **User**: `root` (or `ubuntu` with sudo)
- **SSH Key**: `ubuntu-ky.pem`
- **Application Directory**: `/var/www/valt-intellidoc`
- **Domain**: (Configure in Nginx after deployment)

### Required Server Resources
- **CPU**: 2+ cores
- **RAM**: 4GB minimum
- **Disk**: 40GB minimum
- **Ports**: 80 (HTTP), 443 (HTTPS), 22 (SSH)

---

## 🚀 Quick Start (First Time Deployment)

### Step 1: Test SSH Connection

```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
```

If successful, you'll see the Ubuntu welcome message. Type `exit` to disconnect.

### Step 2: Run Deployment Script

#### Option A: Full Automated Deployment (Linux/Mac/WSL)

```bash
bash scripts/deploy.sh
```

This script will:
- ✓ Install Node.js 20.x
- ✓ Install PM2 process manager
- ✓ Install and configure Nginx
- ✓ Upload application files
- ✓ Build the application
- ✓ Configure firewall
- ✓ Start the application
- ✓ Verify deployment

#### Option B: Windows Deployment (CMD)

```cmd
scripts\deploy.bat
```

This script will:
- ✓ Copy files to temporary directory
- ✓ Upload via SCP
- ✓ Build on server
- ✓ Restart application

### Step 3: Verify Deployment

Open your browser:
```
http://91.98.19.163
```

You should see the Valt Intellidoc homepage!

---

## 🔄 Updating Your Application

### Quick Update (After Code Changes)

```cmd
scripts\quick-update.bat
```

This uploads only changed files and restarts the app (faster than full deployment).

### Via GitHub Actions (Automatic)

Once configured, every push to `main` branch automatically deploys:

```cmd
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will:
1. Build the application
2. Run tests
3. Deploy to server
4. Verify deployment
5. Rollback if failed

---

## ⚙️ Configuration

### 1. Environment Variables

On your server, edit the environment file:

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
nano /var/www/valt-intellidoc/.env.production
```

**Required variables:**

```env
# Authentication
NEXTAUTH_URL=http://91.98.19.163
NEXTAUTH_SECRET=your-secret-here

# Database (if using)
DATABASE_URL=postgresql://user:password@localhost:5432/valtdb

# OpenAI (for RAG features)
OPENAI_API_KEY=sk-your-key-here

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# SharePoint (if integrating)
SHAREPOINT_CLIENT_ID=your-client-id
SHAREPOINT_CLIENT_SECRET=your-client-secret
SHAREPOINT_TENANT_ID=your-tenant-id

# Logging
LOG_LEVEL=info
```

**Generate secure secrets:**

```bash
# On server, generate random secrets:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. GitHub Actions Setup

Add secrets to your GitHub repository:

1. Go to: `https://github.com/Harsh-d-lab/SHIVAM/settings/secrets/actions`

2. Add these secrets:

| Secret Name | Value |
|------------|-------|
| `SSH_PRIVATE_KEY` | Contents of `ubuntu-ky.pem` file |
| `SSH_HOST` | `91.98.19.163` |
| `SSH_USER` | `root` |

**To get SSH key contents:**

```cmd
type ubuntu-ky.pem
```

Copy entire output including:
```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

### 3. Domain Setup (Optional)

If you have a domain (e.g., `intellidoc.example.com`):

**A. Point domain to server:**

Add DNS A record:
```
Type: A
Name: @  (or subdomain)
Value: 91.98.19.163
TTL: 3600
```

**B. Update Nginx configuration:**

On server:

```bash
nano /etc/nginx/sites-available/valt-intellidoc
```

Change:
```nginx
server_name _;
```

To:
```nginx
server_name intellidoc.example.com;
```

Restart Nginx:
```bash
nginx -t
systemctl reload nginx
```

**C. Enable HTTPS with Let's Encrypt:**

```bash
# Install Certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d intellidoc.example.com

# Auto-renewal is configured automatically
```

Update environment:
```bash
nano /var/www/valt-intellidoc/.env.production
```

Change:
```env
NEXTAUTH_URL=https://intellidoc.example.com
```

Rebuild and restart:
```bash
cd /var/www/valt-intellidoc
npm run build
pm2 restart valt-intellidoc
```

---

## 🔍 Monitoring & Maintenance

### Set Up Automated Monitoring

Upload and configure the monitoring script:

```bash
# Upload monitor script to server
scp -i ubuntu-ky.pem scripts/monitor.sh root@91.98.19.163:/usr/local/bin/
ssh -i ubuntu-ky.pem root@91.98.19.163

# Make executable
chmod +x /usr/local/bin/monitor.sh

# Test it
/usr/local/bin/monitor.sh
```

**Schedule monitoring (run every 5 minutes):**

```bash
crontab -e
```

Add line:
```
*/5 * * * * /usr/local/bin/monitor.sh
```

### Optional: Email Alerts

Configure email alerts in monitoring script:

```bash
nano /usr/local/bin/monitor.sh
```

Set:
```bash
ENABLE_EMAIL_ALERTS=true
ALERT_EMAIL="your-email@example.com"
```

Install mail utility:
```bash
apt-get install -y mailutils
```

### Check Application Status

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163

# PM2 status
pm2 status

# Application logs
pm2 logs valt-intellidoc

# Last 50 lines
pm2 logs valt-intellidoc --lines 50

# Monitoring log
tail -f /var/log/valt-monitoring.log

# Nginx access log
tail -f /var/log/nginx/valt-access.log

# Nginx error log
tail -f /var/log/nginx/valt-error.log
```

### Resource Monitoring

```bash
# CPU and memory usage
top

# Disk usage
df -h

# Network connections
netstat -tulpn | grep node
```

---

## 💾 Backups

### Set Up Automated Backups

**Upload backup script:**

```bash
scp -i ubuntu-ky.pem scripts/backup.sh root@91.98.19.163:/usr/local/bin/
ssh -i ubuntu-ky.pem root@91.98.19.163
chmod +x /usr/local/bin/backup.sh
```

**Test backup:**

```bash
/usr/local/bin/backup.sh
```

**Schedule daily backups (2 AM):**

```bash
crontab -e
```

Add:
```
0 2 * * * /usr/local/bin/backup.sh
```

**List backups:**

```bash
ls -lh /var/backups/valt-intellidoc/
```

### Restore from Backup

**Upload restore script:**

```bash
scp -i ubuntu-ky.pem scripts/restore.sh root@91.98.19.163:/usr/local/bin/
ssh -i ubuntu-ky.pem root@91.98.19.163
chmod +x /usr/local/bin/restore.sh
```

**Run restore:**

```bash
/usr/local/bin/restore.sh
```

The script will:
1. List all available backups
2. Let you choose which to restore
3. Create safety backup of current state
4. Restore selected backup
5. Rebuild and restart application

---

## 🛠️ Common Tasks

### Restart Application

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
pm2 restart valt-intellidoc
```

### View Logs

```bash
# Real-time logs
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc"

# From Windows without SSH session
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc --lines 100"
```

### Update Environment Variables

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
nano /var/www/valt-intellidoc/.env.production
# Make changes, save (Ctrl+O), exit (Ctrl+X)

# Restart app to apply changes
pm2 restart valt-intellidoc
```

### Clear Application Cache

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
cd /var/www/valt-intellidoc
rm -rf .next
npm run build
pm2 restart valt-intellidoc
```

### Update Dependencies

```bash
ssh -i ubuntu-ky.pem root@91.98.19.163
cd /var/www/valt-intellidoc
npm update
npm run build
pm2 restart valt-intellidoc
```

---

## 🐛 Troubleshooting

### Application Won't Start

**Check logs:**
```bash
pm2 logs valt-intellidoc --lines 50
```

**Common issues:**

1. **Port 3000 already in use:**
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
pm2 restart valt-intellidoc
```

2. **Build errors:**
```bash
cd /var/www/valt-intellidoc
rm -rf node_modules .next
npm install
npm run build
pm2 restart valt-intellidoc
```

3. **Permission errors:**
```bash
chown -R root:root /var/www/valt-intellidoc
chmod -R 755 /var/www/valt-intellidoc
```

### Can't Connect via SSH

**Check SSH key permissions (Windows):**

```cmd
icacls ubuntu-ky.pem
```

Should show only your user. If not:
```cmd
icacls ubuntu-ky.pem /inheritance:r
icacls ubuntu-ky.pem /grant:r "%USERNAME%:R"
```

**Test connection with verbose output:**
```cmd
ssh -v -i ubuntu-ky.pem root@91.98.19.163
```

### Nginx Issues

**Check Nginx status:**
```bash
systemctl status nginx
```

**Test configuration:**
```bash
nginx -t
```

**View error log:**
```bash
tail -f /var/log/nginx/error.log
```

**Restart Nginx:**
```bash
systemctl restart nginx
```

### Deployment Script Fails

**Check network connectivity:**
```cmd
ping 91.98.19.163
```

**Check SSH connection:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "echo Connected"
```

**Run script in verbose mode:**
```cmd
bash -x scripts/deploy.sh
```

### High Memory Usage

**Check PM2 processes:**
```bash
pm2 list
```

**Restart with lower memory limit:**
```bash
pm2 delete valt-intellidoc
pm2 start npm --name valt-intellidoc --max-memory-restart 500M -- start
pm2 save
```

### Disk Space Full

**Check disk usage:**
```bash
df -h
```

**Clear old logs:**
```bash
pm2 flush  # Clear PM2 logs
find /var/log -type f -name "*.log" -mtime +30 -delete  # Delete old logs
```

**Clear old backups:**
```bash
find /var/backups/valt-intellidoc -type d -mtime +30 -exec rm -rf {} +
```

**Clear npm cache:**
```bash
npm cache clean --force
```

---

## 📊 Performance Optimization

### Enable Gzip Compression

Already configured in Nginx by deploy script. Verify:

```bash
curl -H "Accept-Encoding: gzip" -I http://localhost:3000
```

Should see: `Content-Encoding: gzip`

### Enable Caching

Static assets are cached for 1 year (configured in Nginx).

### PM2 Cluster Mode (Optional)

For better performance with multiple CPU cores:

```bash
pm2 delete valt-intellidoc
pm2 start npm --name valt-intellidoc -i max -- start
pm2 save
```

This creates one instance per CPU core with load balancing.

---

## 🔐 Security Checklist

- [ ] SSH key-based authentication (no password login)
- [ ] Firewall configured (ufw enabled, only ports 80/443/22)
- [ ] HTTPS enabled with Let's Encrypt
- [ ] Environment variables secured (.env.production not in git)
- [ ] Regular backups scheduled
- [ ] Monitoring and alerting configured
- [ ] PM2 logs rotated (automatic)
- [ ] Nginx security headers enabled
- [ ] Rate limiting configured (Nginx)
- [ ] Regular system updates: `apt-get update && apt-get upgrade`

---

## 📚 Additional Resources

### Useful Commands Reference

```bash
# PM2
pm2 start <app>      # Start application
pm2 stop <app>       # Stop application
pm2 restart <app>    # Restart application
pm2 delete <app>     # Remove application
pm2 logs <app>       # View logs
pm2 monit            # Monitor resources
pm2 list             # List all applications
pm2 save             # Save current process list
pm2 startup          # Configure PM2 to start on boot

# Nginx
systemctl start nginx    # Start Nginx
systemctl stop nginx     # Stop Nginx
systemctl restart nginx  # Restart Nginx
systemctl reload nginx   # Reload config
nginx -t                 # Test configuration
systemctl status nginx   # Check status

# System
systemctl status <service>  # Check service status
journalctl -u <service>     # View service logs
top                         # Monitor resources
htop                        # Better resource monitor
df -h                       # Disk usage
du -sh <dir>                # Directory size
netstat -tulpn              # Active connections
ufw status                  # Firewall status
```

### File Locations

```
/var/www/valt-intellidoc/              # Application directory
/var/www/valt-intellidoc/.env.production  # Environment variables
/etc/nginx/sites-available/valt-intellidoc  # Nginx config
/var/log/nginx/valt-*.log              # Nginx logs
/var/log/valt-monitoring.log           # Monitoring log
/var/backups/valt-intellidoc/          # Backup directory
~/.pm2/logs/                           # PM2 logs
```

### Support

- **Project Repository**: https://github.com/Harsh-d-lab/SHIVAM
- **Next.js Documentation**: https://nextjs.org/docs
- **PM2 Documentation**: https://pm2.keymetrics.io/docs
- **Nginx Documentation**: https://nginx.org/en/docs/

---

## 🎉 Success!

Your application is now deployed! Access it at:

**HTTP**: http://91.98.19.163

**HTTPS** (after domain setup): https://intellidoc.example.com

**Key Metrics to Monitor:**
- Application uptime (PM2 status)
- Response times (monitoring script)
- Resource usage (CPU/Memory/Disk)
- Error rates (logs)
- Backup completion (daily at 2 AM)

**Next Steps:**
1. Configure your domain and SSL
2. Set up email alerts for monitoring
3. Test backup/restore procedure
4. Review and adjust resource limits
5. Share with your team!

Happy deploying! 🚀
