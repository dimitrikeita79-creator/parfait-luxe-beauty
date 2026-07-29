-- Migration : renommer users -> profiles si nécessaire
-- À exécuter dans Supabase SQL Editor si la table users existe déjà

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users')
  AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    ALTER TABLE public.users RENAME TO profiles;
    ALTER INDEX public.users_id_seq RENAME TO profiles_id_seq;
    
    DROP POLICY IF EXISTS "users_read_own" ON public.profiles;
    DROP POLICY IF EXISTS "users_update_own" ON public.profiles;
    
    CREATE POLICY "profiles_read_own" ON public.profiles
      FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY "profiles_update_own" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;
