# Valt Intellidoc Deployment Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR WINDOWS MACHINE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Local Development                                               │
│  ├─ Edit code (VS Code)                                         │
│  ├─ Test locally (npm run dev)                                  │
│  └─ Commit & push (git push)                                    │
│                                                                  │
│  Deployment Scripts                                              │
│  ├─ scripts\deploy.bat         → Full deployment                │
│  ├─ scripts\quick-update.bat   → Fast updates                   │
│  ├─ scripts\health-check.bat   → Status check                   │
│  └─ scripts\setup-github-actions.bat → CI/CD setup              │
│                                                                  │
│  SSH Key: ubuntu-ky.pem                                          │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ SSH (Port 22)
                         │ SCP/rsync for file transfer
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HETZNER UBUNTU SERVER                         │
│                      91.98.19.163                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Web Server Layer (Nginx)                                        │
│  ├─ Reverse proxy (Port 80 → 3000)                              │
│  ├─ Static file serving                                          │
│  ├─ Gzip compression                                             │
│  ├─ Security headers                                             │
│  └─ SSL/TLS (Port 443) [Optional]                               │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Application Layer (PM2 + Next.js)                               │
│  ├─ PM2 Process Manager                                          │
│  │  ├─ Auto-restart on crash                                    │
│  │  ├─ Log management                                            │
│  │  ├─ Cluster mode (optional)                                  │
│  │  └─ Startup script                                            │
│  │                                                               │
│  └─ Next.js Application (Port 3000)                              │
│     ├─ SSR/SSG rendering                                         │
│     ├─ API routes                                                │
│     ├─ Static assets                                             │
│     └─ Environment config                                        │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Application Directory                                           │
│  /var/www/valt-intellidoc/                                       │
│  ├─ src/              → Application source code                 │
│  ├─ public/           → Static assets                            │
│  ├─ .next/            → Built application                        │
│  ├─ node_modules/     → Dependencies                             │
│  ├─ uploads/          → User uploads                             │
│  ├─ .env.production   → Environment variables                    │
│  └─ package.json      → Dependency manifest                      │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Monitoring & Maintenance                                        │
│  ├─ /usr/local/bin/monitor.sh                                   │
│  │  ├─ Runs every 5 minutes (cron)                              │
│  │  ├─ Checks PM2 status                                         │
│  │  ├─ HTTP health check                                         │
│  │  ├─ Resource monitoring (CPU/Memory/Disk)                    │
│  │  ├─ Auto-restart on failure                                   │
│  │  └─ Logs to /var/log/valt-monitoring.log                     │
│  │                                                               │
│  ├─ /usr/local/bin/backup.sh                                    │
│  │  ├─ Runs daily at 2 AM (cron)                                │
│  │  ├─ Backs up application files                               │
│  │  ├─ Backs up uploads directory                               │
│  │  ├─ Backs up configuration                                    │
│  │  └─ 30-day retention policy                                   │
│  │                                                               │
│  └─ /usr/local/bin/restore.sh                                   │
│     ├─ Interactive restoration                                   │
│     ├─ Safety backups                                            │
│     └─ Selective component restore                               │
│                                                                  │
│  Backup Storage                                                  │
│  /var/backups/valt-intellidoc/                                   │
│  ├─ valt-backup-20240115_020000/                                │
│  ├─ valt-backup-20240116_020000/                                │
│  └─ valt-backup-20240117_020000/                                │
│                                                                  │
│  Logs                                                            │
│  ├─ /var/log/valt-monitoring.log    → Monitoring logs           │
│  ├─ /var/log/nginx/valt-*.log       → Web server logs           │
│  └─ ~/.pm2/logs/                     → Application logs          │
│                                                                  │
│  Firewall (UFW)                                                  │
│  ├─ Allow 22 (SSH)                                               │
│  ├─ Allow 80 (HTTP)                                              │
│  ├─ Allow 443 (HTTPS)                                            │
│  └─ Deny all other incoming                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                         ▲
                         │
                         │ HTTPS/HTTP
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        END USERS                                 │
│                                                                  │
│  Browser → http://91.98.19.163                                   │
│         or https://your-domain.com (with SSL)                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘


                         ┌─────────────────────┐
                         │  GITHUB ACTIONS     │
                         │     CI/CD           │
                         ├─────────────────────┤
                         │                     │
                         │  On push to main:   │
                         │  1. Build app       │
                         │  2. Run tests       │
                         │  3. Deploy to srv   │
                         │  4. Verify          │
                         │  5. Rollback if ✗   │
                         │                     │
                         └──────────┬──────────┘
                                    │
                                    │ SSH
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │   Ubuntu Server           │
                    │   (Auto-deployment)       │
                    └───────────────────────────┘
```

## Deployment Flow

### Manual Deployment (Windows)

```
Developer Machine                    Ubuntu Server
─────────────────                    ─────────────

┌──────────────┐                    ┌──────────────┐
│ Edit Code    │                    │              │
└──────┬───────┘                    │              │
       │                            │              │
       ▼                            │              │
┌──────────────┐                    │              │
│ Test Locally │                    │              │
└──────┬───────┘                    │              │
       │                            │              │
       ▼                            │              │
┌──────────────┐                    │              │
│ Run          │   SSH/SCP          │              │
│ deploy.bat   ├───────────────────►│  Receives    │
│              │                    │  Files       │
└──────────────┘                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ npm install  │
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ npm run build│
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ PM2 restart  │
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Verify       │
                                    │ Health       │
                                    └──────────────┘
```

### Automated CI/CD (GitHub Actions)

```
Developer Machine          GitHub            Ubuntu Server
─────────────────          ──────            ─────────────

┌──────────────┐
│ git push     ├──────►┌──────────────┐
│ origin main  │       │ Trigger      │
└──────────────┘       │ Workflow     │
                       └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ Checkout     │
                       │ Code         │
                       └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ Setup Node   │
                       │ & Install    │
                       └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ Run Tests    │
                       └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ Build App    │
                       └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐       ┌──────────────┐
                       │ Deploy to    ├──────►│ Extract &    │
                       │ Server       │ SSH   │ Build        │
                       └──────┬───────┘       └──────┬───────┘
                              │                      │
                              ▼                      ▼
                       ┌──────────────┐       ┌──────────────┐
                       │ Verify       │◄──────┤ PM2 Restart  │
                       │ Deployment   │       └──────────────┘
                       └──────┬───────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             ┌──────────────┐    ┌──────────────┐
             │ ✓ Success    │    │ ✗ Failed     │
             │ Notify       │    │ Rollback     │
             └──────────────┘    └──────────────┘
```

## Monitoring Flow

```
Every 5 minutes (cron job):

┌──────────────────────────────────────────────────────────┐
│ /usr/local/bin/monitor.sh                                │
└────────────────────┬─────────────────────────────────────┘
                     │
     ┌───────────────┼───────────────┬──────────────┬───────┐
     │               │               │              │       │
     ▼               ▼               ▼              ▼       ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ PM2     │   │ HTTP    │   │ CPU     │   │ Memory  │   │ Disk    │
│ Status  │   │ Check   │   │ Usage   │   │ Usage   │   │ Space   │
└────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
     │             │             │             │             │
     └─────────────┴─────────────┴─────────────┴─────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
            ┌───────────────┐         ┌───────────────┐
            │ All Healthy   │         │ Issue Found   │
            └───────┬───────┘         └───────┬───────┘
                    │                         │
                    ▼                         ▼
            ┌───────────────┐         ┌───────────────┐
            │ Log Status    │         │ Auto-Restart  │
            └───────────────┘         │ Send Alert    │
                                      └───────┬───────┘
                                              │
                                              ▼
                                      ┌───────────────┐
                                      │ Log to        │
                                      │ /var/log/     │
                                      │ valt-*.log    │
                                      └───────────────┘
```

## Backup & Restore Flow

```
Daily at 2 AM (cron job):

┌──────────────────────────────────────────────────────────┐
│ /usr/local/bin/backup.sh                                 │
└────────────────────┬─────────────────────────────────────┘
                     │
     ┌───────────────┼───────────────┬──────────────┐
     │               │               │              │
     ▼               ▼               ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ App      │  │ Uploads  │  │ Env      │  │ Configs  │
│ Files    │  │ Dir      │  │ Vars     │  │ PM2/Nginx│
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     └─────────────┴─────────────┴─────────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ Create tar.gz      │
         │ archives           │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ Save to            │
         │ /var/backups/      │
         │ valt-intellidoc/   │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ Delete backups     │
         │ older than 30 days │
         └────────────────────┘


On Demand (manual):

┌──────────────────────────────────────────────────────────┐
│ /usr/local/bin/restore.sh                                │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
         ┌────────────────────┐
         │ List available     │
         │ backups            │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ User selects       │
         │ backup to restore  │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ Create safety      │
         │ backup of current  │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ Stop PM2 app       │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ Extract backup     │
         │ archives           │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ Rebuild app        │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ Restart PM2 app    │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ Verify health      │
         └────────────────────┘
```

## File Structure on Server

```
/var/www/valt-intellidoc/
│
├── Application Files
│   ├── src/                    # Source code
│   ├── public/                 # Static assets
│   ├── .next/                  # Built application
│   ├── node_modules/           # Dependencies
│   ├── package.json            # Dependency manifest
│   ├── next.config.js          # Next.js config
│   └── .env.production         # Environment variables
│
├── User Data
│   └── uploads/                # User uploaded files
│
└── Temporary
    └── backup/                 # Pre-deployment backup

/usr/local/bin/
├── backup.sh                   # Backup script
├── restore.sh                  # Restore script
└── monitor.sh                  # Monitoring script

/var/backups/valt-intellidoc/
├── valt-backup-20240115_020000/
│   ├── app-files.tar.gz
│   ├── uploads.tar.gz
│   ├── environment.env
│   ├── pm2-config.json
│   ├── nginx-config.conf
│   └── backup-manifest.txt
└── ...

/var/log/
├── valt-monitoring.log         # Monitoring logs
└── nginx/
    ├── valt-access.log         # Access logs
    └── valt-error.log          # Error logs

/etc/nginx/sites-available/
└── valt-intellidoc             # Nginx configuration

~/.pm2/
├── logs/
│   ├── valt-intellidoc-out.log # stdout logs
│   └── valt-intellidoc-error.log # stderr logs
└── dump.pm2                    # PM2 process list
```

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│                    INTERNET                          │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   UFW Firewall        │
         │   ├─ Allow 22 (SSH)   │
         │   ├─ Allow 80 (HTTP)  │
         │   ├─ Allow 443 (HTTPS)│
         │   └─ Deny others      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Nginx (Web Server)  │
         │   ├─ Security headers │
         │   ├─ Rate limiting    │
         │   ├─ Gzip compression │
         │   └─ SSL/TLS (opt)    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Next.js App         │
         │   ├─ Environment vars │
         │   ├─ Input validation │
         │   ├─ Authentication   │
         │   └─ Authorization    │
         └───────────────────────┘
```

## Key Components

| Component | Purpose | Port/Path |
|-----------|---------|-----------|
| **Nginx** | Web server, reverse proxy | 80, 443 |
| **PM2** | Process manager | - |
| **Next.js** | Application server | 3000 |
| **UFW** | Firewall | - |
| **Cron** | Task scheduler | - |
| **SSH** | Secure remote access | 22 |

## Ports Overview

| Port | Service | Access |
|------|---------|--------|
| 22 | SSH | Public (key auth only) |
| 80 | HTTP (Nginx) | Public |
| 443 | HTTPS (Nginx) | Public (if configured) |
| 3000 | Next.js | Localhost only (proxied) |

## Process Flow

1. **User Request** → Nginx (Port 80/443)
2. **Nginx** → Reverse proxy to Next.js (Port 3000)
3. **Next.js** → Renders page or handles API request
4. **Response** → Nginx → User

## Monitoring & Alerts

- **Monitor.sh** runs every 5 minutes
- Checks: PM2, HTTP, CPU, Memory, Disk
- **Auto-restart** if app down
- **Alerts** via email/Slack (configurable)
- **Logs** to `/var/log/valt-monitoring.log`

## Backup Strategy

- **Frequency**: Daily at 2 AM
- **Retention**: 30 days
- **Components**: App files, uploads, configs
- **Recovery**: Interactive restore script
- **Safety**: Pre-restore backup of current state

---

This architecture provides:
- ✅ High availability (auto-restart)
- ✅ Automated deployment
- ✅ Continuous monitoring
- ✅ Disaster recovery
- ✅ Security best practices
- ✅ Easy maintenance
