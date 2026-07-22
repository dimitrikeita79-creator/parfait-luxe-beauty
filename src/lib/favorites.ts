import type { CatalogItem, GalleryItem, ServiceItem } from "@/backend/models";

export type FavoriteKind = "gallery" | "catalog" | "service";

export interface FavoriteItem {
  id: string;
  kind: FavoriteKind;
  title: string;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  category?: string | null;
}

const FAVORITES_STORAGE_KEY = "desmohair-favorites";

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as FavoriteItem[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(items: FavoriteItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
}

export function isFavorite(kind: FavoriteKind, id: string) {
  return getFavorites().some((item) => item.kind === kind && item.id === id);
}

export function toggleFavorite(item: FavoriteItem) {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex((candidate) => candidate.kind === item.kind && candidate.id === item.id);

  const nextItems = existingIndex >= 0
    ? favorites.filter((_, index) => index !== existingIndex)
    : [item, ...favorites];

  saveFavorites(nextItems);
  return nextItems;
}

export function asFavoriteItem(item: GalleryItem | CatalogItem | ServiceItem, kind: FavoriteKind): FavoriteItem {
  return {
    id: item.id,
    kind,
    title: "title" in item ? item.title : "",
    description: "description" in item ? item.description : null,
    price: "price" in item ? item.price : null,
    imageUrl: "image_url" in item ? item.image_url : null,
    category: "category" in item ? item.category : null,
  };
}
