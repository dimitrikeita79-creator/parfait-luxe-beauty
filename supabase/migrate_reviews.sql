-- ============================================================
-- Migration pour ajouter la colonne "approved" à la table reviews
-- ============================================================

-- 1. Ajouter la colonne approved si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' 
        AND column_name = 'approved'
    ) THEN
        ALTER TABLE public.reviews 
        ADD COLUMN approved BOOLEAN DEFAULT false NOT NULL;
        
        RAISE NOTICE 'Colonne approved ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne approved existe déjà';
    END IF;
END $$;

-- 2. Ajouter la colonne updated_at si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.reviews 
        ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;
        
        RAISE NOTICE 'Colonne updated_at ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne updated_at existe déjà';
    END IF;
END $$;

-- 3. Créer la fonction pour mettre à jour updated_at (si elle n'existe pas)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Créer le trigger pour updated_at (si il n'existe pas)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_reviews_updated_at'
    ) THEN
        CREATE TRIGGER update_reviews_updated_at
          BEFORE UPDATE ON public.reviews
          FOR EACH ROW
          EXECUTE FUNCTION public.update_updated_at_column();
        
        RAISE NOTICE 'Trigger update_reviews_updated_at créé avec succès';
    ELSE
        RAISE NOTICE 'Le trigger update_reviews_updated_at existe déjà';
    END IF;
END $$;

-- 5. Créer les politiques RLS (si elles n'existent pas)
DO $$
BEGIN
    -- Politique: Les avis approuvés sont visibles par tous
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Les avis approuvés sont visibles par tous'
    ) THEN
        CREATE POLICY "Les avis approuvés sont visibles par tous"
          ON public.reviews
          FOR SELECT
          USING (approved = true);
        
        RAISE NOTICE 'Politique de lecture créée';
    END IF;

    -- Politique: Les utilisateurs authentifiés peuvent créer des avis
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Les utilisateurs authentifiés peuvent créer des avis'
    ) THEN
        CREATE POLICY "Les utilisateurs authentifiés peuvent créer des avis"
          ON public.reviews
          FOR INSERT
          WITH CHECK (auth.role() = 'authenticated');
        
        RAISE NOTICE 'Politique d insertion créée';
    END IF;

    -- Politique: Les utilisateurs peuvent modifier leurs propres avis
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Les utilisateurs peuvent modifier leurs propres avis'
    ) THEN
        CREATE POLICY "Les utilisateurs peuvent modifier leurs propres avis"
          ON public.reviews
          FOR UPDATE
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
        
        RAISE NOTICE 'Politique de modification créée';
    END IF;
END $$;

-- 6. Accorder les permissions
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

-- 7. Créer les index pour améliorer les performances (si ils n'existent pas)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_reviews_approved'
    ) THEN
        CREATE INDEX idx_reviews_approved ON public.reviews(approved, created_at DESC);
        RAISE NOTICE 'Index idx_reviews_approved créé';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_reviews_user_id'
    ) THEN
        CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
        RAISE NOTICE 'Index idx_reviews_user_id créé';
    END IF;
END $$;

-- 8. Marquer tous les avis existants comme approuvés (optionnel)
-- Décommentez la ligne ci-dessous si vous voulez approuver tous les avis existants
-- UPDATE public.reviews SET approved = true WHERE approved = false;

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================