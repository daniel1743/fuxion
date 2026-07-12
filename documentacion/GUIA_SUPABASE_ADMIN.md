# 🔐 Guía de Supabase para Sistema de Administrador

## 📋 ¿Qué es Supabase?

Supabase es una alternativa de código abierto a Firebase. Ofrece:
- Base de datos PostgreSQL
- Autenticación de usuarios
- Almacenamiento de archivos
- API en tiempo real
- 100% GRATIS hasta 500MB de base de datos

---

## 🚀 Paso 1: Crear cuenta en Supabase

1. Ve a: https://supabase.com
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub (recomendado) o correo electrónico
4. Crea un nuevo proyecto:
   - **Nombre del proyecto**: `fuxion-shop`
   - **Contraseña de base de datos**: Guárdala bien (la necesitarás)
   - **Región**: Elige la más cercana a tu ubicación (por ejemplo, South America - Sao Paulo)

---

## 📊 Paso 2: Crear la tabla de administradores

### 2.1. Ir al Editor SQL

1. En el panel izquierdo de Supabase, haz clic en **"SQL Editor"**
2. Haz clic en **"New query"**

### 2.2. Ejecutar este código SQL:

```sql
-- Crear tabla de administradores
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (seguridad a nivel de fila)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Política: Solo lectura para usuarios autenticados
CREATE POLICY "Los administradores pueden leer sus propios datos"
ON admins FOR SELECT
USING (auth.uid() = id);

-- Crear índice para búsquedas rápidas por username
CREATE INDEX idx_admins_username ON admins(username);

-- Insertar el primer administrador (cambia estos valores)
-- Nota: La contraseña debe estar encriptada con bcrypt en producción
INSERT INTO admins (username, password_hash, email)
VALUES (
  'admin',
  crypt('FuxionAdmin2025!', gen_salt('bf')), -- Esto encripta la contraseña
  'admin@fuxionshop.com'
);
```

### 2.3. Haz clic en **"Run"** para ejecutar

---

## 🔑 Paso 3: Obtener las credenciales de tu proyecto

1. Ve a **"Settings"** (Configuración) en el panel izquierdo
2. Haz clic en **"API"**
3. Copia estos valores:

   - **Project URL**: `https://tuproyecto.supabase.co`
   - **anon / public key**: Una clave larga que empieza con `eyJ...`

---

## 💻 Paso 4: Configurar tu proyecto React

### 4.1. Instalar Supabase en tu proyecto

Abre la terminal en tu proyecto y ejecuta:

```bash
npm install @supabase/supabase-js
```

### 4.2. Crear archivo de configuración

Crea el archivo: `src/lib/supabaseClient.js`

```javascript
import { createClient } from '@supabase/supabase-js'

// Reemplaza estos valores con los de tu proyecto
const supabaseUrl = 'https://tuproyecto.supabase.co'
const supabaseAnonKey = 'tu-clave-anon-key-aqui'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 4.3. Actualizar AdminContext.jsx

Reemplaza el archivo `src/context/AdminContext.jsx` con este código:

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe usarse dentro de AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // Verificar si ya está autenticado al cargar
  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminExpiry = localStorage.getItem('adminExpiry');

    if (adminToken && adminExpiry) {
      const expiryDate = new Date(adminExpiry);
      if (expiryDate > new Date()) {
        setIsAdmin(true);
      } else {
        // Token expirado
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminExpiry');
      }
    }
  };

  const login = async (username, password) => {
    try {
      // Consultar Supabase para verificar credenciales
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !data) {
        return {
          success: false,
          error: 'Usuario o contraseña incorrectos'
        };
      }

      // Verificar la contraseña (necesitarás usar una función de Supabase)
      const { data: passwordMatch, error: passwordError } = await supabase
        .rpc('verify_admin_password', {
          input_username: username,
          input_password: password
        });

      if (passwordError || !passwordMatch) {
        return {
          success: false,
          error: 'Usuario o contraseña incorrectos'
        };
      }

      // Autenticación exitosa
      const token = btoa(`${username}:${Date.now()}`);
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24); // Expira en 24 horas

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminExpiry', expiry.toISOString());
      setIsAdmin(true);
      setAdminData(data);
      setIsLoginModalOpen(false);

      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error al conectar con el servidor'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminExpiry');
    setIsAdmin(false);
    setAdminData(null);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const value = {
    isAdmin,
    isLoginModalOpen,
    adminData,
    login,
    logout,
    openLoginModal,
    closeLoginModal,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
```

### 4.4. Crear función de verificación de contraseña en Supabase

Vuelve al **SQL Editor** en Supabase y ejecuta:

```sql
-- Función para verificar la contraseña del administrador
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

  -- Comparar la contraseña con el hash
  RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🎯 Paso 5: Probar el sistema

1. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a tu sitio web

3. Haz clic en el ícono de escudo (🛡️) en el header

4. Inicia sesión con:
   - **Usuario**: `admin`
   - **Contraseña**: `FuxionAdmin2025!`

5. Si todo funciona:
   - Verás el botón "Admin" en verde en el header
   - Podrás eliminar comentarios en el foro
   - Tus respuestas aparecerán como "Fuxion Shop" con el badge verificado ✅

---

## 🔒 Políticas de seguridad recomendadas

### Regla 1: Row Level Security (RLS)
- **Qué es**: Protege los datos para que solo usuarios autorizados puedan acceder
- **Estado**: ✅ Ya activado con `ALTER TABLE admins ENABLE ROW LEVEL SECURITY`

### Regla 2: Solo lectura desde el cliente
- Los clientes solo pueden **leer** sus propios datos
- **NO** pueden crear, actualizar o eliminar directamente desde el navegador
- Esto previene ataques

### Regla 3: Contraseñas encriptadas
- **NUNCA** guardes contraseñas en texto plano
- Usamos `crypt()` de PostgreSQL con bcrypt
- Las contraseñas están protegidas incluso si alguien accede a la base de datos

### Regla 4: Tokens de sesión
- Los tokens se guardan en `localStorage`
- Expiran después de 24 horas
- Se invalidan al hacer logout

---

## 📝 Agregar más administradores

Ejecuta esto en el SQL Editor:

```sql
INSERT INTO admins (username, password_hash, email)
VALUES (
  'nombre_usuario',
  crypt('contraseña_segura', gen_salt('bf')),
  'correo@ejemplo.com'
);
```

---

## ⚠️ Solución de problemas comunes

### Error: "relation admins does not exist"
- **Causa**: No ejecutaste el SQL para crear la tabla
- **Solución**: Ve al Paso 2 y ejecuta el código SQL

### Error: "Invalid API key"
- **Causa**: La clave anon key es incorrecta
- **Solución**: Ve a Settings → API y copia la clave correcta

### Error: "function verify_admin_password does not exist"
- **Causa**: No creaste la función de verificación de contraseña
- **Solución**: Ve al Paso 4.4 y ejecuta el código SQL

### El login no funciona
- **Causa**: La contraseña no coincide
- **Solución**: Verifica que la contraseña sea exactamente `FuxionAdmin2025!`

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Sistema de autenticación de administrador funcional
- ✅ Base de datos segura en Supabase
- ✅ Contraseñas encriptadas
- ✅ Sesiones con expiración automática
- ✅ Interfaz completa con login/logout

---

## 📚 Recursos adicionales

- Documentación de Supabase: https://supabase.com/docs
- Tutorial de autenticación: https://supabase.com/docs/guides/auth
- Dashboard de Supabase: https://app.supabase.com
