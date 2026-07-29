-- ============================================================
-- THEME UTILISATEUR (pour users ET admin uniquement)
-- ============================================================

-- 1. Ajoute la colonne theme sur profiles (table existante)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'gold' CHECK (theme IN ('gold', 'light', 'silver', 'dark', 'black'));

-- 2. Met à jour le trigger handle_new_user pour inclure le theme par défaut
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, theme)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    'gold'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    theme = COALESCE(public.profiles.theme, 'gold');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recrée le trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. RLS: seuls le propriétaire ou un admin peuvent modifier le theme
CREATE POLICY "profiles_update_own_theme" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Index
CREATE INDEX IF NOT EXISTS idx_profiles_theme ON public.profiles(theme);
