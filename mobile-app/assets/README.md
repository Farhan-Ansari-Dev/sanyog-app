# Mobile assets

This folder is intentionally committed without binary images.

## What you should add before store submission

Create these files (PNG recommended):

- `icon.png` (1024x1024)
- `adaptive-icon.png` (1024x1024, with padding; Android adaptive icon foreground)
- `splash.png` (at least 1242x2436 or larger, centered artwork)
- `favicon.png` (48x48) (optional, for Expo web)

## Then update Expo config

Once the files exist, update `mobile-app/app.json` to reference them, e.g.:

- `expo.icon`: `./assets/icon.png`
- `expo.android.adaptiveIcon.foregroundImage`: `./assets/adaptive-icon.png`
- `expo.splash.image`: `./assets/splash.png`

You can generate correct sizes from a single 1024x1024 source using common asset generators, or design them in Figma/Canva.
