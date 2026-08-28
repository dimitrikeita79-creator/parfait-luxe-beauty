import { supabase, TABLES, withRetry, isTableNotFoundError } from "../client";
import { ApiException } from "../exceptions";
import type { Notification } from "../models";
import { localNotificationService } from "./local-notification.service";

export class NotificationService {
  async getAll(): Promise<Notification[]> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from(TABLES.NOTIFICATIONS)
          .select('id, user_id, title, message, type, read, created_at')
          .order("created_at", { ascending: false })
          .limit(50);
        if (error) {
          if (isTableNotFoundError(error)) return [];
          console.error("[NotificationService] query error:", error);
          return [];
        }
        return (data ?? []) as Notification[];
      });
    } catch (error) {
      if (isTableNotFoundError(error)) return [];
      console.error("[NotificationService] unexpected error:", error);
      return [];
    }
  }

  async create(notification: Omit<Notification, "id" | "created_at">): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .insert(notification)
        .select()
        .single();
      if (error) {
        if (isTableNotFoundError(error)) return { id: '', ...notification, created_at: new Date().toISOString() } as Notification;
        console.error("[NotificationService] create error:", error);
        throw error;
      }
      return data as Notification;
    } catch (error) {
      if (isTableNotFoundError(error)) return { id: '', ...notification, created_at: new Date().toISOString() } as Notification;
      console.error("[NotificationService] create unexpected error:", error);
      throw ApiException.fromError(error);
    }
  }

  async createForItem(
    itemType: "gallery" | "catalog" | "service",
    itemTitle: string,
    action: "created" | "updated" | "deleted",
    options?: { sound?: boolean },
  ): Promise<void> {
    try {
      const titles: Record<string, Record<string, string>> = {
        gallery: {
          created: "Nouvelle galerie",
          updated: "Galerie mise à jour",
          deleted: "Galerie supprimée",
        },
        catalog: {
          created: "Nouveau catalogue",
          updated: "Catalogue mis à jour",
          deleted: "Catalogue supprimé",
        },
        service: {
          created: "Nouveau service",
          updated: "Service mis à jour",
          deleted: "Service supprimé",
        },
      };
      const messages: Record<string, Record<string, string>> = {
        gallery: {
          created: `Photo "${itemTitle}" ajoutée à la galerie.`,
          updated: `Photo "${itemTitle}" a été mise à jour.`,
          deleted: `Photo "${itemTitle}" a été supprimée de la galerie.`,
        },
        catalog: {
          created: `Produit "${itemTitle}" ajouté au catalogue.`,
          updated: `Produit "${itemTitle}" a été mis à jour.`,
          deleted: `Produit "${itemTitle}" a été supprimé du catalogue.`,
        },
        service: {
          created: `Service "${itemTitle}" ajouté.`,
          updated: `Service "${itemTitle}" a été mis à jour.`,
          deleted: `Service "${itemTitle}" a été supprimé.`,
        },
      };
      const title = titles[itemType]?.[action] ?? "Nouvelle notification";
      const message = messages[itemType]?.[action] ?? `${itemTitle} a été modifié.`;
      await this.create({
        title,
        message,
        type: itemType,
        read: false,
      });

      const prefs = await this.getNotificationPreferences();
      const enabledTypes = prefs.enabledTypes ?? ["gallery", "catalog", "service"];
      if (enabledTypes.includes(itemType) && options?.sound !== false) {
        void localNotificationService.notify({
          title: title,
          body: message,
          id: Date.now() & 0x7FFFFFFF,
        });
      }
    } catch (error) {
      console.error("[NotificationService] createForItem error:", error);
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ read: true })
        .eq("id", id);
      if (error) {
        if (isTableNotFoundError(error)) return;
        throw error;
      }
    } catch (error) {
      if (!isTableNotFoundError(error)) {
        throw ApiException.fromError(error);
      }
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);
      if (error) {
        if (isTableNotFoundError(error)) return;
        throw error;
      }
    } catch (error) {
      if (!isTableNotFoundError(error)) {
        throw ApiException.fromError(error);
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(TABLES.NOTIFICATIONS).delete().eq("id", id);
      if (error) {
        if (isTableNotFoundError(error)) return;
        throw error;
      }
    } catch (error) {
      if (!isTableNotFoundError(error)) {
        throw ApiException.fromError(error);
      }
    }
  }

  async getNotificationPreferences(): Promise<{ enabledTypes: string[] }> {
    try {
      if (typeof window === "undefined") return { enabledTypes: ["gallery", "catalog", "service"] };
      const raw = window.localStorage.getItem("notification-preferences");
      if (!raw) return { enabledTypes: ["gallery", "catalog", "service"] };
      try {
        const parsed = JSON.parse(raw) as { enabledTypes?: string[] };
        if (Array.isArray(parsed.enabledTypes)) {
          return { enabledTypes: parsed.enabledTypes };
        }
      } catch {
        // ignore
      }
      return { enabledTypes: ["gallery", "catalog", "service"] };
    } catch {
      return { enabledTypes: ["gallery", "catalog", "service"] };
    }
  }

  async saveNotificationPreferences(prefs: { enabledTypes: string[] }): Promise<void> {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem("notification-preferences", JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }
}

export const notificationService = new NotificationService();
