-- Sincroniza la contraseña del administrador con Supabase Auth.
-- Ejecutar TODO este archivo en Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 1. Actualizar primero la cuenta real utilizada por supabase.auth.signInWithPassword.
DO $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE auth.users
  SET
    encrypted_password = extensions.crypt('Daniel22.', extensions.gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmation_token = '',
    recovery_token = '',
    updated_at = NOW()
  WHERE lower(trim(email)) = 'falcondaniel37@gmail.com';

  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  IF affected_rows = 0 THEN
    RAISE EXCEPTION
      'No existe falcondaniel37@gmail.com en Authentication > Users. Créalo allí y vuelve a ejecutar este archivo.';
  END IF;
END;
$$;

-- 2. Mantener activo el rol administrativo de la aplicación.
INSERT INTO public.admin_users (email, name, is_active, created_by)
VALUES ('falcondaniel37@gmail.com', 'Daniel Falcon', true, 'system')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  is_active = true,
  updated_at = NOW();

-- 3. Sincronizar el acceso administrativo antiguo solo si esa tabla existe.
DO $$
BEGIN
  IF to_regclass('public.admins') IS NOT NULL THEN
    EXECUTE $legacy$
      INSERT INTO public.admins (username, password_hash, email, nombre_completo)
      VALUES (
        'admin',
        extensions.crypt('Daniel22.', extensions.gen_salt('bf')),
        'falcondaniel37@gmail.com',
        'Daniel Falcon'
      )
      ON CONFLICT (username) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        email = EXCLUDED.email,
        nombre_completo = EXCLUDED.nombre_completo
    $legacy$;
  END IF;
END;
$$;

-- 4. VERIFICACIÓN OBLIGATORIA.
-- La columna password_matches debe devolver TRUE.
SELECT
  id,
  email,
  email_confirmed_at IS NOT NULL AS email_confirmado,
  encrypted_password IS NOT NULL AS tiene_password,
  extensions.crypt('Daniel22.', encrypted_password) = encrypted_password AS password_matches,
  banned_until
FROM auth.users
WHERE lower(trim(email)) = 'falcondaniel37@gmail.com';

