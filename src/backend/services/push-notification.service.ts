import { PushNotifications } from '@capacitor/push-notifications';

type PushTokenCallback = (token: string) => void;

export class PushNotificationService {
  private tokenCallback: PushTokenCallback | null = null;

  async register(): Promise<string | null> {
    try {
      if (typeof PushNotifications === 'undefined') {
        return null;
      }
      const perm = await PushNotifications.requestPermissions();
      if (perm.receive === 'granted') {
        await PushNotifications.register();
        return null;
      }
      return null;
    } catch {
      return null;
    }
  }

  async checkPermissions(): Promise<boolean> {
    try {
      if (typeof PushNotifications === 'undefined') {
        return false;
      }
      const perm = await PushNotifications.checkPermissions();
      return perm.receive === 'granted';
    } catch (error) {
      console.error('[PushNotificationService] checkPermissions error:', error);
      return false;
    }
  }

  onToken(callback: PushTokenCallback): void {
    this.tokenCallback = callback;
    if (typeof PushNotifications !== 'undefined') {
      PushNotifications.addListener('registration', (token) => {
        if (this.tokenCallback) {
          this.tokenCallback((token as any).value || (token as any).registrationId || '');
        }
      });
    }
  }

  onNotificationReceived(callback: (notification: { title: string; body: string; data?: Record<string, unknown> }) => void): void {
    if (typeof PushNotifications !== 'undefined') {
      PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
        callback({
          title: notification.title || 'Parfait.design',
          body: notification.body || '',
          data: notification.data,
        });
      });
    }
  }

  onNotificationOpened(callback: (notification: { title: string; body: string; data?: Record<string, unknown> }) => void): void {
    if (typeof PushNotifications !== 'undefined') {
      PushNotifications.addListener('pushNotificationActionPerformed', (action: any) => {
        const notification = action.notification || action;
        callback({
          title: notification.title || 'Parfait.design',
          body: notification.body || '',
          data: notification.data,
        });
      });
    }
  }
}

export const pushNotificationService = new PushNotificationService();
