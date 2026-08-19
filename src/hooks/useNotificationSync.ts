import { useEffect, useRef } from "react";
import { notificationService } from "@/backend/services";
import { localNotificationService } from "@/backend/services/local-notification.service";

const POLL_INTERVAL = 15000;
const STORAGE_KEY = "notification-sync-last-timestamp";

export function useNotificationSync() {
  const lastSyncRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isVisible = () => {
    if (typeof document === "undefined") return true;
    return document.visibilityState === "visible";
  };

  const sync = async () => {
    if (!isVisible()) return;
    try {
      const notifications = await notificationService.getAll();
      const now = Date.now();
      const newNotifications = notifications.filter((n) => {
        const created = new Date(n.created_at).getTime();
        return created > lastSyncRef.current;
      });

      if (newNotifications.length > 0) {
        for (const n of newNotifications) {
          await localNotificationService.notify({
            title: n.title,
            body: n.message,
            id: new Date(n.created_at).getTime(),
          });
        }
        lastSyncRef.current = now;
        try {
          localStorage.setItem(STORAGE_KEY, String(now));
        } catch {
          // ignore
        }
      }
    } catch (error) {
      console.error("[useNotificationSync] error:", error);
    }
  };

  useEffect(() => {
    let active = true;

    const loadLastSync = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = parseInt(raw, 10);
          if (!Number.isNaN(parsed)) {
            lastSyncRef.current = parsed;
            return;
          }
        }
      } catch {
        // ignore
      }
      lastSyncRef.current = Date.now();
    };

    loadLastSync();

    const handleVisibilityChange = () => {
      if (isVisible()) {
        sync();
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(sync, POLL_INTERVAL);
      } else if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    sync();
    timerRef.current = setInterval(sync, POLL_INTERVAL);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
