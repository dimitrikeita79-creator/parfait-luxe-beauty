// Modèles fortement typés

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user';
  theme: 'gold' | 'light' | 'silver';
  created_at: string;
  updated_at: string;
}

export type AppUser = Profile;

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: 'coiffure' | 'mèches' | 'équipement' | 'Produits' | 'Promo';
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CatalogItem {
  id: string;
  code?: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration_min: number;
  category: string;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string | null;
  author_name: string;
  title: string | null;
  comment: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export type FavoriteKind = 'gallery' | 'catalog' | 'service';

export interface FavoriteItem {
  id: string;
  kind: FavoriteKind;
  title: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  category: string | null;
}

export interface SalonInfo {
  id: string;
  logo_url: string | null;
  banner_url: string | null;
  salon_name: string;
  slogan: string | null;
  about_text: string | null;
  address: string | null;
  phone_number: string | null;
  email: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  whatsapp_url: string | null;
  opening_hours: string | null;
  updated_at: string;
}

export interface SavedProduct {
  id: string;
  user_id: string;
  title: string;
  note: string;
  created_at: string;
}