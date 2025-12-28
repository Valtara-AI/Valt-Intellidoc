#!/bin/bash

###############################################################################
# Valt Intellidoc - Automated Backup Script
# Run this script on the server to create backups
###############################################################################

set -e

# Configuration
BACKUP_DIR="/var/backups/valt-intellidoc"
APP_DIR="/var/www/valt-intellidoc"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="valt-backup-${DATE}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Valt Intellidoc - Backup Script          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}➜ Creating backup: $BACKUP_NAME${NC}"

# Create backup directory for this backup
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
mkdir -p "$BACKUP_PATH"

# Backup application files
echo "Backing up application files..."
tar -czf "$BACKUP_PATH/app-files.tar.gz" \
    -C "$APP_DIR" \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='uploads' \
    .

# Backup uploads separately (if exists)
if [ -d "$APP_DIR/uploads" ]; then
    echo "Backing up uploads..."
    tar -czf "$BACKUP_PATH/uploads.tar.gz" -C "$APP_DIR" uploads
fi

# Backup environment file
if [ -f "$APP_DIR/.env.production" ]; then
    echo "Backing up environment configuration..."
    cp "$APP_DIR/.env.production" "$BACKUP_PATH/.env.production"
fi

# Backup PM2 configuration
echo "Backing up PM2 configuration..."
pm2 save
cp -r ~/.pm2 "$BACKUP_PATH/pm2-config" 2>/dev/null || true

# Backup Nginx configuration
echo "Backing up Nginx configuration..."
mkdir -p "$BACKUP_PATH/nginx"
cp /etc/nginx/sites-available/* "$BACKUP_PATH/nginx/" 2>/dev/null || true

# Create backup manifest
cat > "$BACKUP_PATH/manifest.txt" << EOF
Backup created: $(date)
Server: $(hostname)
App Directory: $APP_DIR
Node Version: $(node --version)
PM2 Version: $(pm2 --version)
Nginx Version: $(nginx -v 2>&1)
EOF

# Calculate backup size
BACKUP_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)

echo -e "${GREEN}✓ Backup created successfully${NC}"
echo "Location: $BACKUP_PATH"
echo "Size: $BACKUP_SIZE"

# Clean up old backups
echo ""
echo "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -maxdepth 1 -type d -name "valt-backup-*" -mtime +$RETENTION_DAYS -exec rm -rf {} \;

# List recent backups
echo ""
echo "Recent backups:"
ls -lth "$BACKUP_DIR" | grep "valt-backup-" | head -5

echo ""
echo -e "${GREEN}Backup complete!${NC}"
