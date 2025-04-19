# Echo Psychology Deployment Guide

This guide provides detailed instructions for deploying the Echo Psychology application to an AWS EC2 instance, with a focus on security and proper configuration.

## 1. EC2 Environment Setup

### 1.1 EC2 Instance Preparation

1. Launch an EC2 instance with Amazon Linux 2023, Ubuntu, or your preferred Linux distribution
   - Recommended: t3.small or larger for production
   - Ensure at least 20GB of storage

2. Configure Security Groups:
   - Allow HTTP (port 80) - For initial setup and redirects
   - Allow HTTPS (port 443) - For encrypted traffic
   - Allow SSH (port 22) - Restrict to your IP address for security

3. Set up basic software:
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js and npm (for Next.js applications)
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install Nginx as a reverse proxy
   sudo apt install -y nginx
   
   # Basic utilities
   sudo apt install -y git certbot python3-certbot-nginx
   ```

### 1.2 Clone and Set Up Application

1. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/health.git /home/ubuntu/echo-psychology
   cd /home/ubuntu/echo-psychology
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build the application:
   ```bash
   npm run build
   ```

## 2. Production Environment Variables Setup

### 2.1 Create Environment Variables File

1. Create a system-wide environment file:
   ```bash
   sudo nano /etc/environment
   ```

2. Add the following environment variables (replace with actual values):
   ```
   # Auth0 Credentials
   AUTH0_SECRET=your_actual_auth0_secret
   AUTH0_BASE_URL=https://echopsychology.com
   AUTH0_ISSUER_BASE_URL=https://dev-gunuewmlia26r0vh.us.auth0.com
   AUTH0_CLIENT_ID=your_actual_auth0_client_id
   AUTH0_CLIENT_SECRET=your_actual_auth0_client_secret
   
   # Database Connection
   DATABASE_URL=postgresql://actual_username:actual_password@actual_host:5432/echo_psychology?schema=public
   
   # M-Pesa Integration
   MPESA_API_URL=https://api.safaricom.co.ke
   MPESA_CONSUMER_KEY=your_actual_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_actual_mpesa_consumer_secret
   MPESA_PASSKEY=your_actual_mpesa_passkey
   MPESA_SHORTCODE=your_actual_mpesa_shortcode
   
   # Application URL
   NEXT_PUBLIC_APP_URL=https://echopsychology.com
   ```

3. Apply the environment variables:
   ```bash
   source /etc/environment
   ```

### 2.2 PM2 Environment Configuration

1. Create a PM2 ecosystem file:
   ```bash
   nano ecosystem.config.js
   ```

2. Add the following configuration:
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'echo-psychology',
         script: 'npm',
         args: 'start',
         cwd: '/home/ubuntu/echo-psychology',
         env: {
           NODE_ENV: 'production',
           // PM2 will inherit system environment variables
         },
         instances: 'max',
         exec_mode: 'cluster'
       }
     ]
   };
   ```

3. Start the application with PM2:
   ```bash
   pm2 start ecosystem.config.js
   ```

4. Configure PM2 to start on boot:
   ```bash
   pm2 startup
   pm2 save
   ```

## 3. SSL/HTTPS Configuration

### 3.1 Domain Configuration

1. Ensure your domain (echopsychology.com) points to your EC2 instance's public IP address
   - Create an A record in your DNS settings
   - Wait for DNS propagation (can take up to 48 hours, but typically within an hour)

### 3.2 Configure Nginx

1. Create an Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/echo-psychology
   ```

2. Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name echopsychology.com www.echopsychology.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/echo-psychology /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### 3.3 Set Up SSL/HTTPS with Certbot

1. Obtain an SSL certificate:
   ```bash
   sudo certbot --nginx -d echopsychology.com -d www.echopsychology.com
   ```

2. Follow the prompts to complete the setup
   - Choose to redirect all HTTP traffic to HTTPS when asked

3. Test the automatic renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## 4. Auth0 Configuration Verification

### 4.1 Update Auth0 Dashboard Settings

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to Applications > Your Application
3. Update the following fields:
   - **Allowed Callback URLs**: `https://echopsychology.com/api/auth/callback`
   - **Allowed Logout URLs**: `https://echopsychology.com`
   - **Allowed Web Origins**: `https://echopsychology.com`
   - **Allowed Origins (CORS)**: `https://echopsychology.com`

### 4.2 Verify Auth0 Configuration

1. Check that your environment variables are set correctly:
   ```bash
   printenv | grep AUTH0
   ```

2. Test the login flow:
   - Visit your application: https://echopsychology.com
   - Click the login button
   - Complete the Auth0 login process
   - Verify you are redirected back to your application
   - Check that you can access authenticated routes

## 5. EC2 Security Best Practices

### 5.1 Secure Your EC2 Instance

1. Keep your system updated:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. Set up automatic security updates:
   ```bash
   sudo apt install -y unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

3. Configure a firewall:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. Disable password authentication for SSH (use key-based authentication only):
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
   Set `PasswordAuthentication no`
   ```bash
   sudo systemctl restart sshd
   ```

### 5.2 Secure Application Data

1. Protect sensitive files:
   ```bash
   # Ensure proper permissions for sensitive directories
   sudo chown -R ubuntu:ubuntu /home/ubuntu/echo-psychology
   sudo chmod -R 750 /home/ubuntu/echo-psychology
   
   # Ensure logs are only accessible by the application user
   sudo chown -R ubuntu:ubuntu /home/ubuntu/echo-psychology/logs
   sudo chmod -R 640 /home/ubuntu/echo-psychology/logs
   ```

2. Consider setting up AWS CloudWatch for logging:
   ```bash
   sudo apt install -y awslogs
   sudo systemctl enable awslogsd.service
   sudo systemctl start awslogsd.service
   ```

## 6. Post-Deployment Verification Checklist

### 6.1 Application Verification

- [ ] Website loads correctly at https://echopsychology.com
- [ ] All static assets (images, CSS, JavaScript) load properly
- [ ] Authentication (login/logout) works as expected
- [ ] Protected routes are accessible only to authenticated users
- [ ] M-Pesa integration functions correctly

### 6.2 Security Verification

- [ ] HTTPS is enforced (http:// URLs redirect to https://)
- [ ] Security headers are present (verify with [Security Headers](https://securityheaders.com/))
- [ ] No sensitive credentials are exposed in browser sources
- [ ] CSP (Content Security Policy) is properly configured
- [ ] Server returns appropriate 404 and 500 error pages

### 6.3 Performance Verification

- [ ] Website loads quickly (check with [PageSpeed Insights](https://pagespeed.web.dev/))
- [ ] Server resource usage is within acceptable limits
- [ ] Database connections are optimized and limited

### 6.4 Monitoring Setup

- [ ] Set up monitoring with CloudWatch or another monitoring service
- [ ] Configure alerts for high CPU/memory usage
- [ ] Set up error logging and notification
- [ ] Configure regular database backups

---

## Troubleshooting

### Common Issues

1. **Auth0 login fails with 400 error**:
   - Verify that AUTH0_BASE_URL exactly matches your site URL
   - Check that callback URLs are correctly configured in Auth0 Dashboard
   - Ensure all Auth0 environment variables are set correctly

2. **Next.js application doesn't start**:
   - Check for errors in the application logs: `pm2 logs`
   - Verify all required environment variables are set
   - Ensure the build process completed successfully

3. **SSL certificate issues**:
   - Renew the certificate: `sudo certbot renew`
   - Verify Nginx configuration: `sudo nginx -t`
   - Check that DNS is correctly configured for your domain

---

For additional support or questions, please contact the development team.

