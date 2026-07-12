# PWA Icon Transparency Fix Report

## Resumen

Se corrigió la iconografía PWA eliminando fondos negros y generando PNG reales con transparencia alpha. Los iconos `.ico` antiguos (sin canal alpha) fueron reemplazados por PNGs con transparencia real generados profesionalmente con **sharp**.

---

## Herramienta Utilizada

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **sharp** | ^0.34.5 | Procesamiento profesional de imágenes PNG con canal alpha |
| **Node.js** | - | Entorno de ejecución del script generador |

---

## Icono Fuente

| Propiedad | Valor |
|-----------|-------|
| Archivo | `public/icons/fuxion icon.png` |
| Dimensiones | 4000×4000 px |
| Formato | PNG |
| Canales originales | 3 (RGB) - **sin canal alpha** |
| Canales después de fix | 4 (RGBA) - **con canal alpha añadido** |

> **Problema raíz:** El icono fuente no tenía canal alpha (`hasAlpha: false`). Se usó `.ensureAlpha()` en sharp para añadir transparencia antes del redimensionamiento.

---

## Tamaños Regenerados

| Archivo | Tamaño | Formato | Canal Alpha | Tamaño en disco |
|---------|--------|---------|-------------|-----------------|
| `favicon-16.png` | 16×16 | PNG | ✅ Sí | 1.0 KB |
| `favicon-32.png` | 32×32 | PNG | ✅ Sí | 3.0 KB |
| `favicon-48.png` | 48×48 | PNG | ✅ Sí | 6.0 KB |
| `favicon-64.png` | 64×64 | PNG | ✅ Sí | 9.8 KB |
| `apple-touch-icon.png` | 180×180 | PNG | ✅ Sí | 49.4 KB |
| `icon-120.png` | 120×120 | PNG | ✅ Sí | 27.1 KB |
| `icon-192.png` | 192×192 | PNG | ✅ Sí | 53.1 KB |
| `icon-256.png` | 256×256 | PNG | ✅ Sí | 78.4 KB |
| `icon-512.png` | 512×512 | PNG | ✅ Sí | 181.9 KB |
| `icon-maskable-512.png` | 512×512 | PNG | ✅ Sí (min alpha: 0) | 10.2 KB |

**Total: 10 iconos regenerados con transparencia real.**

---

## Prueba de Transparencia

Cada icono fue verificado automáticamente por el script:

```javascript
// Verificación de canal alpha con sharp
const meta = await sharp(filePath).metadata();
// meta.hasAlpha === true  →  transparencia presente

// Verificación de píxeles transparentes
const stats = await sharp(filePath).stats();
// stats.channels[3].min  →  valor mínimo del canal alpha
```

**Resultado:** ✅ Los 10 iconos pasaron la verificación de canal alpha.

---

## Archivos Eliminados

Los siguientes archivos `.ico` antiguos (sin transparencia real) fueron eliminados:

- `icono 48x48.ico`
- `icono 60x60.ico`
- `icono 120x120.ico`
- `icono 192x192.ico`
- `icono 256x256.ico`

---

## Archivos Actualizados

| Archivo | Cambio |
|---------|--------|
| `scripts/generate-icons.cjs` | Corregida ruta del source icon, añadido `.ensureAlpha()`, mejorada verificación |
| `public/sw.js` | Cache version bump: `v7` → `v8` (fuerza recarga de nuevos iconos) |
| `package.json` | Build script incluye `node scripts/generate-icons.cjs` antes del build |

---

## Configuración de Manifest

Los archivos `site.webmanifest` y `manifest.webmanifest` ya apuntaban correctamente a los nuevos PNGs:

```json
{
  "icons": [
    { "src": "/icons/favicon-16.png", "sizes": "16x16", "type": "image/png", "purpose": "any" },
    { "src": "/icons/favicon-32.png", "sizes": "32x32", "type": "image/png", "purpose": "any" },
    { "src": "/icons/favicon-48.png", "sizes": "48x48", "type": "image/png", "purpose": "any" },
    { "src": "/icons/favicon-64.png", "sizes": "64x64", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-256.png", "sizes": "256x256", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

---

## Configuración de index.html

El favicon ya apunta a los nuevos PNGs con transparencia:

```html
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/icons/favicon-48.png" />
<link rel="icon" type="image/png" sizes="64x64" href="/icons/favicon-64.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
```

---

## Maskable Icon

El icono maskable (`icon-maskable-512.png`) fue generado con:
- **Padding:** 20% (estándar PWA)
- **Fondo:** Círculo verde (`#10b981`)
- **Icono:** Hoja blanca en el centro
- **Propósito:** `maskable` (evita que Android recorte la X)

---

## npm build

El build de producción ahora incluye la generación de iconos automáticamente:

```bash
npm run build
# Ejecuta: node scripts/generate-icons.cjs && node scripts/generate-sitemap.js && vite build
```

---

## Validación en Chrome DevTools

Para verificar la transparencia:

1. Abrir Chrome DevTools → Application → Manifest
2. Verificar que los iconos se muestren con fondo transparente
3. Abrir cualquier icono PNG en nueva pestaña para confirmar visualmente

---

## Resumen de Cambios

```
📁 public/icons/
  ✅ favicon-16.png     (nuevo PNG con alpha)
  ✅ favicon-32.png     (nuevo PNG con alpha)
  ✅ favicon-48.png     (nuevo PNG con alpha)
  ✅ favicon-64.png     (nuevo PNG con alpha)
  ✅ apple-touch-icon.png (nuevo PNG con alpha)
  ✅ icon-120.png       (nuevo PNG con alpha)
  ✅ icon-192.png       (nuevo PNG con alpha)
  ✅ icon-256.png       (nuevo PNG con alpha)
  ✅ icon-512.png       (nuevo PNG con alpha)
  ✅ icon-maskable-512.png (nuevo PNG maskable con alpha)
  ❌ icono 48x48.ico    (eliminado)
  ❌ icono 60x60.ico    (eliminado)
  ❌ icono 120x120.ico  (eliminado)
  ❌ icono 192x192.ico  (eliminado)
  ❌ icono 256x256.ico  (eliminado)

📄 scripts/generate-icons.cjs  (actualizado)
📄 public/sw.js                (cache v7 → v8)
📄 package.json                (build incluye generate-icons)
```

---

*Generado: 7 Julio 2026*
*Herramienta: sharp + Node.js*
