-- ============================================================
-- Script final pour configurer les avis et avatars
-- ============================================================

-- 1. Créer la table reviews (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Ajouter les colonnes manquantes si la table existe déjà
DO $$ 
BEGIN
    -- Ajouter approved si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' 
        AND column_name = 'approved'
    ) THEN
        ALTER TABLE public.reviews 
        ADD COLUMN approved BOOLEAN DEFAULT false NOT NULL;
        RAISE NOTICE 'Colonne approved ajoutée';
    END IF;

    -- Ajouter updated_at si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.reviews 
        ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;
        RAISE NOTICE 'Colonne updated_at ajoutée';
    END IF;
END $$;

-- 3. Créer les index (si ils n'existent pas)
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

-- 4. Activer RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 5. Supprimer les politiques existantes et les recréer
DROP POLICY IF EXISTS "Les avis approuvés sont visibles par tous" ON public.reviews;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent créer des avis" ON public.reviews;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leurs propres avis" ON public.reviews;

-- Créer les politiques
CREATE POLICY "Les avis approuvés sont visibles par tous"
  ON public.reviews FOR SELECT USING (approved = true);

CREATE POLICY "Les utilisateurs authentifiés peuvent créer des avis"
  ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres avis"
  ON public.reviews FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Accorder les permissions
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

-- 7. Créer le bucket pour les avatars (si il n'existe pas)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 8. Supprimer les politiques de storage existantes et les recréer
DROP POLICY IF EXISTS "Les avatars sont publics en lecture" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent uploader des avatars" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leurs propres avatars" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs peuvent supprimer leurs propres avatars" ON storage.objects;

-- Créer les politiques de storage
CREATE POLICY "Les avatars sont publics en lecture"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Les utilisateurs authentifiés peuvent uploader des avatars"
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'avatars'
  );

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres avatars"
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres avatars"
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

-- 9. Créer la fonction pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Supprimer le trigger existant et le recréer
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Insérer des avis de démonstration (optionnel)
INSERT INTO public.reviews (author_name, text, rating, approved)
VALUES 
  ('Laitifa Segda', 'C''était super et magique à la fois', 5, true),
  ('Venance Koffi', 'Très bien', 5, true),
  ('Sampawende Maelyse', 'Perfect', 5, true),
  ('Nana Yasmine Zoure', 'C''est vraiment cool', 5, true),
  ('Adèle Sawadogo', 'C''est jolie dès 😍🥰', 5, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================