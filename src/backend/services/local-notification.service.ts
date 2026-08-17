import { LocalNotifications } from '@capacitor/local-notifications';

type NotificationPayload = {
  title: string;
  body: string;
  id?: number;
};

const EMOJI_MAP: Record<string, string> = {
  cart: '🛒',
  favorite: '❤️',
  order: '📦',
  promo: '🔥',
  welcome: '✨',
};

export class LocalNotificationService {
  private granted = false;
  private channelCreated = false;

  async createChannel(): Promise<void> {
    try {
      if (this.channelCreated) return;
      await LocalNotifications.createChannel({
        id: 'default',
        name: 'Notifications',
        importance: 5,
        visibility: 1,
        sound: 'default',
      });
      this.channelCreated = true;
    } catch (error) {
      console.error('[LocalNotificationService] createChannel error:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const perm = await LocalNotifications.requestPermissions();
      this.granted = perm.display === 'granted';
      return this.granted;
    } catch (error) {
      console.error('[LocalNotificationService] requestPermission error:', error);
      return false;
    }
  }

  async isPermissionGranted(): Promise<boolean> {
    try {
      const perm = await LocalNotifications.checkPermissions();
      this.granted = perm.display === 'granted';
      return this.granted;
    } catch (error) {
      console.error('[LocalNotificationService] checkPermissions error:', error);
      return false;
    }
  }

  async ensurePermission(): Promise<boolean> {
    try {
      await this.createChannel();
      const already = await this.isPermissionGranted();
      if (already) return true;
      const result = await this.requestPermission();
      if (!result && typeof window !== "undefined" && "Notification" in window) {
        const browserGranted = Notification.permission === "granted";
        this.granted = browserGranted;
        return browserGranted;
      }
      return result;
    } catch (error) {
      console.error('[LocalNotificationService] ensurePermission error:', error);
      return false;
    }
  }

  async notify({ title, body, id = 1 }: NotificationPayload): Promise<void> {
    try {
      await this.createChannel();
      if (!this.granted) {
        const ok = await this.ensurePermission();
        if (!ok) {
          console.warn('[LocalNotificationService] permission not granted, notification skipped:', title);
          return;
        }
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
            sound: 'default',
            iconColor: '#c8a050',
            smallIcon: 'ic_notification',
          },
        ],
      });
    } catch (error) {
      console.error('[LocalNotificationService] notify error:', error);
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(title, { body, icon: '/logo.ico' });
        } catch (browserError) {
          console.error('[LocalNotificationService] browser fallback error:', browserError);
        }
      }
    }
  }

  async cancelAll(): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [] });
    } catch (error) {
      console.error('[LocalNotificationService] cancelAll error:', error);
    }
  }

  async cartAdded(itemTitle: string, quantity: number, totalItems: number): Promise<void> {
    const emoji = EMOJI_MAP.cart;
    const title = `${emoji} Ajouté au panier !`;
    const body =
      quantity > 1
        ? `"${itemTitle}" x${quantity} ajouté(s) — Votre panier contient maintenant ${totalItems} article${totalItems > 1 ? 's' : ''}.`
        : `"${itemTitle}" a été ajouté — Votre panier contient maintenant ${totalItems} article${totalItems > 1 ? 's' : ''}.`;
    await this.notify({ title, body, id: Date.now() });
  }

  async cartUpdated(totalItems: number): Promise<void> {
    const emoji = EMOJI_MAP.cart;
    const title = `${emoji} Panier mis à jour`;
    const body = `Votre panier contient maintenant ${totalItems} article${totalItems > 1 ? 's' : ''}.`;
    await this.notify({ title, body, id: Date.now() + 1 });
  }

  async cartCleared(): Promise<void> {
    const emoji = EMOJI_MAP.cart;
    const title = `${emoji} Panier vidé`;
    const body = 'Votre panier a été vidé avec succès.';
    await this.notify({ title, body, id: Date.now() + 2 });
  }

  async itemRemoved(itemTitle: string): Promise<void> {
    const emoji = EMOJI_MAP.cart;
    const title = `${emoji} Article retiré`;
    const body = `"${itemTitle}" a été retiré de votre panier.`;
    await this.notify({ title, body, id: Date.now() + 3 });
  }
}

export const localNotificationService = new LocalNotificationService();
