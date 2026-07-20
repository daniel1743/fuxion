# Implementaciones Pendientes — Bienestar en Claro

> **Fecha:** 2026-07-19  
> **Estado:** Fase 1 y Fase 2 completadas. Estas implementaciones son las siguientes prioridades.

---

## Tabla de Contenidos

1. [Email Corporativo](#1-email-corporativo)
2. [Sitemap Dinámico con Blog de Supabase](#2-sitemap-dinamico-con-blog-de-supabase)
3. [Hub Pages por Silo Temático](#3-hub-pages-por-silo-tematico)
4. [Imágenes OG Dinámicas por Artículo](#4-imagenes-og-dinamicas-por-articulo)
5. [AggregateRating en Testimonios](#5-aggregaterating-en-testimonios)
6. [Migrar a Next.js (SSR) para SEO Agresivo](#6-migrar-a-nextjs-ssr-para-seo-agresivo)

---

## 1. Email Corporativo

### Por qué es importante

Cuando Google valida tu sitio, busca señales de confianza. Un email corporativo en el footer, en la página de contacto, en los schemas JSON-LD y en el manifest de la PWA es una de esas señales. Sin un email propio, Google trata tu sitio como "sitio temporal" o "personal", no como una empresa real.

Además, el schema `contactPoint` que ya implementamos en la Organización tiene un email pendiente. Sin él, el schema está incompleto y Google no puede validar tu identidad.

### Qué hacer

1. **Crear la cuenta:** `contacto@bienestarenclaro.com`
2. **Configurar DNS:**
   - TXT record para SPF: `v=spf1 include:_spf.google.com ~all`
   - MX record apuntando al proveedor
   - DKIM y DMARC para autenticación de correo
3. **Actualizar el código:** Cuando la cuenta esté lista, editar `src/lib/productSeo.js` y cambiar el email en los schemas:
   ```javascript
   email: 'contacto@bienestarenclaro.com'
   ```
4. **Agregar al manifest:** `public/manifest.json` en el campo `email` si el proveedor lo soporta.
5. **Agregar al footer:** Mostrar el email en la página de contacto y en el footer de todas las páginas.

### Impacto en SEO

- ✅ Mejora la validación de entidad (Entity SEO)
- ✅ Fortalece el schema Organization
- ✅ Señal de confianza para Google
- ✅ Necesario para Google Business Profile

---

## 2. Sitemap Dinámico con Blog de Supabase

### Por qué es importante

Actualmente, el sitemap se genera con `scripts/generate-sitemap.js` que lee:
- Productos de `fuxion_database.json`
- Wellness articles de un cache en `wellness-articles-cache.json`
- Páginas estáticas

**Pero NO incluye los artículos de blog de Supabase.**

Esto significa que Google no sabe que existen tus artículos de blog y no los indexa. Un artículo nuevo publicado hoy no aparecerá en el sitemap hasta que alguien lo descubra manualmente.

El sitemap es la forma más directa de decirle a Google: "aquí están todas mis páginas, indexalas". Sin él, la indexación es lenta y aleatoria.

### Qué hacer

El script actual (`scripts/generate-sitemap.js`) tiene una función `loadWellnessArticleSlugs()` que lee de un archivo cache. Hay que agregar una función similar para blog posts:

```javascript
// scripts/generate-sitemap.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function loadBlogPostSlugs() {
  const { data } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false });
    
  return data.map(post => ({ slug: post.slug, updated_at: post.updated_at }));
}
```

Luego agregar al sitemap:
```javascript
for (const post of blogPosts) {
  urls.push(`  <url>
    <loc>${SITE_URL}/articulos/${post.slug}</loc>
    <lastmod>${post.updated_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>`);
}
```

### Consideraciones

- **Variables de entorno:** `SUPABASE_URL` y `SUPABASE_ANON_KEY` deben estar en un `.env` (nunca hardcodear)
- **Build time:** El script corre en `npm run build`, así que el sitemap se genera al hacer deploy
- **Fallback:** Si la conexión falla, el script debe generar un sitemap sin los blog posts, sin romper el build
- **Cache:** Considerar cachear la respuesta de Supabase por 1 hora para no hacer muchas consultas

### Impacto en SEO

- ✅ Google indexa todos tus artículos de blog
- ✅ Actualización automática de `lastmod` cada vez que se publica o modifica un artículo
- ✅ Más páginas indexadas = más oportunidades de tráfico
- ✅ Los artículos con contenido fresco se indexan más rápido

---

## 3. Hub Pages por Silo Temático

### Por qué es importante

Google entiende que un sitio es experto en un tema cuando publica **muchos artículos sobre ese tema**. No basta con publicar un artículo sobre "obesidad". Necesitas 50, 100, 200 artículos sobre obesidad, control de peso, metabolismo, nutrición para bajar de peso, etc.

Esto se llama **authority temática** o **tema cluster**.

Tu sitio tiene 32 condiciones médicas, pero cada una tiene solo una página. Para dominar el tema, necesitas:

```
Silo: Salud Digestiva (página pilar)
├── Página hija: Estreñimiento (hub page)
│   ├── Artículo: "¿Qué es el estreñimiento?"
│   ├── Artículo: "Estreñimiento y embarazo"
│   ├── Artículo: "Estreñimiento en niños"
│   └── Producto: PRUNEX 1
├── Página hija: Síndrome del Intestino Irritable
│   ├── Artículo: "¿Qué es el SII?"
│   ├── Artículo: "SII y alimentos"
│   └── Producto: FLORA LIV
└── Página hija: Disbiosis Intestinal
    └── Artículo: "¿Qué es la disbiosis?"
```

### Qué hacer

1. **Definir los silos** (agrupar condiciones por categoría):
   - Salud Digestiva (estreñimiento, SII, disbiosis, microbiota)
   - Salud Mental (ansiedad, depresión, estrés, insomnio)
   - Salud Cardiovascular (hipertensión, colesterol, obesidad)
   - Nutrición y Metabolismo
   - Salud Hormonal (menopausia, hipotiroidismo)

2. **Crear hub pages** como páginas intermedias:
   ```
   /bienestar/digestivo/      → Hub de salud digestiva
   /bienestar/mental/         → Hub de salud mental
   /bienestar/cardiovascular/ → Hub cardiovascular
   ```

3. **Cada hub page debe tener:**
   - Descripción general del silo
   - Lista de todas las sub-condiciones
   - Productos relacionados del silo
   - Artículos recientes del silo
   - Enlaces internos hacia cada sub-página

4. **Cada sub-página debe enlazar:**
   - De vuelta al hub (breadcrumb)
   - A las otras sub-páginas del mismo silo
   - A los productos relacionados

### Impacto en SEO

- ✅ Google entiende que eres experto en el tema
- ✅ Distribuye autoridad entre páginas (link equity)
- ✅ Más páginas indexadas por tema
- ✅ Mejor posicionamiento para keywords del silo
- ✅ Los usuarios encuentran contenido relacionado fácilmente

---

## 4. Imágenes OG Dinámicas por Artículo

### Por qué es importante

Cuando compartes un artículo en WhatsApp, Facebook, Twitter o LinkedIn, la plataforma muestra una vista previa con imagen y título. Esta vista previa se genera con los meta tags `og:image` y `og:title`.

Actualmente, cada artículo usa su propia `image_url` si existe, pero si no tiene imagen, usa la imagen OG del root. Esto significa que **un artículo sobre "obesidad" compartido en redes muestra una imagen genérica de "Bienestar en Claro"**, no una imagen que hable del tema.

Una imagen personalizada para cada artículo aumenta el CTR (click-through rate) al compartir en redes sociales en un 30-50%.

### Qué hacer

**Opción A — Imágenes pre-generadas (más fácil):**
Al publicar un artículo, generar una imagen OG usando un template:
- Fondo degradado con el color del silo (verde para digestivo, azul para mental, etc.)
- Título del artículo en tipografía grande y legible
- Logo de Bienestar en Claro en esquina
- Categoría como badge

Se puede hacer con `sharp` o `canvas` en Node.js, o con herramientas como `@vercel/og`.

**Opción B — Imágenes dinámicas (más avanzado):**
Usar un endpoint que genere la imagen al vuelo:
```javascript
// src/app/api/og/[slug]/route.ts (Next.js)
export async function GET(request, { params }) {
  const post = await getPostBySlug(params.slug);
  const image = await generateOgImage({
    title: post.title,
    category: post.category,
    logo: '/logo.png'
  });
  return new Response(image, { headers: { 'Content-Type': 'image/png' } });
}
```

Luego en el artículo:
```html
<meta property="og:image" content="https://www.bienestarenclaro.com/api/og/{{slug}}" />
```

### Consideraciones

- **Dimensiones:** Siempre 1200x630 (ratio 2:1)
- **Formato:** PNG o JPEG
- **Texto grande:** En móvil la imagen se ve pequeña, el texto debe ser legible a 300px de ancho
- **Accesibilidad:** Incluir `og:image:alt` con descripción
- **Cache:** Las imágenes pre-generadas se cachean en CDN

### Impacto en SEO

- ✅ Más clicks cuando se comparte en redes sociales
- ✅ Más tráfico referido
- ✅ Mejor experiencia de usuario al compartir
- ✅ Mayor alcance orgánico

---

## 5. AggregateRating en Testimonios

### Por qué es importante

Cuando Google ve estrellas de calificación en los resultados de búsqueda, aumenta el CTR en 10-30%. Las estrellas se muestran con el schema `AggregateRating`.

Actualmente, tu sitio tiene testimonios en `src/components/TestimonialsSection.jsx`, pero no hay un schema de rating asociado. Google ve los testimonios como texto plano, no como ratings.

### Qué hacer

1. **Crear el schema** en la página donde aparecen los testimonios:

```javascript
const aggregateRatingSchema = {
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  'itemRated': {
    '@type': 'Organization',
    'name': 'Bienestar en Claro'
  },
  'ratingValue': '4.8',
  'bestRating': '5',
  'worstRating': '1',
  'ratingCount': 127,
  'reviewCount': 43
};
```

2. **Para cada testimonio individual:**
```javascript
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  'author': {
    '@type': 'Person',
    'name': testimonio.nombre
  },
  'datePublished': testimonio.fecha,
  'reviewBody': testimonio.contenido,
  'reviewRating': {
    '@type': 'Rating',
    'ratingValue': testimonio.estrellas,
    'bestRating': '5'
  }
};
```

3. **Agregar a la página de testimonios:**
```javascript
import { buildAggregateRatingSchema } from '@/lib/productSeo';

<SEO
  schema={[
    buildAggregateRatingSchema({
      ratingValue: 4.8,
      bestRating: 5,
      ratingCount: 127,
      reviewCount: 43
    })
  ]}
/>
```

### Consideraciones

- **Datos reales:** Solo reportar ratings reales, no inventarlos
- **Cantidad mínima:** Google recomienda al menos 4-5 ratings
- **Transparencia:** Mostrar cómo se calcularon los ratings
- **Verificación:** Si puedes, pide a los usuarios que también opinen en Google Business Profile

### Impacto en SEO

- ✅ Estrellas en los resultados de búsqueda
- ✅ Mayor CTR (10-30%)
- ✅ Señal de confianza para usuarios
- ✅ Mejor posicionamiento indirecto

---

## 6. Migrar a Next.js (SSR) para SEO Agresivo

### Por qué es importante

**Este es el cambio más importante para SEO agresivo.**

Actualmente, tu sitio es un **SPA (Single Page Application)** con React Router. Cuando Google visita tu sitio:

1. Google descarga el HTML vacío (`<div id="root"></div>`)
2. Google ejecuta JavaScript
3. Google espera a que React monte la página
4. Google lee el contenido

Esto funciona, pero tiene problemas:

- **Lento:** Google tarda más en indexar
- **No confiable:** Si hay errores en el renderizado, el contenido no aparece
- **Sin SSR:** No puedes renderizar contenido en el servidor
- **Sin SSG:** No puedes generar páginas estáticas para velocidad máxima
- **Sin ISR:** No puedes actualizar contenido sin redeploy completo

Con **Next.js (SSR/SSG)**, Google ve el contenido completo en el primer HTML que descarga. Es instantáneo, confiable y permite técnicas avanzadas.

### Qué hacer

1. **Elegir el framework:**
   - **Next.js App Router** (recomendado para proyectos nuevos)
   - **Next.js Pages Router** (más maduro, más fácil de migrar)

2. **Migración progresiva:**
   - Primero migrar las páginas estáticas (Home, Sobre Nosotros, Contacto)
   - Luego las páginas dinámicas (Productos, Artículos)
   - Mantener el SPA actual funcionando hasta que la migración esté completa

3. **Estrategia de migración:**
   ```
   Semana 1: Setup Next.js + configuración básica
   Semana 2: Migrar páginas estáticas
   Semana 3: Migrar páginas de productos (dinámicas)
   Semana 4: Migrar páginas de blog y bienestar
   Semana 5: Testing y optimización
   Semana 6: Deploy y monitoreo
   ```

4. **Técnicas de SEO en Next.js:**
   - **SSG (Static Site Generation):** Para páginas que no cambian seguido
   - **SSR (Server-Side Rendering):** Para contenido dinámico
   - **ISR (Incremental Static Regeneration):** Para actualizar contenido sin redeploy
   - **Metadata API:** Para OG tags, títulos, descripciones
   - **Image Optimization:** Imágenes automáticas en WebP/AVIF
   - **Font Optimization:** Fuentes cargadas eficientemente
   - **Route Handlers:** Para APIs (como generar imágenes OG dinámicas)

### Impacto en SEO

- ✅ Indexación inmediata de Google (no necesita ejecutar JS)
- ✅ Core Web Vitals mejorados (LCP, CLS, INP)
- ✅ Mejor rendimiento global
- ✅ Más rápido en móviles
- ✅ SEO agresivo real
- ✅ Mejor experiencia de usuario

### Costo-Beneficio

| Aspecto | SPA actual | Next.js |
|---|---|---|
| Tiempo de implementación | Inmediato | 4-6 semanas |
| Indexación de Google | Lenta | Inmediata |
| Core Web Vitals | Regular | Excelente |
| SEO agresivo | Limitado | Completo |
| Mantenimiento | Fácil | Moderado |
| Rendimiento | Bueno | Excelente |

---

## Resumen de Prioridades

| Prioridad | Implementación | Esfuerzo | Impacto |
|---|---|---|---|
| 1 | Email corporativo | Bajo | Alto |
| 2 | Sitemap dinámico con blog | Medio | Alto |
| 3 | Hub pages por silo temático | Alto | Alto |
| 4 | Imágenes OG dinámicas | Medio | Medio |
| 5 | AggregateRating en testimonios | Bajo | Medio |
| 6 | Migrar a Next.js (SSR) | Muy Alto | Muy Alto |

**Recomendación:** Empezar por Email corporativo (semanas 1-2), luego Sitemap dinámico (semana 3), y planear la migración a Next.js como proyecto a largo plazo.
