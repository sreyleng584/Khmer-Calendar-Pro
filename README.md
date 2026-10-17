# Khmer Calendar Pro — ប្រតិទិនខ្មែរ ប្រូ

Production-grade, verified Cambodian lunar calendar, Buddhist observance days (ថ្ងៃសីល), official public holidays, and personal event manager. Built as a single shared codebase for both a Progressive Web App (PWA) and a native Capacitor Android application.

---

## 1. PWA & Offline Architecture

- **PWA Tooling:** `vite-plugin-pwa` (Workbox) with `registerType: 'prompt'` for safe updates.
- **Web App Manifest:**
  - Name: `Khmer Calendar Pro`
  - Short Name: `Khmer Calendar` (≤ 15 characters, no mobile launcher clipping)
  - Start URL: `/` | Scope: `/`
  - Display: `standalone` | Orientation: `portrait-primary`
  - Theme Color: `#8b1e1e` (Cambodian crimson) | Background Color: `#fdfbf7` (parchment ivory)
  - Icons: Local, self-bundled vector and PNG assets:
    - `pwa-192x192.png` (Standard Android icon, `purpose: "any"`)
    - `pwa-512x512.png` (High-resolution icon, `purpose: "any"`)
    - `pwa-maskable-512x512.png` (Safe-zone padded icon with 15% margin, `purpose: "maskable"`)
    - `apple-touch-icon.png` (180x180 PNG for iOS Safari home screen)
    - `icon.svg` & `favicon.ico`
- **Offline Caching Strategy:**
  - **App Shell & Precached Assets:** HTML, JS, CSS, bundled SVG/PNG icons pre-cached via Workbox manifest.
  - **Google Web Fonts Runtime Caching:** `fonts.googleapis.com` and `fonts.gstatic.com` cached via `CacheFirst` (maxAge: 1 year, maxEntries: 20) ensuring Kantumruy Pro and Outfit typography render cleanly offline.
  - **Client-Side Engine:** All Khmer lunar math (`@thyrith/momentkh`), Buddhist Holy Day calculations, and MEF/NBC holiday datasets are 100% bundled client-side. Zero external API calls are made or required.
  - **Safe Updates:** When a new release is deployed, the service worker pre-caches assets in the background and displays `PWAUpdateToast`. Clicking "Update Now" triggers `skipWaiting()` and refreshes without ever touching user data.
  - **Non-Destructive User Storage:** All user events, reminders, and settings reside in `localStorage` and `indexedDB`, completely separate from service worker cache lifecycles.
  - **Offline Indicator:** Non-intrusive floating status indicator notifies users when operating without network connectivity.

---

## 2. In-App Installation Experience

- **Standards-Based Trigger:** Uses the `usePWAInstall` hook listening to the browser's `beforeinstallprompt` event.
- **Strict Availability Discipline:** The "Install" button is rendered **only** when the browser has provided an active prompt (`isInstallable: true`). It is automatically hidden when running in `standalone` mode, running in the native Capacitor app, or on platforms where programmatic install is unsupported.

---

## 3. Shared Web and Android Architecture

The application shares 100% of its React and TypeScript business logic between web and Android:
- **Khmer Lunar Calendar Engine:** Shared adapter (`src/calendar/khmerDateAdapter.ts`) with zero platform forks.
- **Buddhist Observances (ថ្ងៃសីល):** Shared algorithmic observance detector covering 8th waxing, 15th waxing (full moon), 8th waning, and 14th/15th waning (new moon).
- **Subtle Buddha Icon:** Bundled vector silhouette (`BuddhaIcon.tsx`) rendered at 18–22% opacity watermark on verified observance days.
- **Touch Gesture Navigation:** Shared touch and pointer swipe gesture hook (`useSwipeGesture.ts`) with 45px distance threshold, 0.75 vertical scroll tolerance ratio, and 450ms duplicate event suppression.
- **Capacitor Configuration:** `capacitor.config.ts` configured for `com.khmercalendar.pro`.

---

## 4. Web Development & Production Commands

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run automated unit test suite (Node.js native test runner)
npm test

# Run TypeScript type check
npm run lint

# Compile production PWA bundle (generates dist/, sw.js, manifest.webmanifest)
npm run build
```

---

## 5. Android Packaging with Capacitor

```bash
# 1. Build production web bundle
npm run build

# 2. Add Android platform (if first time)
npx cap add android

# 3. Synchronize web assets and Capacitor configuration
npx cap sync android

# 4. Compile Debug APK with Gradle
cd android && ./gradlew assembleDebug

# Output APK path:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 6. Automated Test Report

All 30 unit tests pass with zero failures (`node --test`):
- `pwa.test.ts` (7 tests): Manifest compliance, icon assets validation, Capacitor config consistency, offline lunar calculation, offline Buddhist holy days, offline holiday verification, offline events persistence.
- `khmerDateAdapter.test.ts` (10 tests): Khmer numerals, Gregorian conversion, Buddhist Holy Day rules, leap month detection (Pathamasadh/Tutiyasadh), Sangkran timing, month boundary transitions (Dec ↔ Jan).
- `holidays.test.ts` (5 tests): MEF/NBC holiday datasets, multi-day spans, category filtering, provisional 2027 flags, keyword search.
- `useSwipeGesture.test.ts` (5 tests): Left/right swipe direction, short tap rejection, vertical scrolling rejection, custom thresholds.
- `eventsStore.test.ts` (3 tests): Initial seeding, CRUD operations, JSON backup export/import.
