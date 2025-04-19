#!/bin/bash
# Database Connection Testing Script for EC2
# This script tests the connection to the RDS PostgreSQL database
# using both psql and Prisma

# Set strict error handling
set -e
set -o pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database credentials - REPLACE THESE WITH YOUR ACTUAL VALUES
DB_HOST="prisma-db.cwhq28imgq72.us-east-1.rds.amazonaws.com"
DB_PORT="5432"
DB_NAME="prisma-db"
DB_USER="postgres"
DB_PASSWORD="bharxojDipwer"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# Print header
echo -e "${BLUE}====================================${NC}"
echo -e "${BLUE}  Database Connection Test Script   ${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Check for required tools
check_requirements() {
    echo -e "${YELLOW}Checking requirements...${NC}"
    
    # Check for PostgreSQL client
    if ! command -v psql &> /dev/null; then
        echo -e "${RED}PostgreSQL client (psql) is not installed.${NC}"
        echo -e "Install it with: ${YELLOW}sudo apt-get update && sudo apt-get install -y postgresql-client${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ PostgreSQL client (psql) is installed${NC}"
    fi
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed.${NC}"
        echo -e "Install it with: ${YELLOW}curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ Node.js is installed: $(node -v)${NC}"
    fi
    
    # Check for npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}npm is not installed.${NC}"
        echo -e "It should be installed with Node.js. If not: ${YELLOW}sudo apt-get install -y npm${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ npm is installed: $(npm -v)${NC}"
    fi
    
    echo ""
}

# Test PostgreSQL connection using psql
test_psql_connection() {
    echo -e "${YELLOW}Testing PostgreSQL connection using psql...${NC}"
    
    # Check if connection works
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Successfully connected to PostgreSQL database using psql${NC}"
        echo -e "${BLUE}Database version:${NC}"
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();"
    else
        echo -e "${RED}✗ Failed to connect to PostgreSQL database using psql${NC}"
        echo -e "${YELLOW}Detailed error:${NC}"
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" 2>&1
        
        echo -e "\n${YELLOW}Troubleshooting:${NC}"
        echo -e "1. Check if the EC2 security group allows outbound connections to port 5432"
        echo -e "2. Check if the RDS security group allows inbound connections from your EC2 instance's security group or IP"
        echo -e "3. Verify that the database credentials are correct"
        echo -e "4. Make sure the RDS instance is running and accessible"
    fi
    
    echo ""
}

# Create Prisma test file
create_prisma_test() {
    echo -e "${YELLOW}Creating Prisma test script...${NC}"
    
    # Create temporary directory
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    # Initialize Node.js project
    npm init -y > /dev/null 2>&1
    
    # Install Prisma
    echo -e "${BLUE}Installing @prisma/client...${NC}"
    npm install @prisma/client prisma dotenv > /dev/null 2>&1
    
    # Create Prisma schema
    mkdir -p prisma
    cat > prisma/schema.prisma << EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
EOF
    
    # Create .env file
    cat > .env << EOF
DATABASE_URL="${DATABASE_URL}"
EOF
    
    # Create test file
    cat > test-prisma-connection.js << EOF
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function testConnection() {
  console.log('Testing Prisma connection to PostgreSQL database...')
  console.log(\`Connection string: \${process.env.DATABASE_URL.replace(/postgresql:\\/\\/[^:]+:[^@]+@/g, 'postgresql://USER:PASSWORD@')}\`)
  
  const prisma = new PrismaClient()
  
  try {
    // Test connection with a simple query
    const result = await prisma.$queryRaw\`SELECT NOW() as now\`
    console.log('✅ Successfully connected to PostgreSQL database using Prisma')
    console.log(\`Current database time: \${result[0].now}\`)
    
    // Try to get database version
    const versionResult = await prisma.$queryRaw\`SELECT version()\`
    console.log(\`Database version: \${versionResult[0].version}\`)
    
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL database using Prisma')
    console.error('Error details:', error.message)
    
    console.log('\nTroubleshooting suggestions:')
    console.log('1. Check if the EC2 security group allows outbound connections to port 5432')
    console.log('2. Check if the RDS security group allows inbound connections from your EC2 instance')
    console.log('3. Verify that the database credentials are correct')
    console.log('4. Make sure the RDS instance is running and accessible')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
  .then(() => console.log('Test completed'))
  .catch(console.error)
EOF
    
    echo -e "${GREEN}✓ Prisma test script created at ${TEMP_DIR}/test-prisma-connection.js${NC}"
    echo ""
}

# Test Prisma connection
test_prisma_connection() {
    echo -e "${YELLOW}Testing PostgreSQL connection using Prisma...${NC}"
    
    cd "$TEMP_DIR"
    
    # Run Prisma test
    echo -e "${BLUE}Generating Prisma client...${NC}"
    npx prisma generate > /dev/null 2>&1
    
    echo -e "${BLUE}Running Prisma test...${NC}"
    node test-prisma-connection.js
    
    echo ""
}

# Cleanup temporary files
cleanup() {
    echo -e "${YELLOW}Cleaning up temporary files...${NC}"
    rm -rf "$TEMP_DIR"
    echo -e "${GREEN}✓ Cleanup completed${NC}"
    echo ""
}

# Run security group check
check_security_groups() {
    echo -e "${YELLOW}Checking security group configuration...${NC}"
    
    # Get EC2 instance ID (requires IMDSv2 token)
    TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
    INSTANCE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)
    
    if [ -z "$INSTANCE_ID" ]; then
        echo -e "${RED}Could not determine EC2 instance ID.${NC}"
        echo -e "${YELLOW}Please check EC2 security group manually in AWS Console.${NC}"
        return
    fi
    
    echo -e "${BLUE}Instance ID: ${INSTANCE_ID}${NC}"
    
    # We need AWS CLI for this
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}AWS CLI is not installed. Cannot check security groups automatically.${NC}"
        echo -e "${YELLOW}Install it with: sudo apt-get install -y awscli${NC}"
        echo -e "${YELLOW}Please check EC2 and RDS security groups manually in AWS Console.${NC}"
        return
    fi
    
    # Get security groups attached to the instance
    echo -e "${BLUE}Checking security groups...${NC}"
    SG_IDS=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID" --query "Reservations[0].Instances[0].SecurityGroups[*].GroupId" --output text)
    
    if [ -z "$SG_IDS" ]; then
        echo -e "${RED}Could not determine security groups.${NC}"
        echo -e "${YELLOW}Please check EC2 security group manually in AWS Console.${NC}"
        return
    fi
    
    echo -e "${BLUE}Security Groups: ${SG_IDS}${NC}"
    
    # Check outbound rules for PostgreSQL
    for SG_ID in $SG_IDS; do
        echo -e "${BLUE}Checking outbound rules for ${SG_ID}...${NC}"
        
        OUTBOUND_RULES=$(aws ec2 describe-security-groups --group-ids "$SG_ID" --query "SecurityGroups[0].IpPermissionsEgress[*]")
        
        # This is a simplified check - in reality, we would need to parse the JSON output
        if echo "$OUTBOUND_RULES" | grep -q "FromPort.*5432\|ToPort.*5432\|IpProtocol.*\"-1\""; then
            echo -e "${GREEN}✓ Security group $SG_ID appears to allow outbound traffic to port 5432${NC}"
        else
            echo -e "${YELLOW}⚠ Security group $SG_ID may not allow outbound traffic to port 5432${NC}"
            echo -e "${YELLOW}  Consider adding an outbound rule for TCP port 5432${NC}"
        fi
    done
    
    echo ""
}

# Main function
main() {
    check_requirements
    test_psql_connection
    create_prisma_test
    test_prisma_connection
    check_security_groups
    cleanup
    
    echo -e "${BLUE}====================================${NC}"
    echo -e "${BLUE}  Database Connection Test Complete  ${NC}"
    echo -e "${BLUE}====================================${NC}"
}

# Run the main function
main

# Instructions for the user
echo -e "\n${YELLOW}Instructions:${NC}"
echo -e "1. If all tests passed, your EC2 instance can connect to your RDS database"
echo -e "2. If any tests failed, check the troubleshooting suggestions"
echo -e "3. Make sure your RDS security group allows inbound traffic from your EC2 instance"
echo -e "   - Add an inbound rule to your RDS security group:"
echo -e "     * Type: PostgreSQL"
echo -e "     * Port: 5432"
echo -e "     * Source: Your EC2 security group ID or EC2 instance private IP"
echo -e "4. Make sure your EC2 security group allows outbound traffic to your RDS instance"
echo -e "   - Add an outbound rule to your EC2 security group:"
echo -e "     * Type: PostgreSQL"
echo -e "     * Port: 5432"
echo -e "     * Destination: Your RDS security group ID or RDS endpoint"
echo -e "\n${YELLOW}For security in production:${NC}"
echo -e "1. DO NOT hardcode credentials in scripts"
echo -e "2. Use AWS Secrets Manager or environment variables stored securely"
echo -e "3. Consider using IAM authentication for RDS instead of passwords"
echo -e "4. Regularly rotate your database credentials"

