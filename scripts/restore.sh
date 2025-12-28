#!/bin/bash

#############################################
# Valt Intellidoc - Backup Restore Script
#############################################
# This script restores application backups
# Run on server: ./restore.sh
#############################################

# Configuration
BACKUP_DIR="/var/backups/valt-intellidoc"
APP_DIR="/var/www/valt-intellidoc"
APP_NAME="valt-intellidoc"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Valt Intellidoc - Backup Restore      ║${NC}"
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo ""

# Check if running with appropriate permissions
if [ "$EUID" -ne 0 ] && [ ! -w "$APP_DIR" ]; then 
    echo -e "${RED}✗ Error: Please run with sudo or as root${NC}"
    exit 1
fi

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}✗ Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# List available backups
echo -e "${BLUE}Available backups:${NC}"
echo ""

backups=($(ls -dt $BACKUP_DIR/valt-backup-* 2>/dev/null))

if [ ${#backups[@]} -eq 0 ]; then
    echo -e "${RED}✗ No backups found in $BACKUP_DIR${NC}"
    exit 1
fi

# Display backups with details
counter=1
declare -A backup_info

for backup in "${backups[@]}"; do
    backup_name=$(basename "$backup")
    manifest="$backup/backup-manifest.txt"
    
    # Extract timestamp from backup name (valt-backup-YYYYMMDD_HHMMSS)
    timestamp=$(echo "$backup_name" | sed 's/valt-backup-//')
    date_part=$(echo "$timestamp" | cut -d'_' -f1)
    time_part=$(echo "$timestamp" | cut -d'_' -f2)
    
    # Format display
    display_date="${date_part:0:4}-${date_part:4:2}-${date_part:6:2}"
    display_time="${time_part:0:2}:${time_part:2:2}:${time_part:4:2}"
    
    # Get backup size
    backup_size=$(du -sh "$backup" | cut -f1)
    
    # Store info
    backup_info[$counter]="$backup"
    
    echo -e "${YELLOW}[$counter]${NC} $display_date $display_time"
    echo "    Path: $backup"
    echo "    Size: $backup_size"
    
    # Show manifest info if available
    if [ -f "$manifest" ]; then
        echo "    Components:"
        grep "✓" "$manifest" 2>/dev/null | sed 's/^/      /'
    fi
    
    echo ""
    ((counter++))
done

# Prompt for selection
echo -e "${BLUE}Select backup to restore (1-$((counter-1)), or 0 to cancel): ${NC}"
read -r selection

# Validate input
if [ "$selection" -eq 0 ]; then
    echo -e "${YELLOW}Restore cancelled${NC}"
    exit 0
fi

if [ "$selection" -lt 1 ] || [ "$selection" -ge "$counter" ]; then
    echo -e "${RED}✗ Invalid selection${NC}"
    exit 1
fi

# Get selected backup
selected_backup="${backup_info[$selection]}"
echo ""
echo -e "${GREEN}Selected backup: $(basename "$selected_backup")${NC}"
echo ""

# Confirm restore
echo -e "${YELLOW}⚠ WARNING: This will replace current application files!${NC}"
echo -e "${YELLOW}Current application will be backed up before restore.${NC}"
echo ""
echo -e "${BLUE}Do you want to proceed? (yes/no): ${NC}"
read -r confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}Restore cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Starting restore process...${NC}"
echo ""

# Create safety backup of current state
safety_backup="$APP_DIR/pre-restore-backup-$(date +%Y%m%d_%H%M%S)"
echo -e "${BLUE}[1/6] Creating safety backup of current state...${NC}"

if [ -d "$APP_DIR" ]; then
    mkdir -p "$safety_backup"
    
    # Backup critical files
    [ -f "$APP_DIR/.env.production" ] && cp "$APP_DIR/.env.production" "$safety_backup/"
    [ -d "$APP_DIR/.next" ] && cp -r "$APP_DIR/.next" "$safety_backup/"
    [ -f "$APP_DIR/package.json" ] && cp "$APP_DIR/package.json" "$safety_backup/"
    
    echo -e "${GREEN}✓ Safety backup created: $safety_backup${NC}"
else
    echo -e "${YELLOW}⚠ Application directory not found, skipping safety backup${NC}"
fi

# Stop application
echo -e "${BLUE}[2/6] Stopping application...${NC}"
pm2 stop $APP_NAME 2>/dev/null || echo "App not running"
echo -e "${GREEN}✓ Application stopped${NC}"

# Restore application files
echo -e "${BLUE}[3/6] Restoring application files...${NC}"

app_backup="$selected_backup/app-files.tar.gz"
if [ -f "$app_backup" ]; then
    # Extract to temporary location first
    temp_dir="/tmp/valt-restore-$$"
    mkdir -p "$temp_dir"
    
    tar -xzf "$app_backup" -C "$temp_dir"
    
    # Move files to app directory
    mkdir -p "$APP_DIR"
    
    # Restore files (preserve current .env.production and uploads if they exist)
    if [ -f "$APP_DIR/.env.production" ]; then
        cp "$APP_DIR/.env.production" "$temp_dir/" 2>/dev/null || true
    fi
    
    rsync -a --delete --exclude='.env.production' --exclude='uploads/' \
        "$temp_dir/" "$APP_DIR/"
    
    rm -rf "$temp_dir"
    
    echo -e "${GREEN}✓ Application files restored${NC}"
else
    echo -e "${RED}✗ Application backup file not found${NC}"
    exit 1
fi

# Restore environment file (if needed)
echo -e "${BLUE}[4/6] Checking environment configuration...${NC}"

env_backup="$selected_backup/environment.env"
if [ -f "$env_backup" ] && [ ! -f "$APP_DIR/.env.production" ]; then
    cp "$env_backup" "$APP_DIR/.env.production"
    echo -e "${GREEN}✓ Environment file restored${NC}"
else
    echo -e "${YELLOW}⚠ Using existing environment file${NC}"
fi

# Restore uploads directory (optional)
echo -e "${BLUE}[5/6] Restoring uploads...${NC}"

uploads_backup="$selected_backup/uploads.tar.gz"
if [ -f "$uploads_backup" ]; then
    echo -e "${BLUE}Uploads backup found. Restore uploads? (yes/no): ${NC}"
    read -r restore_uploads
    
    if [ "$restore_uploads" = "yes" ]; then
        tar -xzf "$uploads_backup" -C "$APP_DIR/"
        echo -e "${GREEN}✓ Uploads restored${NC}"
    else
        echo -e "${YELLOW}⚠ Skipped uploads restore${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No uploads backup found${NC}"
fi

# Reinstall dependencies and rebuild
echo -e "${BLUE}[6/6] Rebuilding application...${NC}"

cd "$APP_DIR"

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Build application
echo "Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Application rebuilt successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    echo -e "${YELLOW}Attempting to restore from safety backup...${NC}"
    
    if [ -d "$safety_backup/.next" ]; then
        rm -rf "$APP_DIR/.next"
        cp -r "$safety_backup/.next" "$APP_DIR/"
        echo -e "${GREEN}✓ Restored from safety backup${NC}"
    fi
fi

# Restart application
echo ""
echo -e "${BLUE}Restarting application...${NC}"
pm2 restart $APP_NAME || pm2 start npm --name $APP_NAME -- start
pm2 save

# Verify
echo ""
echo -e "${BLUE}Verifying application...${NC}"
sleep 5

pm2 status $APP_NAME

# Health check
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
    echo -e "${GREEN}✓ Application is responding correctly${NC}"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ Restore completed successfully!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}Safety backup location:${NC}"
    echo "  $safety_backup"
    echo ""
    echo -e "${BLUE}You can remove it once you verify everything works:${NC}"
    echo -e "  ${YELLOW}rm -rf $safety_backup${NC}"
    echo ""
else
    echo -e "${RED}✗ Application health check failed (HTTP $response)${NC}"
    echo -e "${YELLOW}Check logs: pm2 logs $APP_NAME${NC}"
    echo ""
    echo -e "${YELLOW}Safety backup available at: $safety_backup${NC}"
    exit 1
fi
