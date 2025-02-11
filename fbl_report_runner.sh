#!/bin/bash

# Log file location
LOG_FILE="/home/ubuntu/FBL_complains/Fbl-reports/logs/fbl_report_node-logs.log"

# Ensure log directory exists
mkdir -p /home/ubuntu/FBL_complains/Fbl-reports/logs

# Load nvm (node version manager)
source /home/ubuntu/.nvm/nvm.sh

# Use the correct node version
nvm use 22.13.1

# Navigate to your project directory
cd /home/ubuntu/FBL_complains/Fbl-reports

# Start the project and log output
echo "Starting the project at $(date)" >> $LOG_FILE
npm run start >> $LOG_FILE 2>&1
echo "Project finished at $(date)" >> $LOG_FILE
