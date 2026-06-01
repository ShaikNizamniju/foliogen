# Foliogen — Android (Play Store) Build Guide

This project is wrapped with **Capacitor** so the same React/Vite codebase ships as a native Android app installable from the Google Play Store. Because `capacitor.config.ts` points `server.url` to `https://foliogen.in`, **any update you publish on the web is automatically reflected inside the installed Android app** — no new APK/AAB upload required for content or UI changes.

You only need to re-build/re-upload the AAB when you change:
- Native plugins (camera, push, etc.)
- App icon / splash screen
- `appId`, `appName`, permissions, or other native config

---

## 1. One-time local setup

> The Lovable sandbox cannot run `gradle` / `Android Studio`. You must do this on **your own machine** (Mac, Windows, or Linux) after exporting the repo to GitHub and pulling it locally.

Install:
- **Node 18+**
- **Android Studio** (Hedgehog or newer) — installs JDK 17 + Android SDK 34
- **A Google Play Console account** ($25 one-time)

Clone and install:
```bash
git clone <your-repo>
cd <your-repo>
npm install
```

Add the Android platform (creates `/android` folder):
```bash
npx cap add android
npx cap update android
```

---

## 2. Build the web bundle and sync

Every time you pull new code from GitHub:
```bash
npm run build
npx cap sync android
```

Open the native project:
```bash
npx cap open android
```

This launches Android Studio. From there you can:
- **Run** on a connected device or emulator (green play button)
- **Build > Generate Signed Bundle / APK** to produce the `.aab` for Play Store

---

## 3. Signing the release (required by Play Store)

In Android Studio → **Build → Generate Signed Bundle / APK → Android App Bundle**:
1. Create a new keystore (`foliogen-release.jks`) — **back this up; losing it means you can never update the app again**.
2. Save the keystore password, key alias, and key password somewhere safe (e.g. 1Password).
3. Pick **release** build variant.
4. Output: `android/app/release/app-release.aab`

---

## 4. Play Store listing checklist

Inside [Google Play Console](https://play.google.com/console):

| Requirement | Value |
|---|---|
| App name | Foliogen |
| Package name | `app.lovable.1ceb3eb8d3034932b66e9669230597dc` |
| Category | Productivity / Business |
| Content rating | Complete the IARC questionnaire (everyone) |
| Privacy policy URL | `https://foliogen.in/privacy` |
| Data safety form | Declare: email, name, photo, resume content (used for app functionality, encrypted in transit) |
| Target API level | 34 (Android 14) — Capacitor 6 default |
| Permissions | Internet only (no extra runtime permissions needed) |
| App icon | 512×512 PNG (use `/public/android-icon.png`) |
| Feature graphic | 1024×500 PNG |
| Screenshots | At least 2 phone screenshots (1080×1920 recommended) |

### Mandatory policies
- **Privacy Policy** is already live at `/privacy` ✅
- **Terms of Service** at `/terms` ✅
- **Account deletion** must be reachable from inside the app — already available via Dashboard → Settings.
- **Permissions justification**: Foliogen only uses internet permission (granted by default in Capacitor); no further justification required.

---

## 5. Auto-update behavior (how web changes reach the app)

Because of this block in `capacitor.config.ts`:
```ts
server: { url: 'https://foliogen.in', cleartext: false }
```

The installed Android app is effectively a hardened WebView shell that always loads `https://foliogen.in`. When you ship a new build on Lovable / Vercel / your host, users on the Play Store version see the update on next app launch — **zero Play Store review wait**.

⚠️ Trade-off: this means the app **requires internet on first launch**. If you ever need an offline-capable build, swap `server.url` for `webDir: 'dist'` and bundle the assets natively (then you must re-upload an AAB for every release).

---

## 6. Releasing updates

### Web-only update (UI, content, features)
1. Edit in Lovable → publish to `foliogen.in`.
2. Done. The app picks it up automatically.

### Native update (icon, permissions, plugins, appId)
1. `git pull` your latest code locally.
2. `npm install && npm run build && npx cap sync android`.
3. Bump `versionCode` (integer) and `versionName` (string) in `android/app/build.gradle`.
4. Generate a new signed AAB using the **same keystore** from §3.
5. Upload to Play Console → Production track → Roll out.

---

## 7. Further reading

- Lovable mobile guide: <https://lovable.dev/blog/mobile-development>
- Capacitor Android docs: <https://capacitorjs.com/docs/android>
- Play Console policies: <https://support.google.com/googleplay/android-developer/answer/9858738>
