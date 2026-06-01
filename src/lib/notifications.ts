import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { toast } from 'sonner';

/**
 * Unified notification layer.
 *
 * - Native (iOS/Android via Capacitor): registers for APNs/FCM push tokens
 *   and falls back to LocalNotifications when offline or unregistered.
 * - Web (browser/dev preview): uses sonner toasts as a safe local fallback so
 *   you can develop and test the notification UX without a device.
 */

const isNative = Capacitor.isNativePlatform();
let registeredToken: string | null = null;

export interface AppNotification {
  title: string;
  body: string;
  /** Arbitrary payload for handlers — e.g. { route: '/dashboard?section=overview' } */
  data?: Record<string, unknown>;
}

/** Call once on app boot (e.g. in App.tsx). Safe no-op on web. */
export async function initNotifications(
  onPush?: (n: PushNotificationSchema) => void,
): Promise<void> {
  if (!isNative) {
    // Web: nothing to register. Local fallback uses sonner directly.
    return;
  }

  try {
    // Local notifications permission (used for the offline fallback)
    await LocalNotifications.requestPermissions();

    // Push permission + APNs/FCM registration
    const perm = await PushNotifications.requestPermissions();
    if (perm.receive !== 'granted') {
      console.warn('[notifications] Push permission not granted — using local fallback only');
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', (token: Token) => {
      registeredToken = token.value;
      console.log('[notifications] Push token:', token.value);
      // TODO (server): POST token to your backend, associated with the signed-in user.
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('[notifications] Registration error:', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notif) => {
      console.log('[notifications] Received in foreground:', notif);
      onPush?.(notif);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const route = action.notification.data?.route;
      if (typeof route === 'string') {
        window.location.assign(route);
      }
    });
  } catch (err) {
    console.error('[notifications] init failed:', err);
  }
}

/**
 * Dispatch a notification for an in-app event (e.g. "portfolio published").
 *
 * - On native: schedules an immediate LocalNotification so it shows in the tray
 *   even when the app is backgrounded. Reliable, no server required.
 * - On web: shows a sonner toast as the safe local-dev fallback.
 *
 * For true remote push (server → device while app is closed) you also need a
 * backend that calls APNs/FCM with the stored `registeredToken`.
 */
export async function notify(n: AppNotification): Promise<void> {
  if (!isNative) {
    toast.success(n.title, { description: n.body, duration: 6000 });
    return;
  }

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Math.floor(Math.random() * 2_000_000_000),
          title: n.title,
          body: n.body,
          schedule: { at: new Date(Date.now() + 100) },
          extra: n.data ?? {},
        },
      ],
    });
  } catch (err) {
    console.error('[notifications] schedule failed, falling back to toast:', err);
    toast.success(n.title, { description: n.body });
  }
}

export function getPushToken(): string | null {
  return registeredToken;
}
