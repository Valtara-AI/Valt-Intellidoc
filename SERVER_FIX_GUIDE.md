# 🔧 Server Access Issues - Complete Fix Guide

## ⚡ FASTEST FIX (90% of issues)

**Just run this:**
```cmd
scripts\emergency-restart.bat
```

Then check: http://91.98.19.163

---

## 🔍 What to Run Based on the Problem

| Problem | Solution | Command |
|---------|----------|---------|
| Can't access website | Emergency restart | `scripts\emergency-restart.bat` |
| Need full rebuild | Complete fix | `scripts\fix-server.bat` |
| Want to check status | Quick diagnosis | `scripts\quick-diagnose.bat` |
| Environment issues | Setup env vars | `scripts\setup-env.bat` |
| Regular health check | Health check | `scripts\health-check.bat` |

---

## 📋 Step-by-Step Manual Fix

If automated scripts don't work, follow these steps:

### Step 1: Test Connection
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "echo Connected"
```

**If this fails:**
- Server might be down
- Check SSH key permissions: `scripts\fix-ssh-key-permissions.bat`
- Verify server IP: 91.98.19.163

### Step 2: Check What's Running
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 status"
```

**Expected output:** Should show `valt-intellidoc` with status `online`

**If app is not in the list or stopped:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "cd /var/www/valt-intellidoc && pm2 start npm --name 'valt-intellidoc' -- start && pm2 save"
```

### Step 3: Check Nginx
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "systemctl status nginx"
```

**If nginx is not running:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "systemctl start nginx"
```

**If nginx has errors:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "nginx -t"
ssh -i ubuntu-ky.pem root@91.98.19.163 "systemctl restart nginx"
```

### Step 4: Check Application Logs
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc --lines 30"
```

Look for errors like:
- `EADDRINUSE` → Port already in use
- `MODULE_NOT_FOUND` → Missing dependencies
- `BUILD ERROR` → Need to rebuild

### Step 5: Test the Application
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "curl -I http://localhost:3000"
```

**Expected:** HTTP/1.1 200 OK (or 301/302 redirect)

---

## 🐛 Common Errors and Fixes

### Error: "Port 3000 already in use"

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
pm2 delete all
cd /var/www/valt-intellidoc
pm2 start npm --name "valt-intellidoc" -- start
pm2 save
```

### Error: "Cannot find module"

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
cd /var/www/valt-intellidoc
npm install
npm run build
pm2 restart valt-intellidoc
```

### Error: "ENOENT: no such file or directory"

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
cd /var/www/valt-intellidoc
npm run build
pm2 restart valt-intellidoc
```

### Error: "502 Bad Gateway" from Nginx

**Cause:** Application is not responding on port 3000

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
pm2 restart valt-intellidoc
pm2 logs valt-intellidoc
```

### Error: "Connection refused"

**Possible causes:**
1. Nginx is not running
2. Firewall blocking port 80
3. Application not listening on port 3000

**Fix:**
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
systemctl restart nginx
pm2 restart valt-intellidoc
ufw status
```

---

## 🚀 Complete Server Reset (Nuclear Option)

If nothing works, do a complete reset:

```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
```

Then run these commands:

```bash
# Stop everything
pm2 delete all
systemctl stop nginx

# Go to app directory
cd /var/www/valt-intellidoc

# Clean everything
rm -rf .next node_modules

# Fresh install
npm install
npm run build

# Setup environment
echo "NODE_ENV=production" > .env.production
echo "PORT=3000" >> .env.production
echo "NEXTAUTH_URL=http://91.98.19.163" >> .env.production

# Start fresh
pm2 start npm --name "valt-intellidoc" -- start
pm2 save
pm2 startup

# Start nginx
systemctl start nginx

# Verify
pm2 status
curl http://localhost:3000
```

---

## 📊 Monitoring Commands

### Check if everything is running:
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 status && systemctl status nginx"
```

### Check server resources:
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "free -h && df -h && top -bn1 | head -15"
```

### View real-time logs:
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc"
```

### Check nginx logs:
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "tail -50 /var/log/nginx/error.log"
```

---

## ✅ Verification Checklist

After fixing, verify these:

- [ ] SSH connection works
- [ ] PM2 shows app as `online`
- [ ] App responds on port 3000: `curl http://localhost:3000`
- [ ] Nginx is active: `systemctl status nginx`
- [ ] Nginx test passes: `nginx -t`
- [ ] External access works: http://91.98.19.163
- [ ] No errors in logs: `pm2 logs valt-intellidoc --lines 20`

---

## 🆘 Still Not Working?

1. **Run full diagnostics:**
   ```cmd
   scripts\quick-diagnose.bat
   ```

2. **Check all logs:**
   ```cmd
   ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc --lines 100"
   ```

3. **Check system status:**
   ```cmd
   ssh -i ubuntu-ky.pem root@91.98.19.163 "systemctl status nginx && free -h && df -h"
   ```

4. **Try complete reset** (see above section)

5. **Check firewall:**
   ```cmd
   ssh -i ubuntu-ky.pem root@91.98.19.163 "ufw status"
   ```
   
   If blocking port 80:
   ```cmd
   ssh -i ubuntu-ky.pem root@91.98.19.163 "ufw allow 80/tcp && ufw allow 443/tcp"
   ```

---

## 🔐 Security Check

Make sure these are set:

```cmd
# Check SSH key permissions
scripts\fix-ssh-key-permissions.bat

# Check environment variables
scripts\setup-env.bat

# Verify nginx config
ssh -i ubuntu-ky.pem root@91.98.19.163 "nginx -t"
```

---

## 📱 Quick Reference

**Server IP:** 91.98.19.163  
**App URL:** http://91.98.19.163  
**SSH:** `ssh -i ubuntu-ky.pem root@91.98.19.163`  
**App Path:** /var/www/valt-intellidoc  
**PM2 Name:** valt-intellidoc  

**Most Common Fix:**
```cmd
scripts\emergency-restart.bat
```

**Full Fix:**
```cmd
scripts\fix-server.bat
```

**Check Status:**
```cmd
scripts\quick-diagnose.bat
```
