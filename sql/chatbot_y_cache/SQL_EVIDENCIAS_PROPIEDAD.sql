-- Propiedad y permisos de edición para evidencias.
-- Ejecutar una vez en Supabase SQL Editor.
-- Requiere que los autores inicien sesión con Supabase Auth.

ALTER TABLE public.evidence_posts
ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_evidence_posts_owner
ON public.evidence_posts(owner_user_id);

-- Asocia evidencias antiguas al usuario Auth cuyo correo coincida.
UPDATE public.evidence_posts AS post
SET owner_user_id = auth_user.id
FROM auth.users AS auth_user
WHERE post.owner_user_id IS NULL
  AND post.author_email IS NOT NULL
  AND lower(post.author_email) = lower(auth_user.email);

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

GRANT EXECUTE ON FUNCTION public.current_user_is_app_admin() TO anon, authenticated;

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

GRANT EXECUTE ON FUNCTION public.current_user_is_main_admin() TO anon, authenticated;

ALTER TABLE public.evidence_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "evidence_posts_public_select" ON public.evidence_posts;
DROP POLICY IF EXISTS "evidence_posts_public_insert" ON public.evidence_posts;
DROP POLICY IF EXISTS "evidence_posts_public_update" ON public.evidence_posts;
DROP POLICY IF EXISTS "evidence_posts_public_delete" ON public.evidence_posts;
DROP POLICY IF EXISTS "evidence_posts_visible_read" ON public.evidence_posts;
DROP POLICY IF EXISTS "evidence_posts_owner_insert" ON public.evidence_posts;
DROP POLICY IF EXISTS "evidence_posts_owner_update" ON public.evidence_posts;
DROP POLICY IF EXISTS "evidence_posts_owner_delete" ON public.evidence_posts;

CREATE POLICY "evidence_posts_visible_read"
ON public.evidence_posts
FOR SELECT
TO anon, authenticated
USING (
  is_published = true
  OR (
    public.current_user_is_app_admin()
    AND owner_user_id = auth.uid()
  )
  OR public.current_user_is_main_admin()
);

CREATE POLICY "evidence_posts_owner_insert"
ON public.evidence_posts
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_is_app_admin()
  AND owner_user_id = auth.uid()
);

CREATE POLICY "evidence_posts_owner_update"
ON public.evidence_posts
FOR UPDATE
TO authenticated
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

CREATE POLICY "evidence_posts_owner_delete"
ON public.evidence_posts
FOR DELETE
TO authenticated
USING (
  public.current_user_is_main_admin()
  OR (
    public.current_user_is_app_admin()
    AND owner_user_id = auth.uid()
  )
);

GRANT SELECT ON public.evidence_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evidence_posts TO authenticated;

-- Verificación:
-- SELECT id, title, author_email, owner_user_id FROM public.evidence_posts;
-- SELECT public.current_user_is_app_admin();
-- SELECT public.current_user_is_main_admin();
