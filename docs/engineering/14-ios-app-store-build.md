# Foliogen — iOS (App Store Connect) Build Guide

This complements `13-play-store-android-build.md`. The same Capacitor wrapper
(`capacitor.config.ts` → `server.url = https://foliogen.in`) gives you live
auto-updates: web changes propagate to installed iOS apps without an App
Store review. You only re-submit when native config changes (icon, plugins,
permissions, push entitlements).

> **Sandbox limitation:** Lovable cannot produce a signed `.ipa`. iOS code
> signing requires **macOS + Xcode + an Apple Developer account ($99/yr)**.
> Run the steps below on a Mac after exporting the repo to GitHub and
> pulling it locally.

---

## 1. One-time setup (Mac)

```bash
git clone <your-repo>
cd <your-repo>
npm install
sudo gem install cocoapods   # if not already installed
npx cap add ios
npx cap update ios
```

This creates `/ios/App/App.xcworkspace`.

## 2. Build + sync (every code update)

```bash
npm run build
npx cap sync ios
npx cap open ios            # launches Xcode
```

## 3. Xcode configuration

In Xcode, open `App.xcworkspace` → select the **App** target:

| Setting | Value |
|---|---|
| Bundle Identifier | `app.lovable.1ceb3eb8d3034932b66e9669230597dc` (or your own reverse-DNS) |
| Display Name | Foliogen |
| Version | `1.0.0` |
| Build | increment for every TestFlight/App Store upload |
| Signing | Automatic, select your Apple Developer team |
| Deployment Target | iOS 14.0+ |

### Push notification entitlement
- **Signing & Capabilities → + Capability → Push Notifications**
- **+ Capability → Background Modes → Remote notifications**

### Required `Info.plist` keys
Capacitor adds most automatically. Verify these exist:

```xml
<key>NSCameraUsageDescription</key>
<string>Foliogen needs camera access to capture profile photos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Foliogen needs photo library access to upload profile images.</string>
<key>NSUserTrackingUsageDescription</key>
<string>Foliogen does not track you across apps.</string>
```

## 4. Apple Push Notification service (APNs)

1. Apple Developer → **Certificates, IDs & Profiles → Keys → +**
2. Enable **Apple Push Notifications service (APNs)**
3. Download the `.p8` file (one-time!), note the **Key ID** and **Team ID**
4. Store these securely — your backend will use them to send remote pushes
   to the device tokens captured by `src/lib/notifications.ts`

Local + in-app notifications (the "portfolio ready" toast) work
**without** APNs — they use `@capacitor/local-notifications`, which is the
safe-fallback path already wired in.

## 5. Generate signed `.ipa`

In Xcode:
1. Select **Any iOS Device (arm64)** as the run target.
2. **Product → Archive** (takes 2–5 min).
3. Organizer window opens → **Distribute App → App Store Connect → Upload**.
4. Xcode handles signing automatically with your dev team certificate.
5. The `.ipa` is uploaded directly to **App Store Connect → TestFlight**.

For a local `.ipa` file instead of direct upload:
- **Distribute App → App Store Connect → Export** → choose destination folder.

## 6. App Store Connect listing

| Field | Value |
|---|---|
| App name | Foliogen |
| Subtitle | AI Portfolio Engine |
| Primary category | Productivity |
| Privacy policy URL | https://foliogen.in/privacy |
| Support URL | https://foliogen.in/contact |
| Age rating | 4+ |
| Content rights | Does not contain third-party content |
| Account deletion | In-app via Dashboard → Settings (required by Apple) |

### App Privacy questionnaire
Declare:
- **Contact info** (email, name) — linked to user, app functionality
- **User content** (photos, resume text) — linked to user, app functionality
- **Identifiers** (user ID) — linked to user, app functionality
- **Diagnostics** (crash data) — not linked, analytics

## 7. Updating

### Web-only update
Edit in Lovable → publish → `foliogen.in` deploys → iOS app auto-loads on
next launch. **No Apple review.**

### Native update
1. `git pull && npm install && npm run build && npx cap sync ios`
2. Bump `Build` number in Xcode
3. **Product → Archive → Distribute** as in §5
4. In App Store Connect, create a new version → submit for review

## 8. Notifications in code

The unified API is in `src/lib/notifications.ts`:

```ts
import { notify } from '@/lib/notifications';

await notify({
  title: 'Your portfolio is ready 🎉',
  body: 'foliogen.in/u/your-slug is now live.',
  data: { route: '/dashboard?section=overview' },
});
```

- **Web (dev preview)**: shows a sonner toast — the safe local fallback.
- **iOS / Android**: schedules a real system notification via
  `@capacitor/local-notifications`, shown even when the app is backgrounded.
- **Remote push (server → device while app closed)**: POST to APNs/FCM
  using the `registeredToken` captured in `[notifications] Push token:`
  console logs. This requires a backend integration (Supabase Edge Function
  + APNs `.p8` key) — call it from `parse-resume`, `verify-payment`, etc.

Already wired:
- `PublishDialog.tsx` calls `notify()` on successful publish → users see a
  "Your portfolio is ready" notification on native, and a toast on web.

---

## Further reading
- Capacitor iOS docs: https://capacitorjs.com/docs/ios
- Push Notifications plugin: https://capacitorjs.com/docs/apis/push-notifications
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
