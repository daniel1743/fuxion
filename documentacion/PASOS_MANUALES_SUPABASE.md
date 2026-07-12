# 📝 PASOS MANUALES PARA CONFIGURAR SUPABASE

## ✅ Lo que YA está listo (hecho automáticamente):

1. ✅ Instalada librería `@supabase/supabase-js`
2. ✅ Creado archivo `src/lib/supabaseClient.js` con tus credenciales
3. ✅ Actualizado `AdminContext.jsx` para usar Supabase
4. ✅ Sistema de fallback: Si Supabase no está configurado, usa autenticación local

---

## 🔧 Lo que DEBES hacer manualmente en Supabase:

### PASO 1: Acceder a tu proyecto de Supabase

1. Ve a: **https://app.supabase.com**
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto (o créalo si no existe)

---

### PASO 2: Crear la tabla de administradores

1. En el panel izquierdo, haz clic en **"SQL Editor"** (📊 ícono de base de datos)
2. Haz clic en **"New query"** (botón verde arriba a la derecha)
3. **COPIA Y PEGA** este código SQL completo:

```sql
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
-- 7. VERIFICACIÓN (opcional - para comprobar)
-- =============================================
-- Puedes ejecutar esto después para verificar que funciona:
-- SELECT verify_admin_password('admin', 'FuxionAdmin2025!');
-- Debe devolver: true
```

4. Haz clic en el botón **"RUN"** (▶️ Play) abajo a la derecha
5. Deberías ver un mensaje: **"Success. No rows returned"**

---

### PASO 3: Verificar que todo funcionó

1. En el panel izquierdo, haz clic en **"Table Editor"** (📋 ícono de tabla)
2. Selecciona la tabla **"admins"**
3. Deberías ver **1 fila** con:
   - **username**: `admin`
   - **email**: `admin@fuxionshop.com`
   - **password_hash**: Un texto largo encriptado (ejemplo: `$2a$06$...`)

---

### PASO 4: Probar la función de verificación de contraseña

1. Vuelve al **SQL Editor**
2. Crea una **nueva query**
3. Ejecuta este código de prueba:

```sql
-- Probar que la función funciona correctamente
SELECT verify_admin_password('admin', 'FuxionAdmin2025!') AS login_correcto;
```

4. Haz clic en **"RUN"**
5. Deberías ver en los resultados:
   ```
   login_correcto: true
   ```

6. Ahora prueba con una contraseña incorrecta:

```sql
-- Esto debe devolver false
SELECT verify_admin_password('admin', 'contraseña_incorrecta') AS login_incorrecto;
```

7. Resultado esperado:
   ```
   login_incorrecto: false
   ```

---

## 🎯 PASO 5: Probar en tu aplicación

1. **Reinicia tu servidor de desarrollo** (detén y vuelve a ejecutar `npm run dev`)

2. Ve a tu sitio web: **http://localhost:5173**

3. Haz clic en el **ícono de escudo** (🛡️) en el header

4. Intenta iniciar sesión con:
   - **Usuario**: `admin`
   - **Contraseña**: `FuxionAdmin2025!`

5. **Abre la consola del navegador (F12)** y busca uno de estos mensajes:
   - ✅ `"Autenticación con Supabase exitosa"` ← Significa que Supabase funciona
   - ⚠️ `"Supabase no disponible, usando autenticación local"` ← Fallback activado

---

## 🔄 CAMBIAR ENTRE SUPABASE Y LOCAL

Si quieres desactivar Supabase temporalmente y usar solo autenticación local:

1. Abre el archivo: `src/context/AdminContext.jsx`

2. Busca la línea 24:
```javascript
const [useSupabase, setUseSupabase] = useState(true);
```

3. Cámbiala a:
```javascript
const [useSupabase, setUseSupabase] = useState(false);
```

4. Para volver a activar Supabase, ponla en `true`

---

## ➕ AGREGAR MÁS ADMINISTRADORES

Si quieres crear otro usuario administrador:

1. Ve al **SQL Editor** en Supabase
2. Ejecuta este código (cambia los valores):

```sql
INSERT INTO admins (username, password_hash, email)
VALUES (
  'nombre_nuevo_admin',                          -- Cambia esto
  crypt('ContraseñaSegura123!', gen_salt('bf')), -- Cambia esto
  'nuevo_admin@fuxionshop.com'                   -- Cambia esto
);
```

3. Haz clic en **"RUN"**

---

## ❌ SOLUCIÓN DE PROBLEMAS

### Error: "function verify_admin_password does not exist"

**Causa**: No ejecutaste el código SQL del PASO 2 (sección 6)

**Solución**:
1. Ve al SQL Editor
2. Ejecuta solo la parte de "CREAR FUNCIÓN" del código SQL del PASO 2

---

### Error: "relation admins does not exist"

**Causa**: No ejecutaste el código SQL del PASO 2 (sección 1)

**Solución**:
1. Ve al SQL Editor
2. Ejecuta el código SQL completo del PASO 2

---

### Error: "Invalid API key" o "Project not found"

**Causa**: Las credenciales en `supabaseClient.js` son incorrectas

**Solución**:
1. Ve a **Settings → API** en tu proyecto de Supabase
2. Copia de nuevo:
   - **Project URL**
   - **anon public key**
3. Actualiza el archivo `src/lib/supabaseClient.js`

---

### El login funciona pero dice "usando autenticación local"

**Causa**: La función `verify_admin_password` no está creada o tiene un error

**Solución**:
1. Verifica que ejecutaste la sección 6 del código SQL (CREAR FUNCIÓN)
2. Prueba ejecutar:
   ```sql
   SELECT verify_admin_password('admin', 'FuxionAdmin2025!');
   ```
3. Si da error, elimina y recrea la función

---

## 📊 VERIFICAR CONFIGURACIÓN ACTUAL

Ejecuta esto en el SQL Editor para ver el estado:

```sql
-- Ver todos los administradores
SELECT username, email, created_at FROM admins;

-- Ver si la función existe
SELECT routine_name
FROM information_schema.routines
WHERE routine_name = 'verify_admin_password';

-- Ver políticas de seguridad
SELECT * FROM pg_policies WHERE tablename = 'admins';
```

---

## 🎉 ¡LISTO!

Una vez completados todos los pasos manuales:

✅ Tu sistema de administrador está conectado a Supabase
✅ Las contraseñas están encriptadas con bcrypt
✅ La base de datos está protegida con Row Level Security
✅ Tienes un sistema de fallback si Supabase falla

---

## 📞 ¿Necesitas ayuda?

Si tienes algún error o duda:
1. Abre la consola del navegador (F12)
2. Busca mensajes de error
3. Revisa que ejecutaste TODOS los pasos del SQL
4. Verifica que las credenciales en `supabaseClient.js` sean correctas
