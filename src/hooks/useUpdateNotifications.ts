import { useEffect, useState } from "react";
import { supabase, TABLES } from "@/backend/client";

interface UpdateNotification {
  id: string;
  type: "service" | "gallery" | "catalog";
  message: string;
  timestamp: number;
}

export function useUpdateNotifications() {
  const [notifications, setNotifications] = useState<UpdateNotification[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      void checkForUpdates();
    }, 30000);

    void checkForUpdates();

    return () => clearInterval(interval);
  }, []);

  const checkForUpdates = async () => {
    try {
      const lastCheck = localStorage.getItem("last-update-check");
      const now = Date.now();
      const last = lastCheck ? parseInt(lastCheck) : 0;

      const [
        servicesRes,
        galleryRes,
        catalogRes,
      ] = await Promise.all([
        supabase
          .from(TABLES.SERVICES)
          .select("updated_at")
          .order("updated_at", { ascending: false })
          .limit(1),
        supabase
          .from(TABLES.GALLERY)
          .select("updated_at")
          .order("updated_at", { ascending: false })
          .limit(1),
        supabase
          .from(TABLES.CATALOG)
          .select("updated_at")
          .order("updated_at", { ascending: false })
          .limit(1),
      ]);

      if (!servicesRes.error && servicesRes.data?.[0]?.updated_at) {
        const ts = new Date(servicesRes.data[0].updated_at).getTime();
        if (ts > last) {
          addNotification("service", "Nouveau service disponible !");
        }
      }

      if (!galleryRes.error && galleryRes.data?.[0]?.updated_at) {
        const ts = new Date(galleryRes.data[0].updated_at).getTime();
        if (ts > last) {
          addNotification("gallery", "Nouvelles photos dans la galerie !");
        }
      }

      if (!catalogRes.error && catalogRes.data?.[0]?.updated_at) {
        const ts = new Date(catalogRes.data[0].updated_at).getTime();
        if (ts > last) {
          addNotification("catalog", "Nouveaux produits dans le catalogue !");
        }
      }

      localStorage.setItem("last-update-check", now.toString());
    } catch (error) {
      console.error("Erreur lors de la vérification des mises à jour:", error);
    }
  };

  const addNotification = (type: UpdateNotification["type"], message: string) => {
    const notification: UpdateNotification = {
      id: `${type}-${Date.now()}`,
      type,
      message,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, removeNotification };
}