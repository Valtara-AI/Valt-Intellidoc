#!/bin/bash

#############################################
# Valt Intellidoc - Server Setup Script
#############################################
# Run this on the Ubuntu server to install
# all required software and prepare directories
#############################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Valt Intellidoc - Server Setup        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# Update system
echo -e "${BLUE}[1/8] Updating system packages...${NC}"
apt-get update
apt-get install -y curl wget git build-essential
echo -e "${GREEN}✓ System updated${NC}"
echo ""

# Install Node.js 20.x
echo -e "${BLUE}[2/8] Installing Node.js 20.x...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}✓ Node.js $(node --version) installed${NC}"
else
    echo -e "${YELLOW}⚠ Node.js $(node --version) already installed${NC}"
fi
echo ""

# Install PM2
echo -e "${BLUE}[3/8] Installing PM2 process manager...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup systemd -u root --hp /root
    echo -e "${GREEN}✓ PM2 installed${NC}"
else
    echo -e "${YELLOW}⚠ PM2 already installed${NC}"
fi
echo ""

# Install Nginx
echo -e "${BLUE}[4/8] Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}✓ Nginx installed and started${NC}"
else
    echo -e "${YELLOW}⚠ Nginx already installed${NC}"
fi
echo ""

# Create application directory
echo -e "${BLUE}[5/8] Creating application directory...${NC}"
mkdir -p /var/www/valt-intellidoc
chown -R root:root /var/www/valt-intellidoc
echo -e "${GREEN}✓ Directory created: /var/www/valt-intellidoc${NC}"
echo ""

# Configure firewall
echo -e "${BLUE}[6/8] Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw status
    echo -e "${GREEN}✓ Firewall configured${NC}"
else
    echo -e "${YELLOW}⚠ UFW not installed, skipping firewall configuration${NC}"
fi
echo ""

# Configure Nginx
echo -e "${BLUE}[7/8] Configuring Nginx reverse proxy...${NC}"
cat > /etc/nginx/sites-available/valt-intellidoc <<'EOF'
server {
    listen 80;
    server_name 91.98.19.163 _;

    client_max_body_size 100M;
    proxy_buffering off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF

ln -sf /etc/nginx/sites-available/valt-intellidoc /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
echo -e "${GREEN}✓ Nginx configured${NC}"
echo ""

# Create backup directory
echo -e "${BLUE}[8/8] Creating backup directory...${NC}"
mkdir -p /var/backups/valt-intellidoc
echo -e "${GREEN}✓ Backup directory created${NC}"
echo ""

# Summary
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Server setup completed successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Installed versions:${NC}"
echo -e "  Node.js: $(node --version)"
echo -e "  npm: $(npm --version)"
echo -e "  PM2: $(pm2 --version)"
echo -e "  Nginx: $(nginx -v 2>&1 | cut -d/ -f2)"
echo ""
echo -e "${BLUE}Ready for deployment!${NC}"
echo -e "  Application directory: /var/www/valt-intellidoc"
echo -e "  Nginx config: /etc/nginx/sites-available/valt-intellidoc"
echo -e "  Backup directory: /var/backups/valt-intellidoc"
echo ""
echo -e "${YELLOW}Next step: Run deploy.bat from your Windows machine${NC}"
echo ""
