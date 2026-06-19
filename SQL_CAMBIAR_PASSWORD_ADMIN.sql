-- Cambia la contraseña del acceso administrativo legado.
-- Ejecutar una vez en Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

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
  nombre_completo = EXCLUDED.nombre_completo;

-- Verificación:
-- SELECT public.verify_admin_password(
--   'falcondaniel37@gmail.com',
--   'Daniel22.'
-- ) AS password_actualizado;
