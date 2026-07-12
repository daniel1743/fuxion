# PWA Instalable — Auditoría y Correcciones

## Resumen

Se auditaron todos los requisitos para que **Tienda FuXion** sea una PWA instalable real en Chrome Android y otros navegadores compatibles.

---

## ✅ Manifest (site.webmanifest + manifest.json)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| `name: "Tienda FuXion"` | ✅ | Correcto |
| `short_name: "FuXion"` | ✅ | Correcto |
| `display: "standalone"` | ✅ | Correcto |
| `start_url` | ✅ | `/?source=pwa` |
| `scope: "/"` | ✅ | Correcto |
| `theme_color` | ✅ | `#00C878` |
| `background_color` | ✅ | `#ffffff` |
| Icono 192x192 | ✅ | `android-chrome-192x192.png` (44 KB) |
| Icono 512x512 | ✅ | `android-chrome-512x512.png` (133.7 KB) |
| `purpose: "any maskable"` | ✅ | Ambos iconos |
| `manifest.json` | ✅ **NUEVO** | Creado para compatibilidad con navegadores que buscan este nombre |

## ✅ Service Worker (sw.js)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Instalación | ✅ | `install` event con precarga de APP_SHELL |
| Activación | ✅ | `activate` event con limpieza de caches viejos |
| Control de página | ✅ | `clients.claim()` |
| Estrategia fetch | ✅ | Cache-first con fallback a network + offline |
| Offline response | ✅ | Página offline con mensaje "Sin conexión" |
| `manifest.json` en APP_SHELL | ✅ **CORREGIDO** | Se agregó al precache |

## ✅ Instalación (beforeinstallprompt)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Hook `usePwaInstall` | ✅ | Escucha `beforeinstallprompt` y `appinstalled` |
| Componente `PwaInstallPrompt` | ✅ | Banner con botón "Instalar app" |
| Integrado en Layout | ✅ | Renderizado globalmente |
| Botón "Instalar app" | ✅ | Texto: "Instalar app" |
| Manejo iOS | ✅ | Instrucciones para Safari |

## ✅ Registro Service Worker

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Registro en producción | ✅ | `main.jsx` — solo en PROD |
| Cache name consistente | ✅ **CORREGIDO** | `main.jsx` ahora limpia caches con prefijo `fuxion-v` (coincide con `fuxion-v2-brand-refresh`) |

## ✅ Vercel (producción)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Header `sw.js` | ✅ | `Service-Worker-Allowed: /` |
| Header `site.webmanifest` | ✅ | `Content-Type: application/manifest+json` |
| Header `manifest.json` | ✅ **NUEVO** | Mismo header que site.webmanifest |

## ✅ index.html

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| `<link rel="manifest">` | ✅ | `/site.webmanifest` y `/manifest.json` |
| `<meta name="theme-color">` | ✅ | `#00C878` |
| `<meta name="mobile-web-app-capable">` | ✅ | `yes` |
| `<meta name="apple-mobile-web-app-capable">` | ✅ | `yes` |
| `<link rel="apple-touch-icon">` | ✅ | Icono 180x180 |

---

## Cambios Realizados

### 1. `public/manifest.json` — **CREADO**
Archivo duplicado de `site.webmanifest` para navegadores que buscan específicamente `manifest.json`.

### 2. `index.html` — **MODIFICADO**
Se agregó segundo `<link rel="manifest" href="/manifest.json" />` para máxima compatibilidad.

### 3. `vercel.json` — **MODIFICADO**
Se agregó header para `/manifest.json` con `Content-Type: application/manifest+json`.

### 4. `public/sw.js` — **MODIFICADO**
Se agregó `/manifest.json` al `APP_SHELL` para que esté disponible offline.

### 5. `src/main.jsx` — **MODIFICADO**
Se corrigió el filtro de limpieza de caches en desarrollo de `fuxion-shop-` a `fuxion-v` para que coincida con el cache name real `fuxion-v2-brand-refresh`.

---

## Próximos Pasos (Post-Deploy)

1. **Hacer deploy** a Vercel
2. **Verificar en Chrome DevTools** → Application → Manifest (sin warnings)
3. **Verificar en Chrome DevTools** → Application → Service Workers (activated)
4. **En Android Chrome**: Debe mostrar "Instalar aplicación" en el menú (no solo "Agregar acceso directo")
5. Si no aparece el prompt automático, el botón flotante "Instalar app" aparecerá a los 9 segundos
