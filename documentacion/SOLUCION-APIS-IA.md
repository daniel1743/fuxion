# 🔧 Solución Completa: APIs de IA con Backend Serverless

## 📋 Resumen del Problema

Tu chatbot FalconBot tenía **3 problemas críticos**:

1. ❌ **Error CORS en DeepSeek** - No puedes llamar APIs de IA desde el navegador
2. ❌ **API Key inválida en Qwen** - Código 401 Unauthorized
3. ❌ **Modelo incorrecto en Gemini** - Modelo no existe en v1beta (404)

### 🎯 Causa Raíz

Estabas llamando las APIs de IA **directamente desde el frontend** (navegador), lo cual:
- ✗ Genera errores de CORS
- ✗ Expone tus API keys en el código (INSEGURO)
- ✗ Permite que cualquiera robe tus API keys

---

## ✅ Solución Implementada

Se ha implementado una **arquitectura correcta** usando **Vercel Serverless Functions**:

```
ANTES (❌ Incorrecto):
Usuario → Frontend (React) → DeepSeek API directa → Error CORS

DESPUÉS (✅ Correcto):
Usuario → Frontend (React) → Backend (Vercel Function) → DeepSeek API → ✓ Funciona
```

---

## 📁 Archivos Creados/Modificados

### 1. **`api/chat.js`** (NUEVO)
Función serverless que se ejecuta en el **backend de Vercel**:
- ✅ Maneja las llamadas a las 3 APIs de IA
- ✅ Sistema de fallback automático: DeepSeek → Qwen → Gemini
- ✅ API keys seguras (variables de entorno)
- ✅ Sin problemas de CORS

### 2. **`src/services/deepseekService.js`** (MODIFICADO)
Servicio del frontend actualizado:
- ✅ Ahora llama al backend (`/api/chat`) en lugar de las APIs directamente
- ✅ Mantiene toda la lógica de contexto y prompts de Fuxion
- ✅ Sistema de fallback transparente

### 3. **`.env.example`** (ACTUALIZADO)
Variables de entorno actualizadas:
- ✅ Eliminado prefijo `VITE_` de las API keys (solo para backend)
- ✅ Documentación clara de dónde obtener cada API key

---

## 🚀 Pasos para Configurar y Desplegar

### Paso 1: Obtener las API Keys

Necesitas **AL MENOS UNA** de estas API keys (el sistema usa fallback automático):

#### Opción 1: DeepSeek (Recomendada) ⭐
1. Ve a https://platform.deepseek.com/
2. Regístrate/Inicia sesión
3. Ve a "API Keys"
4. Crea una nueva API key
5. Cópiala (ejemplo: `sk-xxxxxxxxxxxx`)

#### Opción 2: Qwen (Alibaba Cloud)
1. Ve a https://dashscope.console.aliyun.com/
2. Regístrate/Inicia sesión
3. Ve a "API-KEY Management"
4. Crea una nueva API key
5. Cópiala

#### Opción 3: Google Gemini
1. Ve a https://aistudio.google.com/apikey
2. Regístrate/Inicia sesión con tu cuenta de Google
3. Click en "Create API Key"
4. Cópiala (ejemplo: `AIzaxxxxxxxxxxxxxxx`)

---

### Paso 2: Configurar Variables de Entorno en Vercel

**⚠️ IMPORTANTE:** Las API keys **SOLO** van en Vercel, NO en tu código local.

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Click en tu proyecto ("de-daniel-falcon" o similar)
3. Click en **Settings** (arriba derecha)
4. En el menú izquierdo, click en **Environment Variables**
5. Agrega las siguientes variables:

```
DEEPSEEK_API_KEY = tu_api_key_real_aqui
QWEN_API_KEY = tu_api_key_real_aqui (opcional)
GEMINI_API_KEY = tu_api_key_real_aqui (opcional)
```

**Para cada variable:**
- **Key (Name)**: Nombre exacto (ej: `DEEPSEEK_API_KEY`)
- **Value**: Tu API key real (ej: `sk-xxxxxxxxxx`)
- **Environment**: Selecciona **Production**, **Preview**, y **Development** (las 3)
- Click en **Add**

6. Click en **Save** cuando termines

---

### Paso 3: Desplegar a Vercel

#### Opción A: Desde GitHub (Recomendada)

1. Asegúrate de que tu código esté en GitHub
2. Haz commit de los cambios:
   ```bash
   cd "C:\Users\Lenovo\Desktop\proyectos desplegados importante\de daniel falcon"
   git add api/chat.js src/services/deepseekService.js .env.example
   git commit -m "Fix: Implementar backend serverless para APIs de IA

   - Crear función serverless api/chat.js
   - Actualizar deepseekService.js para usar backend
   - Solucionar errores CORS y API keys expuestas"
   git push
   ```

3. Vercel automáticamente detectará los cambios y desplegará
4. Espera 1-2 minutos
5. Abre tu sitio y prueba el chatbot

#### Opción B: Deployment Manual

1. Instala Vercel CLI (si no lo tienes):
   ```bash
   npm install -g vercel
   ```

2. Despliega:
   ```bash
   cd "C:\Users\Lenovo\Desktop\proyectos desplegados importante\de daniel falcon"
   vercel --prod
   ```

3. Sigue las instrucciones en pantalla

---

### Paso 4: Verificar que Funciona

1. Abre tu sitio desplegado
2. Abre el chatbot FalconBot
3. Envía un mensaje
4. Abre F12 → Console
5. Deberías ver:
   ```
   🔄 Enviando mensaje al backend...
   ✅ Respuesta recibida del backend (API usada: DeepSeek)
   ```

6. **NO deberías ver** errores de CORS ni API keys expuestas

---

## 🔧 Troubleshooting

### Error: "Todas las APIs fallaron"

**Causa:** Las API keys no están configuradas correctamente en Vercel.

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que las variables estén correctamente escritas:
   - `DEEPSEEK_API_KEY` (sin prefijo VITE_)
   - `QWEN_API_KEY`
   - `GEMINI_API_KEY`
3. Verifica que los valores sean las API keys reales
4. Re-despliega el proyecto

### Error: "404 Not Found" en `/api/chat`

**Causa:** La función serverless no se desplegó correctamente.

**Solución:**
1. Verifica que el archivo `api/chat.js` existe en tu proyecto
2. Haz commit y push de los cambios
3. Espera a que Vercel re-despliegue
4. Verifica en Vercel → Functions que aparece `/api/chat`

### Error: "Qwen Error 401" o "Gemini Error 404"

**Causa:** API keys incorrectas o expiradas.

**Solución para Qwen:**
1. Verifica que la API key sea correcta
2. Asegúrate de tener créditos en tu cuenta de Alibaba Cloud
3. Si la clave es correcta, Qwen hará fallback a Gemini automáticamente

**Solución para Gemini:**
1. Ve a https://aistudio.google.com/apikey
2. Genera una NUEVA API key
3. Actualiza la variable `GEMINI_API_KEY` en Vercel
4. Re-despliega

### Aún veo errores de CORS

**Causa:** Estás usando la versión vieja del código.

**Solución:**
1. Haz hard refresh: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)
2. Si persiste, limpia el caché del navegador
3. Verifica en el código que `deepseekService.js` use `BACKEND_API_URL`

---

## 📊 Cómo Funciona el Sistema de Fallback

El sistema intenta las APIs en este orden:

```
1. DeepSeek API
   ↓ (si falla)
2. Qwen API
   ↓ (si falla)
3. Gemini API
   ↓ (si falla)
4. Error: "Todas las APIs fallaron"
```

**Solo necesitas configurar AL MENOS UNA** para que funcione.

---

## 🔐 Seguridad

### Antes (❌ Inseguro)
```javascript
// Las API keys estaban EXPUESTAS en el código del frontend
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY; // ❌
```

Cualquiera podía:
- Ver el código fuente en el navegador
- Copiar tus API keys
- Usarlas gratis a tu costa

### Ahora (✅ Seguro)
```javascript
// Las API keys están OCULTAS en el backend
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // ✅
```

Las API keys:
- ✅ Solo existen en el servidor de Vercel
- ✅ NUNCA se envían al navegador
- ✅ Nadie puede verlas ni robarlas

---

## 📈 Beneficios de esta Solución

| Antes | Ahora |
|-------|-------|
| ❌ Errores de CORS | ✅ Sin CORS (backend maneja todo) |
| ❌ API keys expuestas | ✅ API keys seguras |
| ❌ Fallas constantes | ✅ Sistema de fallback robusto |
| ❌ Solo 1 API | ✅ 3 APIs con respaldo automático |
| ❌ Inseguro | ✅ Arquitectura profesional |

---

## 🎯 Próximos Pasos

1. ✅ **Configurar variables de entorno** en Vercel
2. ✅ **Desplegar** el código actualizado
3. ✅ **Probar** el chatbot en producción
4. ✅ **Verificar** que no hay errores en F12

---

## ❓ Preguntas Frecuentes

### ¿Necesito las 3 API keys?

No, solo necesitas **AL MENOS UNA**. El sistema hará fallback automáticamente.

### ¿Cuál API es mejor?

- **DeepSeek**: Más rápida y económica (recomendada)
- **Qwen**: Buena para español
- **Gemini**: Muy capaz pero más lenta

### ¿Qué pasa si una API falla?

El sistema automáticamente intenta la siguiente. El usuario no nota nada.

### ¿Las API keys cuestan dinero?

Cada API tiene un plan gratuito con límites. DeepSeek es la más generosa.

### ¿Puedo usar esto en desarrollo local?

Sí, pero necesitas crear un archivo `.env` local con las API keys. NO lo subas a Git.

---

## 📞 Soporte

Si tienes problemas:

1. Verifica los logs en Vercel → Deployments → Functions
2. Revisa la consola del navegador (F12)
3. Asegúrate de que las variables de entorno estén correctas

---

¡Listo! Tu chatbot ahora usa una arquitectura profesional, segura y escalable. 🎉
