-- =====================================================
-- ASESORES, IDS Y MÉTRICAS - FUXION SHOP
-- Ejecutar después de SQL_SUPABASE_NUEVO_PROYECTO.sql
-- =====================================================
-- Esto habilita:
-- - Crear/desactivar/eliminar IDs de asesores.
-- - Guardar WhatsApp, foto y redes sociales por asesor.
-- - Registrar métricas básicas por asesor.
-- - Permitir login admin usando admin o falcondaniel37@gmail.com.
--
-- Nota de seguridad:
-- El proyecto actual usa un admin propio en frontend. Por eso estas
-- políticas quedan abiertas para que el panel existente funcione.
-- La versión final con asesores parciales debe migrarse a Supabase Auth
-- y RLS por usuario autenticado.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.advisors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp_url TEXT,
  whatsapp_number TEXT,
  photo_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.advisor_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id TEXT REFERENCES public.advisors(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  page_path TEXT,
  product_name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advisors_active ON public.advisors(is_active);
CREATE INDEX IF NOT EXISTS idx_advisor_events_advisor ON public.advisor_events(advisor_id);
CREATE INDEX IF NOT EXISTS idx_advisor_events_type ON public.advisor_events(event_type);
CREATE INDEX IF NOT EXISTS idx_advisor_events_created ON public.advisor_events(created_at DESC);

ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "advisors_public_select" ON public.advisors;
CREATE POLICY "advisors_public_select"
ON public.advisors
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "advisors_public_insert" ON public.advisors;
CREATE POLICY "advisors_public_insert"
ON public.advisors
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "advisors_public_update" ON public.advisors;
CREATE POLICY "advisors_public_update"
ON public.advisors
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "advisors_public_delete" ON public.advisors;
CREATE POLICY "advisors_public_delete"
ON public.advisors
FOR DELETE
TO anon, authenticated
USING (id <> 'daniel');

DROP POLICY IF EXISTS "advisor_events_public_select" ON public.advisor_events;
CREATE POLICY "advisor_events_public_select"
ON public.advisor_events
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "advisor_events_public_insert" ON public.advisor_events;
CREATE POLICY "advisor_events_public_insert"
ON public.advisor_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP TRIGGER IF EXISTS update_advisors_updated_at ON public.advisors;
CREATE TRIGGER update_advisors_updated_at
  BEFORE UPDATE ON public.advisors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.advisors (id, name, whatsapp_number, is_active, is_default, notes)
VALUES
  ('daniel', 'Daniel Falcon', '56989639088', true, true, 'Asesor principal por SEO, web directa y tráfico sin ID.'),
  ('david', 'David', null, false, false, 'Pendiente configurar WhatsApp Business.'),
  ('givo', 'Givo', null, false, false, 'Pendiente configurar WhatsApp Business.'),
  ('asesor3', 'Asesor 3', null, false, false, 'Reservado.'),
  ('asesor4', 'Asesor 4', null, false, false, 'Reservado.'),
  ('asesor5', 'Asesor 5', null, false, false, 'Reservado.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  is_default = EXCLUDED.is_default,
  updated_at = NOW();

UPDATE public.admins
SET email = 'falcondaniel37@gmail.com',
    nombre_completo = COALESCE(nombre_completo, 'Daniel Falcon')
WHERE username = 'admin';

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
  WHERE username = input_username OR lower(email) = lower(input_username);

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
  WHERE a.username = input_username OR lower(a.email) = lower(input_username);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

GRANT EXECUTE ON FUNCTION public.verify_admin_password(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_data(TEXT, TEXT) TO anon, authenticated;

-- Verificación rápida:
-- SELECT public.verify_admin_password('falcondaniel37@gmail.com', 'FuxionAdmin2025!') AS admin_email_ok;
-- SELECT * FROM public.advisors ORDER BY is_default DESC, id;
-- SELECT advisor_id, event_type, COUNT(*) FROM public.advisor_events GROUP BY advisor_id, event_type;
