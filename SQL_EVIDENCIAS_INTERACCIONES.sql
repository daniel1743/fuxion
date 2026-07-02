-- Comentarios y reacciones públicas para las evidencias.
-- Ejecutar una vez en Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.evidence_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES public.evidence_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL CHECK (char_length(trim(author_name)) BETWEEN 2 AND 60),
  content TEXT NOT NULL CHECK (char_length(trim(content)) BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.evidence_comments DROP COLUMN IF EXISTS author_email;

CREATE INDEX IF NOT EXISTS idx_evidence_comments_post
ON public.evidence_comments(evidence_id, created_at);

CREATE TABLE IF NOT EXISTS public.evidence_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES public.evidence_posts(id) ON DELETE CASCADE,
  visitor_key TEXT NOT NULL CHECK (char_length(visitor_key) BETWEEN 10 AND 100),
  reaction_type TEXT NOT NULL DEFAULT 'like' CHECK (reaction_type = 'like'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (evidence_id, visitor_key, reaction_type)
);

CREATE INDEX IF NOT EXISTS idx_evidence_reactions_post
ON public.evidence_reactions(evidence_id, reaction_type);

ALTER TABLE public.evidence_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "evidence_comments_public_read" ON public.evidence_comments;
CREATE POLICY "evidence_comments_public_read"
ON public.evidence_comments FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "evidence_comments_public_insert" ON public.evidence_comments;
CREATE POLICY "evidence_comments_public_insert"
ON public.evidence_comments FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(trim(author_name)) BETWEEN 2 AND 60
  AND char_length(trim(content)) BETWEEN 1 AND 500
);

DROP POLICY IF EXISTS "evidence_reactions_public_read" ON public.evidence_reactions;
CREATE POLICY "evidence_reactions_public_read"
ON public.evidence_reactions FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "evidence_reactions_public_insert" ON public.evidence_reactions;
CREATE POLICY "evidence_reactions_public_insert"
ON public.evidence_reactions FOR INSERT TO anon, authenticated
WITH CHECK (reaction_type = 'like');

DROP POLICY IF EXISTS "evidence_reactions_public_delete" ON public.evidence_reactions;
CREATE POLICY "evidence_reactions_public_delete"
ON public.evidence_reactions FOR DELETE TO anon, authenticated
USING (reaction_type = 'like');

GRANT SELECT, INSERT ON public.evidence_comments TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.evidence_reactions TO anon, authenticated;

-- Verificación:
-- SELECT * FROM public.evidence_comments ORDER BY created_at DESC;
-- SELECT evidence_id, count(*) AS likes
-- FROM public.evidence_reactions
-- GROUP BY evidence_id;
