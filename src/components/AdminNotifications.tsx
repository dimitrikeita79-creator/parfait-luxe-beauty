import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, Check, Trash2 } from "lucide-react";
import { GlassButton } from "@/components/GlassButton";

interface AdminNotification {
  id: string;
  type: string;
  message: string;
  author?: string;
  rating?: number;
  timestamp: string;
  read: boolean;
}

interface AdminNotificationsProps {
  isAdmin: boolean;
}

export function AdminNotifications({ isAdmin }: AdminNotificationsProps) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem("admin-notifications");
        if (stored) {
          const parsed = JSON.parse(stored) as AdminNotification[];
          setNotifications(parsed);
          setUnreadCount(parsed.filter(n => !n.read).length);
          return;
        }
      }
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAdmin, loadNotifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      setUnreadCount(updated.filter(n => !n.read).length);
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("admin-notifications", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      setUnreadCount(0);
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("admin-notifications", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      setUnreadCount(updated.filter(n => !n.read).length);
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("admin-notifications", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("admin-notifications", JSON.stringify([]));
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative rounded-full p-2 hover:bg-stone-100 transition"
        aria-expanded={isOpen}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-full z-50 mt-2 w-80 max-h-96 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-stone-100 p-4">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Tout effacer
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Aucune notification
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-b border-stone-50 p-4 ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{notification.message}</p>
                          {notification.rating != null && (
                            <div className="mt-1 flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-xs ${
                                    i < (notification.rating as number) ? "text-yellow-500" : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <button
                              type="button"
                              onClick={() => markAsRead(notification.id)}
                              className="rounded-full p-1 hover:bg-blue-100 transition"
                              title="Marquer comme lu"
                            >
                              <Check className="h-3 w-3 text-blue-600" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteNotification(notification.id)}
                            className="rounded-full p-1 hover:bg-red-100 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}