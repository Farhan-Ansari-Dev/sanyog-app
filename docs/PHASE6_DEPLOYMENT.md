# PHASE 6 — Deployment

## Why these steps
Production rollout must preserve security (secrets), reliability (logs/monitoring), and predictable execution (repeatable builds).

## Backend deployment (Docker-ready)

### Environment variables (backend)
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- OTP:
  - `OTP_PROVIDER=mock|twilio_verify|msg91_otp`
  - `TWILIO_*` if using Twilio Verify
  - `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID` (if using MSG91)
- Admin seed:
  - `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_NAME`

### Steps (VPS / cloud)
1. Provision MongoDB Atlas (recommended) and get `MONGODB_URI`.
2. Build and run backend container.
3. Put behind HTTPS (Nginx / cloud load balancer).
4. Configure CORS allowed origins.

## Android (Play Store) – Expo EAS

### Build commands
- `npm i -g eas-cli`
- `cd mobile-app`
- `eas login`
- `eas build:configure`
- `eas build -p android --profile production`

### Play Store checklist
- App name, icon, screenshots
- Privacy policy URL
- Data safety form filled correctly (phone number, uploaded documents)
- OTP/SMS compliance

## iOS (App Store) – Expo EAS

### Build commands
- `eas build -p ios --profile production`

### App Store checklist
- App Store Connect setup
- Privacy details
- Sign-in/OTP explanation in review notes

## Common deployment errors & fixes
- CORS errors: set `CORS_ORIGIN` correctly for admin + mobile.
- Mobile can’t reach backend on device: use LAN IP / public domain (not localhost).
- File uploads missing in production: use persistent volume or S3 provider.
- JWT invalid after deploy: ensure `JWT_SECRET` unchanged across restarts.
