-- =============================================
-- CÓDIGO SQL COMPLETO PARA SUPABASE
-- Copiar y pegar TODO este archivo en SQL Editor
-- =============================================

-- =============================================
-- 1. CREAR TABLA DE ADMINISTRADORES
-- =============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. HABILITAR SEGURIDAD (ROW LEVEL SECURITY)
-- =============================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. CREAR POLÍTICAS DE SEGURIDAD
-- =============================================

-- Política: Permitir SELECT (lectura) para todos
-- (Necesario para que la función verify_admin_password funcione)
CREATE POLICY "Permitir lectura de admins"
ON admins FOR SELECT
TO public
USING (true);

-- Política: Solo usuarios autenticados pueden insertar
CREATE POLICY "Solo autenticados pueden insertar admins"
ON admins FOR INSERT
TO authenticated
WITH CHECK (true);

-- =============================================
-- 4. CREAR ÍNDICES PARA BÚSQUEDAS RÁPIDAS
-- =============================================
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- =============================================
-- 5. INSERTAR PRIMER ADMINISTRADOR
-- =============================================
-- Usuario: admin
-- Contraseña: FuxionAdmin2025!
-- Email: admin@fuxionshop.com
INSERT INTO admins (username, password_hash, email)
VALUES (
  'admin',
  crypt('FuxionAdmin2025!', gen_salt('bf')),
  'admin@fuxionshop.com'
)
ON CONFLICT (username) DO NOTHING;

-- =============================================
-- 6. CREAR FUNCIÓN PARA VERIFICAR CONTRASEÑA
-- =============================================
CREATE OR REPLACE FUNCTION verify_admin_password(
  input_username TEXT,
  input_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  -- Obtener el hash almacenado
  SELECT password_hash INTO stored_hash
  FROM admins
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
-- 7. VERIFICACIÓN (ejecutar después para comprobar)
-- =============================================
-- Descomentar estas líneas para probar:

-- SELECT verify_admin_password('admin', 'FuxionAdmin2025!') AS resultado;
-- Debe devolver: true

-- SELECT * FROM admins;
-- Debe mostrar 1 fila con el usuario 'admin'
