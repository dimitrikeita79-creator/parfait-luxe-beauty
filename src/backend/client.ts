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
  db: {
    schema: 'public',
  },
});

const inFlightRequests = new Map<string, Promise<unknown>>();

export function deduplicateRequest<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const existing = inFlightRequests.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  
  const promise = fetcher().finally(() => {
    inFlightRequests.delete(key);
  });
  
  inFlightRequests.set(key, promise);
  return promise;
}

export function isTableNotFoundError(error: unknown): boolean {
  const message = String((error as Error)?.message ?? '').toLowerCase();
  return (
    message.includes('relation') && message.includes('does not exist') ||
    message.includes('failed to fetch') ||
    message.includes('not found') ||
    message.includes('404')
  );
}

export async function withRetry<T>(
  fetcher: () => Promise<T>,
  options?: { retries?: number; baseDelay?: number }
): Promise<T> {
  const retries = options?.retries ?? 3;
  const baseDelay = options?.baseDelay ?? 500;
  
  let lastError: unknown;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fetcher();
    } catch (error) {
      lastError = error;
      const message = String((error as Error)?.message ?? '').toLowerCase();
      const isRetryable =
        message.includes('fetch') ||
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('abort') ||
        message.includes('429') ||
        message.includes('too many requests') ||
        message.includes('connection') ||
        (error as { status?: number })?.status === 408 ||
        (error as { status?: number })?.status === 502 ||
        (error as { status?: number })?.status === 503;
      
      if (!isRetryable || attempt >= retries - 1) break;
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export function createOptimizedQuery<T>() {
  return {
    select: (columns: string) => {
      let q = supabase.from('').select(columns);
      return {
        eq: (column: string, value: unknown) => {
          q = q.eq(column, value);
          return {
            order: (column: string, opts?: { ascending?: boolean }) => {
              q = q.order(column, opts);
              return {
                single: async (): Promise<{ data: T | null; error: unknown }> => ({ data: null as T | null, error: null }),
              };
            },
            single: async (): Promise<{ data: T | null; error: unknown }> => ({ data: null as T | null, error: null }),
            then: (resolve: (result: { data: T | null; error: unknown }) => void) => resolve({ data: null as T | null, error: null }),
          };
        },
        order: (column: string, opts?: { ascending?: boolean }) => {
          q = q.order(column, opts);
          return {
            then: (resolve: (result: { data: T[] | null; error: unknown }) => void) => resolve({ data: null as T[] | null, error: null }),
          };
        },
        then: (resolve: (result: { data: T[] | null; error: unknown }) => void) => resolve({ data: null as T[] | null, error: null }),
      };
    },
  };
}

// Tables et Buckets
export const TABLES = {
  PROFILES: 'profiles',
  GALLERY: 'gallery',
  CATALOG: 'catalog',
  SERVICES: 'services',
  SALON_INFO: 'salon_info',
  FAVORITES: 'favorites',
  CAROUSEL_SLIDES: 'carousel_slides',
  REVIEWS: 'reviews',
  SAVED_PRODUCTS: 'saved_products',
  CART: 'cart',
  TEAM: 'team',
  NOTIFICATIONS: 'notifications',
} as const;

export const BUCKETS = {
  GALLERY: 'gallery',
  LOGO: 'logo',
  BANNER: 'banner',
  AVATAR: 'avatars',
} as const;