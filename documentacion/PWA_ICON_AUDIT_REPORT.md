# PWA + Favicon Full Audit Report

**Fecha:** 7 Julio 2026  
**Auditor:** Diagnóstico automático (sin modificar archivos)  
**Estado:** ⚠️ SE ENCONTRARON PROBLEMAS CRÍTICOS

---

## 1. RESUMEN EJECUTIVO

| Componente | Estado |
|-----------|--------|
| Favicon en pestaña navegador | ❌ **DESAPARECIDO** |
| Manifest icons (PWA) | ⚠️ **ROTOS** |
| Service Worker cache | ⚠️ **DESACTUALIZADO** |
| Archivos físicos en `/public/icons/` | ✅ **EXISTEN** |
| Splash logo | ❌ **FALTANTE** |

---

## 2. DIAGNÓSTICO DETALLADO

### 2.1 Favicon en `index.html`

**Estado actual del `<head>`:**

```html
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/icons/favicon-48.png" />
<link rel="icon" type="image/png" sizes="64x64" href="/icons/favicon-64.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
<link rel="icon" type="image/x-icon" href="/icons/favicon-16.png" />
```

**Problema #1 — RUTA INCORRECTA:**
- `index.html` referencia `/icons/favicon-16.png`
- Los archivos REALES están en `public/icons/favicon-16.png`
- En producción (Vercel), la ruta correcta debería ser `/icons/favicon-16.png` **si Vercel sirve `public/` como raíz estática**
- ✅ Esto es correcto para Vercel — `public/` se sirve como raíz

**Problema #2 — FALTA `favicon.ico` EN RAÍZ:**
- No existe `public/favicon.ico`
- No existe `public/favicon-16x16.png`
- No existe `public/favicon-32x32.png`
- No existe `public/apple-touch-icon.png`
- Los navegadores buscan automáticamente `/favicon.ico` en la raíz → **404**

**Problema #3 — `type="image/x-icon"` apunta a PNG:**
```html
<link rel="icon" type="image/x-icon" href="/icons/favicon-16.png" />
```
- El `type="image/x-icon"` es para archivos `.ico`, no para `.png`
- Debería ser `type="image/png"` o apuntar a un `.ico` real

### 2.2 Manifest Icons

**`public/site.webmanifest`** — Referencia 8 iconos:

| src | sizes | type | purpose | ¿Existe físicamente? |
|-----|-------|------|---------|---------------------|
| `/icons/favicon-16.png` | 16×16 | image/png | any | ✅ Sí |
| `/icons/favicon-32.png` | 32×32 | image/png | any | ✅ Sí |
| `/icons/favicon-48.png` | 48×48 | image/png | any | ✅ Sí |
| `/icons/favicon-64.png` | 64×64 | image/png | any | ✅ Sí |
| `/icons/icon-192.png` | 192×192 | image/png | any | ✅ Sí |
| `/icons/icon-256.png` | 256×256 | image/png | any | ✅ Sí |
| `/icons/icon-512.png` | 512×512 | image/png | any | ✅ Sí |
| `/icons/icon-maskable-512.png` | 512×512 | image/png | maskable | ✅ Sí |

**`public/manifest.webmanifest`** — Misma configuración, mismo contenido.

**Problema #4 — DOS MANIFEST, UNO NO REFERENCIADO:**
- `index.html` apunta a: `<link rel="manifest" href="/site.webmanifest" />`
- `public/site.webmanifest` ✅ es el que se usa
- `public/manifest.webmanifest` ❌ **existe pero no se referencia desde ningún lado**
- Esto es confuso y puede causar problemas si alguien actualiza uno y no el otro

### 2.3 Archivos Faltantes

| Archivo | Esperado | Realidad |
|---------|----------|----------|
| `public/icons/splash-logo.png` | ✅ Debe existir | ❌ **NO EXISTE** |
| `public/favicon.ico` | Opcional pero recomendado | ❌ **NO EXISTE** |

El `splash-logo.png` es referenciado en el splash inline de `index.html`:
```html
<img src="/icons/splash-logo.png" alt="" ... />
```
Esto causará un **404** en el splash screen.

### 2.4 Service Worker

**`public/sw.js`** — Cache `fuxion-shop-v8`

APP_SHELL actual:
```javascript
const APP_SHELL = [
  '/',
  '/site.webmanifest',
  '/icons/favicon-16.png',
  '/icons/favicon-32.png',
  '/icons/favicon-48.png',
  '/icons/favicon-64.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-256.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png'
];
```

**Problema #5 — SW cachea `site.webmanifest` pero NO `manifest.webmanifest`:**
- El SW cachea `site.webmanifest` (correcto, es el que se referencia)
- Pero si alguien actualiza `manifest.webmanifest` pensando que es el activo, no tendrá efecto

**Problema #6 — No hay estrategia de "stale-while-revalidate" para iconos:**
- Los iconos se cachean con estrategia "cache-first" (típica)
- Si un icono cambia, los usuarios con SW activo verán el viejo hasta que el SW se actualice

### 2.5 Verificación de Archivos PNG

| Archivo | Tamaño real | Canal Alpha | Estado |
|---------|------------|-------------|--------|
| `favicon-16.png` | 16×16 | ✅ Sí | ✅ OK |
| `favicon-32.png` | 32×32 | ✅ Sí | ✅ OK |
| `favicon-48.png` | 48×48 | ✅ Sí | ✅ OK |
| `favicon-64.png` | 64×64 | ✅ Sí | ✅ OK |
| `apple-touch-icon.png` | 180×180 | ✅ Sí | ✅ OK |
| `icon-120.png` | 120×120 | ✅ Sí | ✅ OK |
| `icon-192.png` | 192×192 | ✅ Sí | ✅ OK |
| `icon-256.png` | 256×256 | ✅ Sí | ✅ OK |
| `icon-512.png` | 512×512 | ✅ Sí | ✅ OK |
| `icon-maskable-512.png` | 512×512 | ✅ Sí | ✅ OK |

Todos los PNG existen y tienen canal alpha. ✅

---

## 3. CAUSA RAÍZ DEL FAVICON DESAPARECIDO

### Causa Exacta: **Falta de `favicon.ico` en la raíz del sitio**

Los navegadores (Chrome, Edge, Firefox) **siempre** solicitan `/favicon.ico` automáticamente cuando:
1. No hay un `<link rel="icon">` que el navegador reconozca como favicon principal, O
2. El navegador está en modo de "nueva pestaña" o "bookmark"

**Lo que ocurrió:**
1. Antes del cambio de iconografía: existía `public/favicon.ico` (icono azul antiguo)
2. Durante el cambio: se eliminaron los archivos antiguos de la raíz (`favicon.ico`, `favicon-32x32.png`, etc.)
3. Se crearon los nuevos PNGs en `public/icons/` con rutas correctas
4. **Pero no se creó un `favicon.ico` nuevo en la raíz**
5. Los navegadores piden `/favicon.ico` → **404** → no muestran nada

### Causa Secundaria: **`type="image/x-icon"` mal aplicado**

```html
<link rel="icon" type="image/x-icon" href="/icons/favicon-16.png" />
```
- `type="image/x-icon"` es para `.ico`
- `href="/icons/favicon-16.png"` es un `.png`
- Inconsistencia MIME type vs archivo real

### Causa Terciaria: **Falta `splash-logo.png`**

```html
<img src="/icons/splash-logo.png" ... />
```
- El archivo no existe → 404 en el splash screen
- No afecta al favicon directamente, pero es otro asset roto

---

## 4. SOLUCIÓN RECOMENDADA

### Prioridad Alta (Favicon)

| # | Acción | Archivo | Detalle |
|---|--------|---------|---------|
| 1 | **Generar `favicon.ico`** | `public/favicon.ico` | Crear un .ico de 48×48 desde el icono verde actual |
| 2 | **Corregir type** | `index.html` | Cambiar `type="image/x-icon"` → `type="image/png"` en el link que apunta a favicon-16.png |
| 3 | **Agregar fallback .ico** | `index.html` | Agregar `<link rel="icon" type="image/x-icon" href="/favicon.ico" />` |

### Prioridad Media (PWA)

| # | Acción | Archivo | Detalle |
|---|--------|---------|---------|
| 4 | **Generar splash-logo.png** | `public/icons/splash-logo.png` | Crear desde el source icon |
| 5 | **Unificar manifests** | Decidir cuál usar | Eliminar `manifest.webmanifest` o referenciarlo también |
| 6 | **Bump SW cache** | `public/sw.js` | Incrementar a `v9` para forzar recarga de iconos |

### Prioridad Baja (Limpieza)

| # | Acción | Archivo | Detalle |
|---|--------|---------|---------|
| 7 | **Eliminar `manifest.webmanifest`** | `public/manifest.webmanifest` | Si no se usa, eliminarlo para evitar confusión |
| 8 | **Verificar en producción** | Vercel | Hacer deploy y verificar con DevTools |

---

## 5. VERIFICACIÓN EN CHROME DEVTOOLS

Para confirmar el diagnóstico:

1. **Abrir Chrome DevTools** → `F12`
2. **Ir a Application** → `Manifest`
   - Verificar que los iconos aparezcan con preview
   - No debe haber errores rojos
3. **Ir a Network** → filtrar por `favicon`
   - Buscar solicitudes a `/favicon.ico`
   - Si aparece con código **404**, esa es la causa raíz
4. **Ir a Application** → `Service Workers`
   - Verificar que el cache activo sea `fuxion-shop-v8`
   - Hacer "Unregister" si es necesario para pruebas

---

## 6. CONCLUSIÓN

| Problema | Impacto | Severidad |
|----------|---------|-----------|
| Falta `favicon.ico` en raíz | ❌ Favicon no se muestra | 🔴 **ALTA** |
| `type="image/x-icon"` apunta a PNG | ⚠️ Inconsistencia MIME | 🟡 **MEDIA** |
| Falta `splash-logo.png` | ⚠️ 404 en splash screen | 🟡 **MEDIA** |
| Dos manifests sin sincronizar | ⚠️ Confusión futura | 🟢 **BAJA** |
| PNGs con alpha channel | ✅ Correcto | — |
| Rutas `/icons/` existen | ✅ Correcto | — |

**Causa raíz principal:** Los archivos antiguos (`favicon.ico`, `favicon-32x32.png`, etc.) fueron eliminados de la raíz de `public/` durante el cambio de iconografía, y no se generó un nuevo `favicon.ico` en su lugar. Los navegadores solicitan `/favicon.ico` automáticamente y reciben un 404.

---

*Auditoría generada el 7 Julio 2026 — Modo solo diagnóstico, sin modificar archivos.*
