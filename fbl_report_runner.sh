#!/bin/bash

# Log file location
LOG_FILE="/home/ubuntu/FBL_complains/Fbl-reports/logs/fbl_report_node-logs.log"

# Ensure log directory exists
mkdir -p /home/ubuntu/FBL_complains/Fbl-reports/logs

# Load NVM properly
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use correct Node.js version
nvm use 22.13.1

# Navigate to the project directory
cd /home/ubuntu/FBL_complains/Fbl-reports || exit 1

# Start the project and log output
echo "Starting the project at $(date)" >> $LOG_FILE
/home/ubuntu/.nvm/versions/node/v22.13.1/bin/npm run start >> $LOG_FILE 2>&1
echo "Project finished at $(date)" >> $LOG_FILE