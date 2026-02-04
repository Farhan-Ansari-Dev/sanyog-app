# Deployment Guide

## Backend (Node + Mongo)

### Option 0: No Docker (local/dev)

1) Ensure you have MongoDB:
- MongoDB Atlas (recommended):
	- Create a cluster
	- Create a Database User (strong password)
	- Network Access: allow your backend host IP (or `0.0.0.0/0` temporarily for testing)
	- Get the connection string (Drivers -> Node.js)
	- Set `MONGODB_URI` like:
		- `mongodb+srv://DB_USER:DB_PASSWORD@CLUSTER_HOST/sanyog?retryWrites=true&w=majority&appName=sanyog`
		- If your password has special characters, URL-encode it.
- Local MongoDB: install MongoDB Community Server and ensure it is running.

2) Configure and start the backend:

```bash
cd backend
npm install
copy NUL .env
# edit backend/.env (set MONGODB_URI, JWT_SECRET, and ADMIN_SEED_* on first run)
npm run dev
```

Backend API runs at `http://localhost:5000`.

3) Start the admin panel:

```bash
cd admin-panel
npm install
copy NUL .env
npm run dev
```

Admin runs at `http://localhost:5173`.

4) Start the Expo mobile app:

```bash
cd mobile-app
npm install
copy NUL .env
npm start
```

For physical devices, set `EXPO_PUBLIC_API_BASE_URL` to your PC LAN IP.

### Option 0: Docker (local/dev)

From repo root:

```bash
docker compose up --build
```

Variants:
- Full stack dev: `docker compose -f docker-compose.full.yml up --build`
- Prod-like local: `docker compose -f docker-compose.prod.yml up --build`

S3 storage override (recommended for production-like behavior):
- Create `backend/.env.s3` and set `AWS_REGION`, `AWS_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Run: `docker compose -f docker-compose.prod.yml -f docker-compose.s3.yml up --build`

This starts:
- MongoDB at `mongodb://localhost:27017/sanyog`
- Backend API at `http://localhost:5000`

### Option A: Render / Railway / Fly.io
1. Create a new Node service from `backend/`.
2. Set environment variables (see the required list in this document).
3. Provide MongoDB connection (MongoDB Atlas recommended).
4. Ensure the platform exposes port `5000` (or use `PORT`).

### Option B: VPS (Ubuntu) + Nginx
1. Install Node.js 18+, PM2, and MongoDB (or Atlas).
2. Upload project, then:

```bash
cd backend
npm ci
touch .env
# edit .env
npm run build:check
pm2 start server.js --name sanyog-backend
pm2 save
```

3. Nginx reverse proxy:
- `api.yourdomain.com` -> `http://127.0.0.1:5000`

### Option C: AWS VPS (Fedora) + Nginx + PM2 (recommended if you don’t use Docker)

This option assumes:
- MongoDB Atlas (cloud)
- Backend runs on the VPS with PM2
- Nginx terminates TLS (HTTPS) and proxies to the backend
- Admin panel is served as static files from Nginx

#### 1) Atlas: network allowlist

In MongoDB Atlas:
- Network Access: allow your VPS **public IP** (best) or attach an Elastic IP (recommended so it doesn’t change).
- Avoid `0.0.0.0/0` for production (only use temporarily for debugging).

Security note:
- Don’t paste or commit database passwords/keys into the repo.
- If credentials are ever shared in chat or leaked, rotate them immediately in Atlas.

#### 2) Server prerequisites (Fedora)

On the VPS:

```bash
sudo dnf update -y
sudo dnf install -y git nginx
sudo systemctl enable --now nginx

# Node.js 18+ (NodeSource example)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# PM2
sudo npm i -g pm2
```

Open firewall ports (adjust to your setup):

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

#### 3) Deploy backend

```bash
mkdir -p /var/www
cd /var/www
git clone <YOUR_REPO_URL> sanyog-app
cd sanyog-app/backend
npm ci
touch .env
```

Edit `backend/.env` for production:
- `MONGODB_URI=mongodb+srv://DB_USER:DB_PASSWORD@CLUSTER_HOST/sanyog_conformity?retryWrites=true&w=majority&appName=sanyog-app`
- If `DB_PASSWORD` has special characters, URL-encode it.
- `JWT_SECRET=<long-random>`
- `ADMIN_JWT_SECRET=<long-random>`
- `CORS_ORIGIN=https://admin.yourdomain.com` (add commas if multiple origins)
- (first deploy only) `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_NAME`
- Storage:
	- `STORAGE_PROVIDER=local` (quick start)
	- or `STORAGE_PROVIDER=s3` + `AWS_REGION`, `AWS_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- OTP:
	- `OTP_PROVIDER=twilio_verify` (recommended where available)
	- or `OTP_PROVIDER=msg91_otp` (India-ready)

Start the backend with PM2:

```bash
pm2 start server.js --name sanyog-backend
pm2 save
pm2 startup
```

#### 4) Build & deploy admin panel (static)

```bash
cd /var/www/sanyog-app/admin-panel
npm ci
npm run build

sudo mkdir -p /var/www/sanyog-admin
sudo rm -rf /var/www/sanyog-admin/*
sudo cp -r dist/* /var/www/sanyog-admin/
```

#### 5) Nginx config (admin + API)

Create two server blocks.

`/etc/nginx/conf.d/admin.conf` (static admin SPA):

```nginx
server {
	listen 80;
	server_name admin.yourdomain.com;

	root /var/www/sanyog-admin;
	index index.html;

	location / {
		try_files $uri $uri/ /index.html;
	}
}
```

`/etc/nginx/conf.d/api.conf` (proxy to backend):

```nginx
server {
	listen 80;
	server_name api.yourdomain.com;

	client_max_body_size 25m;

	location / {
		proxy_pass http://127.0.0.1:5000;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### 6) TLS / HTTPS (Let’s Encrypt)

Install Certbot (package names can vary by Fedora version):

```bash
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d admin.yourdomain.com -d api.yourdomain.com
```

#### 7) Mobile app API base URL

Set the mobile env to:
- `EXPO_PUBLIC_API_BASE_URL=https://api.yourdomain.com`

Then build with EAS.

## OTP (India SMS)

India requires DLT registration for promotional/transactional SMS with many providers.

Supported modes in this repo:
- `OTP_PROVIDER=mock` for local dev (prints OTP in server logs)
- `OTP_PROVIDER=twilio_verify` for production-grade flows (Twilio Verify) where available

If you use MSG91 / Textlocal / Gupshup, implement it in `backend/services/otpProvider.js`.

## File uploads
Uploads can be stored on the backend filesystem (`STORAGE_PROVIDER=local`) or in S3-compatible object storage (`STORAGE_PROVIDER=s3`).
For production, prefer S3-compatible storage + signed URLs.

## Play Store (high-level)
1. Use Expo EAS build or React Native CLI builds.
2. Create a release keystore, configure package name, versioning.
3. Prepare Store Listing assets (icon, screenshots, privacy policy URL).
4. Ensure you comply with OTP/SMS policies and handle user data securely.

Recommended: Expo EAS
- Run `cd mobile-app` then `eas init` once to connect your Expo account/project
- Build: `eas build -p android --profile production`
- Preview/internal: `eas build -p android --profile preview`

## Environment split
- Use a separate MongoDB database for production.
- Use strong JWT secrets.
- Enable CORS for your admin + mobile origins only.

## Admin panel auth
Admin panel uses admin email/password login:
- `POST /admin/auth/login` returns an admin JWT
- Admin panel sends `Authorization: Bearer <token>`

Seed an initial admin via env vars (`ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_NAME`) on first backend run.

## Callback requests
The mobile app can submit callback requests:
- `POST /contact/request` (requires client JWT)
- Admin can view/update requests at `GET /admin/contact` (requires admin JWT)
