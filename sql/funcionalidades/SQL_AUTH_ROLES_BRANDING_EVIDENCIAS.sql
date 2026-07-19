-- =====================================================
-- ROLES, BRANDING Y EVIDENCIAS - FUXION SHOP
-- Ejecutar después de tener Supabase Auth activo.
-- =====================================================
-- Habilita:
-- - Dar/quitar rol admin por email desde la app.
-- - Cambiar logo/foto redonda y nombre visible de la tienda.
-- - Publicar evidencias con imagen y audio opcional.
-- - Bucket público para imágenes/audios del sitio.
--
-- Nota:
-- Las políticas quedan abiertas para mantener el frontend actual.
-- En una fase final conviene cerrar INSERT/UPDATE/DELETE con RLS por JWT.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Bucket público para medios del sitio.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  10485760,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
    'audio/wav',
    'audio/webm'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "site_media_public_read" ON storage.objects;
CREATE POLICY "site_media_public_read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "site_media_public_insert" ON storage.objects;
CREATE POLICY "site_media_public_insert"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'site-media');

DROP POLICY IF EXISTS "site_media_public_update" ON storage.objects;
CREATE POLICY "site_media_public_update"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'site-media')
WITH CHECK (bucket_id = 'site-media');

DROP POLICY IF EXISTS "site_media_public_delete" ON storage.objects;
CREATE POLICY "site_media_public_delete"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id = 'site-media');

-- Roles admin por email.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(lower(email));
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_public_select" ON public.admin_users;
CREATE POLICY "admin_users_public_select"
ON public.admin_users
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "admin_users_public_insert" ON public.admin_users;
CREATE POLICY "admin_users_public_insert"
ON public.admin_users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_users_public_update" ON public.admin_users;
CREATE POLICY "admin_users_public_update"
ON public.admin_users
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_users_public_delete" ON public.admin_users;
CREATE POLICY "admin_users_public_delete"
ON public.admin_users
FOR DELETE
TO anon, authenticated
USING (lower(email) <> 'falcondaniel37@gmail.com');

-- Configuración visible del sitio.
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  site_name TEXT NOT NULL DEFAULT 'Bienestar en Claro Chile',
  logo_url TEXT,
  owner_name TEXT DEFAULT 'Daniel Falcon',
  tagline TEXT DEFAULT 'Asesoría personalizada en productos Fuxion',
  updated_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_public_select" ON public.site_settings;
CREATE POLICY "site_settings_public_select"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "site_settings_public_insert" ON public.site_settings;
CREATE POLICY "site_settings_public_insert"
ON public.site_settings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "site_settings_public_update" ON public.site_settings;
CREATE POLICY "site_settings_public_update"
ON public.site_settings
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Evidencias públicas con imagen y audio opcional.
CREATE TABLE IF NOT EXISTS public.evidence_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  author_email TEXT,
  author_name TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_posts_published ON public.evidence_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_evidence_posts_created ON public.evidence_posts(created_at DESC);

ALTER TABLE public.evidence_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "evidence_posts_public_select" ON public.evidence_posts;
CREATE POLICY "evidence_posts_public_select"
ON public.evidence_posts
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "evidence_posts_public_insert" ON public.evidence_posts;
CREATE POLICY "evidence_posts_public_insert"
ON public.evidence_posts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "evidence_posts_public_update" ON public.evidence_posts;
CREATE POLICY "evidence_posts_public_update"
ON public.evidence_posts
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "evidence_posts_public_delete" ON public.evidence_posts;
CREATE POLICY "evidence_posts_public_delete"
ON public.evidence_posts
FOR DELETE
TO anon, authenticated
USING (true);

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_evidence_posts_updated_at ON public.evidence_posts;
CREATE TRIGGER update_evidence_posts_updated_at
  BEFORE UPDATE ON public.evidence_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.admin_users (email, name, is_active, created_by)
VALUES ('falcondaniel37@gmail.com', 'Daniel Falcon', true, 'system')
ON CONFLICT (email) DO UPDATE SET
  name = COALESCE(public.admin_users.name, EXCLUDED.name),
  is_active = true,
  updated_at = NOW();

INSERT INTO public.site_settings (id, site_name, owner_name, tagline)
VALUES ('main', 'Bienestar en Claro Chile', 'Daniel Falcon', 'Asesoría personalizada en productos Fuxion')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_app_admin(input_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE lower(email) = lower(input_email)
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.is_app_admin(TEXT) TO anon, authenticated;

-- Verificación:
-- SELECT public.is_app_admin('falcondaniel37@gmail.com') AS daniel_admin_ok;
-- SELECT * FROM public.site_settings;
-- SELECT * FROM public.admin_users ORDER BY created_at DESC;
