#!/bin/bash

###############################################################################
# Valt Intellidoc - Monitoring & Health Check Script
# Monitors application health and sends alerts
###############################################################################

# Configuration
APP_NAME="valt-intellidoc"
APP_URL="http://localhost:3000"
LOG_FILE="/var/log/valt-monitoring.log"
ALERT_EMAIL=""  # Add email for alerts (optional)
SLACK_WEBHOOK=""  # Add Slack webhook for alerts (optional)

# Thresholds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=85
RESPONSE_TIME_THRESHOLD=5

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to send alert
send_alert() {
    local message="$1"
    log_message "ALERT: $message"
    
    # Send email alert (if configured)
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "Valt Intellidoc Alert" "$ALERT_EMAIL" 2>/dev/null || true
    fi
    
    # Send Slack alert (if configured)
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 Valt Intellidoc Alert: $message\"}" \
            "$SLACK_WEBHOOK" 2>/dev/null || true
    fi
}

# Check if PM2 is running
check_pm2() {
    if ! pm2 list | grep -q "$APP_NAME"; then
        send_alert "Application $APP_NAME is not running in PM2!"
        return 1
    fi
    return 0
}

# Check application response
check_app_response() {
    local start_time=$(date +%s)
    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $RESPONSE_TIME_THRESHOLD "$APP_URL" 2>/dev/null)
    local end_time=$(date +%s)
    local response_time=$((end_time - start_time))
    
    if [ "$response" != "200" ] && [ "$response" != "301" ] && [ "$response" != "302" ]; then
        send_alert "Application not responding! HTTP Status: $response"
        return 1
    fi
    
    if [ $response_time -gt $RESPONSE_TIME_THRESHOLD ]; then
        log_message "WARNING: Slow response time: ${response_time}s"
    fi
    
    return 0
}

# Check CPU usage
check_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    cpu_usage=${cpu_usage%.*}
    
    if [ "$cpu_usage" -gt "$CPU_THRESHOLD" ]; then
        send_alert "High CPU usage: ${cpu_usage}%"
    fi
    
    echo "$cpu_usage"
}

# Check memory usage
check_memory() {
    local mem_usage=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    
    if [ "$mem_usage" -gt "$MEMORY_THRESHOLD" ]; then
        send_alert "High memory usage: ${mem_usage}%"
    fi
    
    echo "$mem_usage"
}

# Check disk usage
check_disk() {
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -gt "$DISK_THRESHOLD" ]; then
        send_alert "High disk usage: ${disk_usage}%"
    fi
    
    echo "$disk_usage"
}

# Check Nginx status
check_nginx() {
    if ! systemctl is-active --quiet nginx; then
        send_alert "Nginx is not running!"
        return 1
    fi
    return 0
}

# Auto-restart if application is down
auto_restart() {
    if ! check_pm2; then
        log_message "Attempting to restart application..."
        pm2 restart "$APP_NAME" 2>&1 | tee -a "$LOG_FILE"
        
        # Wait and check again
        sleep 5
        if check_pm2 && check_app_response; then
            log_message "Application restarted successfully"
            send_alert "Application was down and has been automatically restarted"
        else
            send_alert "Failed to restart application - manual intervention required!"
        fi
    fi
}

# Main monitoring function
main() {
    echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║    Valt Intellidoc - Health Check             ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
    echo ""
    
    local all_checks_passed=true
    
    # PM2 Check
    echo -n "PM2 Status: "
    if check_pm2; then
        echo -e "${GREEN}✓ Running${NC}"
    else
        echo -e "${RED}✗ Not Running${NC}"
        all_checks_passed=false
    fi
    
    # Application Response Check
    echo -n "Application Response: "
    if check_app_response; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
        all_checks_passed=false
    fi
    
    # Nginx Check
    echo -n "Nginx Status: "
    if check_nginx; then
        echo -e "${GREEN}✓ Running${NC}"
    else
        echo -e "${RED}✗ Not Running${NC}"
        all_checks_passed=false
    fi
    
    # Resource Usage
    echo ""
    echo "Resource Usage:"
    local cpu=$(check_cpu)
    echo -n "  CPU: ${cpu}% "
    if [ "$cpu" -gt "$CPU_THRESHOLD" ]; then
        echo -e "${RED}(High)${NC}"
    else
        echo -e "${GREEN}(OK)${NC}"
    fi
    
    local mem=$(check_memory)
    echo -n "  Memory: ${mem}% "
    if [ "$mem" -gt "$MEMORY_THRESHOLD" ]; then
        echo -e "${RED}(High)${NC}"
    else
        echo -e "${GREEN}(OK)${NC}"
    fi
    
    local disk=$(check_disk)
    echo -n "  Disk: ${disk}% "
    if [ "$disk" -gt "$DISK_THRESHOLD" ]; then
        echo -e "${RED}(High)${NC}"
    else
        echo -e "${GREEN}(OK)${NC}"
    fi
    
    # PM2 Status
    echo ""
    echo "PM2 Process Details:"
    pm2 jlist | jq -r '.[] | select(.name=="'$APP_NAME'") | "  Status: \(.pm2_env.status)\n  Uptime: \(.pm2_env.pm_uptime | if . then (now - (./1000)) | floor | tostring + "s" else "N/A" end)\n  Restarts: \(.pm2_env.restart_time)\n  Memory: \(.monit.memory / 1024 / 1024 | floor)MB\n  CPU: \(.monit.cpu)%"' 2>/dev/null || echo "  Unable to get PM2 details"
    
    echo ""
    
    # Auto-restart if needed
    if [ "$all_checks_passed" = false ]; then
        echo -e "${YELLOW}Some checks failed. Attempting auto-restart...${NC}"
        auto_restart
    else
        echo -e "${GREEN}✓ All checks passed${NC}"
        log_message "Health check passed - all systems operational"
    fi
    
    echo ""
}

# Run main function
main
