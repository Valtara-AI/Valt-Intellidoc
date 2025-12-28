# 🎯 QUICK START - Fix Server Access

## ⚡ FASTEST WAY TO FIX

**Just double-click this file:**
```
FIX-SERVER-NOW.bat
```

Wait 30 seconds, then try: http://91.98.19.163

---

## 📋 If That Doesn't Work

Try these in order:

### 1. Emergency Restart
```cmd
scripts\emergency-restart.bat
```

### 2. Full Rebuild
```cmd
scripts\fix-server.bat
```

### 3. Check What's Wrong
```cmd
scripts\quick-diagnose.bat
```

---

## 📖 Need More Help?

See these guides:
- **SERVER_ACCESS_FIX.md** - Complete walkthrough with all tools
- **SERVER_FIX_GUIDE.md** - Manual troubleshooting steps
- **TROUBLESHOOTING.md** - Detailed error solutions

---

## 🔧 All Available Scripts

| Script | Purpose |
|--------|---------|
| `FIX-SERVER-NOW.bat` | ⚡ One-click fix (START HERE) |
| `scripts\emergency-restart.bat` | Quick restart (30 sec) |
| `scripts\fix-server.bat` | Full rebuild (2-3 min) |
| `scripts\quick-diagnose.bat` | Check status (10 sec) |
| `scripts\health-check.bat` | Detailed health check |
| `scripts\setup-env.bat` | Setup environment vars |

---

## 💻 Manual SSH Access

If scripts don't work:
```cmd
ssh -i ubuntu-ky.pem root@91.98.19.163
```

Then run:
```bash
pm2 status
pm2 restart valt-intellidoc
systemctl restart nginx
```

---

## ✅ Success Check

Server is working when:
- ✓ http://91.98.19.163 loads
- ✓ No error pages
- ✓ Can navigate the site

---

## 🆘 Still Stuck?

1. Run `scripts\quick-diagnose.bat`
2. Share the output
3. Check **SERVER_FIX_GUIDE.md** for your specific error

---

**Server:** 91.98.19.163  
**App:** http://91.98.19.163  
**SSH:** `ssh -i ubuntu-ky.pem root@91.98.19.163`
