# 🚀 Guía de Despliegue en Vercel - Fuxion Shop

## ✅ Proyecto Listo para Vercel

Este proyecto está completamente configurado para desplegarse en Vercel con React + Vite.

---

## 📋 Pre-requisitos

1. Cuenta en Vercel (https://vercel.com)
2. Repositorio en GitHub ya configurado: https://github.com/daniel1743/fuxion.git
3. API Key de DeepSeek (nueva, la anterior quedó expuesta)

---

## 🎯 Método 1: Despliegue Desde GitHub (RECOMENDADO)

### Paso 1: Ir a Vercel
1. Ve a https://vercel.com
2. Haz clic en **"Add New"** → **"Project"**

### Paso 2: Importar Repositorio
1. Conecta tu cuenta de GitHub
2. Busca el repositorio: **daniel1743/fuxion**
3. Haz clic en **"Import"**

### Paso 3: Configurar Variables de Entorno
En la sección **"Environment Variables"**, agrega:

```
VITE_DEEPSEEK_API_KEY=tu_nueva_api_key_aqui
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
VITE_APP_NAME=Fuxion Shop
VITE_WHATSAPP_URL=https://wa.me/message/XJNUSSLNP24CJ1
```

**⚠️ IMPORTANTE**:
- Reemplaza `tu_nueva_api_key_aqui` con tu nueva API key de DeepSeek
- Si tienes un número de WhatsApp diferente, actualiza la URL

### Paso 4: Configuración del Proyecto
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (detectado automáticamente)
- **Output Directory**: `dist` (detectado automáticamente)
- **Install Command**: `npm install` (detectado automáticamente)

### Paso 5: Deploy
1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel construye el proyecto
3. ¡Listo! Vercel te dará una URL tipo: `https://fuxion-xxx.vercel.app`

---

## 🎯 Método 2: Despliegue con Vercel CLI

### Instalación
```bash
npm install -g vercel
```

### Despliegue
```bash
cd "C:\Users\Lenovo\Desktop\proyectos desplegados importante\de daniel falcon"
vercel
```

Sigue las instrucciones en pantalla:
1. Conecta tu cuenta
2. Configura el proyecto
3. Agrega las variables de entorno cuando te lo pida

---

## 🔧 Configuración Avanzada

### Archivo vercel.json
Ya está incluido en el proyecto con:
- Redirecciones para SPA (Single Page Application)
- Configuración de rutas para React Router
- Manejo de assets estáticos

### Dominios Personalizados
Para agregar tu propio dominio:
1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio personalizado
4. Sigue las instrucciones de configuración DNS

---

## ⚠️ IMPORTANTE: Variables de Entorno

### NO OLVIDES CONFIGURAR:

1. **VITE_DEEPSEEK_API_KEY** ← ¡MUY IMPORTANTE!
   - Sin esta key, el bot de IA no funcionará
   - Usa una KEY NUEVA (la anterior quedó expuesta)
   - Consíguela en: https://platform.deepseek.com

2. **VITE_WHATSAPP_URL**
   - Tu enlace de WhatsApp para pedidos
   - Formato: `https://wa.me/message/XXXXXXXXXXX`

### Cómo Agregar Variables en Vercel:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Add New → Agrega cada variable
4. Haz clic en "Save"
5. Redeploy el proyecto para que tome efecto

---

## 🧪 Probar el Build Local

Antes de desplegar, puedes probar que el build funciona:

```bash
npm run build
npm run preview
```

Esto construirá el proyecto y lo servirá en http://localhost:3000

---

## 📊 Verificar el Despliegue

Una vez desplegado, verifica que todo funcione:

### ✅ Checklist:
- [ ] La página carga correctamente
- [ ] El bot de IA responde (prueba con "hola")
- [ ] El carrito funciona
- [ ] El botón de WhatsApp abre con el mensaje correcto
- [ ] Los productos se muestran correctamente
- [ ] El tema claro/oscuro funciona
- [ ] Las rutas funcionan (Home, Explorar, Carrito, etc.)

---

## 🔄 Actualizaciones Automáticas

Vercel detecta automáticamente cambios en GitHub:
1. Haces un `git push` a tu repositorio
2. Vercel detecta el cambio
3. Automáticamente hace rebuild y redeploy
4. En 2-3 minutos, tu sitio está actualizado

---

## 🐛 Solución de Problemas

### El bot no responde
- Verifica que `VITE_DEEPSEEK_API_KEY` esté configurada
- Revisa los logs en Vercel → Deployments → [tu deploy] → Build Logs

### WhatsApp no se abre
- Verifica que `VITE_WHATSAPP_URL` esté correcta
- Prueba el enlace directamente en el navegador

### Errores de build
- Revisa los logs de build en Vercel
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que no haya errores de TypeScript/ESLint

### Variables de entorno no funcionan
- Vercel requiere que las variables empiecen con `VITE_` para Vite
- Después de agregar/modificar variables, haz un redeploy manual
- Ve a Deployments → [...] → Redeploy

---

## 📱 Performance y Optimización

Vercel automáticamente optimiza:
- ✅ Compresión Gzip/Brotli
- ✅ CDN global
- ✅ HTTP/2 y HTTP/3
- ✅ Caché inteligente de assets
- ✅ Preload de recursos críticos

---

## 💰 Costos

- **Plan Hobby (Gratis)**:
  - Proyectos ilimitados
  - 100GB bandwidth/mes
  - Perfecto para proyectos personales

- Si necesitas más, hay planes pagos desde $20/mes

---

## 🔗 Enlaces Útiles

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentación Vercel**: https://vercel.com/docs
- **Documentación Vite**: https://vitejs.dev/guide/
- **Tu Repositorio**: https://github.com/daniel1743/fuxion

---

## ✨ Comandos Rápidos

```bash
# Build local
npm run build

# Preview local
npm run preview

# Deploy con Vercel CLI
vercel

# Deploy a producción
vercel --prod

# Ver logs en tiempo real
vercel logs [URL-del-proyecto]
```

---

## 🎉 ¡Listo!

Tu proyecto Fuxion Shop está listo para ser desplegado en Vercel.

Cualquier cambio que hagas en GitHub se desplegará automáticamente.

**URL de ejemplo**: Una vez desplegado, tendrás algo como:
`https://fuxion-daniel1743.vercel.app`

¡Éxito con tu tienda! 🚀
