import { useEffect, useState } from "react";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import type { FavoriteItem } from "@/backend/models";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    const handler = () => setFavorites(getFavorites());
    window.addEventListener("favorites-updated", handler);
    return () => window.removeEventListener("favorites-updated", handler);
  }, []);

  const toggle = (item: FavoriteItem) => {
    setFavorites(toggleFavorite(item));
  };

  return { favorites, setFavorites, toggle };
}
