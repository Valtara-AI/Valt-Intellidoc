# GitHub Actions CI/CD Setup Guide

This guide explains how to configure GitHub Actions for automatic deployment of Valt Intellidoc.

## Prerequisites

- GitHub repository set up with your code
- Server deployed and accessible (91.98.19.163)
- SSH key generated (`new-deploy-key`)

## Step 1: Add GitHub Repository Secrets

Go to your GitHub repository settings and add the following secrets:

**Navigation:** `Repository Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### Required Secrets

1. **SSH_PRIVATE_KEY**
   - Value: Contents of `new-deploy-key` file (the private key)
   - How to get the value:
     ```bash
     # On Windows (CMD):
     type new-deploy-key
     
     # Copy the entire output including:
     # -----BEGIN OPENSSH PRIVATE KEY-----
     # ... (key content) ...
     # -----END OPENSSH PRIVATE KEY-----
     ```

2. **SSH_HOST**
   - Value: `91.98.19.163`
   - Description: The IP address of your Hetzner server

3. **SSH_USER**
   - Value: `root`
   - Description: The SSH user to connect as

### Optional Secrets (for future use)

4. **NEXTAUTH_SECRET**
   - Generate a random secret: `openssl rand -base64 32`
   - Used for NextAuth.js session encryption

5. **DATABASE_URL**
   - Your production database connection string
   - Example: `postgresql://user:pass@localhost:5432/valt_intellidoc`

6. **OPENAI_API_KEY**
   - Your OpenAI API key if using AI features
   - Format: `sk-...`

## Step 2: Verify Workflow File

The workflow file already exists at `.github/workflows/deploy.yml`

**Current workflow features:**
- ✅ Triggers on push to `main` branch
- ✅ Manual trigger available (workflow_dispatch)
- ✅ Runs tests (if available)
- ✅ Builds the application
- ✅ Deploys via SSH
- ✅ Verifies deployment
- ✅ Automatic rollback on failure
- ✅ PM2 process management

## Step 3: Test the Workflow

### Option A: Push to Main Branch
```bash
git add .
git commit -m "Setup CI/CD"
git push origin main
```

### Option B: Manual Trigger
1. Go to `Actions` tab in your GitHub repository
2. Select `Deploy to Production` workflow
3. Click `Run workflow` button
4. Select branch and click `Run workflow`

## Step 4: Monitor Deployment

1. Go to `Actions` tab in your GitHub repository
2. Click on the running workflow
3. Watch the real-time logs for each step
4. Verify the deployment was successful

## Workflow Steps Explained

### 1. Checkout Code
Clones your repository code into the runner

### 2. Setup Node.js
Installs Node.js 20 with npm caching

### 3. Install Dependencies
Runs `npm ci` for clean install

### 4. Run Tests
Executes test suite (continues on error if no tests configured)

### 5. Build Application
Runs `npm run build` to create production build

### 6. Configure SSH
Sets up SSH key and known hosts

### 7. Deploy to Server
- Creates deployment tarball
- Uploads to server via SCP
- Extracts and installs dependencies
- Builds on server
- Restarts PM2 process

### 8. Verify Deployment
- Waits 10 seconds for startup
- Checks PM2 status
- Verifies HTTP response (200, 301, or 302)
- Shows logs on failure

### 9. Rollback on Failure
- Restores previous `.next` build if deployment fails
- Restarts PM2 with previous version

## Troubleshooting

### SSH Connection Issues

**Problem:** "Permission denied (publickey)"
**Solution:** 
1. Verify SSH_PRIVATE_KEY secret contains the complete private key
2. Ensure the corresponding public key is in `/root/.ssh/authorized_keys` on server
3. Test SSH connection locally:
   ```bash
   ssh -i new-deploy-key root@91.98.19.163 "echo 'Connection works!'"
   ```

### Build Failures

**Problem:** Build fails during workflow
**Solution:**
1. Check Node.js version matches (should be 20)
2. Verify all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check for TypeScript errors

### Deployment Verification Fails

**Problem:** "Application health check failed"
**Solution:**
1. Check PM2 logs: `pm2 logs valt-intellidoc`
2. Verify port 3000 is not blocked
3. Check Nginx configuration
4. Verify environment variables are set

### Rollback Not Working

**Problem:** Rollback fails to restore previous version
**Solution:**
1. Manually restore from backups: `/var/backups/valt-intellidoc/`
2. Check if backup directory exists
3. Verify permissions on application directory

## Manual Deployment (Fallback)

If GitHub Actions fails, you can deploy manually:

```bash
# From Windows (CMD)
cd "d:\Valt Intellidoc"
scripts\deploy.bat
```

Or manually via SSH:

```bash
# Connect to server
ssh -i new-deploy-key root@91.98.19.163

# Navigate to app directory
cd /var/www/valt-intellidoc

# Pull latest changes (if using git on server)
git pull

# Install and build
npm install
npm run build

# Restart PM2
pm2 restart valt-intellidoc
```

## Best Practices

1. **Always test locally first**
   ```bash
   npm run build
   npm start
   ```

2. **Use feature branches**
   - Don't push directly to `main`
   - Use pull requests for code review
   - Merge to `main` only after review

3. **Monitor deployments**
   - Watch the Actions tab during deployment
   - Check server logs after deployment
   - Verify application is responding

4. **Keep secrets secure**
   - Never commit secrets to repository
   - Rotate SSH keys periodically
   - Use different keys for different environments

5. **Test rollback procedure**
   - Intentionally trigger a failure
   - Verify rollback works
   - Document any issues

## Monitoring After Deployment

### Check Application Status
```bash
ssh -i new-deploy-key root@91.98.19.163 "pm2 status"
```

### View Application Logs
```bash
ssh -i new-deploy-key root@91.98.19.163 "pm2 logs valt-intellidoc --lines 100"
```

### Check Resource Usage
```bash
ssh -i new-deploy-key root@91.98.19.163 "/usr/local/bin/valt-monitor.sh"
```

### View Monitoring Logs
```bash
ssh -i new-deploy-key root@91.98.19.163 "tail -50 /var/log/valt-monitoring.log"
```

## Automated Monitoring

The following automated monitoring is already configured:

- **Health Checks:** Every 5 minutes via cron
  - Location: `/etc/cron.d/valt-monitor`
  - Script: `/usr/local/bin/valt-monitor.sh`
  - Logs: `/var/log/valt-monitoring.log`

- **Backups:** Daily at 2:00 AM via cron
  - Location: `/etc/cron.d/valt-backup`
  - Script: `/usr/local/bin/valt-backup.sh`
  - Backups: `/var/backups/valt-intellidoc/`
  - Retention: 30 days

## Next Steps

1. ✅ Add GitHub Secrets (SSH_PRIVATE_KEY, SSH_HOST, SSH_USER)
2. ✅ Test workflow with manual trigger
3. ⏳ Configure environment variables in `/var/www/valt-intellidoc/.env.production`
4. ⏳ Set up domain name and SSL certificate
5. ⏳ Configure monitoring alerts (email/Slack)
6. ⏳ Set up staging environment

## Support

- **Documentation:** See `README.md` and `DEPLOYMENT.md`
- **Logs:** Check `/var/log/valt-monitoring.log` and PM2 logs
- **Backups:** Available in `/var/backups/valt-intellidoc/`
- **Health Check:** Run `/usr/local/bin/valt-monitor.sh` manually

---

**Last Updated:** October 10, 2025
**Server:** 91.98.19.163 (Hetzner CX22, Nuremberg)
**Node.js:** v20.19.5
**PM2:** 6.0.13
**Nginx:** 1.24.0
