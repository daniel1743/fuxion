# FASES PENDIENTES SEO — Bienestar en Claro

**Estado actual:** Fase 1 completa, Fase 2B (artículos) completa.
**Faltan:** Fase 2C-F (authority, programmatic SEO, Core Web Vitals, OG, JSON-LD Organization).

---

## 🟡 Prioridad MEDIA — Mejoras con alto ROI

### Fase 2F: Open Graph mejorado
**Qué:** Cada artículo y producto debe tener su propia imagen OG para compartir en redes.
**Por qué:** Cuando alguien comparte un link en WhatsApp/Facebook, la imagen previsualizada define el CTR.
**Acciones:**
1. Crear plantilla de OG image para artículos (imagen con título + categoría + logo)
2. Crear plantilla de OG image para productos (imagen con nombre + precio + logo)
3. Actualizar `WellnessArticlePage.jsx` para usar OG image del artículo
4. Actualizar `ProductPage.jsx` para usar OG image del producto
5. Agregar `og:image:alt` en todas las páginas dinámicas
6. Agregar `article:tag`, `article:author`, `article:published_time` en OG de artículos

**Archivos a modificar:**
- `src/components/SEO.jsx` — agregar soporte para dynamic ogImages
- `src/pages/WellnessArticlePage.jsx` — pasar ogImage del artículo
- `src/pages/ProductPage.jsx` — pasar ogImage del producto
- `src/pages/BlogPostPage.jsx` — pasar ogImage del artículo

**Tiempo estimado:** 2-3 horas

---

### Fase 2G: JSON-LD Organization completo
**Qué:** Schema de organización completo con todos los campos requeridos por Google.
**Por qué:** Google entiende mejor quién eres, dónde estás, cómo contactarte.
**Acciones:**
1. Crear `buildCompleteOrganizationSchema()` con:
   - ContactPoint (email, teléfono, hours)
   - sameAs (Facebook, Instagram, LinkedIn, Twitter)
   - Logo URL
   - Address completa (cuando esté disponible)
2. Crear `buildWebsiteSearchActionSchema()` para que Google muestre tu buscador en los resultados
3. Crear `buildPersonSchema()` completo para Daniel Falcón (foto, bio, LinkedIn)
4. Crear `buildBreadcrumbSchema()` para todas las páginas
5. Agregar schema en HomePage, AboutPage, ContactPage
6. Agregar Author schema en BlogPostPage y WellnessArticlePage

**Archivos a modificar:**
- `src/lib/productSeo.js` — agregar nuevos builders
- `src/pages/HomePage.jsx` — agregar schema completo
- `src/pages/BlogPostPage.jsx` — agregar Author schema
- `src/pages/WellnessArticlePage.jsx` — agregar Author schema
- `src/pages/AboutPage.jsx` — agregar Person schema
- `src/pages/ContactPage.jsx` — agregar ContactPoint

**Tiempo estimado:** 3-4 horas

---

## 🟠 Prioridad ALTA — Necesarios para SEO agresivo

### Fase 2C: Authority temática (profundidad)
**Qué:** Páginas pillar que dominen un tema completo.
**Por qué:** Google premia sitios que demuestran expertise en un tema.
**Acciones:**
1. Crear hub pages para las condiciones médicas (YA HECHO — 10 condiciones)
2. Crear silos temáticos:
   - Silo digestivo: estreñimiento, SII, disbiosis, microbiota
   - Silo metabólico: obesidad, resistencia insulina, diabetes
   - Silo mental: estrés, insomnio, ansiedad, cognición
   - Silo cardiovascular: hipertensión, colesterol, prevención
3. Para cada silo: crear página con introducción, lista de artículos, productos relacionados
4. Interlinking entre artículos del mismo silo

**Archivos a crear:**
- `src/pages/SiloPage.jsx` — componente genérico para silos
- `src/data/silos.js` — definición de silos temáticos
- Páginas específicas para cada silo

**Tiempo estimado:** 6-8 horas

---

### Fase 2D: Programmatic SEO avanzado
**Qué:** Páginas generadas automáticamente para maximizar cobertura de keywords.
**Por qué:** Cubre miles de keywords que manualmente no se podrían crear.
**Acciones:**
1. Páginas de comparación: "Prunex 1 vs Liquid Fiber"
2. Páginas de ingredientes: "Beneficios de la cúrcuma", "Qué es la fibra soluble"
3. Páginas de "productos para X": "Productos Fuxion para el estreñimiento"
4. Páginas de recetas/rutinas: "Rutina matutina de bienestar"
5. Páginas de síntomas: "¿Qué es la hinchazón abdominal?"

**Archivos a crear:**
- `src/pages/ComparisonPage.jsx`
- `src/pages/IngredientPage.jsx`
- `src/pages/SymptomPage.jsx`
- `src/data/comparisons.js`
- `src/data/ingredients.js`
- `src/data/symptoms.js`

**Tiempo estimado:** 8-12 horas

---

### Fase 2E: Core Web Vitals
**Qué:** Optimización de performance para móvil.
**Por qué:** Google penaliza sitios lentos, especialmente en móvil.
**Acciones:**
1. Instalar Google Analytics 4 (GA4)
2. Configurar Google Search Console
3. Agregar Web Vitals tracking (Chrome UX Report)
4. Agregar preload para fuentes críticas
5. Agregar preload para OG images above-the-fold
6. Agregar `dim` attributes en imágenes
7. Agregar `font-display: swap` para fuentes
8. Optimizar Service Worker caching strategy
9. Evaluar bundle size (HomePage es 55kB gzipped — aceptable pero hay margen)

**Archivos a modificar:**
- `index.html` — agregar preload, GA4 script
- `src/main.jsx` — agregar servicio worker registration
- Vite config — optimizar chunks

**Tiempo estimado:** 4-6 horas

---

## 🔵 Prioridad BAJA — Mejoras adicionales

### AEO (Answer Engine Optimization)
- Agregar FAQs estructuradas en artículos de blog
- Agregar HowTo schema para rutinas de bienestar
- Estructura de respuestas directas (definición → explicación → ejemplo → conclusión)
- Tablas de contenido con jump links en artículos largos

### Microdatos adicionales
- AggregateRating en productos
- VideoObject para videos
- Recipe para rutinas de nutrición

### Internacionalización
- hreflang para otros idiomas (es-MX, es-AR, etc.)
- Meta tags para compartir en LinkedIn (Open Graph LinkedIn)

---

## 📊 Resumen de prioridades

| Fase | Qué | ROI | Esfuerzo | Prioridad |
|------|-----|-----|----------|-----------|
| 2F | Open Graph mejorado | Alto | Bajo | 🟡 Media |
| 2G | JSON-LD Organization | Alto | Medio | 🟡 Media |
| 2C | Authority temática | Muy alto | Alto | 🟠 Alta |
| 2D | Programmatic SEO | Muy alto | Muy alto | 🟠 Alta |
| 2E | Core Web Vitals | Alto | Medio | 🟠 Alta |
| AEO | Respuestas IA | Medio | Bajo | 🔵 Baja |

---

## ⚠️ Bloqueantes (debes resolver primero)

1. **Decidir dominio** — `bienestarenclaro.com` o `tiendafuxion.space`
2. **Registrar GA4** — sin esto, no puedes medir ni corregir
3. **Verificar en Search Console** — sin esto, Google no sabe qué indexar
4. **Registrar Google Business Profile** — para LocalBusiness schema real
5. **Crear email corporativo** — `contacto@bienestarenclaro.com` (para LocalBusiness schema)
