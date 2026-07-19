# CHANGELOG SEO — Bienestar en Claro

**Fecha:** 19 de julio de 2026
**Versión del proyecto:** 0.0.0
**Dominio:** www.bienestarenclaro.com

---

## Fase 1: Fundamentos (Dominio, Marca, Contacto)

### Dominio unificado
- **`public/sitemap.xml`** — 59 URLs cambiadas de `tiendafuxion.space` a `www.bienestarenclaro.com`
- **`scripts/generate-sitemap.js`** — `SITE_URL` actualizado a `https://www.bienestarenclaro.com`
- **`public/robots.txt`** — comentario del header corregido

### Marca "Bienestar en Claro" (reemplazó "Tienda Fuxion" en sitio, productos mantienen "Fuxion")
- **`src/pages/HomePage.jsx`** — title y description del SEO, hero badge
- **`src/pages/WellnessArticlePage.jsx`** — publisher del schema (tienda → bienestar en claro)
- **`src/pages/BlogPostPage.jsx`** — CTA "En Bienestar en Claro tenemos..."
- **`src/pages/ProductPage.jsx`** — sección "Dónde comprar"
- **`src/pages/PlaceholderPage.jsx`** — descripción placeholder
- **`src/pages/ReviewsPage.jsx`** — name del schema
- **`src/config/site.js`** — STORE.name
- **`src/data/fuxionKnowledgeBase.js`** — knowledge base name
- **`src/components/admin/AdminPanel.jsx`** — placeholder
- **`src/lib/productSeo.js`** — Store, Organization y LocalBusiness descriptions
- **`src/components/SEO.jsx`** — comentario del componente
- **`public/robots.txt`** — comentario del header
- **`sql/funcionalidades/SQL_AUTH_ROLES_BRANDING_EVIDENCIAS.sql`** — default values

### Contacto
- **`src/lib/productSeo.js`** — teléfono cambiado a `+56989639088`
- Email pendiente (usuario creará uno exclusivo)

---

## Fase 2A: Entity SEO + JSON-LD

### Artículos de bienestar
- **`src/pages/WellnessArticlePage.jsx`** — publisher corregido a "Bienestar en Claro"

### Product SEO completado
- **`src/data/productSeoExtensions.js`** — NUEVO: SEO único para 19 productos:
  - liquid-fiber, berry-balance, alpha-balance, pre-sport, post-sport
  - cafe-fit, pack-5-14, vitaenergia, bioprotein, passion, probal
  - golden-flx, beauty-in, youth-elixir, on, no-stress, gano-plus-cappuccino
- **`src/lib/productSeo.js`** — integrado `PRODUCT_SEO_EXTENSIONS`, `getProductSeoContent()` mergea prioridad + semántica + extensiones

### Páginas de condiciones médicas (hub pages)
- **`src/data/conditionHub.js`** — NUEVO: 10 condiciones médicas:
  - obesidad, estreñimiento, insomnio, estrés, hígado graso
  - síndrome del intestino irritable, defensas bajas, piel, articular, recuperación deportiva
- **`src/pages/ConditionHubPage.jsx`** — NUEVO: componente de página con:
  - SEO, OG tags, schema, productos relacionados
  - Breadcrumbs con schema
  - CTA WhatsApp personalizado por condición
- **`src/App.jsx`** — ruta `/condicion/:slug` agregada

---

## Fase 2B: Article Enrichment Pipeline

### Conversor biblia → artículos
- **`scripts/convert-bible-to-articles.js`** — NUEVO: convierte `biblioteca_bienestar.json` a artículos listos para Supabase
- **`public/converted-articles.json`** — 130 artículos generados:
  - Módulo 1 (Nutrición y Peso): 50 artículos
  - Módulo 2 (Intestino y Estreñimiento): 30 artículos
  - Módulo 4 (Estrés y Cognitivo): 30 artículos
  - Módulo 5 (Hidratación): 20 artículos

---

## Pendientes de implementación

### Fase 2C: Authority temática
- Hub pages para condiciones médicas (COMPLETO)
- Silos temáticos para categorías de bienestar (PENDIENTE)
- Páginas pillar para temas amplios (PENDIENTE)

### Fase 2D: Programmatic SEO
- SEO completo para todos los productos (COMPLETO)
- Páginas de comparación entre productos (PENDIENTE)
- Páginas de "qué es" para términos médicos (PENDIENTE)

### Fase 2E: Core Web Vitals
- Preload de fuentes y OG images (PENDIENTE)
- Dim attributes en imágenes (PENDIENTE)
- CWV tracking con GA4 (PENDIENTE)

### Fase 2F: Open Graph mejorado
- OG images únicas por artículo (PENDIENTE)
- article:tags, article:author en OG (PENDIENTE)

### Fase 2G: JSON-LD Organization
- Organization schema con ContactPoint, sameAs (PENDIENTE)
- WebSite + SearchAction (PENDIENTE)
- Person schema completo para Daniel Falcón (PENDIENTE)
- BreadcrumbList en todas las páginas (PENDIENTE)

### AEO (Answer Engine Optimization)
- FAQs en artículos de blog (PENDIENTE)
- HowTo schema para rutinas (PENDIENTE)

---

## Notas técnicas

- **Stack:** React 18 + Vite + react-router-dom (SPA)
- **CMS:** Supabase (blog_posts, wellness_articles)
- **SEO:** react-helmet para meta tags dinámicos
- **Paquetes SEO:** react-helmet@6.1.0
- **Imágenes:** WebP con script de compresión
- **PWA:** manifest.json, service worker configurado
- **Fuentes:** Cormorant Garamond, Playfair Display (Google Fonts)
- **Analytics:** PENDIENTE — instalar GA4 y configurar Search Console
