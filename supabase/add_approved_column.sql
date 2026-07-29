-- ============================================================
-- Migration simple pour ajouter la colonne approved
-- ============================================================

-- Ajouter la colonne approved si elle n'existe pas
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

-- Ajouter la colonne updated_at si elle n'existe pas
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

-- Créer la fonction pour updated_at (si elle n'existe pas)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger (ignorer l'erreur si il existe)
DO $$
BEGIN
    CREATE TRIGGER update_reviews_updated_at
      BEFORE UPDATE ON public.reviews
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Créer les index si ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

-- ============================================================
-- FIN
-- ============================================================