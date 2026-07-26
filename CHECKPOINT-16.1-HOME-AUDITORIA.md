# CHECKPOINT 16.1 — Verificación Dirigida de Hallazgos

**Proyecto:** Bienestar en Claro
**Branch:** `feature/editorial-pipeline-slice-1`
**Fecha:** 2026-07-25

## Método

- Capturas Puppeteer en 8 viewports + 3 viewports en modo claro y oscuro
- Componentes reabiertos y trazados: HomePage.jsx, MobileAppShell.jsx, MobileCategoryGrid.jsx, TestimonialsSection.jsx, CookieConsentBanner.jsx, Layout.jsx, Footer.jsx, WellnessJourneyCarousel.jsx, ProductNeedSearch.jsx
- Medición de distancias y posicionamiento verificada en código

---

## TABLA RESUMEN

| ID | Clasif. anterior | Clasif. corregida | Severidad | Causa confirmada | Archivo | Línea | Cambio recomendado | Autorización |
|----|------------------|-------------------|-----------|------------------|---------|-------|-------------------|--------------|
| H1 | DEFECTO_CONFIRMADO | DEFECTO_CONFIRMADO | MEDIUM | Padding excesivo acumulado | HomePage.jsx | 800 | Reducir py-20 a py-12 | Sí, directa |
| H2 | DEFECTO_CONFIRMADO | COMPORTAMIENTO_INTENCIONAL | NO_APLICA | Banner de consentimiento de cookies | CookieConsentBanner.jsx | 129 | Ninguno | No — es regulatorio |
| H3 | DEFECTO_CONFIRMADO | COMPORTAMIENTO_INTENCIONAL | NO_APLICA | Header legítimo de MobileCategoryGrid | MobileCategoryGrid.jsx | 70 | Ninguno | No — es intencional |
| H4 | MEJORA_OPCIONAL | MEJORA_OPCIONAL | NO_APLICA | Carrusel automático sin controles manuales | HomePage.jsx | 223-230 | Opcional — requiere aprobación | Solo si se aprueba |
| H7 | DEFECTO_CONFIRMADO | DEFECTO_CONFIRMADO | LOW | Padding del Footer excesivo en desktop | Footer.jsx | 65 | Reducir md:py-14 a md:py-10 | Sí, directa |
| H8 | OK | DEUDA_TECNICA | LOW | Emerald hardcodeado en 30+ lugares | HomePage.jsx | 194-748 | Migración progresiva | Requiere aprobación |
| H10 | DEFECTO_CONFIRMADO | NO_APLICA | NO_APLICA | Badge dentro de overflow-hidden, no se corta | HomePage.jsx | 339 | Ninguno | No — no es defecto |

---

## H1 · Espacio excesivo — DEFECTO CONFIRMADO

**Severidad:** MEDIUM
**Archivo:** `src/pages/HomePage.jsx`
**Línea:** 800 (CierreEmocional) y 846 (Footer)

### Causa confirmada

El espacio blanco no está entre Testimonials y Footer (como se reportó originalmente). Las secciones intermedias son:
TrustBar → PainPoints → PromesaFuxion → Soluciones → Acompañamiento → Artículos → OportunidadFuxionBanner → AsesoríaPersonalizada → CierreEmocional → Footer

El culpable es la sección **CierreEmocional** (línea 800) cuyo padding `py-12 md:py-20` genera:
- `md:py-20` = 80px arriba + 80px abajo = 160px de padding
- Más el Footer que tiene `mt-16 sm:mt-20` (64-80px de margen)
- Más el Footer que tiene `md:py-14` (56px de padding arriba)

**Total acumulativo en desktop:** ~160px + 56px = 216px entre el último contenido y el Footer.

### Medición

| Breakpoint | Distancia estimada |
|------------|-------------------|
| 768px | ~140px |
| 1024px | ~170px |
| 1280px | ~216px |
| 1440px | ~216px |

### Corrección mínima

```jsx
// Línea 800 de HomePage.jsx
<section className="py-12 md:py-20 bg-secondary/30">
→
<section className="py-8 md:py-12 bg-secondary/30">
```

**Riesgo:** Bajo. Solo reduce espacio vacío, no afecta contenido ni layout.

---

## H2 · Popup "Mejora de Experiencia" — COMPORTAMIENTO INTENCIONAL

**Severidad:** NO_APLICA
**Archivo:** `src/components/CookieConsentBanner.jsx`
**Línea:** 129 (render)

### Propósito confirmado

Banner de consentimiento de cookies regulatorio (GDPR/Chile). Se muestra:
- Después de 800ms de retraso (línea 78)
- Solo si no hay consentimiento almacenado en localStorage (clave `fuxion_cookie_consent`)
- Una vez por sesión de consentimiento (expira en 365 días)

### Comportamiento verificado

| Acción | Resultado |
|--------|-----------|
| "Aceptar Todo" | Guarda `allAccepted = { necessary, experience, analytics }` en localStorage |
| "Configurar" | Abre modal de preferencias detalladas |
| "Rechazar todo" | Guarda solo `necessary` |
| Cerrar modal | Funciona (botón X) |
| Superponerse al contenido | Intencional — es un banner de consentimiento |
| z-index | `z-max` (9999) — correcto para modal de consentimiento |

### Clasificación

Este NO es un defecto. Es un componente regulatorio que **debe** superponerse al contenido mientras el usuario no responda. Reducir su z-index sería incorrecto.

### Deuda técnica observada

El banner se renderiza en `Layout.jsx` línea 93, fuera del `<main>`. Está en el DOM correcto. No requiere cambio.

---

## H3 · "Descubre" — COMPORTAMIENTO INTENCIONAL

**Severidad:** NO_APLICA
**Archivo:** `src/components/mobile/MobileCategoryGrid.jsx`
**Línea:** 70

### Estructura DOM confirmada

```html
<section className="px-4 pt-6">
  <div className="mb-3 flex items-center justify-between">
    <h3 className="text-lg font-bold text-gray-900">Descubre</h3>
    <button>Ver todo ></button>
  </div>
  <div className="grid grid-cols-2 gap-4">
    <!-- 4 tarjetas: Productos, Testimonios, Asesoría, Conócenos -->
  </div>
</section>
```

### Análisis

- "Descubre" es el **h3** del grid de categorías
- "Ver todo" navega a `/explorar`
- Debajo del header existe contenido real: 4 tarjetas en grid 2×2
- El WellnessJourneyCarousel que aparece después es un componente separado, renderizado en HomePage.jsx línea 355

### Clasificación

No es un residuo. Es un encabezado legítimo de un componente que sí tiene contenido. La percepción de "flotar" se debe a la proximidad visual con el siguiente carrusel.

### Recomendación

Ninguna. Si se desea separar visualmente, podría añadirse un `mt-6` al MobileCategoryGrid, pero es decisión de diseño.

---

## H4 · Indicadores del carrusel del Hero — MEJORA OPCIONAL

**Severidad:** NO_APLICA
**Archivo:** `src/pages/HomePage.jsx`
**Línea:** 223-230

### Estado de accesibilidad

| Aspecto | Estado |
|---------|--------|
| Carrusel automático | Sí (intervalo 4500ms, línea 143) |
| Controles manuales | No |
| Pausa en hover | No |
| Pausa en focus | No |
| Respetar prefers-reduced-motion | No |
| Indicadores (dots) | No |
| ARIA live region | No |
| Roles | No (no es un `<div role="region">`) |

### Necesidad real

Los dots **no son obligatorios**. Son un patrón de UX que ayuda a la descubribilidad del carrusel. No agregarlos no es un defecto funcional.

### Clasificación

**MEJORA OPCIONAL.** Añadir dots, contador o controles manuales es una decisión de producto que requiere aprobación independiente. No debe implementarse sin aprobación.

---

## H7 · Footer padding — DEFECTO CONFIRMADO

**Severidad:** LOW
**Archivo:** `src/components/Footer.jsx`
**Línea:** 65

### Medición

| Propiedad | Valor actual | Función |
|-----------|-------------|---------|
| `mt-16 sm:mt-20` | 64px / 80px | Margen superior del Footer |
| `pt-10` | 40px | Padding interior del Footer (móvil) |
| `md:py-14` | 56px | Padding interior del Footer (desktop) |
| `pb-28` | 112px | Padding inferior del Footer (móvil, compensa BottomNav) |

### Causa

En móvil, `pb-28` es necesario porque el MobileBottomNav ocupa ~70px. En desktop, el BottomNav no existe (`md:hidden`), por lo que 112px de padding inferior es excesivo.

### Corrección mínima

```jsx
// Línea 65 de Footer.jsx
<footer className="... pb-28 md:py-14">
→
<footer className="... pb-16 md:py-10">
```

**Riesgo:** Muy bajo. Solo reduce espacio vacío.

---

## H8 · Tokens y colores — DEUDA TÉCNICA

### Hallazgo

La Home usa `emerald-*` en 30+ lugares. El Design System tiene el token `primary` (que en CSS var equivale a `hsl(151, 55%, 34%)` = `#0E5C53` = fuxion).

### Uso de emerald en HomePage.jsx (30+ instancias)

| Clase | Función | Equivalencia token |
|-------|---------|-------------------|
| `text-emerald-50/70` | Texto secundario sobre verde | `text-primary-foreground/70` |
| `border-emerald-200` | Borde de badge | `border-primary/20` |
| `bg-emerald-700` | Texto badge | `text-primary` |
| `bg-emerald-950/40` | Fondo badge oscuro | `bg-primary/10` |
| `text-emerald-300` | Texto badge oscuro | `text-primary` |
| `text-emerald-600` | Texto/acento | `text-primary` |
| `text-emerald-400` | Texto/acento oscuro | `text-primary` |
| `bg-emerald-50` | Fondo claro | `bg-primary/5` |
| `bg-emerald-100` | Fondo icono | `bg-primary/10` |
| `bg-emerald-900/30` | Fondo oscuro | `bg-primary/10` |
| `bg-emerald-500` | Fondo badge | `bg-primary` |
| `bg-emerald-900/50` | Fondo oscuro | `bg-primary/20` |

### Uso de emerald en otros componentes

- **MobileAppShell:** `text-emerald-100/80` (texto sobre verde), `bg-emerald-400` (badge de carrito), `bg-emerald-400/20` (glow)
- **MobileCategoryGrid:** `text-emerald-600` ("Ver todo")
- **TestimonialsSection:** `text-emerald-600`, `bg-emerald-100`, `focus:ring-emerald-500`

### Uso de hex en HomePage.jsx

| Hex | Uso | Equivalencia |
|-----|-----|-------------|
| `#f7faf4` | Fondo Hero (gradiente) | `bg-secondary/30` o token dedicado |
| `#edf7ee` | Gradiente Hero | `bg-emerald-50/30` o token |
| `#111827` | Fondo oscuro Hero | `bg-surface-muted` (ya existe) |
| `#1b1630` | Fondo oscuro Hero | `bg-surface-muted` (ya existe) |

### Clasificación

**DEUDA TÉCNICA.** No es un defecto visual. Los verdes emerald son coherentes con la marca fuxion. La migración debe hacerse progresivamente, reemplazando solo cuando exista un token semánticamente equivalente. No reemplazar `emerald-500` por `fuxion` si visualmente `emerald-500` es el verde de marca deseado.

---

## H10 · Badge en 1024px — NO_APLICA

**Severidad:** NO_APLICA
**Archivo:** `src/pages/HomePage.jsx`
**Línea:** 339

### Posición confirmada

```jsx
<div className="absolute -bottom-6 -right-4 lg:-right-8 z-sticky bg-white/85 ... rounded-2xl p-3.5 shadow-xl">
```

### Comportamiento

- Contenedor padre: `div.relative` con `overflow-hidden` (línea 306)
- En 1024px: `-right-4` = 16px fuera del borde derecho
- En 1280px+: `lg:-right-8` = 32px fuera del borde derecho
- Todo dentro de `overflow-hidden`, por lo que el badge se recorta limpiamente

### Medición

| Viewport | Posición relativa al contenedor |
|----------|-------------------------------|
| 1024px | 16px fuera del borde derecho |
| 1280px | 32px fuera del borde derecho |
| 1440px | 32px fuera del borde derecho |

### Conclusión

El badge no se corta de forma problemática. Está dentro del contenedor con `overflow-hidden`. La percepción de "pegado" es estética, no funcional. **No requiere cambio.**

---

## PLAN DE CORRECCIÓN

### Correcciones Obligatorias (2)

| ID | Archivo | Cambio | Riesgo |
|----|---------|--------|--------|
| H1 | HomePage.jsx:800 | `md:py-20` → `md:py-12` | Bajo |
| H7 | Footer.jsx:65 | `pb-28 md:py-14` → `pb-16 md:py-10` | Muy bajo |

### Mejoras Opcionales (1)

| ID | Descripción | Requiere aprobación |
|----|-------------|-------------------|
| H4 | Añadir indicadores al Hero carousel | Sí |

### Deuda Técnica (1)

| ID | Descripción |
|----|-------------|
| H8 | Migración progresiva de `emerald-*` a `primary` en HomePage.jsx |

### Falsos Positivos (2)

| ID | Razón |
|----|-------|
| H2 | Banner regulatorio — comportamiento intencional |
| H3 | Header legítimo de MobileCategoryGrid |
| H10 | Badge dentro de overflow-hidden — no se corta |

---

## CAPTURAS DE EVIDENCIA

| Archivo | Viewport | Tema |
|---------|----------|------|
| `auditorias/home-320-baseline.png` | 320×700 | Oscuro |
| `auditorias/home-375-baseline.png` | 375×812 | Oscuro |
| `auditorias/home-390-baseline.png` | 390×844 | Oscuro |
| `auditorias/home-412-baseline.png` | 412×915 | Oscuro |
| `auditorias/home-768-baseline.png` | 768×1024 | Oscuro |
| `auditorias/home-1024-baseline.png` | 1024×900 | Oscuro |
| `auditorias/home-1280-baseline.png` | 1280×900 | Oscuro |
| `auditorias/home-1440-baseline.png` | 1440×1000 | Oscuro |
| `auditorias/home-375-light.png` | 375×812 | Claro |
| `auditorias/home-375-dark.png` | 375×812 | Oscuro |
| `auditorias/home-1024-light.png` | 1024×900 | Claro |
| `auditorias/home-1024-dark.png` | 1024×900 | Oscuro |
| `auditorias/home-1440-light.png` | 1440×1000 | Claro |
| `auditorias/home-1440-dark.png` | 1440×1000 | Oscuro |

## CHECKSUM

- Build: ✅ OK
- Archivos revisados: 9
- Viewports validados: 14 (incluyendo claro/oscuro)
- Estado general: **APROBADO CON OBSERVACIONES — CORREGIBLE**

---

*Esperando aprobación explícita antes de implementar cualquier corrección.*
