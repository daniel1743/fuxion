# 🚀 PASOS SIMPLES PARA CONFIGURAR SUPABASE

## ⚠️ IMPORTANTE: NO uses el sistema de autenticación de Supabase

Este sistema usa una **tabla personalizada** que NO depende del sistema de autenticación por email de Supabase.

---

## 📋 SOLO 3 PASOS PARA CONFIGURAR

### PASO 1️⃣: Ir a Supabase

1. Abre tu navegador
2. Ve a: **https://app.supabase.com**
3. Inicia sesión con tu cuenta
4. Selecciona tu proyecto

---

### PASO 2️⃣: Abrir SQL Editor

1. En el menú de la izquierda, busca el ícono **📊** que dice **"SQL Editor"**
2. Haz clic en **"SQL Editor"**
3. Haz clic en el botón verde **"+ New query"** (arriba a la derecha)

---

### PASO 3️⃣: Copiar y pegar el código SQL

1. **Abre el archivo**: `SQL_SIMPLE_PARA_SUPABASE.sql` (está en la carpeta de tu proyecto)

2. **Selecciona TODO** el contenido del archivo (Ctrl + A)

3. **Copia** todo (Ctrl + C)

4. **Pega** en el editor de Supabase (Ctrl + V)

5. Haz clic en el botón **"Run"** (▶️) abajo a la derecha

6. Espera unos segundos

7. Deberías ver un mensaje que dice:
   ```
   Success. No rows returned
   ```

---

## ✅ VERIFICAR QUE FUNCIONÓ

### Verificación 1: Ver la tabla

1. En el menú izquierdo, haz clic en **"Table Editor"** (📋 ícono de tabla)
2. Busca la tabla llamada **"admins"**
3. Haz clic en ella
4. Deberías ver **1 fila** con:
   - **username**: `admin`
   - **email**: `admin@fuxionshop.com`
   - **password_hash**: Un texto largo encriptado (como `$2a$06$...`)

Si ves esto: **✅ ¡FUNCIONA!**

---

### Verificación 2: Probar la función

1. Vuelve al **SQL Editor**
2. Haz clic en **"+ New query"**
3. Copia y pega esto:

```sql
SELECT verify_admin_password('admin', 'FuxionAdmin2025!') AS resultado;
```

4. Haz clic en **"Run"** ▶️
5. Deberías ver en los resultados:
   ```
   resultado: true
   ```

Si ves `true`: **✅ ¡FUNCIONA!**

---

### Verificación 3: Probar con contraseña incorrecta

1. En el **SQL Editor**, ejecuta esto:

```sql
SELECT verify_admin_password('admin', 'contraseña_incorrecta') AS resultado;
```

2. Deberías ver:
   ```
   resultado: false
   ```

Si ves `false`: **✅ ¡FUNCIONA!**

---

### Verificación 4: Obtener datos del admin

1. En el **SQL Editor**, ejecuta esto:

```sql
SELECT * FROM get_admin_data('admin', 'FuxionAdmin2025!');
```

2. Deberías ver una tabla con:
   - **id**: 1
   - **username**: admin
   - **email**: admin@fuxionshop.com
   - **nombre_completo**: Administrador Fuxion Shop

Si ves estos datos: **✅ ¡FUNCIONA PERFECTO!**

---

## 🌐 PROBAR EN TU APLICACIÓN

1. Abre tu navegador
2. Ve a: **http://localhost:3001**
3. **Abre la consola del navegador** (presiona F12)
4. Haz clic en el ícono de **escudo** 🛡️ en el header de tu sitio
5. Ingresa:
   - **Usuario**: `admin`
   - **Contraseña**: `FuxionAdmin2025!`
6. Haz clic en **"Iniciar Sesión"**

---

## 📊 QUÉ VERÁS EN LA CONSOLA

Si **Supabase está configurado correctamente**:
```
🔍 Intentando autenticación con Supabase...
✅ Autenticación con Supabase exitosa
👤 Usuario: admin
📧 Email: admin@fuxionshop.com
```

Si **Supabase NO está configurado aún**:
```
🔍 Intentando autenticación con Supabase...
⚠️ Error de Supabase: ...
📝 Usando autenticación local como fallback
✅ Autenticación local exitosa
```

---

## 🆘 SI ALGO SALE MAL

### Error: "function verify_admin_password does not exist"

**Solución**:
1. Ve al **SQL Editor**
2. Ejecuta de nuevo el código de `SQL_SIMPLE_PARA_SUPABASE.sql`
3. Espera el mensaje "Success"

---

### Error: "relation admins does not exist"

**Solución**:
1. Ve al **SQL Editor**
2. Ejecuta de nuevo el código completo de `SQL_SIMPLE_PARA_SUPABASE.sql`

---

### Aparece "using @ to sign in"

**Esto es NORMAL y puedes ignorarlo**. Supabase detecta que no estás usando su sistema de autenticación por email, pero no importa porque estamos usando nuestra propia tabla.

---

### El login funciona pero dice "usando autenticación local"

**Causa**: Supabase no está configurado o hay un error en las funciones

**Solución**:
1. Verifica que ejecutaste TODO el código SQL
2. Ve a **SQL Editor** y ejecuta:
   ```sql
   SELECT verify_admin_password('admin', 'FuxionAdmin2025!');
   ```
3. Si da error, ejecuta de nuevo todo el código SQL

---

## ➕ AGREGAR MÁS ADMINISTRADORES

Si quieres crear otro usuario administrador:

1. Ve al **SQL Editor**
2. Ejecuta esto (cambia los valores):

```sql
INSERT INTO public.admins (username, password_hash, email, nombre_completo)
VALUES (
  'nombre_del_nuevo_admin',                      -- Cambia esto
  crypt('ContraseñaSegura123!', gen_salt('bf')), -- Cambia esto
  'nuevo@fuxionshop.com',                        -- Cambia esto
  'Nombre Completo del Admin'                    -- Cambia esto
);
```

3. Haz clic en **"Run"** ▶️

---

## 🎯 RESUMEN

### Lo que debes hacer:
1. ✅ Ir a https://app.supabase.com
2. ✅ Abrir SQL Editor
3. ✅ Copiar y pegar `SQL_SIMPLE_PARA_SUPABASE.sql`
4. ✅ Hacer clic en "Run"
5. ✅ Verificar en Table Editor que existe la tabla "admins"
6. ✅ Probar login en tu aplicación

### Archivos importantes:
- **`SQL_SIMPLE_PARA_SUPABASE.sql`** ← El que debes copiar en Supabase
- **Este archivo** ← Las instrucciones paso a paso

---

## 🎉 ¡Listo!

Una vez hayas ejecutado el SQL, tu sistema de administrador estará completamente funcional con Supabase.

¿Necesitas ayuda con algún paso? Revisa la sección **"SI ALGO SALE MAL"** arriba.
