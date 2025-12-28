#!/bin/bash

###############################################################################
# Valt Intellidoc - Automated Deployment Script
# This script automates the deployment process to your Ubuntu server
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="91.98.19.163"
SERVER_USER="root"
SSH_KEY="ubuntu-ky.pem"
APP_DIR="/var/www/valt-intellidoc"
APP_NAME="valt-intellidoc"
NODE_VERSION="20"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Valt Intellidoc - Deployment Script        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print step headers
print_step() {
    echo ""
    echo -e "${GREEN}➜ $1${NC}"
    echo "─────────────────────────────────────────────────"
}

# Function to handle errors
handle_error() {
    echo -e "${RED}✗ Error: $1${NC}"
    exit 1
}

# Function to run commands on server
run_remote() {
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$@"
}

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    handle_error "SSH key not found: $SSH_KEY"
fi

# Step 1: Test SSH Connection
print_step "Testing SSH connection..."
if run_remote "echo 'Connection successful'" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ SSH connection successful${NC}"
else
    handle_error "Cannot connect to server. Check your SSH key and server IP."
fi

# Step 2: Update System Packages
print_step "Updating system packages..."
run_remote "sudo apt update && sudo DEBIAN_FRONTEND=noninteractive apt upgrade -y" || handle_error "Failed to update system"
echo -e "${GREEN}✓ System updated${NC}"

# Step 3: Install Node.js
print_step "Installing Node.js ${NODE_VERSION}..."
run_remote "
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo bash -
        sudo apt install -y nodejs
    fi
    node --version
" || handle_error "Failed to install Node.js"
echo -e "${GREEN}✓ Node.js installed${NC}"

# Step 4: Install PM2
print_step "Installing PM2..."
run_remote "
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi
    pm2 --version
" || handle_error "Failed to install PM2"
echo -e "${GREEN}✓ PM2 installed${NC}"

# Step 5: Install Nginx
print_step "Installing Nginx..."
run_remote "
    if ! command -v nginx &> /dev/null; then
        sudo apt install -y nginx
        sudo systemctl enable nginx
    fi
    nginx -v
" || handle_error "Failed to install Nginx"
echo -e "${GREEN}✓ Nginx installed${NC}"

# Step 6: Install Git
print_step "Installing Git..."
run_remote "
    if ! command -v git &> /dev/null; then
        sudo apt install -y git
    fi
    git --version
" || handle_error "Failed to install Git"
echo -e "${GREEN}✓ Git installed${NC}"

# Step 7: Create Application Directory
print_step "Creating application directory..."
run_remote "
    sudo mkdir -p $APP_DIR
    sudo chown -R \$USER:\$USER $APP_DIR
" || handle_error "Failed to create app directory"
echo -e "${GREEN}✓ Application directory created${NC}"

# Step 8: Upload Application Files
print_step "Uploading application files..."
echo "This may take a few minutes depending on your connection..."

# Create a temporary directory for deployment
TEMP_DIR=$(mktemp -d)
cp -r . "$TEMP_DIR/" 2>/dev/null || true

# Remove unnecessary files from temp directory
cd "$TEMP_DIR"
rm -rf node_modules .next .git .env.local ubuntu-ky.pem

# Upload files using rsync for efficiency
rsync -avz --delete \
    -e "ssh -i $PWD/../$SSH_KEY -o StrictHostKeyChecking=no" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '.env.local' \
    --exclude '*.pem' \
    --exclude 'uploads' \
    . "$SERVER_USER@$SERVER_IP:$APP_DIR/" || handle_error "Failed to upload files"

cd - > /dev/null
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✓ Files uploaded${NC}"

# Step 9: Create Production Environment File
print_step "Creating production environment file..."
run_remote "cat > $APP_DIR/.env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=http://91.98.19.163
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
LOG_LEVEL=info
AUDIT_LOG_RETENTION_DAYS=365
EOF
chmod 600 $APP_DIR/.env.production
" || handle_error "Failed to create environment file"
echo -e "${GREEN}✓ Environment file created${NC}"

# Step 10: Install Dependencies and Build
print_step "Installing dependencies and building application..."
run_remote "
    cd $APP_DIR
    npm install --production=false
    npm run build
" || handle_error "Failed to build application"
echo -e "${GREEN}✓ Application built${NC}"

# Step 11: Configure PM2
print_step "Configuring PM2..."
run_remote "
    cd $APP_DIR
    pm2 delete $APP_NAME 2>/dev/null || true
    pm2 start npm --name '$APP_NAME' -- start
    pm2 save
    sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u \$USER --hp \$HOME
" || handle_error "Failed to configure PM2"
echo -e "${GREEN}✓ PM2 configured${NC}"

# Step 12: Configure Nginx
print_step "Configuring Nginx..."
run_remote "
    sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null << 'EOF'
server {
    listen 80;
    server_name 91.98.19.163;

    client_max_body_size 100M;
    proxy_buffering off;

    # Security headers
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control \"public, immutable\";
    }

    location /public {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control \"public, max-age=3600\";
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
    sudo systemctl enable nginx
" || handle_error "Failed to configure Nginx"
echo -e "${GREEN}✓ Nginx configured${NC}"

# Step 13: Configure Firewall
print_step "Configuring firewall..."
run_remote "
    sudo ufw --force enable
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw status
" || handle_error "Failed to configure firewall"
echo -e "${GREEN}✓ Firewall configured${NC}"

# Step 14: Verify Deployment
print_step "Verifying deployment..."
sleep 5  # Wait for app to start

# Check PM2 status
run_remote "pm2 status" || handle_error "PM2 not running correctly"

# Check if app is responding
if run_remote "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000" | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ Application is responding${NC}"
else
    echo -e "${YELLOW}⚠ Application might not be fully started yet. Check logs with: pm2 logs $APP_NAME${NC}"
fi

# Step 15: Display Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Deployment Completed Successfully     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ Your application is now running!${NC}"
echo ""
echo -e "Access your application at: ${YELLOW}http://91.98.19.163${NC}"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View logs:     ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs $APP_NAME'"
echo "  Restart app:   ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 restart $APP_NAME'"
echo "  App status:    ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 status'"
echo "  Server access: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
echo ""
