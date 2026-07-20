import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variables d\'environnement Supabase manquantes. Vérifiez votre fichier .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Noms des tables centralisés
export const TABLES = {
  PROFILES: 'profiles',
  GALLERY: 'gallery',
  CATALOG: 'catalog',
  TEAM: 'team',
  SERVICES: 'services',
  SALON_INFO: 'salon_info',
} as const;

// Noms des buckets storage centralisés
export const BUCKETS = {
  GALLERY: 'gallery',
  LOGO: 'logo',
  BANNER: 'banner',
  TEAM: 'team',
} as const;
