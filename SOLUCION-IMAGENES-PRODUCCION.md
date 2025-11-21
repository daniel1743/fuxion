# Solución: Imágenes no cargadas en producción

## 🔍 Problema identificado

Las imágenes no se cargaban en producción en Vercel porque:

1. **`vercel.json` no tenía rutas específicas para archivos estáticos**: Todas las peticiones (incluyendo imágenes) se redirigían a `/index.html`
2. **Falta de manejo consistente de rutas**: Algunos archivos usaban rutas hardcodeadas en lugar del helper

## ✅ Soluciones implementadas

### 1. Actualización de `vercel.json`

Se agregaron rutas específicas para servir archivos estáticos antes de la regla catch-all:

```json
{
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/img/(.*)",
      "dest": "/img/$1",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*\\.(jpg|jpeg|png|gif|svg|webp|ico|pdf))",
      "dest": "/$1",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Orden importante**: Las rutas más específicas deben ir ANTES de la regla catch-all.

### 2. Mejora del helper `imageUtils.js`

Se mejoró la función `getImageUrl` para:
- Validar entradas
- Manejar correctamente `BASE_URL` si existe
- Agregar logs en desarrollo para debugging
- Devolver placeholders si la ruta es inválida

### 3. Actualización de componentes

Se actualizaron todos los componentes para usar el helper `getImageUrl` y `getPlaceholderImage`:

- ✅ `src/pages/HomePage.jsx` - Ya usaba el helper correctamente
- ✅ `src/pages/ExplorePage.jsx` - Actualizado para usar `getImageUrl`
- ✅ `src/components/ProductModal.jsx` - Actualizado para usar `getPlaceholderImage`

### 4. Manejo de errores mejorado

Todos los `<img>` ahora tienen:
- `loading="lazy"` para mejor rendimiento
- `onError` handler que usa `getPlaceholderImage` como fallback
- Validación para evitar loops infinitos de errores

## 📋 Checklist de verificación

- [x] Rutas específicas para `/img/` en `vercel.json`
- [x] Rutas específicas para archivos estáticos (jpg, png, etc.)
- [x] Helper `getImageUrl` mejorado y robusto
- [x] Todos los componentes usan el helper
- [x] Manejo de errores con placeholders
- [x] Headers de caché configurados
- [x] Sin errores de linting

## 🚀 Próximos pasos

1. **Hacer deploy a producción** y verificar que las imágenes cargan correctamente
2. **Verificar en consola del navegador** que no haya errores 404 para imágenes
3. **Comprobar que los placeholders** funcionan si una imagen no existe

## 🔧 Cómo verificar que funciona

1. **En desarrollo local**:
   ```bash
   npm run dev
   ```
   Abre la consola y verifica que no haya errores de imágenes.

2. **En producción**:
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña "Network"
   - Filtra por "Img"
   - Verifica que todas las imágenes respondan con status 200
   - Si alguna falla, verifica la ruta en `public/img/`

## 📝 Notas importantes

- **Las imágenes deben estar en `public/img/`**: Vite copia automáticamente los archivos de `public/` a la raíz del build
- **Usa siempre el helper**: No uses rutas hardcodeadas como `/img/productos/...`, usa `getImageUrl('/img/productos/...')`
- **Orden de rutas en vercel.json**: Las rutas más específicas DEBEN ir antes de la regla catch-all

## 🐛 Si aún no funciona

1. Verifica que las imágenes existen en `public/img/productos/`
2. Verifica la consola del navegador para ver errores 404
3. Verifica que el build incluya las imágenes: mira en `dist/img/` después de `npm run build`
4. Verifica que las rutas en `vercel.json` estén en el orden correcto

