-- =============================================
-- CÓDIGO SQL SIMPLIFICADO PARA SUPABASE
-- NO usa el sistema de autenticación de Supabase
-- Solo crea una tabla simple para administradores
-- =============================================

-- =============================================
-- 1. HABILITAR EXTENSIÓN DE ENCRIPTACIÓN
-- =============================================
-- Esto permite usar crypt() para encriptar contraseñas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- 2. ELIMINAR TABLA SI EXISTE (para empezar limpio)
-- =============================================
DROP TABLE IF EXISTS public.admins CASCADE;

-- =============================================
-- 3. CREAR TABLA DE ADMINISTRADORES
-- =============================================
-- Tabla simple, sin relación con auth.users de Supabase
CREATE TABLE public.admins (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  nombre_completo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. DESACTIVAR RLS PARA ESTA TABLA
-- =============================================
-- Permitimos acceso público a esta tabla
-- (la seguridad está en la función verify_admin_password)
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. CREAR ÍNDICE PARA BÚSQUEDAS RÁPIDAS
-- =============================================
CREATE INDEX idx_admins_username ON public.admins(username);

-- =============================================
-- 6. INSERTAR PRIMER ADMINISTRADOR
-- =============================================
-- Usuario: admin
-- Contraseña: FuxionAdmin2025!
INSERT INTO public.admins (username, password_hash, email, nombre_completo)
VALUES (
  'admin',
  crypt('FuxionAdmin2025!', gen_salt('bf')),
  'admin@fuxionshop.com',
  'Administrador Fuxion Shop'
)
ON CONFLICT (username) DO NOTHING;

-- =============================================
-- 7. CREAR FUNCIÓN PARA VERIFICAR CONTRASEÑA
-- =============================================
CREATE OR REPLACE FUNCTION public.verify_admin_password(
  input_username TEXT,
  input_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  -- Obtener el hash almacenado
  SELECT password_hash INTO stored_hash
  FROM public.admins
  WHERE username = input_username;

  -- Verificar si existe el usuario
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Comparar la contraseña con el hash usando bcrypt
  RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 8. CREAR FUNCIÓN PARA OBTENER DATOS DEL ADMIN
-- =============================================
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
  -- Verificar contraseña primero
  IF NOT public.verify_admin_password(input_username, input_password) THEN
    RETURN;
  END IF;

  -- Devolver datos del admin (sin el password_hash)
  RETURN QUERY
  SELECT a.id, a.username, a.email, a.nombre_completo
  FROM public.admins a
  WHERE a.username = input_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 9. VERIFICACIÓN (ejecutar después para comprobar)
-- =============================================
-- Descomentar estas líneas para probar:

-- SELECT verify_admin_password('admin', 'FuxionAdmin2025!') AS login_correcto;
-- Debe devolver: true

-- SELECT verify_admin_password('admin', 'contraseña_incorrecta') AS login_incorrecto;
-- Debe devolver: false

-- SELECT * FROM get_admin_data('admin', 'FuxionAdmin2025!');
-- Debe devolver: id, username, email, nombre_completo

-- SELECT * FROM admins;
-- Debe mostrar 1 fila con el usuario 'admin' (pero con password_hash encriptado)
