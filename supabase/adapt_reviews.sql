-- ============================================================
-- Script d'adaptation pour la table reviews existante
-- ============================================================

-- 1. Vérifier et ajouter les colonnes manquantes
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
    
    -- Vérifier si la colonne pour le texte existe (peu importe le nom)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' 
        AND (column_name = 'text' OR column_name = '"text"' OR column_name = 'content' OR column_name = 'message')
    ) THEN
        -- Aucune colonne pour le texte n'existe, on ajoute "text"
        ALTER TABLE public.reviews 
        ADD COLUMN "text" TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Colonne text ajoutée';
    END IF;
END $$;

-- 2. Créer les index (si ils n'existent pas)
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

-- 3. Activer RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. Supprimer les politiques existantes et les recréer
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

-- 5. Accorder les permissions
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

-- 6. Créer le bucket pour les avatars (si il n'existe pas)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 7. Supprimer les politiques de storage existantes et les recréer
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

-- 8. Créer la fonction pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Supprimer le trigger existant et le recréer
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Insérer des avis de démonstration (seulement si la colonne "text" existe)
-- Note: Cette partie est commentée car nous ne connaissons pas la structure exacte
-- Décommentez et adaptez selon vos colonnes existantes
/*
INSERT INTO public.reviews (author_name, "text", rating, approved)
VALUES 
  ('Laitifa Segda', 'C''était super et magique à la fois', 5, true),
  ('Venance Koffi', 'Très bien', 5, true),
  ('Sampawende Maelyse', 'Perfect', 5, true),
  ('Nana Yasmine Zoure', 'C''est vraiment cool', 5, true),
  ('Adèle Sawadogo', 'C''est jolie dès 😍🥰', 5, true)
ON CONFLICT DO NOTHING;
*/

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================