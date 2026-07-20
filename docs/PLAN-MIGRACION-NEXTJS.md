# Plan de Migración a Next.js — Fase 5

## 1. Por qué Next.js

| Aspecto | Vite + React Router (actual) | Next.js (objetivo) |
|---------|------------------------------|-------------------|
| Rendering | SPA (cliente) | SSR/SSG (servidor) |
| SEO | Google debe ejecutar JS | HTML listo al primer byte |
| Indexación | Lenta (segundos) | Instantánea |
| Performance | LCP depende del cliente | LCP < 1s garantizado |
| Sitemap | Generado manualmente | Generado automáticamente |
| Imágenes OG | No se pueden generar | Edge Functions |
| API routes | Necesita backend separado | Integrado |
| Incremental Static Regeneration | No soportado | Soportado |
| Image optimization | Manual | Automático (Next/Image) |
| Route prefetching | Manual | Automático (Link) |
| Middleware | No | Sí (redirects, rewrites) |
| Metadata API | react-helmet | Built-in (app router) |
| Font optimization | Manual | Auto |
| Code splitting | Manual | Auto (routes) |

**Conclusión:** Sin SSR, un SEO "agresivo" no es posible. Google puede indexar SPAs, pero con latencia y riesgo de errores.

## 2. Arquitectura objetivo

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14+ (App Router)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  app/                                                       │
│  ├── (landing)/                                             │
│  │   ├── page.jsx  (Home)                                  │
│  │   ├── blog/page.jsx                                     │
│  │   ├── bienestar/page.jsx                                │
│  │   └── oportunidad/page.jsx                              │
│  │                                                         │
│  ├── blog/                                                  │
│  │   ├── [slug]/                                           │
│  │   │   └── page.jsx  (SSG + ISR)                        │
│  │   └── layout.jsx                                        │
│  │                                                         │
│  ├── bienestar/                                             │
│  │   ├── [slug]/                                           │
│  │   │   └── page.jsx  (SSG + ISR)                        │
│  │   └── layout.jsx                                        │
│  │                                                         │
│  ├── producto/                                              │
│  │   ├── [slug]/                                           │
│  │   │   └── page.jsx  (SSG + ISR)                        │
│  │   └── layout.jsx                                        │
│  │                                                         │
│  ├── hub/                                                   │
│  │   ├── [slug]/                                           │
│  │   │   └── page.jsx  (SSG)                              │
│  │   └── layout.jsx                                        │
│  │                                                         │
│  ├── api/                                                   │
│  │   ├── og/route.jsx  (OG dinámico)                      │
│  │   ├── sitemap/route.jsx  (sitemap dinámico)            │
│  │   └── rss/route.jsx  (RSS feed)                        │
│  │                                                         │
│  └── layout.jsx  (root layout con metadata)               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     Supabase (CMS)                          │
│  ├── blog_posts (artículos de blog)                        │
│  ├── wellness_articles (artículos de bienestar)            │
│  ├── products (productos Fuxion)                           │
│  └── testimonials (opiniones)                              │
├─────────────────────────────────────────────────────────────┤
│                   Vercel (Hosting)                          │
│  ├── Edge Functions (OG, sitemap, RSS)                     │
│  ├── ISR (Incremental Static Regeneration)                 │
│  └── Analytics                                             │
└─────────────────────────────────────────────────────────────┘
```

## 3. Plan de migración

### Fase 5.1 — Setup (1 día)
- Crear nuevo proyecto Next.js 14+ con App Router
- Instalar dependencias: `@supabase/supabase-js`, `framer-motion`, `lucide-react`
- Configurar tailwind, theme provider, auth
- Mover componentes compartidos (SEO, OptimizedImage, etc.)
- Configurar Vercel con variables de entorno

### Fase 5.2 — Páginas críticas (2 días)
- Home (SSG + ISR)
- Productos (SSG + ISR)
- Productos individuales (SSG + ISR)
- Blog (SSG + ISR)
- Blog posts (SSG + ISR)
- Bienestar (SSG + ISR)
- Bienestar articles (SSG + ISR)

### Fase 5.3 — Páginas secundarias (2 días)
- Sobre nosotros
- Contacto
- FAQ
- Oportunidad Fuxion
- Ayuda
- Términos, privacidad, cookies
- Hub pages
- Categorías
- Opiniones
- Carrito

### Fase 5.4 — API Routes (1 día)
- `/api/sitemap/route.jsx` — Sitemap dinámico
- `/api/og/route.jsx` — OG dinámico (Canvas)
- `/api/rss/route.jsx` — RSS feed
- `/api/search/route.jsx` — Búsqueda

### Fase 5.5 — Optimizaciones (1 día)
- Next/Image para todas las imágenes
- Font optimization (Google Fonts automático)
- Metadata API (títulos, descripciones, OG)
- Middleware (redirects, canonical, hreflang)
- ISR configs (revalidate: 3600 para artículos, revalidate: 86400 para productos)
- Sitemap + robots.txt dinámicos

### Fase 5.6 — Testing (1 día)
- Lighthouse (métricas CWV)
- Google Search Console
- Rich Results Test
- Comparar con versión actual
- Deploy a Vercel preview

## 4. Migración de código

### Lo que se reutiliza (sin cambios)
- `src/lib/productSeo.js` (schemas)
- `src/lib/entityResolutionEngine.ts`
- `src/lib/articleEnrichmentService.ts`
- `src/lib/programmaticSeoGenerator.js`
- `src/lib/hubCatalog.js`
- `src/lib/performance.js`
- `src/lib/ogImageGenerator.js`
- `src/lib/ogCanvas.js`
- `src/components/SEO.jsx`
- `src/components/OptimizedImage.jsx`
- `src/components/PerformanceProvider.jsx`
- `src/components/TestimonialsSection.jsx`
- `src/hooks/useCoreWebVitals.js`

### Lo que se migra (con cambios mínimos)
- Páginas de React Router → App Router
- `react-helmet` → Next.js Metadata API
- `useParams` → params del App Router
- `Link` de react-router → `Link` de next/link
- `useNavigate` → `useRouter` de next/navigation

### Lo que se elimina
- `react-router-dom`
- `vite.config.js`
- `index.html` (reemplazado por `app/layout.jsx`)
- `main.jsx` (reemplazado por `app/layout.jsx`)

### Lo que se añade
- `next.config.js`
- `app/layout.jsx` (root layout)
- `app/head.jsx` (metadata global)
- `middleware.ts` (redirects, canonical, hreflang)
- `public/` (static assets)

## 5. Configuración de metadata

```jsx
// app/[category]/[slug]/page.jsx
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image_url, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: post.created_at,
      authors: ['Daniel Falcón'],
      tags: parseCategories(post.category),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
    },
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
    other: {
      'article:author': 'Daniel Falcón',
      'article:published_time': post.created_at,
    },
  };
}
```

## 6. ISR (Incremental Static Regeneration)

| Tipo de página | revalidate | Cache |
|---------------|------------|-------|
| Home | 3600s (1h) | ISR |
| Productos | 86400s (24h) | ISR |
| Productos individuales | 3600s (1h) | ISR |
| Artículos de blog | 300s (5min) | ISR |
| Artículos de bienestar | 300s (5min) | ISR |
| Hub pages | 3600s (1h) | ISR |
| Páginas estáticas | false | SSG |

## 7. Benefits estimados

| Métrica | Actual (SPA) | Con Next.js |
|---------|-------------|-------------|
| LCP | ~2-4s | <1s |
| CLS | 0.05-0.15 | <0.02 |
| INP | 200-500ms | <100ms |
| Time to First Byte | 800ms-2s | <200ms |
| Indexación | 3-7 días | Horas |
| Rich Results | Parcial | Completo |
| TTFB (Edge) | N/A | <50ms |

## 8. Costos

| Recurso | Costo mensual |
|---------|--------------|
| Vercel Hobby | $0 |
| Supabase | $0 (plan gratis) |
| **Total** | **$0** |

## 9. Timeline estimado

| Semana | Entrega |
|--------|---------|
| 1 | Setup + Home + Productos |
| 2 | Blog + Bienestar + Páginas secundarias |
| 3 | API Routes + Optimizaciones + Testing |
| 4 | Deploy + Monitoreo + Ajustes |

## 10. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Ruptura de estilos | Media | Mismo Tailwind, revisar clases |
| Ruptura de rutas | Baja | Middleware con redirects |
| Ruptura de SEO | Baja | Mantener mismos schemas |
| Ruptura de funcionalidades | Media | Testing exhaustivo |
| Tiempo de desarrollo | Alta | Planificar 4 semanas |

## 11. Checklist de pre-migración

- [ ] Backup completo del código actual
- [ ] Exportar datos de Supabase (productos, artículos, testimonios)
- [ ] Documentar todas las rutas actuales
- [ ] Configurar dominio en Vercel
- [ ] Configurar variables de entorno
- [ ] Crear lista de verificación de rutas (roadmap)
