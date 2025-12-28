# Valt Intellidoc - Server Troubleshooting Guide

## Quick Fix

If you can't access the server at http://91.98.19.163, run:

```cmd
scripts\fix-server.bat
```

This will:
- ✅ Check SSH connection
- ✅ Rebuild the application
- ✅ Restart PM2 processes
- ✅ Restart Nginx
- ✅ Verify everything is working

## Quick Diagnosis

To quickly check what's wrong:

```cmd
scripts\quick-diagnose.bat
```

## Common Issues and Solutions

### Issue 1: Application Not Running

**Symptoms:** Server responds but shows error page

**Quick Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "cd /var/www/valt-intellidoc && pm2 restart valt-intellidoc"
```

**Full Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
cd /var/www/valt-intellidoc
npm run build
pm2 restart valt-intellidoc
pm2 logs valt-intellidoc
```

### Issue 2: Port 3000 Not Listening

**Symptoms:** Cannot connect to localhost:3000

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
cd /var/www/valt-intellidoc
pm2 delete valt-intellidoc
npm run build
pm2 start npm --name "valt-intellidoc" -- start
pm2 save
```

### Issue 3: Nginx Not Working

**Symptoms:** Connection refused or timeout

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
systemctl status nginx
nginx -t
systemctl restart nginx
```

### Issue 4: Build Errors

**Symptoms:** Application fails to start, build errors in logs

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
cd /var/www/valt-intellidoc
rm -rf .next node_modules
npm install
npm run build
pm2 restart valt-intellidoc
```

### Issue 5: Environment Variables Missing

**Symptoms:** Application starts but features don't work

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
nano /var/www/valt-intellidoc/.env.production
```

Add required variables:
```env
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=http://91.98.19.163
NEXTAUTH_SECRET=your_secret_here
DATABASE_URL=your_database_url
```

Then restart:
```cmd
pm2 restart valt-intellidoc
```

### Issue 6: Out of Memory

**Symptoms:** Application crashes or server unresponsive

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
pm2 delete valt-intellidoc
pm2 start npm --name "valt-intellidoc" -- start --max-memory-restart 500M
pm2 save
```

### Issue 7: Disk Space Full

**Check:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "df -h"
```

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
# Clean PM2 logs
pm2 flush

# Clean old logs
find /root/.pm2/logs -type f -mtime +7 -delete

# Clean npm cache
npm cache clean --force

# Clean old node_modules if multiple apps exist
cd /var/www
du -sh */node_modules
```

## Manual Step-by-Step Fix

If automated scripts don't work, follow these steps:

### Step 1: Connect to Server
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
```

### Step 2: Check Application Status
```bash
pm2 status
pm2 logs valt-intellidoc --lines 50
```

### Step 3: Check if Port is Open
```bash
ss -tuln | grep :3000
netstat -tuln | grep :3000
```

### Step 4: Check Nginx
```bash
systemctl status nginx
nginx -t
cat /etc/nginx/sites-enabled/valt-intellidoc
```

### Step 5: Rebuild Application
```bash
cd /var/www/valt-intellidoc
npm install
npm run build
```

### Step 6: Restart Everything
```bash
pm2 delete valt-intellidoc
pm2 start npm --name "valt-intellidoc" -- start
pm2 save
systemctl restart nginx
```

### Step 7: Verify
```bash
pm2 status
curl http://localhost:3000
curl http://localhost
```

## Checking Logs

### PM2 Logs
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc"
```

### Nginx Access Logs
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "tail -100 /var/log/nginx/access.log"
```

### Nginx Error Logs
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "tail -100 /var/log/nginx/error.log"
```

### System Logs
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "journalctl -u nginx -n 50"
```

## Performance Issues

### Check Resource Usage
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "top -bn1 | head -20"
```

### Check Memory
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "free -h"
```

### Check Disk
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "df -h"
```

## Complete Reset (Last Resort)

If nothing else works, perform a complete reset:

```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
cd /var/www/valt-intellidoc

# Backup current state
tar -czf ~/valt-backup-$(date +%Y%m%d).tar.gz .

# Stop everything
pm2 delete all

# Clean everything
rm -rf .next node_modules .npm

# Fresh install
npm install
npm run build

# Start fresh
pm2 start npm --name "valt-intellidoc" -- start
pm2 save
pm2 startup

# Restart Nginx
systemctl restart nginx
```

## Testing After Fix

### Test Locally on Server
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "curl -I http://localhost:3000"
```

### Test Externally
Open in browser: http://91.98.19.163

Or from command line:
```cmd
curl -I http://91.98.19.163
```

## Automated Monitoring

Set up automated monitoring to prevent future issues:

```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
crontab -e
```

Add these lines:
```cron
# Check every 5 minutes
*/5 * * * * /usr/local/bin/monitor.sh

# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup.sh

# Weekly cleanup at 3 AM Sunday
0 3 * * 0 pm2 flush && find /root/.pm2/logs -type f -mtime +7 -delete
```

## Getting Help

If issues persist:

1. Run full diagnostics:
   ```cmd
   scripts\quick-diagnose.bat > diagnosis.txt
   ```

2. Check all logs:
   ```cmd
   ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc --lines 100 > /tmp/app.log && cat /tmp/app.log"
   ```

3. Review the diagnosis output and logs to identify the root cause

## Prevention

To avoid future issues:

1. **Use automated deployment:**
   ```cmd
   scripts\deploy.bat
   ```

2. **Enable monitoring:**
   Upload and schedule `scripts/monitor.sh`

3. **Regular backups:**
   Upload and schedule `scripts/backup.sh`

4. **Keep dependencies updated:**
   ```cmd
   ssh -i ubuntu-ky.pem root@91.98.19.163 "cd /var/www/valt-intellidoc && npm update"
   ```

5. **Monitor resources:**
   Set up alerts for CPU, memory, and disk usage
