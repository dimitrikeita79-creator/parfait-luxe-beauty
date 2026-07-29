import { useEffect, useState } from "react";

interface UpdateNotification {
  id: string;
  type: "service" | "gallery" | "catalog";
  message: string;
  timestamp: number;
}

export function useUpdateNotifications() {
  const [notifications, setNotifications] = useState<UpdateNotification[]>([]);

  useEffect(() => {
    // Vérifier les mises à jour toutes les 30 secondes
    const interval = setInterval(() => {
      checkForUpdates();
    }, 30000);

    // Vérifier au chargement
    checkForUpdates();

    return () => clearInterval(interval);
  }, []);

  const checkForUpdates = async () => {
    try {
      // Récupérer le dernier timestamp depuis localStorage
      const lastCheck = localStorage.getItem("last-update-check");
      const now = Date.now();

      // Vérifier les services
      const servicesRes = await fetch("/api/services/last-update");
      if (servicesRes.ok) {
        const { timestamp } = await servicesRes.json();
        if (timestamp > (lastCheck ? parseInt(lastCheck) : 0)) {
          addNotification("service", "Nouveau service disponible !");
        }
      }

      // Vérifier la galerie
      const galleryRes = await fetch("/api/gallery/last-update");
      if (galleryRes.ok) {
        const { timestamp } = await galleryRes.json();
        if (timestamp > (lastCheck ? parseInt(lastCheck) : 0)) {
          addNotification("gallery", "Nouvelles photos dans la galerie !");
        }
      }

      // Vérifier le catalogue
      const catalogRes = await fetch("/api/catalog/last-update");
      if (catalogRes.ok) {
        const { timestamp } = await catalogRes.json();
        if (timestamp > (lastCheck ? parseInt(lastCheck) : 0)) {
          addNotification("catalog", "Nouveaux produits dans le catalogue !");
        }
      }

      // Mettre à jour le dernier check
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

    // Auto-supprimer après 5 secondes
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, removeNotification };
}