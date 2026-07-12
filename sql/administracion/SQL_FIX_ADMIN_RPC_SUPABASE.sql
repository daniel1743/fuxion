-- =====================================================
-- FIX LOGIN ADMIN - SUPABASE
-- Ejecutar si get_admin_data falla con:
-- function crypt(text, text) does not exist
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

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

-- Verificación:
-- SELECT public.verify_admin_password('admin', 'FuxionAdmin2025!') AS admin_ok;
-- SELECT public.verify_admin_password('falcondaniel37@gmail.com', 'FuxionAdmin2025!') AS admin_email_ok;
