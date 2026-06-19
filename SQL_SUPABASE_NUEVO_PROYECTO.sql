-- =====================================================
-- SQL UNIFICADO PARA NUEVO PROYECTO SUPABASE
-- Fuxion Shop - blog, admin actual, foro/opiniones y reseñas
-- =====================================================
-- Uso recomendado:
-- 1. Abrir Supabase > SQL Editor.
-- 2. Pegar este archivo completo.
-- 3. Ejecutar una sola vez.
--
-- Nota:
-- Este SQL recupera el funcionamiento actual del proyecto.
-- El sistema futuro de asesores con login independiente, fotos,
-- testimonios, métricas y RLS por asesor debe ir en una migración nueva.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- =====================================================
-- ADMIN ACTUAL
-- =====================================================

CREATE TABLE IF NOT EXISTS public.admins (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  nombre_completo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_username ON public.admins(username);

-- El código actual valida admin mediante RPC get_admin_data.
-- No se expone el password_hash desde la app.
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_no_direct_select" ON public.admins;
CREATE POLICY "admins_no_direct_select"
ON public.admins
FOR SELECT
TO anon, authenticated
USING (false);

INSERT INTO public.admins (username, password_hash, email, nombre_completo)
VALUES (
  'admin',
  extensions.crypt('FuxionAdmin2025!', extensions.gen_salt('bf')),
  'admin@fuxionshop.com',
  'Administrador Fuxion Shop'
)
ON CONFLICT (username) DO NOTHING;

CREATE OR REPLACE FUNCTION public.verify_admin_password(
  input_username TEXT,
  input_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash
  FROM public.admins
  WHERE username = input_username;

  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN stored_hash = extensions.crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

CREATE OR REPLACE FUNCTION public.get_admin_data(
  input_username TEXT,
  input_password TEXT
)
RETURNS TABLE(
  id INT,
  username TEXT,
  email TEXT,
  nombre_completo TEXT
) AS $$
BEGIN
  IF NOT public.verify_admin_password(input_username, input_password) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT a.id, a.username, a.email, a.nombre_completo
  FROM public.admins a
  WHERE a.username = input_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

GRANT EXECUTE ON FUNCTION public.verify_admin_password(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_data(TEXT, TEXT) TO anon, authenticated;

-- =====================================================
-- BLOG
-- =====================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  author VARCHAR(100) DEFAULT 'Equipo Fuxion',
  is_published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created ON public.blog_posts(created_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_posts_public_read" ON public.blog_posts;
CREATE POLICY "blog_posts_public_read"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (is_published = true OR true);

-- Políticas abiertas para mantener funcionando el admin actual desde frontend.
-- Luego se deben reemplazar por Auth real/RLS por rol.
DROP POLICY IF EXISTS "blog_posts_public_insert" ON public.blog_posts;
CREATE POLICY "blog_posts_public_insert"
ON public.blog_posts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "blog_posts_public_update" ON public.blog_posts;
CREATE POLICY "blog_posts_public_update"
ON public.blog_posts
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "blog_posts_public_delete" ON public.blog_posts;
CREATE POLICY "blog_posts_public_delete"
ON public.blog_posts
FOR DELETE
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Artículos iniciales. Si ya existen por slug, no duplica.
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, image_url, is_published)
VALUES
(
  '5 Hábitos que Sabotean tu Pérdida de Peso sin que lo Sepas',
  '5-habitos-que-sabotean-tu-perdida-de-peso',
  'Descubre errores comunes al intentar bajar de peso y cómo evitarlos con hábitos sostenibles.',
  'Contenido informativo sobre hábitos, alimentación consciente, descanso, hidratación y manejo del estrés.',
  'Pérdida de Peso',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
  true
),
(
  'Cómo la Inflamación Afecta tu Peso y Energía',
  'como-la-inflamacion-afecta-tu-peso',
  'La inflamación crónica puede influir en energía, digestión y bienestar general.',
  'Contenido educativo sobre inflamación, hábitos saludables, descanso, movimiento e hidratación.',
  'Bienestar',
  'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
  true
),
(
  'Guía para Principiantes: Empezando tu Camino hacia un Peso Saludable',
  'guia-principiantes-peso-saludable',
  'Una guía simple para iniciar cambios saludables sin dietas extremas.',
  'Contenido educativo sobre mentalidad, alimentación consciente, movimiento y descanso.',
  'Sobrepeso',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- FORO / OPINIONES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.forum_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author TEXT NOT NULL,
  author_avatar TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  votes INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  solved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.forum_questions(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  product_name TEXT,
  likes INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_questions_created ON public.forum_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_questions_category ON public.forum_questions(category);
CREATE INDEX IF NOT EXISTS idx_forum_answers_question ON public.forum_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON public.product_reviews(product_name);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created ON public.product_reviews(created_at DESC);

ALTER TABLE public.forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas públicas porque el código actual permite preguntas, respuestas,
-- votos y reseñas desde el navegador.
DROP POLICY IF EXISTS "forum_questions_public_select" ON public.forum_questions;
CREATE POLICY "forum_questions_public_select" ON public.forum_questions
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "forum_questions_public_insert" ON public.forum_questions;
CREATE POLICY "forum_questions_public_insert" ON public.forum_questions
FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "forum_questions_public_update" ON public.forum_questions;
CREATE POLICY "forum_questions_public_update" ON public.forum_questions
FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "forum_answers_public_select" ON public.forum_answers;
CREATE POLICY "forum_answers_public_select" ON public.forum_answers
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "forum_answers_public_insert" ON public.forum_answers;
CREATE POLICY "forum_answers_public_insert" ON public.forum_answers
FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "forum_answers_public_update" ON public.forum_answers;
CREATE POLICY "forum_answers_public_update" ON public.forum_answers
FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "product_reviews_public_select" ON public.product_reviews;
CREATE POLICY "product_reviews_public_select" ON public.product_reviews
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "product_reviews_public_insert" ON public.product_reviews;
CREATE POLICY "product_reviews_public_insert" ON public.product_reviews
FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "product_reviews_public_update" ON public.product_reviews;
CREATE POLICY "product_reviews_public_update" ON public.product_reviews
FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_forum_questions_updated_at ON public.forum_questions;
CREATE TRIGGER update_forum_questions_updated_at
  BEFORE UPDATE ON public.forum_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_forum_answers_updated_at ON public.forum_answers;
CREATE TRIGGER update_forum_answers_updated_at
  BEFORE UPDATE ON public.forum_answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- VERIFICACIÓN RÁPIDA
-- =====================================================
-- SELECT public.verify_admin_password('admin', 'FuxionAdmin2025!') AS admin_ok;
-- SELECT COUNT(*) FROM public.blog_posts;
-- SELECT COUNT(*) FROM public.forum_questions;
-- SELECT COUNT(*) FROM public.product_reviews;
