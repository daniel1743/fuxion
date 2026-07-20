# Auditoría y Plan de SEO Agresivo — Bienestar en Claro

> **Fecha:** 2026-07-19  
> **Sitio:** https://www.bienestarenclaro.com  
> **Dominio:** www.bienestarenclaro.com  
> **Modelo:** SPA (React 18 + Vite + react-router-dom)  
> **CMS:** Supabase (blog_posts, wellness_articles)  
> **Datos de contacto:** +56989639088  
> **Contacto pendiente:** email exclusivo para bienestar en claro

---

## 1. Regla de Marca

**Bienestar en Claro** = marca del sitio  
**Fuxion** = marca de los productos (solo en productos, nunca como marca del sitio)

## 2. Arquitectura Actual

- **Framework:** React 18 + Vite + react-router-dom (SPA)
- **Routing:** Pages router bajo `src/pages/` con lazy loading
- **Meta tags:** react-helmet
- **CSS:** Tailwind CSS + framer-motion
- **PWA:** Service Worker
- **Analytics:** Ninguno instalado
- **Search Console:** No configurado

## 3. Páginas Principales

| Ruta | Tipo | Datos |
|---|---|---|
| `/` | HomePage | Estática |
| `/producto/:slug` | ProductPage | `fuxion_database.json` (25 productos) |
| `/categoria/:slug` | CategoryPage | 8 categorías |
| `/articulos/:slug` | BlogPostPage | Supabase (blog_posts) |
| `/bienestar/:slug` | WellnessArticlePage | Supabase (wellness_articles) |
| `/condiciones/:slug` | ConditionHubPage | `catalog.json` (32 condiciones) |

## 4. SEO Existente

### 4.1 Componentes y Librerías

- `src/components/SEO.jsx` — Wrapper de Helmet con OG, Twitter Card, JSON-LD
- `src/lib/productSeo.js` — 780 líneas: PRIORITY_PRODUCT_SEO, PRODUCT_SEMANTIC_SECTIONS, schemas
- `src/lib/articleEnricher.js` — Genera article schema, FAQ schema, keywords semánticos
- `src/lib/categoryCatalog.js` — Catálogo de categorías
- `src/lib/tagCatalog.js` — Catálogo de etiquetas

### 4.2 Schemas JSON-LD Implementados

| Schema | Dónde | Estado |
|---|---|---|
| `Organization` | HomePage, ProductPage | ✅ Completo (contactPoint, address, sameAs) |
| `LocalBusiness` | ProductPage | ✅ Completo |
| `Person` | BlogPostPage | ✅ Daniel Falcón |
| `Product` | ProductPage | ✅ Con Offer, Brand, SKU |
| `Offer` | ProductPage | ✅ Precio CLP, disponibilidad |
| `FAQPage` | ProductPage, WellnessArticlePage | ✅ 7 productos, FAQs extraídas de markdown |
| `MedicalWebPage` | WellnessArticlePage, BlogPostPage | ✅ Con author, publisher, MedicalCondition |
| `BreadcrumbList` | ProductPage | ✅ Navegación estructurada |
| `Store` | HomePage | ✅ |
| `Article` | BlogPostPage (MedicalWebPage) | ✅ Con datePublished, dateModified |

### 4.3 Open Graph

- **Root (index.html):** og:image 1200x630, twitter:card, og:locale es_CL
- **WellnessArticlePage:** ogImage por artículo (article.image_url)
- **BlogPostPage:** ogImage por artículo (post.image_url)
- **ProductPage:** ogImage por producto (product.imageUrl)
- Imágenes en `public/branding/social/`: og-image.png, twitter-card.png, share-image.png

### 4.4 Productos con SEO Completo (7/25)

| Producto | SEO Title | Meta Description | FAQs | Semantic Sections |
|---|---|---|---|---|
| thermo-t3 | ✅ | ✅ | ✅ | ✅ |
| nocarb-t | ✅ | ✅ | ✅ | ✅ |
| prunex-1 | ✅ | ✅ | ✅ | ✅ |
| flora-liv | ✅ | ✅ | ✅ | ✅ |
| rexet | ✅ | ✅ | ✅ | ✅ |
| nutraday | ✅ | ✅ | ✅ | ✅ |
| vita-xtra-t-plus | ✅ | ✅ | ✅ | ✅ |

### 4.5 Condiciones Médicas (32)

| Slug | Condición | Código ICD-10 |
|---|---|---|
| obesidad | Obesidad | E66 |
| estrenimiento | Estreñimiento Crónico | K59.0 |
| sindrome-intestino-irritable | Síndrome de Intestino Irritable | K58 |
| disbiosis | Disbiosis Intestinal | K63.89 |
| microbiota | Microbiota Intestinal | K63.89 |
| insomnio | Insomnio | F51.01 |
| estres | Estrés Crónico | Z55-Z65 |
| ansiedad | Trastorno de Ansiedad | F41 |
| depresion | Depresión | F32-F33 |
| higado-graso | Esteatosis Hepática No Alcohólica | K75.81 |
| colesterol-alto | Dislipidemia | E78 |
| presion-arterial | Hipertensión Arterial | I10 |
| diabetes | Diabetes Mellitus Tipo 2 | E11 |
| fibromialgia | Fibromialgia | M79.7 |
| osteoporosis | Osteoporosis | M81 |
| artritis | Artritis | M13-M14 |
| piel | Enfermedades de la Piel | L40-L99 |
| defensas-bajas | Inmunodeficiencia | D80-D89 |
| nutricion | Trastornos Nutricionales | E40-E64 |
| hidratacion | Trastornos de Hidratación | E86 |
| ejercicio | Sedentarismo | Z72.3 |
| hormonas | Trastornos Endocrinos | E30-E34 |
| menopausia | Menopausia | N95 |
| fatiga-cronica | Fatiga Crónica | R53.83 |
| hipotiroidismo | Hipotiroidismo | E03 |
| sobrepeso | Sobrepeso | R63.4 |
| anemia | Anemia | D50-D64 |
| dolor-cronico | Dolor Crónico | G89 |
| intolerancias-alimentarias | Intolerancias Alimentarias | K90 |
| antioxidantes | Estrés Oxidativo | R68.89 |

## 5. Biblias de Contenido

### 5.1 Biblioteca de Bienestar IA

**Archivo:** `public/branding/base de datos bienestar ia/biblioteca_bienestar.json`

6 módulos con 200+ intervenciones:

| Módulo | Intervenciones |
|---|---|
| Nutrición, Metabolismo y Peso Corporal | 50 |
| Salud Intestinal, Disbiosis y Estreñimiento | 30 |
| Neurobiología del Sueño, Sistema Inmune y Descanso | 0 (vacío) |
| Salud Mental, Estrés Crónico y Función Cognitiva | 30 |
| Hidratación Clínica, Termorregulación y Nutrición Celular | 20 |
| Ejercicio, Aparato Cardiovascular y Longevidad Funcional | 0 (vacío) |

**Fuentes bibliográficas:** 70 referencias científicas (ADA 2026, AHA, ESPEN, AGA, ACG, etc.)

### 5.2 Base de Conocimiento Fuxion

**Archivo:** `src/data/fuxionKnowledgeBase.js`  
**Contenido:** 25 productos con nombre, beneficios, modo de uso, precio, categoría.

## 6. Cambios Realizados — Fase 1

### 6.1 Dominio Unificado

**Antes:** `tiendafuxion.space`  
**Ahora:** `www.bienestarenclaro.com`

Archivos modificados:
- `public/sitemap.xml` — Todas las URLs de `<loc>`
- `scripts/generate-sitemap.js` — `SITE_URL = 'https://www.bienestarenclaro.com'`

### 6.2 Marca "Bienestar en Claro"

Reemplazos de "Tienda Fuxion" → "Bienestar en Claro" en:
- `src/pages/HomePage.jsx` — SEO title y description
- `src/pages/WellnessArticlePage.jsx` — Publisher del schema
- `src/pages/BlogPostPage.jsx` — CTA "En Bienestar en Claro tenemos..."
- `src/pages/ProductPage.jsx` — Sección "Dónde comprar"
- `src/pages/PlaceholderPage.jsx` — Descripción placeholder
- `src/pages/ReviewsPage.jsx` — Name del schema
- `src/config/site.js` — STORE.name
- `src/data/fuxionKnowledgeBase.js` — Knowledge base name
- `src/components/admin/AdminPanel.jsx` — Placeholder
- `src/lib/productSeo.js` — Store, Organization, LocalBusiness descriptions
- `public/robots.txt` — Header comment
- `src/components/SEO.jsx` — Comment
- `sql/.../SQL_AUTH_ROLES_BRANDING_EVIDENCIAS.sql` — Default values

### 6.3 Contacto

- Teléfono: `+56989639088` (en Organization y LocalBusiness schemas)
- Email: pendiente (como solicitó Daniel)

## 7. Cambios Realizados — Fase 2

### 7.1 Product Semantic Sections Completados

Todos los 25 productos ahora tienen secciones semánticas completas:
- `semanticTerms` — Términos relevantes para SEO
- `deepSections` — Ingredientes, uso, perfil, errores, relacionados
- `internalLinks` — Productos relacionados con razón

### 7.2 TableOfContents Integrado

Componente existente `src/components/TableOfContents.jsx` integrado en:
- `src/pages/BlogPostPage.jsx` — Renderizado antes del contenido
- `src/pages/WellnessArticlePage.jsx` — Renderizado antes del contenido

### 7.3 Organization Schema Ampliado

SameAs extendido a:
- Sitio web
- Instagram (@bienestarenclaro)
- Twitter (@bienestarenclaro)
- Facebook (bienestarenclaro)
- LinkedIn (company/bienestarenclaro)
- YouTube (@bienestarenclaro)

## 8. AEO (Answer Engine Optimization)

### 8.1 Lo que existe

- ✅ Tablas de productos con beneficios, ingredientes, modos de uso
- ✅ FAQs estructuradas en productos (Product FAQPage schema)
- ✅ Tablas de intervenciones en artículos de bienestar
- ✅ TableOfContents en artículos
- ✅ Citas y definiciones claras en contenido médico
- ✅ MedicalCondition schema con códigos ICD-10

### 8.2 Lo que falta para AEO agresivo

- ❌ Estructura de respuesta directa para preguntas frecuentes (schema FAQPage en artículos de bienestar)
- ❌ Definiciones breves al inicio de cada artículo (primer párrafo como definición)
- ❌ Tablas comparativas entre productos
- ❌ HowTo schema para rutinas de bienestar
- ❌ VideoObject schema si se agregan videos explicativos

## 9. Core Web Vitals

### 9.1 Lo que existe

- ✅ Imágenes en WebP (scripts de compresión)
- ✅ Lazy loading en imágenes secundarias
- ✅ Preconnect a Google Fonts
- ✅ Viewport meta configurado

### 9.2 Lo que falta

- ❌ `fetchpriority="high"` en imagen LCP del hero
- ❌ `loading="eager"` explícito en imagen principal del producto
- ❌ CLS mitigation con dimensiones fijas en imágenes
- ❌ Prefetch de fuentes críticas
- ❌ Optimización de fuentes (variable fonts con display=swap)

## 10. Open Graph

### 10.1 Lo que existe

- ✅ OG tags en index.html (1200x630, twitter:card)
- ✅ OG por artículo (WellnessArticlePage, BlogPostPage)
- ✅ OG por producto (ProductPage)
- ✅ Imágenes OG en `public/branding/social/`

### 10.2 Lo que falta

- ❌ OG por condición médica (ConditionHubPage)
- ❌ OG por categoría (CategoryPage)
- ❌ Imágenes OG generadas dinámicamente por artículo (cada artículo usa su image_url, pero si no tiene, usa la del root)

## 11. JSON-LD Organization

### 11.1 Lo que existe

- ✅ Organization completo con contactPoint, address, sameAs
- ✅ LocalBusiness con teléfono real
- ✅ Person schema (Daniel Falcón)
- ✅ BreadcrumbList en productos

### 11.2 Lo que falta

- ❌ WebSite + SearchAction schema — ❌ IMPLEMENTADO (2026-07-19)
- ❌ AggregateRating para testimonios
- ❌ VideoObject schema para videos
- ❌ HowTo schema para rutinas de bienestar

## 11.3 WebSite + SearchAction Schema (IMPLEMENTADO 2026-07-19)

El schema `WebSite` con `SearchAction` permite que Google muestre un cuadro de búsqueda directa en los resultados de búsqueda.

**Implementado en:**
- `src/pages/HomePage.jsx`
- `src/pages/ProductPage.jsx`
- `src/pages/BlogPostPage.jsx`
- `src/pages/WellnessArticlePage.jsx`
- `src/pages/ConditionHubPage.jsx`

**Estructura:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Bienestar en Claro",
  "url": "https://www.bienestarenclaro.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.bienestarenclaro.com/explorar?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## 12. Autoridad Temática

### 12.1 Lo que existe

- ✅ 32 condiciones médicas con hub pages
- ✅ Cross-linking entre condiciones relacionadas
- ✅ Productos vinculados por condición
- ✅ Library modules vinculados a la biblia
- ✅ 8 categorías de productos
- ✅ Tags y categorías en artículos de blog

### 12.2 Lo que falta

- ❌ Hubs por silo temático (ej. `/bienestar/digestivo/`)
- ❌ Página "Centro de Bienestar" que agrupe todas las condiciones
- ❌ Mapa de silos: pilar → subtema → artículo específico
- ❌ Internal linking bidireccional entre artículos y productos

## 13. Programmatic SEO

### 13.1 Lo que existe

- ✅ 25 productos con SEO completo
- ✅ Semantic terms, deep sections, internal links
- ✅ Search intent, FAQs
- ✅ Páginas de categoría
- ✅ Rich snippets automáticos

### 13.2 Lo que falta

- ❌ Páginas de comparación entre productos (ej. "THERMO T3 vs NOCARB-T")
- ❌ Páginas de "cómo combinar productos"
- ❌ Páginas de recetas con productos Fuxion
- ❌ Páginas de "qué producto es para mí" (quiz interactivo)
- ❌ Páginas de síntomas → productos

## 14. Sitemap

### 14.1 Lo que existe

- ✅ Generador automático (`scripts/generate-sitemap.js`)
- ✅ Incluye productos, categorías, wellness articles, páginas estáticas
- ✅ Prioridades configuradas

### 14.2 Lo que falta

- ❌ Inclusión de artículos de blog (Supabase) en tiempo real
- ❌ Inclusión de hub pages de condiciones
- ❌ Sitemap index (múltiples sitemaps)
- ❌ Actualización automática de lastmod

## 15. Robots.txt

### 15.1 Lo que existe

- ✅ Permite indexación de todas las páginas importantes
- ✅ Bloquea /api/, /admin/, /carrito/, /checkout, /cuenta/, query params
- ✅ Referencia al sitemap

### 15.2 Lo que falta

- ❌ Host: (opcional, para indicar dominio preferido)

## 16. Seguridad y Privacidad

### 16.1 Lo que existe

- ✅ Política de privacidad
- ✅ Política de cookies
- ✅ Aviso legal

### 16.2 Lo que falta

- ❌ Banner de cookies funcional (solo HTML estático)
- ❌ Consent manager

## 17. Performance

### 17.1 Lo que existe

- ✅ Imágenes WebP
- ✅ Code splitting (lazy loading de rutas)
- ✅ Service Worker (PWA)

### 17.2 Lo que falta

- ❌ Lighthouse CI en CI/CD
- ❌ Monitoring de Core Web Vitals en producción

## 18. Checklist Final

### Completado ✅

- [x] Dominio unificado
- [x] Marca consistente
- [x] Teléfono real
- [x] Organization schema
- [x] LocalBusiness schema
- [x] Product schemas
- [x] MedicalWebPage schema
- [x] FAQPage schema
- [x] BreadcrumbList schema
- [x] Person schema
- [x] OG tags completos
- [x] OG por artículo
- [x] OG por producto
- [x] 25 productos con semantic sections
- [x] 32 condiciones médicas con hub pages
- [x] TableOfContents en artículos
- [x] Biblias de contenido (200+ intervenciones)
- [x] Cross-linking entre productos y condiciones
- [x] Sitemap generado automáticamente
- [x] Robots.txt
- [x] WebSite + SearchAction schema (en HomePage, ProductPage, BlogPostPage, WellnessArticlePage, ConditionHubPage)

### Pendiente ⏳

- [ ] Google Search Console
- [ ] Google Analytics 4
- [ ] Email de contacto (Daniel lo configura)
- [ ] SSR/Next.js para SEO agresivo
- [ ] Sitemap dinámico con blog de Supabase
- [ ] Sitemap index
- [ ] AggregateRating para testimonios
- [ ] VideoObject schema
- [ ] HowTo schema
- [ ] Hubs por silo temático
- [ ] Página "Centro de Bienestar"
- [ ] Comparaciones entre productos
- [ ] Quiz "qué producto es para mí"
- [ ] Imágenes OG por condición
- [ ] FAQPage schema en artículos de bienestar
- [ ] fetchpriority en LCP
- [ ] CLS mitigation
- [ ] Lighthouse CI
- [ ] Banner de cookies funcional

## 19. Recomendaciones Prioritarias

### Nivel 1 (Crítico — hacer inmediatamente)
1. Configurar Google Search Console con `www.bienestarenclaro.com`
2. Configurar Google Analytics 4
3. Crear email corporativo `contacto@bienestarenclaro.com`
4. Verificar que el DNS apunte correctamente al hosting

### Nivel 2 (Importante — esta semana)
5. Migrar a Next.js (SSR) para indexación confiable
6. Generar sitemaps dinámicos con artículos de blog
7. Crear hub pages por silo temático
8. Implementar AggregateRating en testimonios

### Nivel 3 (Avanzado — este mes)
9. Generar imágenes OG dinámicas por artículo
10. Implementar AggregateRating en testimonios
11. Crear comparaciones entre productos
12. Lanzar quiz interactivo "qué producto es para mí"

### Nivel 4 (Estratégico — este trimestre)
13. Expandir artículos de bienestar (módulos 3 y 6 de la biblia)
14. Crear contenido para cada condición médica
15. Implementar HowTo schema para rutinas
16. Añadir VideoObject schema
17. Optimizar Core Web Vitals con Lighthouse CI
