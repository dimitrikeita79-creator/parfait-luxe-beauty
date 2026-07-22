-- ============================================================================
-- PARFAIT LUXE BEAUTY — BASE DE DONNÉES (Version Corrigée Sans Permission)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SECTION 1: TABLES & TYPES (Sans Enums pour éviter les problèmes de droits)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'user',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.salon_info (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url      TEXT,
  banner_url    TEXT,
  salon_name    TEXT NOT NULL DEFAULT 'Parfait Luxe Beauty',
  slogan        TEXT,
  about_text    TEXT,
  address       TEXT,
  phone_number  TEXT,
  email         TEXT,
  instagram_url TEXT,
  facebook_url  TEXT,
  tiktok_url    TEXT,
  whatsapp_url  TEXT,
  opening_hours TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'coiffure',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.catalog (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(10, 2) NOT NULL DEFAULT 0,
  image_url    TEXT,
  category     TEXT NOT NULL DEFAULT 'coiffure',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration_min INTEGER NOT NULL DEFAULT 30,
  category     TEXT NOT NULL DEFAULT 'coiffure',
  image_url    TEXT,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'Coiffeur',
  description TEXT,
  photo_url   TEXT,
  specialties TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SECTION 2: TRIGGERS (Mise à jour automatique)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS salon_info_updated_at ON public.salon_info;
CREATE TRIGGER salon_info_updated_at BEFORE UPDATE ON public.salon_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS gallery_updated_at ON public.gallery;
CREATE TRIGGER gallery_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS catalog_updated_at ON public.catalog;
CREATE TRIGGER catalog_updated_at BEFORE UPDATE ON public.catalog FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS team_updated_at ON public.team;
CREATE TRIGGER team_updated_at BEFORE UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SECTION 3: SECURITE (RLS & Policies)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Lecture publique des profils" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admin: Gestion des profils" ON public.profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Lecture publique salon_info" ON public.salon_info FOR SELECT USING (true);
CREATE POLICY "Admin: Gestion salon_info" ON public.salon_info FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Lecture publique gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admin: Gestion gallery" ON public.gallery FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Lecture publique catalog" ON public.catalog FOR SELECT USING (true);
CREATE POLICY "Admin: Gestion catalog" ON public.catalog FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Lecture publique services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin: Gestion services" ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Lecture publique team" ON public.team FOR SELECT USING (true);
CREATE POLICY "Admin: Gestion team" ON public.team FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SECTION 4: STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('logo', 'logo', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('banner', 'banner', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('team', 'team', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Lecture publique storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('gallery', 'logo', 'banner', 'team'));
CREATE POLICY "Admin: Upload storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('gallery', 'logo', 'banner', 'team') AND public.is_admin());
CREATE POLICY "Admin: Delete storage" ON storage.objects
  FOR DELETE USING (bucket_id IN ('gallery', 'logo', 'banner', 'team') AND public.is_admin());
