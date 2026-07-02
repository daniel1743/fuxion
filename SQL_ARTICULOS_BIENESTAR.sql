-- Artículos editoriales de la sección Bienestar.
-- Ejecutar una vez en Supabase SQL Editor.
-- Requiere los administradores registrados en public.admin_users.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.current_user_is_app_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_main_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(COALESCE(auth.jwt() ->> 'email', '')) = 'falcondaniel37@gmail.com'
    AND EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE lower(email) = 'falcondaniel37@gmail.com'
        AND is_active = true
    );
$$;

GRANT EXECUTE ON FUNCTION public.current_user_is_app_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_is_main_admin() TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.wellness_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  title TEXT NOT NULL CHECK (char_length(trim(title)) BETWEEN 5 AND 160),
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL CHECK (char_length(trim(excerpt)) BETWEEN 10 AND 500),
  content TEXT NOT NULL CHECK (char_length(trim(content)) BETWEEN 50 AND 20000),
  category TEXT NOT NULL CHECK (category IN (
    'Belleza',
    'Bienestar',
    'Salud hepática',
    'Control de peso',
    'Bienestar gástrico',
    'Ejercicio',
    'Nutrición',
    'Energía',
    'Hábitos saludables',
    'Salud emocional'
  )),
  image_url TEXT,
  editor_name TEXT NOT NULL,
  editor_email TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_articles_published
ON public.wellness_articles(is_published, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_wellness_articles_category
ON public.wellness_articles(category);

CREATE INDEX IF NOT EXISTS idx_wellness_articles_owner
ON public.wellness_articles(owner_user_id);

CREATE OR REPLACE FUNCTION public.update_wellness_article_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.is_published = true AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_wellness_articles_updated_at ON public.wellness_articles;
CREATE TRIGGER update_wellness_articles_updated_at
BEFORE INSERT OR UPDATE ON public.wellness_articles
FOR EACH ROW EXECUTE FUNCTION public.update_wellness_article_timestamp();

ALTER TABLE public.wellness_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wellness_articles_public_read" ON public.wellness_articles;
DROP POLICY IF EXISTS "wellness_articles_admin_insert" ON public.wellness_articles;
DROP POLICY IF EXISTS "wellness_articles_admin_update" ON public.wellness_articles;
DROP POLICY IF EXISTS "wellness_articles_admin_delete" ON public.wellness_articles;

CREATE POLICY "wellness_articles_public_read"
ON public.wellness_articles
FOR SELECT TO anon, authenticated
USING (
  is_published = true
  OR public.current_user_is_main_admin()
  OR (
    public.current_user_is_app_admin()
    AND owner_user_id = auth.uid()
  )
);

CREATE POLICY "wellness_articles_admin_insert"
ON public.wellness_articles
FOR INSERT TO authenticated
WITH CHECK (
  public.current_user_is_app_admin()
  AND owner_user_id = auth.uid()
);

CREATE POLICY "wellness_articles_admin_update"
ON public.wellness_articles
FOR UPDATE TO authenticated
USING (
  public.current_user_is_main_admin()
  OR (
    public.current_user_is_app_admin()
    AND owner_user_id = auth.uid()
  )
)
WITH CHECK (
  public.current_user_is_main_admin()
  OR (
    public.current_user_is_app_admin()
    AND owner_user_id = auth.uid()
  )
);

CREATE POLICY "wellness_articles_admin_delete"
ON public.wellness_articles
FOR DELETE TO authenticated
USING (
  public.current_user_is_main_admin()
  OR (
    public.current_user_is_app_admin()
    AND owner_user_id = auth.uid()
  )
);

GRANT SELECT ON public.wellness_articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wellness_articles TO authenticated;

-- Verificación:
-- SELECT title, category, editor_name, is_published
-- FROM public.wellness_articles
-- ORDER BY published_at DESC NULLS LAST;
