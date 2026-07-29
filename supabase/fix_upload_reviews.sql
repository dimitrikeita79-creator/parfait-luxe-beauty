-- ============================================================
-- SQL pour corriger l'upload d'images de profil et les avis clients
-- ============================================================

-- 1. Créer la table des avis clients
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

-- 3. Activer RLS (Row Level Security)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques de sécurité
-- Tout le monde peut lire les avis approuvés
CREATE POLICY "Les avis approuvés sont visibles par tous"
  ON public.reviews
  FOR SELECT
  USING (approved = true);

-- Les utilisateurs authentifiés peuvent créer des avis
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des avis"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Les utilisateurs peuvent modifier leurs propres avis
CREATE POLICY "Les utilisateurs peuvent modifier leurs propres avis"
  ON public.reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent tout faire
CREATE POLICY "Les admins ont tous les droits"
  ON public.reviews
  FOR ALL
  USING (auth.role() = 'service_role');

-- 5. Créer la fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer le trigger pour updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Configurer le storage pour les avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 8. Créer les politiques de storage pour les avatars
CREATE POLICY "Les avatars sont publics en lecture"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Les utilisateurs authentifiés peuvent uploader des avatars"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'avatars'
  );

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres avatars"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres avatars"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

-- 9. Accorder les permissions
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
GRANT SELECT ON public.reviews TO anon;

-- 10. Créer une fonction pour approuver les avis (pour les admins)
CREATE OR REPLACE FUNCTION public.approve_review(review_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.reviews
  SET approved = true, updated_at = now()
  WHERE id = review_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Créer une fonction pour récupérer les avis approuvés
CREATE OR REPLACE FUNCTION public.get_approved_reviews(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  author_name TEXT,
  text TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.author_name,
    r.text,
    r.rating,
    r.created_at
  FROM public.reviews r
  WHERE r.approved = true
  ORDER BY r.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Insérer des avis de démonstration (optionnel)
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