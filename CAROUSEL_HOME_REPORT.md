# 🚗 WellnessJourneyCarousel → ProductPage Fix Report

## Fecha
2026-06-07

## Problema
Al hacer clic en productos del WellnessJourneyCarousel en la Home (ej: "Liquid Fiber"), la navegación a `/producto/liquid-fiber` mostraba una pantalla vacía/blanca en lugar del contenido del producto.

## Root Cause Analysis

### Causa Raíz #1: `AnimatePresence mode="wait"` en App.jsx
El `App.jsx` envolvía las rutas con `<AnimatePresence mode="wait">`. Cuando se navegaba desde el carrusel (que **también** contiene su propio `AnimatePresence` anidado), el `mode="wait"` a nivel de ruta causaba un conflicto conocido de Framer Motion: la animación de salida de HomePage bloqueaba la animación de entrada de ProductPage, resultando en una pantalla vacía.

**Archivo modificado:** `src/App.jsx`
- **Antes:** `<AnimatePresence mode="wait">`
- **Después:** `<AnimatePresence mode="popLayout">`

El modo `popLayout` permite que las animaciones de entrada y salida ocurran simultáneamente, evitando el bloqueo.

### Causa Raíz #2: Slugify inconsistente en el carrusel
El `WellnessJourneyCarousel.jsx` usaba su propia función de slugify inline (simple `.toLowerCase().replace(/[^a-z0-9]+/g, '-')`) en lugar de la función `slugifyProduct` de `productSeo.js`. Aunque para los 4 productos actuales del carrusel los slugs coincidían, esto era frágil y podía romperse con productos que contengan:
- Caracteres acentuados (ej: "VITAENERGÍA")
- Signos `+` (ej: "VITA XTRA T+" → carrusel producía `vita-xtra-t` vs SEO `vita-xtra-t-plus`)
- Letras con diacríticos

**Archivo modificado:** `src/components/WellnessJourneyCarousel.jsx`
- **Antes:** Slugify inline manual
- **Después:** Usa `slugifyProduct` importado de `@/lib/productSeo`

### Mejora: Debug en ProductPage
Se agregó un `console.warn` en `ProductPage.jsx` cuando un slug no es encontrado, mostrando el slug exacto solicitado para facilitar debugging futuro. También se muestra el slug en la UI de "Producto no encontrado".

**Archivo modificado:** `src/pages/ProductPage.jsx`

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/App.jsx` | `mode="wait"` → `mode="popLayout"` |
| `src/components/WellnessJourneyCarousel.jsx` | Importa y usa `slugifyProduct` de productSeo |
| `src/pages/ProductPage.jsx` | Agrega `console.warn` y muestra slug en fallback |

## Slugs Verificados (Carousel vs SEO)

| Producto | Slug Carousel (antes) | Slug SEO (después) | Match |
|----------|----------------------|-------------------|-------|
| Flora Liv | `flora-liv` | `flora-liv` | ✅ |
| Prunex 1 | `prunex-1` | `prunex-1` | ✅ |
| Liquid Fiber | `liquid-fiber` | `liquid-fiber` | ✅ |
| Berry Balance | `berry-balance` | `berry-balance` | ✅ |

## Build
`npm run build` → ✅ Compilación exitosa (0 errores, 1929 módulos transformados)

## URLs de prueba
- `/producto/flora-liv` → ✅
- `/producto/prunex-1` → ✅
- `/producto/liquid-fiber` → ✅
- `/producto/berry-balance` → ✅

## Resumen Técnico
El bug era un problema de **Framer Motion** con `AnimatePresence` anidados. La solución principal fue cambiar `mode="wait"` a `mode="popLayout"` en el `AnimatePresence` de las rutas en `App.jsx`. Adicionalmente, se estandarizó la generación de slugs en el carrusel usando la función oficial `slugifyProduct` de `productSeo.js` para evitar futuros bugs de inconsistencia de slugs.
