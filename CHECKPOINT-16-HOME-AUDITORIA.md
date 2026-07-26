# CHECKPOINT 16 — VALIDACIÓN VISUAL INTEGRAL DE LA HOME

**Proyecto:** Bienestar en Claro
**Branch:** `feature/editorial-pipeline-slice-1`
**Fecha:** 2026-07-25
**Estado:** BUILD OK (51s, 8369 módulos)

## MÉTODO

- Capturas Puppeteer en 8 viewports: `320, 375, 390, 412, 768, 1024, 1280, 1440`
- Modo oscuro forzado vía cookie
- `networkidle0` + 2s para animaciones
- Full-page screenshots

## ARQUITECTURA DE LA HOME (confirmada)

```
MobileAppShell (green gradient header, sticky nav)
├── MobileHero (carousel de 3 imágenes, CTA)
├── MobileCategoryGrid
├── WellnessJourneyCarousel
├── TestimonialsSection
├── TrustBar (3 items)
├── PainPointsSection
├── SolucionesFuxion (3 cards swipeable)
├── Acompañamiento (3 pasos)
├── ArtículosDestacados
├── OportunidadFuxionBanner
├── AsesoríaPersonalizada
└── CierreEmocional
Footer
```

---

## HALLAZGOS

### 🔴 H1 — Espacio blanco excesivo entre Testimonials y Footer

**Viewports afectados:** Todos (especialmente 768, 1024, 1280, 1440)

**Descripción:** Después de la última tarjeta de testimonial, hay un espacio blanco enorme (~40-50% del viewport) antes del footer. Esto genera sensación de página incompleta o contentiva.

**Causa probable:** Las últimas secciones de HomePage (CierreEmocional) usan `py-12 md:py-20` que en desktop genera `py-80px` ≈ 160px, pero no hay contenido debajo del último botón CTA — el espacio es puro padding.

**Evidencia:** Screenshot 768px y 1024px muestran claramente el gap entre la última card de testimonial y el footer.

**Recomendación:** Reducir padding de la sección final (línea 800 de HomePage.jsx: `py-12 md:py-20` → `py-8 md:py-12`).

---

### 🔴 H2 — Popup "Mejora de Experiencia" cubre contenido en desktop

**Viewports afectados:** 768, 1024, 1280, 1440

**Descripción:** Aparece un modal "Mejora de Experiencia" en posición absoluta centrada sobre el carousel de soluciones, bloqueando parcialmente las tres tarjetas y el botón "Aceptar Todo".

**Impacto:** El usuario no puede ver el contenido principal de la sección de soluciones mientras el popup esté abierto.

**Evidencia:** Screenshot 768px y 1024px — el modal ocupa el centro de la pantalla con botón "Aceptar Todo" y "Configurar".

**Recomendación:** Verificar origen del componente (probablemente un cookie consent o feature flag). Ajustar `z-index` o posición para que no solape contenido crítico.

---

### 🟡 H3 — "Descubre" en mobile — redundante

**Viewport afectado:** 320, 375, 390, 412

**Descripción:** Debajo del MobileAppShell, aparece un título "Descubre" solitario seguido de un "Ver todo →" alineado a la derecha. Este título parece residuo de un componente de categoría que debería tener contenido debajo.

**Evidencia:** Screenshot 320px y 375px — el texto "Descubre" está flotando encima del WellnessJourneyCarousel.

**Recomendación:** Investigar si este componente aún se necesita. Podría ser un residuo de refactorización de MobileAppShell.

---

### 🟡 H4 — Hero section en mobile — imagen rotativa sin indicador

**Viewport afectado:** 320, 375, 390, 412

**Descripción:** El carousel del hero tiene 3 imágenes (`/para el hero.jpeg`, `/branding/yoga.png`, `/branding/niños.png`) que rotan cada 4.5s, pero no hay indicadores de slides (dots ni barra de progreso). El usuario no sabe cuántas imágenes hay ni cuál está viendo.

**Evidencia:** Screenshot 375px muestra la imagen "yoga" activa sin ningún indicador.

**Recomendación:** Agregar dot indicators o un contador (ej: "1/3") en la esquina inferior derecha de la imagen.

---

### 🟢 H5 — Tipografía y jerarquía — OK

**Viewports afectados:** Todos

**Descripción:** La jerarquía tipográfica se mantiene consistente:
- Mobile: `text-[22px]` → `text-2xl` → `text-lg` para subtítulos
- Desktop: `text-responsive-hero` (clamp) → `text-sm` → `text-xxs`
- El gradiente `from-emerald-600 to-emerald-400` en el H1 destaca correctamente.

**Veredicto:** ✅ Sin cambios.

---

### 🟢 H6 — Navegación — OK

**Viewports afectados:** Todos

**Descripción:**
- Mobile: AppShell con nav verde fijo arriba, hamburger menu funcional.
- Desktop: Header con menú horizontal (Inicio, Bienestar, Conócenos, Tienda oficial).
- Glassmorphism aplicado correctamente en el header.
- Smart sticky funciona (header se oculta al bajar, reaparece al subir).

**Veredicto:** ✅ Sin cambios.

---

### 🟡 H7 — Footer — padding superior excesivo en desktop

**Viewports afectados:** 1024, 1280, 1440

**Descripción:** El footer tiene `mt-16 sm:mt-20` y dentro `pt-10 pb-28 md:py-14`. En el 1440px, la distancia entre el cierre emocional y el footer es muy grande porque el cierre emocional ya tiene su propio padding generoso + el margin del footer.

**Evidencia:** Screenshot 1440px — el footer está muy abajo en relación al contenido.

**Recomendación:** Reducir `mt-16 sm:mt-20` a `mt-10 sm:mt-12` y/o reducir padding de la última sección.

---

### 🟢 H8 — Colores y contraste — OK

**Viewports afectados:** Todos

**Descripción:**
- Verde fuxion (`#0E5C53` / `emerald-600`) consistente en CTAs, badges y navegación.
- Fondo claro (`#f7faf4` / `bg-secondary/30`) usado correctamente para separar secciones.
- Contraste texto sobre fondo verde en MobileAppShell: blanco sobre gradiente fuxion, legible.
- Dark mode: fondos `surface-muted`, `#111827`, `#1b1630` aplicados correctamente.

**Veredicto:** ✅ Sin cambios.

---

### 🟢 H9 — Imágenes del hero — OK

**Viewports afectados:** Todos

**Descripción:** Las imágenes del hero (yoga, yoga pareja, niños) cargan correctamente. Aspect ratio `4/3` en desktop y `3/4` en mobile mantienen proporciones adecuadas. Transición de opacidad entre slides suave (1500ms).

**Veredicto:** ✅ Sin cambios.

---

### 🟡 H10 — Badge "100% Natural" y "Calidad Premium" — overlap en 1024px

**Viewport afectado:** 1024

**Descripción:** Los glassmorphism badges del hero están posicionados con `absolute -top-6 -left-6` y `absolute -bottom-6 -right-4`. En 1024px, el badge derecho queda pegado al borde de la imagen sin suficiente padding.

**Evidencia:** Screenshot 1024px — badge "Calidad Premium" toca el borde derecho de la imagen.

**Recomendación:** Aumentar offset en media-query md: `-right-4` → `-right-8`.

---

## RESUMEN

| Prioridad | Cantidad | Hallazgo principal |
|-----------|----------|---------------------|
| 🔴 Critical | 2 | Espacio blanco excesivo, popup bloqueante |
| 🟡 Medium | 4 | "Descubre" fantasma, hero sin dots, footer padding, badge overlap |
| 🟢 OK | 3 | Tipografía, navegación, colores/imágenes |

## PRIORIDAD DE CORRECCIÓN

1. **H2** — Popup "Mejora de Experiencia" (bloquea contenido)
2. **H1** — Espacio blanco entre Testimonials y Footer (sensación de página incompleta)
3. **H3** — Título "Descubre" sin contenido debajo (residuo visual)
4. **H4** — Indicadores de slides en hero mobile
5. **H7** — Footer padding excesivo
6. **H10** — Badge overlap en 1024px

---

## ARCHIVOS DE EVIDENCIA

| Archivo | Viewport |
|---------|----------|
| `auditorias/home-320-baseline.png` | 320 × 700 |
| `auditorias/home-375-baseline.png` | 375 × 812 |
| `auditorias/home-390-baseline.png` | 390 × 844 |
| `auditorias/home-412-baseline.png` | 412 × 915 |
| `auditorias/home-768-baseline.png` | 768 × 1024 |
| `auditorias/home-1024-baseline.png` | 1024 × 900 |
| `auditorias/home-1280-baseline.png` | 1280 × 900 |
| `auditorias/home-1440-baseline.png` | 1440 × 1000 |

---

## CHECKSUM

- Build: ✅ OK (51s)
- Archivos revisados: HomePage.jsx (851 líneas), MobileAppShell.jsx (237 líneas), Footer.jsx (169 líneas), ProductNeedSearch.jsx (58 líneas)
- Viewports capturados: 8/8
- Estado general: **APROBADO CON OBSERVACIONES**

---

*Esperando aprobación explícita para proceder a correcciones.*
