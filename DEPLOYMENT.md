# DICE Ecosystem EC2 Deployment Strategy

Follow these exact steps sequentially on your Ubuntu AWS EC2 instance to deploy the standardized application cluster safely.

## 1. Environment & Network Lock
Before cloning the code, ensure the foundational server stack exists:
```bash
# Update OS headers & install Nginx + PM2 globally
sudo apt update && sudo apt upgrade -y
sudo apt install nginx -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2. Nginx Firewall & Proxy Initialization
You have the newly unified Nginx wrapper in the project root: `portal.sanyogconformity.com.conf`

```bash
# Copy over the specific block
sudo cp /path/to/sanyog-app/portal.sanyogconformity.com.conf /etc/nginx/sites-available/dice.conf

# Link to active directory
sudo ln -s /etc/nginx/sites-available/dice.conf /etc/nginx/sites-enabled/

# Purge default fallback
sudo rm /etc/nginx/sites-enabled/default

# Verify syntax bounds without breaking existing traffic
sudo nginx -t

# Execute the swap
sudo systemctl reload nginx
```

## 3. Node.js API Startup (V8 Cluster Mode)
Spin up the backend ensuring `ecosystem.config.js` properly tracks `.env`.

```bash
cd /path/to/sanyog-app/backend

# Install dependencies (ignoring local dev tools)
npm ci --production

# Rename the template and fill in MongoDB URL and JWT Secret
cp .env.example .env
nano .env

# Engage the PM2 load-balancer
pm2 start ecosystem.config.js

# Seal it so it boots silently if AWS restarts the EC2 instance
pm2 save
pm2 startup
```

## 4. Web Client Builds
We do not use `npm run dev` in production. We must compile the React code into optimized, minimized static files for Nginx to serve globally at high velocity.

```bash
# ----- CLIENT PORTAL -----
cd /path/to/sanyog-app/client-website
cp .env.example .env

# Install & Build
npm install
npm run build

# Push to Nginx Root
sudo mkdir -p /var/www/portal/dist
sudo cp -r dist/* /var/www/portal/dist/

# ----- ADMIN PORTAL -----
cd /path/to/sanyog-app/admin-panel
cp .env.example .env

# Install & Build
npm install
npm run build

# Push to Nginx Root
sudo mkdir -p /var/www/admin/dist
sudo cp -r dist/* /var/www/admin/dist/
```

## 5. Mobile Synchronization (React Native deployment)
Now that `App.tsx`, `api.ts`, and State Management are standardized, bundle the mobile app for AppStore & PlayStore utilizing the live API keys.
```bash
cd /path/to/sanyog-app/mobile-app
npx expo export
# Deploy to EAS (Expo Application Services) if using their cloud builder:
eas build -p android --profile production
eas build -p ios --profile production
```
