// Modèles fortement typés

export interface AppUser {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: 'coiffure' | 'maquillage' | 'ongles' | 'soin' | 'autre';
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CatalogItem {
  id: string;
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

export interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  description: string | null;
  photo_url: string;
  specialties: string[];
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
