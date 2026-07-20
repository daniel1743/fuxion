# Plan SEO Pendiente — Bienestar en Claro

> Fecha: 2026-07-19  
> Sitio: https://www.bienestarenclaro.com  
> Estado actual: Fase 1 ✅ | Fase 2A ✅ | Fase 2B ✅

---

## Lo que YA está hecho

### Fase 1: Fundamentos ✅
- [x] Dominio unificado a `www.bienestarenclaro.com` (sitemap, robots, código)
- [x] Marca: "Bienestar en Claro" reemplaza "Tienda Fuxion" en todo el sitio
- [x] Teléfono actualizado: `+56989639088`
- [x] Email removido de LocalBusiness (pendiente como pediste)
- [x] Schema descriptions corregidos (ya no dicen "Tienda Fuxion")
- [x] SQL de branding actualizado

### Fase 2A: Entity SEO + JSON-LD ✅
- [x] `buildOrganizationSchema()` con ContactPoint + sameAs (Instagram, Twitter)
- [x] `buildLocalBusinessSchema()` con teléfono correcto, dirección, sameAs
- [x] `buildWebsiteSchema()` con SearchAction (Sitelinks Searchbox)
- [x] `buildPersonSchema()` mejorado (Daniel Falcón, knowsAbout)
- [x] `SEO.jsx` acepta `ogImageAlt`, `articleAuthor`, `articlePublished`, `articleTags`
- [x] ogImageAlt en TODAS las páginas del sitio
- [x] `article:author`, `article:published_time`, `article:tag` en artículos
- [x] BreadcrumbList en BlogPostPage y WellnessArticlePage
- [x] HomePage incluye `buildWebsiteSchema()`

### Fase 2B: Article enrichment pipeline ✅
- [x] Script `scripts/polish-articles.mjs` creado
- [x] Ejecutado: 150/150 artículos de la biblia pulidos
- [x] Títulos editoriales generados (no más nombres técnicos)
- [x] Contenido estructurado con secciones claras
- [x] FAQs generadas automáticamente (en campo `faqsGenerated`)

---

## Fase 2C: Authority temática — PENDIENTE

Hub pages y silos temáticos para dominar cada condición médica.

### Qué hacer
Crear páginas hub para las principales condiciones de búsqueda:

| Condición | Slug propuesto | Búsqueda mensual estimada |
|-----------|----------------|--------------------------|
| Estreñimiento crónico | `/condiciones/estreñimiento` | 40K+ |
| Síndrome del intestino irritable | `/condiciones/sii` | 25K+ |
| Hígado graso | `/condiciones/higado-graso` | 20K+ |
| Obesidad | `/condiciones/obesidad` | 30K+ |
| Disbiosis intestinal | `/condiciones/disbiosis` | 10K+ |
| Ansiedad / Estrés crónico | `/condiciones/estres-cronico` | 20K+ |
| Insomnio | `/condiciones/insomnio` | 15K+ |
| Reflujo gastroesofágico | `/condiciones/reflujo` | 15K+ |
| SIBO | `/condiciones/sibo` | 8K+ |
| Microbiota intestinal | `/condiciones/microbiota` | 10K+ |

### Qué debe tener cada hub page
1. **Título H1** optimizado para la condición
2. **Meta description** con keyword principal
3. **Schema CollectionPage** (o MedicalWebPage)
4. **Contenido introductorio** sobre la condición (de la biblia)
5. **Grid de artículos** relacionados de la biblia
6. **Productos Fuxion** recomendados (cross-link programático)
7. **FAQs** sobre la condición
8. **CTA** para WhatsApp

### Archivos a crear
- `src/pages/ConditionPage.jsx` — página genérica de condición
- `src/pages/ConditionsIndexPage.jsx` — índice de todas las condiciones
- `src/lib/conditionCatalog.js` — catálogo de condiciones con metadata
- `scripts/generate-condition-pages.mjs` — genera las páginas estáticas

### Estado: 0%

---

## Fase 2D: Programmatic SEO — PENDIENTE

Completar SEO de TODOS los productos y generar contenido programático.

### Qué hacer
1. **Completar `PRIORITY_PRODUCT_SEO`** para los 14 productos que faltan
   - Solo 7-12 de 26 productos tienen SEO completo
   - Los demás usan fallback genérico

2. **Generar páginas de comparación**
   - `/comparaciones/prunex-1-vs-liquid-fiber`
   - `/comparaciones/thermo-t3-vs-nocarb-t`
   - `/comparaciones/flora-liv-vs-prunex-1`
   - etc.

3. **Generar páginas de "qué es"**
   - `/que-es/microbiota-intestinal`
   - `/que-es/disbiosis`
   - `/que-es/sibo`
   - etc.

4. **Generar páginas de "productos para"**
   - `/productos-para/estreñimiento`
   - `/productos-para/energia`
   - `/productos-para/control-de-peso`
   - etc.

5. **Cross-link automático** entre artículos y productos
   - Cuando un artículo menciona "estreñimiento", enlazar a Prunex 1 y Liquid Fiber

### Estado: 0%

---

## Fase 2E: Core Web Vitals — PENDIENTE

### Qué hacer
1. **Preload de fuentes críticas**
   - `rel="preload"` para Cormorant Garamond y Playfair Display

2. **dim attributes en imágenes**
   - Agregar `width` y `height` en TODAS las imágenes para reducir CLS
   - Especialmente en artículos de blog (contenido dinámico)

3. **fetchpriority="high"** en imágenes LCP
   - Hero del HomePage
   - Imagen principal del producto
   - Imagen principal del artículo

4. **CWV tracking**
   - Instalar Web Vitals JS API
   - Enviar métricas a GA4 o similar

5. **Font-display: swap**
   - Asegurar que las fuentes carguen correctamente

6. **Image srcset**
   - Generar versiones responsivas (320, 768, 1200px)

### Estado: 0%

---

## Fase 2F: Open Graph refinado — PARCIAL

### Lo que YA tiene
- ogImageAlt en todas las páginas
- article:author, article:published_time, article:tag en artículos
- ogImage por producto (cada producto tiene su imagen)
- ogImage por artículo (usa imagen del artículo)

### Qué falta
1. **Imágenes OG específicas por artículo**
   - Actualmente cada artículo usa su imagen en og:image, pero NO hay imagen OG diseñada específicamente para compartir en redes
   - Solución: Generar OG images dinámicas (o al menos tener plantillas por categoría)

2. **og:image:secure_url** en páginas dinámicas
   - Solo en index.html, falta en páginas renderizadas por React-Helmet

3. **og:type correcto en todas las páginas**
   - HomePage: `website` ✅
   - Productos: `product` ✅
   - Artículos bienestar: `article` ✅
   - Artículos blog: `article` ✅
   - Páginas legales: `website` ✅
   - **Verificar** que todas las páginas tienen og:type correcto

4. **Twitter card alt text**
   - Faltan `twitter:image:alt` en páginas dinámicas

### Estado: 60%

---

## Fase 2G: JSON-LD Organization completo — PARCIAL

### Lo que YA tiene
- Organization schema completo con ContactPoint
- LocalBusiness con sameAs
- WebSite con SearchAction
- BreadcrumbList en algunas páginas
- Person schema para Daniel Falcón

### Qué falta
1. **AggregateRating en productos**
   - Schema `AggregateRating` con reviews de productos
   - Reviews ya existen en ReviewsPage (`reviews` data)

2. **VideoObject schema**
   - Si hay videos en la página (oportunidad-fuxion)

3. **HowTo schema para rutinas**
   - Las intervenciones de la biblia son esencialmente HowTo

4. **Recipe schema** para recetas de nutrición
   - Si se crean páginas de recetas

5. **MediaObject schema** para imágenes
   - Cada imagen con su schema

6. **Review schema** en testimonios
   - ReviewsPage tiene opiniones — agregar schema

7. **WebApplication schema** para la PWA
   - Para que Google lo reconozca como aplicación instalable

### Estado: 70%

---

## Fase 2H: AEO (Answer Engine Optimization) — PARCIAL

### Lo que YA tiene
- FAQs en productos (12 productos)
- FAQs en artículos (generadas automáticamente)
- Contenido estructurado con headings claros
- Schema FAQPage en productos y artículos bienestar

### Qué falta
1. **FAQPage schema en artículos de blog** (Supabase)
   - BlogPostPage NO genera FAQPage schema
   - Solo WellnessArticlePage lo hace

2. **Tabla de contenido con jump links**
   - Cada artículo debe tener TOC con links internos
   - Mejora UX y ayuda a Google a entender la estructura

3. **Definiciones claras tipo "What is X?"**
   - Los artículos de blog no tienen definición al inicio

4. **Schema HowTo** para rutinas de bienestar
   - Las intervenciones de la biblia son HowTo

5. **Estructura "definición → explicación → ejemplo → conclusión"**
   - Los artículos de blog usan contenido crudo de Supabase
   - Necesitan enriquecimiento automático

### Estado: 50%

---

## Fase 2I: Sitemap dinámico — CRÍTICO

### Problema actual
- El sitemap solo tiene 10 artículos de bienestar
- Hay 150 artículos en la biblia (ahora pulidos)
- Los artículos de blog (Supabase) NO aparecen en el sitemap
- Los artículos de bienestar recién pulidos probablemente no están en el sitemap

### Qué hacer
1. **Actualizar `scripts/generate-sitemap.js`** para:
   - Fetchar artículos de bienestar desde Supabase (ya lo hace, verificar)
   - Fetchar artículos de blog desde Supabase (NUEVO)
   - Incluir todos los nuevos artículos

2. **Incluir artículos de la biblia** en el sitemap
   - Los 150 artículos pulidos deben aparecer

3. **Agregar `lastmod` real** para cada artículo
   - No más fecha hardcoded

4. **XML sitemap index** (si supera 50K URLs)
   - Por ahora no es necesario

### Estado: 30%

---

## Fase 2J: Google Search Console + Analytics — CRÍTICO

### Lo que NO tiene
- ❌ Google Analytics 4
- ❌ Google Search Console
- ❌ Bing Webmaster Tools
- ❌ Verificación de dominio

### Qué hacer
1. **Instalar GA4** — tag en index.html
2. **Registrar en Search Console** — propiedad `www.bienestarenclaro.com`
3. **Enviar sitemap a Search Console**
4. **Configurar Core Web Vitals** en Search Console
5. **Bing Webmaster Tools** — opcional pero recomendado

### Estado: 0%

---

## Fase 2K: Email corporativo — PENDIENTE

### Pendiente desde Fase 1
- Crear email corporativo: `contacto@bienestarenclaro.com`
- Configurar DNS (SPF, DKIM, DMARC)
- Actualizar LocalBusiness schema con el email

### Estado: 0%

---

## Fase 2L: SEO de artículos de blog — PENDIENTE

### Problema
Los artículos de blog (Supabase `blog_posts`) tienen SEO básico pero no están optimizados para:
- AEO (sin FAQs estructuradas)
- Authority (sin silos)
- Cross-links a productos

### Qué hacer
1. **Generar FAQPage schema** para artículos de blog
2. **Extraer entidades del contenido** y generar tags semánticos
3. **Sugerir productos relacionados** basados en el contenido
4. **Agregar BreadcrumbList** (ya existe en schema pero verificar)
5. **Agregar `dateModified`** al schema de artículo

### Estado: 20%

---

## Fase 2M: Páginas legales y políticas — REVISIÓN

### Páginas existentes
- /terminos, /privacidad, /cookies, /envios, /faq

### Qué verificar
- Title tags correctos
- ogImageAlt presente (algunos faltan)
- Noindex en páginas que no deberían indexarse
- Canonical correcto

### Estado: 90%

---

## Resumen de prioridades

| Prioridad | Fase | Estado |
|-----------|------|--------|
| 🔴 Crítica | 2I: Sitemap dinámico | 30% |
| 🔴 Crítica | 2J: Search Console + GA4 | 0% |
| 🔴 Crítica | 2K: Email corporativo | 0% |
| 🟠 Alta | 2C: Authority temática | 0% |
| 🟠 Alta | 2D: Programmatic SEO | 0% |
| 🟠 Alta | 2H: AEO completo | 50% |
| 🟡 Media | 2E: Core Web Vitals | 0% |
| 🟡 Media | 2F: OG refinado | 60% |
| 🟡 Media | 2G: JSON-LD completo | 70% |
| 🟢 Bajo | 2L: SEO blog | 20% |
| 🟢 Bajo | 2M: Páginas legales | 90% |

---

## Recomendación de orden

1. **2J: Search Console + GA4** — sin esto no puedes medir nada
2. **2I: Sitemap** — sin esto Google no encuentra tus 150 artículos
3. **2K: Email corporativo** — pediste hacerlo, ya lo teníamos pendiente
4. **2C: Authority temática** — hub pages para condiciones
5. **2D: Programmatic SEO** — completar productos + comparaciones
6. **2E: Core Web Vitals** — performance
7. **2H: AEO completo** — FAQs en blog + HowTo
8. **2F: OG refinado** — imágenes OG por artículo
9. **2G: JSON-LD completo** — AggregateRating, Review, etc.
10. **2L: SEO blog** — último ajuste
