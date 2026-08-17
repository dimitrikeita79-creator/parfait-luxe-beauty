import { supabase, TABLES } from '../client';
import { ApiException } from '../exceptions';
import type { Notification } from '../models';

export class NotificationService {
  async getAll(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) {
        console.error('[NotificationService] query error:', error);
        return [];
      }
      return (data ?? []) as Notification[];
    } catch (error) {
      console.error('[NotificationService] unexpected error:', error);
      return [];
    }
  }

  async create(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .insert(notification)
        .select()
        .single();
      if (error) {
        console.error('[NotificationService] create error:', error);
        throw error;
      }
      return data as Notification;
    } catch (error) {
      console.error('[NotificationService] create unexpected error:', error);
      throw ApiException.fromError(error);
    }
  }

  async createForItem(
    itemType: 'gallery' | 'catalog' | 'service',
    itemTitle: string,
    action: 'created' | 'updated' | 'deleted',
  ): Promise<void> {
    try {
      if (action !== 'created') return;
      const title = `Nouvel élément disponible`;
      const message = `${itemTitle} est maintenant disponible sur Parfait.Design.`;
      await this.create({
        title,
        message,
        type: 'promo',
        read: false,
      });
    } catch (error) {
      console.error('[NotificationService] createForItem error:', error);
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ read: true })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      throw ApiException.fromError(error);
    }
  }
}

export const notificationService = new NotificationService();
