# PWA BRANDING UPDATE - Reemplazar iconografía azul por nueva identidad verde

**Fecha:** 7 de Julio 2026  
**Estado:** ✅ COMPLETADO

---

## Problema Detectado

La aplicación PWA todavía usaba iconografía azul antigua en varios puntos clave:
- **Favicon** en pestaña del navegador (azul)
- **Manifest** de PWA apuntaba a iconos azules antiguos
- **Apple Touch Icon** azul antiguo
- **Service Worker** cacheados con versión anterior

Los nuevos iconos verdes ya existían en `/public/icons/` pero no estaban siendo referenciados.

---

## Archivos Modificados

### 1. `public/site.webmanifest`

**Antes:** Referenciaba iconos azules antiguos en la raíz
```json
"icons": [
  { "src": "/android-chrome-192x192.png", ... },
  { "src": "/android-chrome-512x512.png", ... },
  { "src": "/icons/icon-maskable-512.png", ... }
]
```

**Después:** Referencia los nuevos iconos verdes en `/icons/`
```json
"icons": [
  { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

### 2. `index.html`

**Antes:** Referencias a favicons y apple-touch-icon azules antiguos
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />  <!-- duplicado -->
```

**Después:** Referencias a los nuevos iconos verdes en `/icons/`
```html
<link rel="icon" type="image/x-icon" href="/icons/icono 48x48.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/icons/favicon-48.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
<!-- Se eliminó el link duplicado de apple-touch-icon -->
```

### 3. `public/sw.js`

**Cambio:** Versión de cache incrementada para forzar descarga de nuevos iconos
```javascript
const CACHE_NAME = 'fuxion-shop-v6';  // Antes: v5
```

El `APP_SHELL` ya apuntaba correctamente a `/icons/`:
```javascript
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/favicon-32.png',
  '/icons/favicon-48.png',
  '/icons/favicon-64.png',
  '/icons/apple-touch-icon.png'
];
```

### 4. `public/manifest.webmanifest`

**Sin cambios necesarios** - Ya referenciaba correctamente los iconos verdes de `/icons/`.

---

## Mapa de Iconos Asignados

| Uso | Tamaño | Archivo Antiguo (azul) | Archivo Nuevo (verde) |
|-----|--------|----------------------|----------------------|
| Favicon (ICO) | 48x48 | `/favicon.ico` | `/icons/icono 48x48.ico` |
| Favicon PNG | 32x32 | `/favicon-32x32.png` | `/icons/favicon-32.png` |
| Favicon PNG | 48x48 | `/favicon-48x48.png` | `/icons/favicon-48.png` |
| Apple Touch Icon | 180x180 | `/apple-touch-icon.png` | `/icons/apple-touch-icon.png` |
| PWA Icon | 192x192 | `/android-chrome-192x192.png` | `/icons/icon-192.png` |
| PWA Icon | 512x512 | `/android-chrome-512x512.png` | `/icons/icon-512.png` |
| PWA Maskable | 512x512 | `/icons/icon-maskable-512.png` | `/icons/icon-maskable-512.png` (sin cambio) |

---

## Archivos No Modificados

- ✅ Componentes React - sin cambios
- ✅ SEO - sin cambios
- ✅ Productos - sin cambios
- ✅ Chatbot - sin cambios
- ✅ API - sin cambios
- ✅ Diseño interno - sin cambios
- ✅ Colores de marca (theme_color: #10b981, background_color: #ffffff) - sin cambios

---

## Build

```
npm run build
✓ built in 34.65s
1932 modules transformed
0 errors
```

---

## Verificación PWA

### Chrome DevTools - Application > Manifest
- ✅ Icon 192x192: `/icons/icon-192.png` (verde)
- ✅ Icon 512x512: `/icons/icon-512.png` (verde)
- ✅ Icon maskable 512x512: `/icons/icon-maskable-512.png`
- ✅ Theme color: `#10b981` (verde)
- ✅ Background color: `#ffffff` (blanco)
- ✅ Sin errores en manifest

### Navegador
- ✅ Favicon verde en pestaña
- ✅ Apple Touch Icon verde en iOS

### Service Worker
- ✅ Cache version bump: v5 → v6 (fuerza recarga de nuevos iconos)
- ✅ Cache antiguo se elimina automáticamente en activate
