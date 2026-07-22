import { createClient } from '@supabase/supabase-js';

// On force la lecture avec import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// On affiche dans le terminal pour vérifier
console.log('URL utilisée :', supabaseUrl);
console.log('Clé utilisée :', supabaseAnonKey ? 'OK (présente)' : 'MANQUANTE !');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🚨 ERREUR : Les variables Supabase ne sont pas chargées. Vérifiez votre fichier .env et redémarrez le serveur.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Tables et Buckets
export const TABLES = {
  PROFILES: 'profiles',
  GALLERY: 'gallery',
  CATALOG: 'catalog',
  TEAM: 'team',
  SERVICES: 'services',
  SALON_INFO: 'salon_info',
} as const;

export const BUCKETS = {
  GALLERY: 'gallery',
  LOGO: 'logo',
  BANNER: 'banner',
  TEAM: 'team',
} as const;
