-- =============================================
-- ALTER TABLE: Agregar columnas de enriquecimiento a wellness_articles
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Columnas de enriquecimiento SEO y editorial
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'enriched') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN enriched BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'entity_detected') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN entity_detected TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'entity_slug') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN entity_slug TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'evidence_level') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN evidence_level TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'related_products') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN related_products TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'semantic_keywords') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN semantic_keywords TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'seo_schema') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN seo_schema JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'enrichment_score') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN enrichment_score NUMERIC;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'author_id') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN author_id UUID REFERENCES auth.users(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_articles' AND column_name = 'views') THEN
    ALTER TABLE public.wellness_articles ADD COLUMN views INTEGER DEFAULT 0;
  END IF;
END $$;
