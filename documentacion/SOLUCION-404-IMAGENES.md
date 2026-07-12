# Solución: Errores 404 en imágenes de productos

## 🔍 Problema identificado

Las imágenes no se cargan en producción (404) por dos razones principales:

1. **Discrepancia entre nombres normalizados y archivos reales**:
   - El archivo se llama `vitaenergía.png` (con tilde)
   - La función normalizaba a `vitaenergia.png` (sin tilde)
   - Resultado: 404 porque el archivo no existe

2. **Caracteres especiales en nombres de archivos**:
   - Archivos con `+` como `vita-xtra-t+.png`, `vera+.png`, `gano+-cappuccino.png`
   - Estos caracteres pueden causar problemas en URLs si no se manejan correctamente

3. **Archivos no copiados al build**:
   - Vite debería copiar automáticamente `public/` al build
   - Pero puede haber problemas si los archivos no existen o tienen nombres incorrectos

## ✅ Soluciones implementadas

### 1. Mapeo explícito de productos a archivos

Se creó un mapeo en `src/lib/imageUtils.js` que mapea nombres de productos a nombres de archivos reales:

```javascript
const PRODUCT_IMAGE_MAP = {
  'PRUNEX 1': 'prunex-1.png',
  'VITAENERGÍA': 'vitaenergía.png', // Con tilde
  'VITAENERGIA': 'vitaenergía.png', // Sin tilde también funciona
  'THERMO T3': 'thermo-t3.jpg',
  'VITA XTRA T+': 'vita-xtra-t+.png',
  // ... más productos
};
```

### 2. Función `getProductImageUrl` mejorada

Ahora usa el mapeo primero antes de intentar normalizar:

```javascript
export const getProductImageUrl = (productName) => {
  // 1. Buscar en el mapeo primero
  const mappedFile = PRODUCT_IMAGE_MAP[productName.toUpperCase()];
  if (mappedFile) {
    return getImageUrl(`/img/productos/${mappedFile}`);
  }
  
  // 2. Si no está en el mapeo, normalizar
  const normalized = normalizeProductName(productName);
  return getImageUrl(`/img/productos/${normalized}.png`);
};
```

### 3. Actualización de `ExplorePage.jsx`

La función `getImagePath` ahora usa `getProductImageUrl` que maneja el mapeo:

```javascript
const getImagePath = (productKey) => {
  return getProductImageUrl(productKey);
};
```

## 📋 Verificación de archivos

Asegúrate de que estos archivos existan en `public/img/productos/`:

- ✅ `prunex-1.png`
- ✅ `thermo-t3.jpg` (o `.png`)
- ✅ `vita-xtra-t+.png`
- ✅ `vitaenergía.png` (con tilde)
- ✅ `bioprotein-active.png`
- ✅ `nutraday.png`
- ✅ `vera+.png`
- ✅ `gano+-cappuccino.png`
- ✅ `biopro+-fit.png`
- ✅ `nocarb-t.png`
- ✅ `protein-active-fit.png`

## 🚀 Próximos pasos

1. **Verificar que los archivos existen**:
   ```bash
   ls -la public/img/productos/
   ```

2. **Hacer build local y verificar**:
   ```bash
   npm run build
   ls -la dist/img/productos/
   ```
   Todos los archivos deberían estar en `dist/img/productos/`

3. **Si faltan archivos en el build**:
   - Verifica que estén en `public/img/productos/`
   - Verifica que no estén en `.gitignore`
   - Verifica que Vite los esté copiando (revisa la consola del build)

4. **Deploy a Vercel**:
   - Los archivos de `public/` se copian automáticamente
   - Verifica en la consola del navegador que las URLs sean correctas
   - Si aún hay 404, verifica que `vercel.json` tenga las rutas correctas

## 🔧 Debugging

Si aún hay problemas:

1. **Abre la consola del navegador** y verifica:
   - ¿Qué URL está intentando cargar?
   - ¿El archivo existe con ese nombre exacto?

2. **Verifica el mapeo**:
   - ¿El nombre del producto en la base de datos coincide con el mapeo?
   - ¿El nombre del archivo en `public/` coincide con el mapeo?

3. **Verifica encoding**:
   - Los archivos con `+` deberían funcionar sin encoding
   - Si hay problemas, prueba renombrar los archivos sin `+`

## 📝 Notas importantes

- **Los archivos con tildes** deben mapearse explícitamente
- **Los archivos con `+`** funcionan sin encoding especial
- **El mapeo tiene prioridad** sobre la normalización
- **Siempre verifica** que el nombre en el mapeo coincida exactamente con el archivo real

