# 🔧 VARIABLES DE ENTORNO PARA PRODUCCIÓN

## 📋 TODAS LAS VARIABLES QUE NECESITAS

Cuando despliegues a producción (Vercel, Netlify, etc.), necesitas configurar estas variables de entorno:

---

## 🗂️ LISTA COMPLETA DE VARIABLES

### 1. Supabase (Base de datos y autenticación)
```env
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui
```

**Dónde obtenerlas:**
- Ve a: https://app.supabase.com
- Selecciona tu proyecto
- Settings → API
- Copia "Project URL" y "anon public" key

### 2. DeepSeek (IA principal - Asesor, Soporte, Bots del foro)
```env
VITE_DEEPSEEK_API_KEY=tu_api_key_de_deepseek_aqui
```

**Dónde obtenerla:**
- Ve a: https://platform.deepseek.com
- Dashboard → API Keys
- Create new key o copia existente

### 3. Qwen (IA fallback secundaria)
```env
VITE_QWEN_API_KEY=tu_api_key_de_qwen_aqui
```

**Dónde obtenerla:**
- Ve a: https://dashscope.aliyun.com
- API-KEY Management
- Create API Key

### 4. Gemini (IA fallback terciaria)
```env
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

**Dónde obtenerla:**
- Ve a: https://aistudio.google.com/apikey
- Create API Key

---

## 🎯 PARA QUÉ SIRVE CADA VARIABLE

### VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
**Uso**: Sistema de administrador con base de datos

**Si NO las configuras**:
- ⚠️ El admin funciona con autenticación local (hardcoded)
- ⚠️ Solo 1 administrador predefinido
- ⚠️ No puedes agregar más administradores

**Si SÍ las configuras**:
- ✅ Sistema completo de autenticación con Supabase
- ✅ Contraseñas encriptadas en base de datos
- ✅ Puedes agregar múltiples administradores
- ✅ Más seguro

---

### VITE_DEEPSEEK_API_KEY
**Uso**: IA principal para:
- 🤖 Asesor Premium (chat de productos)
- 💬 Soporte (respuestas a preguntas)
- 👥 Bots del foro (generan preguntas/respuestas automáticas)

**Si NO la configuras**:
- ❌ El asesor premium NO funciona
- ❌ Los bots del foro NO funcionan
- ❌ Las respuestas automáticas NO se generan

**Si SÍ la configuras**:
- ✅ Asesor premium funciona
- ✅ Bots del foro generan contenido cada 45 min
- ✅ Respuestas inteligentes

---

### VITE_QWEN_API_KEY (Fallback)
**Uso**: IA secundaria si DeepSeek falla

**Sistema de fallback**:
1. Intenta DeepSeek primero
2. Si falla → Usa Qwen
3. Si falla → Usa Gemini

**Opcional pero recomendado** para mayor confiabilidad

---

### VITE_GEMINI_API_KEY (Fallback)
**Uso**: IA terciaria si DeepSeek y Qwen fallan

**Opcional pero recomendado** para máxima confiabilidad

---

## 🚀 CÓMO AGREGAR EN VERCEL

### Paso 1: Ir a tu proyecto en Vercel
```
1. Ve a: https://vercel.com
2. Selecciona tu proyecto
3. Ve a "Settings"
4. Click en "Environment Variables" (menú izquierdo)
```

### Paso 2: Agregar cada variable
```
Para cada variable:
1. Click en "Add New"
2. Key: Nombre de la variable (ejemplo: VITE_SUPABASE_URL)
3. Value: Valor de tu variable
4. Environment: Selecciona "Production, Preview, Development"
5. Click en "Save"
```

### Paso 3: Agregar TODAS estas variables

**Mínimo requerido (para que funcione todo):**
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_DEEPSEEK_API_KEY
```

**Recomendado (con fallbacks):**
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_DEEPSEEK_API_KEY
VITE_QWEN_API_KEY
VITE_GEMINI_API_KEY
```

### Paso 4: Redeploy
```
1. Ve a "Deployments"
2. Click en los 3 puntos (...) del último deployment
3. Click en "Redeploy"
4. Espera que termine
```

---

## 🔧 CÓMO AGREGAR EN NETLIFY

### Paso 1: Ir a tu sitio en Netlify
```
1. Ve a: https://app.netlify.com
2. Selecciona tu sitio
3. Ve a "Site configuration" → "Environment variables"
```

### Paso 2: Agregar variables
```
1. Click en "Add a variable"
2. Click en "Add a single variable"
3. Key: Nombre de la variable
4. Value: Valor de tu variable
5. Scopes: Selecciona "Same value for all deploy contexts"
6. Click en "Create variable"
```

### Paso 3: Redeploy
```
1. Ve a "Deploys"
2. Click en "Trigger deploy" → "Deploy site"
```

---

## 🔍 VERIFICAR QUE FUNCIONAN EN PRODUCCIÓN

### 1. Abrir tu sitio en producción
```
https://tu-sitio.vercel.app
```

### 2. Abrir DevTools (F12)
```
Clic derecho → Inspeccionar → Console
```

### 3. Buscar mensajes de las APIs

**Supabase:**
```
✅ "Autenticación con Supabase exitosa"
❌ "Supabase no disponible" → Variable mal configurada
```

**DeepSeek:**
```
✅ "Respuesta de DeepSeek exitosa"
❌ "Error: API key inválida" → Variable mal configurada
```

**Bots del foro:**
```
✅ "🚀 Sistema de bots del foro iniciado"
❌ Si no aparece → DeepSeek no configurado
```

---

## ❌ SOLUCIÓN DE PROBLEMAS

### Error: "environment variable is undefined"

**Causa**: La variable no está configurada en Vercel/Netlify

**Solución**:
1. Verifica que escribiste bien el nombre (VITE_SUPABASE_URL, no SUPABASE_URL)
2. Verifica que el valor no tenga espacios al inicio/final
3. Redeploy después de agregar variables

---

### Error: "Invalid API key"

**Causa**: La API key es incorrecta o expiró

**Solución**:
1. Ve al dashboard de la API correspondiente
2. Verifica tu API key
3. Si expiró, genera una nueva
4. Actualiza la variable en Vercel/Netlify
5. Redeploy

---

## 📊 PRIORIDAD DE VARIABLES

### 🔴 CRÍTICAS (sin estas, algunas funciones no funcionan):
```
VITE_DEEPSEEK_API_KEY     → Para IA (asesor, bots)
```

### 🟡 IMPORTANTES (mejoran la seguridad):
```
VITE_SUPABASE_URL         → Para admin con base de datos
VITE_SUPABASE_ANON_KEY    → Para admin con base de datos
```

### 🟢 OPCIONALES (fallback):
```
VITE_QWEN_API_KEY         → Si DeepSeek falla
VITE_GEMINI_API_KEY       → Si DeepSeek y Qwen fallan
```

---

## ✅ CHECKLIST DE DESPLIEGUE

Antes de desplegar a producción, verifica:

- [ ] Tienes todas las API keys necesarias
- [ ] Agregaste VITE_SUPABASE_URL
- [ ] Agregaste VITE_SUPABASE_ANON_KEY
- [ ] Agregaste VITE_DEEPSEEK_API_KEY
- [ ] (Opcional) Agregaste VITE_QWEN_API_KEY
- [ ] (Opcional) Agregaste VITE_GEMINI_API_KEY
- [ ] Hiciste redeploy después de agregar variables
- [ ] Probaste el admin en producción
- [ ] Probaste el asesor premium en producción
- [ ] Verificaste los bots del foro (consola F12)

---

## ⚠️ SEGURIDAD

**NUNCA:**
- ❌ Subas archivos con API keys reales a GitHub
- ❌ Compartas tus API keys públicamente
- ❌ Pongas API keys en el código fuente

**SIEMPRE:**
- ✅ Usa variables de entorno
- ✅ Agrega archivos sensibles al .gitignore
- ✅ Usa .env.example con placeholders
- ✅ Configura variables en Vercel/Netlify manualmente

---

¿Necesitas ayuda configurando las variables en alguna plataforma específica? 🚀
