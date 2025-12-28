# 🚨 SERVER NOT ACCESSIBLE - QUICK FIX

## Immediate Action Required

Run this command to fix server access issues:

```cmd
scripts\fix-server.bat
```

This will automatically:
- ✅ Check connection
- ✅ Rebuild application
- ✅ Restart all services
- ✅ Verify everything works

## Quick Diagnosis

To check what's wrong:

```cmd
scripts\quick-diagnose.bat
```

## Most Common Issues

### 1. Application Crashed
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 restart valt-intellidoc"
```

### 2. Nginx Stopped
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "systemctl restart nginx"
```

### 3. Build Failed
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163 "cd /var/www/valt-intellidoc && npm run build && pm2 restart valt-intellidoc"
```

## Full Documentation

See **TROUBLESHOOTING.md** for complete guide with all possible issues and solutions.

## Emergency Contact

- Server IP: 91.98.19.163
- SSH: `ssh -i ubuntu-ky.pem root@91.98.19.163`
- PM2 Status: `pm2 status`
- View Logs: `pm2 logs valt-intellidoc`
