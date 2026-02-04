# Sanyog App (Mobile + Backend + Admin)

Monorepo containing:
- `backend/` Node.js + Express + MongoDB API (OTP login, applications, file uploads)
- `mobile-app/` React Native (Expo) client
- `admin-panel/` React web admin (Vite)

## Prerequisites
- Node.js 18+ (recommended)
- MongoDB (local or Atlas)

## Quick start (local)

### 0) MongoDB

You need a MongoDB connection string.

Option A (recommended): MongoDB Atlas
- Create a free cluster and get the connection string.
- Use it as `MONGODB_URI` in `backend/.env`.

Security:
- Never commit `.env` files or paste real secrets into chat.
- If a password/key is leaked, rotate it immediately.

Option B: Local MongoDB
- Install MongoDB Community Server and ensure the MongoDB service is running.
- Use: `mongodb://127.0.0.1:27017/sanyog`

### 1) Backend

```bash
cd backend
npm install
copy NUL .env
```

Edit `backend/.env`:
- Set `MONGODB_URI`
- Set a strong `JWT_SECRET`
- (First run) set `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_NAME`

Start API:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2) Admin panel

```bash
cd admin-panel
npm install
copy NUL .env
npm run dev
```

Admin runs at `http://localhost:5173`.

### 3) Mobile app (Expo)

```bash
cd mobile-app
npm install
copy NUL .env
npm start
```

If testing on a physical phone, set `EXPO_PUBLIC_API_BASE_URL` in `mobile-app/.env` to your PC LAN IP, e.g. `http://192.168.1.10:5000`.

## Quick start (Docker)

Starts MongoDB + backend in containers:

```bash
docker compose up --build
```

Full stack (Mongo + backend + admin dev server):

```bash
docker compose -f docker-compose.full.yml up --build
```

Production-like (Mongo + backend + admin static via Nginx):

```bash
docker compose -f docker-compose.prod.yml up --build
```

Admin will be at `http://localhost:8080`.

S3 uploads (prod-like):
- Create `backend/.env.s3` and fill your `AWS_*` values
- Run:

```bash
docker compose -f docker-compose.prod.yml -f docker-compose.s3.yml up --build
```

Backend will be on `http://localhost:5000`.

Notes:
- This compose file is intended for local/dev. Update `JWT_SECRET` and other env vars before production.
- Uploads are persisted to `backend/uploads` via a bind mount.

### 1) Backend

```bash
cd backend
npm install
copy NUL .env
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2) Mobile app (Expo)

```bash
cd mobile-app
npm install
copy NUL .env
npm start
```

Set `EXPO_PUBLIC_API_BASE_URL` in `mobile-app/.env` (use your LAN IP for physical device).

### 3) Admin panel

```bash
cd admin-panel
npm install
copy NUL .env
npm run dev
```

Admin runs at `http://localhost:5173`.

Admin login uses email/password (JWT):
- Set `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_NAME` in `backend/.env` (first run seeds the admin user)
- Login at `/login` in the admin panel

Note: A legacy `ADMIN_API_KEY` mechanism may exist in older docs/routes, but production uses admin JWT.

## Docs
- Deployment guide: `DEPLOYMENT.md`
- No-code guide: `NO_CODE.md`
