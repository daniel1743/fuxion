# Auditoría de Fusión de Dominios — BienestarEnClaro → TiendaFuXion

**Fecha de auditoría:** 16 de julio de 2026  
**Dominio nuevo:** `tiendafuxion.space`  
**Dominio antiguo:** `bienestarenclaro.com`  
**Tipo de migración:** Fusión completa de contenido y dominio  
**Sitio migrado:** 10 artículos de bienestar integrados en la sección `/bienestar/` de Tienda FuXion

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Fase 1 — Dominios y redirecciones](#fase-1--dominios-y-redirecciones)
3. [Fase 2 — Redirecciones de URLs](#fase-2--redirecciones-de-urls)
4. [Fase 3 — Contenido duplicado](#fase-3--contenido-duplicado)
5. [Fase 4 — Enlaces internos](#fase-4--enlaces-internos)
6. [Fase 5 — Sitemap](#fase-5--sitemap)
7. [Fase 6 — Robots.txt](#fase-6--robotstxt)
8. [Fase 7 — Schema markup](#fase-7--schema-markup)
9. [Fase 8 — Imágenes](#fase-8--imágenes)
10. [Fase 9 — Artículos de bienestar](#fase-9--artículos-de-bienestar)
11. [Fase 10 — Search Console](#fase-10--search-console)
12. [Fase 11 — Rendimiento](#fase-11--rendimiento)
13. [Fase 12 — AI SEO y EEAT](#fase-12--ai-seo-y-eeat)
14. [Hallazgos por gravedad](#hallazgos-por-gravedad)
15. [Lista de URLs afectadas](#lista-de-urls-afectadas)
16. [Acciones recomendadas por prioridad](#acciones-recomendadas-por-prioridad)
17. [Notas sobre el contenido migrado](#notas-sobre-el-contenido-migrado)

---

## 1. Resumen ejecutivo

Se identificaron **17 hallazgos** en la migración:

| Gravedad | Cantidad |
|----------|----------|
| 🔴 Crítico | 2 |
| 🟠 Alto | 4 |
| 🟡 Medio | 5 |
| 🟢 Bajo | 6 |

### Riesgos principales

| Riesgo | Nivel |
|--------|-------|
| Pérdida de autoridad del dominio antiguo | 🔴 Crítico |
| Pérdida de backlinks (dominio viejo sin redirección) | 🔴 Crítico |
| Entidades duplicadas en Google | 🟠 Alto |
| Señales EEAT débiles | 🟠 Alto |
| Slugs ilegibles en URLs | 🟡 Medio |
| Schema sameAs incorrecto | 🟡 Medio |
| Crawl budget desperdiciado | 🟡 Medio |
| Rich results afectados | 🟢 Bajo |

---

## Fase 1 — Dominios y redirecciones

### Hallazgo #1 — No existe redirección del dominio anterior 🔴 CRÍTICO

**Gravedad:** Crítica  
**Fase:** Redirects + Domains

**Evidencia:**
- `vercel.json` contiene solo 4 redirecciones internas: `/sobre-mi`, `/blog/:slug`, `/empieza-aqui`, `/preguntas-frecuentes`
- No hay redirección 301 de `bienestarenclaro.com` → `tiendafuxion.space`
- No hay configuración de dominio antiguo en Vercel (no se encontraron `domains`, `aliases` ni `redirects` para el dominio viejo)

**Impacto:**
- Todo el backlink equity del dominio `bienestarenclaro.com` se pierde
- Google no recibe señal de migración
- Los usuarios y bots que accedan al dominio antiguo obtendrán error 404
- Riesgo de pérdida de autoridad de dominio y ranking

**Recomendación:** Configurar `bienestarenclaro.com` como alias/redirección 301 en Vercel y registrar la migración en Google Search Console.

---

## Fase 2 — Redirecciones de URLs

### Hallazgo #2 — No hay mapeo de URLs antiguas a nuevas 🟠 ALTO

**Gravedad:** Alta

**Evidencia:** No existe documentación ni código que mapee las URLs de `bienestarenclaro.com/bienestar/*` a las nuevas URLs de `tiendafuxion.space/bienestar/*`.

**Impacto:**
- Si el dominio viejo llegara a indexarse, cada URL antigua generaría un soft 404 o error 410
- Los backlinks a URLs específicas de artículos se pierden

**Recomendación:** Crear un archivo de mapeo con todas las URLs antiguas → nuevas y configurar redirecciones 301 en Vercel.

---

## Fase 3 — Contenido duplicado

### Hallazgo #3 — Brand name contradictorio en footer 🟠 ALTO

**Gravedad:** Alta  
**Fase:** Duplicate Content + Internal Links

**Evidencia:** `src/components/Footer.jsx:76` y `Footer.jsx:151`:
```jsx
// Línea 76
Bienestar en Claro: Información basada en evidencia científica y nutrición inteligente.

// Línea 151
© {new Date().getFullYear()} {settings.site_name || 'Bienestar en Claro'}. Investigación y desarrollo por {settings.owner_name || 'Daniel Falcon'}.
```

**Impacto:**
- El nombre de la marca antigua aparece en el pie de página de **todas las páginas**
- Confusión para Google sobre cuál es la marca real del sitio
- Posible señal de contenido duplicado si el dominio viejo aún indexa
- Daña la percepción de EEAT

**Recomendación:** Reemplazar todas las menciones de "Bienestar en Claro" por "Tienda FuXion Chile" en el footer.

### Hallazgo #4 — Artículos de blog usan schema "Bienestar en Claro" 🟠 ALTO

**Gravedad:** Alta  
**Fase:** Schema + Duplicate Content

**Evidencia:** `src/pages/BlogPostPage.jsx:166`:
```json
{
  "@type": "Organization",
  "name": "Bienestar en Claro"
}
```

**Impacto:**
- Cada artículo de blog publicado en el nuevo dominio lleva el schema de la marca antigua
- Google asocia el contenido nuevo con la entidad "Bienestar en Claro"
- Si Google indexa ambos nombres, crea entidades duplicadas
- Daña la señal de autoridad de marca en los artículos migrados

**Recomendación:** Cambiar `"name": "Bienestar en Claro"` a `"name": "Tienda Fuxion Chile"` en el schema del publisher.

### Hallazgo #5 — About page usa "Sobre mí" y "Bienestar en Claro" 🟠 ALTO

**Gravedad:** Alta  
**Fase:** Schema + Duplicate Content

**Evidencia:** `src/pages/AboutPage.jsx:11-14`:
```jsx
<SEO 
  title="Sobre mí | Daniel Falcón - Bienestar en Claro"
  description="Conoce a Daniel Falcón, Investigador de Salud y Bienestar. Descubre la misión detrás de Bienestar en Claro y nuestra rigurosa metodología editorial."
/>
```

Y en el contenido de la página (línea 55):
```jsx
<h2>La misión detrás de Bienestar en Claro</h2>
```

**Impacto:**
- Title tag incluye nombre de marca antigua
- Meta description hace referencia a la marca antigua
- Contenido textual menciona "Bienestar en Claro" como nombre de la marca
- La página de "Sobre mí" es una señal fuerte de EEAT — el nombre equivocado afecta autoridad

**Recomendación:** Actualizar title, meta description y contenido textual de la About Page.

---

## Fase 4 — Enlaces internos

### Hallazgo #6 — No hay links internos entre artículos migrados 🟡 MEDIO

**Gravedad:** Media  
**Fase:** Internal Links

**Evidencia:** Los 10 artículos publicados en `docs/articles/` están escritos con enlaces internos entre ellos (ej. el artículo de "Disbiosis Intestinal" enlaza a "Eje Intestino-Cerebro"), pero no hay un sistema de internal linking visible en las páginas de `WellnessArticlePage.jsx`.

**Impacto:**
- Los artículos migrados no están conectados entre sí en la navegación del sitio
- Se pierde el beneficio de las clusters temáticas definidas en la editorial bible
- Mal uso del crawl budget

**Recomendación:** Implementar sección de "Artículos relacionados" en cada artículo de bienestar.

### Hallazgo #7 — Breadcrumb con nombre inconsistente 🟢 BAJO

**Gravedad:** Baja  
**Fase:** Internal Links

**Evidencia:** `src/pages/AboutPage.jsx:21-25`:
```html
<nav class="breadcrumb">
  <Link to="/">Inicio</Link> > Sobre mí
</nav>
```

Pero el breadcrumb debería ser "Sobre nosotros" para consistencia con el menú y el sitemap.

---

## Fase 5 — Sitemap

### Hallazgo #8 — Slugificados con caracteres especiales en URLs 🟡 MEDIO

**Gravedad:** Media  
**Fase:** URLs + Sitemap

**Evidencia:** URLs en `public/sitemap.xml`:
```
https://tiendafuxion.space/bienestar/celiaqu-a-vs-sensibilidad-al-gluten-no-cel-aca-mecanismos-inmunol-gicos-diferenciados
```

Los slugs contienen guiones medios (`-`) que parecen ser codificaciones de tildes y vocales con tilde (ej. `á` → `a`, `é` → `e`, `í` → `i`). Esto se debe al `slugify` que hace `.normalize('NFD').replace(/[̀-ͯ]/g, '')`.

**Impacto:**
- Los slugs pierden la información fonética del español
- URLs difíciles de leer para humanos (ej. "celiaqu-a" en lugar de "celiaquia")
- Peor CTR en SERPs
- No hay consistencia con el contenido (el H1 del artículo usa "Celiaquía")

**Recomendación:** Mejorar el algoritmo de slugificación para preservar caracteres ASCII legibles.

### Hallazgo #9 — No hay sitemap index para artículos de bienestar 🟢 BAJO

**Gravedad:** Baja  
**Fase:** Sitemap

**Evidencia:** `public/sitemap.xml` tiene `/bienestar` como página de categoría (prioridad 0.75), pero no hay un sitemap separado para artículos de bienestar. Los artículos individuales sí están en el sitemap principal, pero no hay estructura de sitemap index.

**Impacto:**
- No es crítico — todos los artículos están en el sitemap principal
- Podría optimizarse para sitios grandes

---

## Fase 6 — Robots.txt

### Hallazgo #10 — Robots.txt servido correctamente ⚪ OK

**Gravedad:** Ninguna  
**Fase:** Robots

**Evidencia:** `public/robots.txt` existe y es servido correctamente. Contiene reglas de `Disallow` para parámetros de búsqueda.

**Observación:** La configuración es correcta, aunque podría mejorarse añadiendo reglas para bloquear rutas de administración en producción.

---

## Fase 7 — Schema markup

### Hallazgo #11 — Schema de organización con misma URL en sameAs 🟡 MEDIO

**Gravedad:** Media  
**Fase:** Schema

**Evidencia:** `src/lib/productSeo.js:699-701` y `715-717`:
```json
{
  "@type": "Store",
  "sameAs": ["https://tiendafuxion.space"]
}
```

`sameAs` debería contener perfiles en redes sociales y Wikidata, no la URL del propio sitio.

**Impacto:**
- Señal de schema incorrecta para Google
- No conecta la marca con sus perfiles de redes sociales reales
- Pierde la oportunidad de fortalecer entidad

**Recomendación:** Agregar los mismos `sameAs` que en `site.js` (Instagram, Facebook, TikTok) y opcionalmente Wikidata.

### Hallazgo #12 — Wellness article service sin SEO meta generada automáticamente 🟢 BAJO

**Gravedad:** Baja  
**Fase:** Schema

**Evidencia:** `src/services/wellnessArticleService.js` no genera ni valida meta tags automáticos (title, description, canonical) al crear un artículo. Estos deben ser proporcionados manualmente.

**Impacto:**
- Riesgo de artículos sin metadata SEO
- Si un artículo se publica sin `image_url`, el schema tendrá imagen indefinida

### Hallazgo #13 — Artículos de bienestar sin fecha de publicación explícita en schema 🟢 BAJO

**Gravedad:** Baja  
**Fase:** Schema

**Evidencia:** `src/pages/WellnessArticlePage.jsx:70`:
```json
{
  "@type": "MedicalWebPage",
  "datePublished": article.published_at || article.created_at
}
```

Usa `|| article.created_at` como fallback. Si la columna `published_at` no existe en la base de datos de Supabase, se usa `created_at`, que puede ser anterior a la publicación real.

**Impacto:**
- Fechas de publicación potencialmente incorrectas en rich results
- Google puede mostrar fechas antiguas que confunden al usuario

**Recomendación:** Asegurar que `published_at` siempre esté poblado al crear artículos.

---

## Fase 8 — Imágenes

### Hallazgo #14 — Imágenes de artículos usan alt del título (potencialmente largo) 🟢 BAJO

**Gravedad:** Baja  
**Fase:** Images

**Evidencia:** `WellnessArticlePage.jsx:138`:
```jsx
<img src={article.image_url} alt={article.title} />
```

El `alt` viene del título del artículo, que puede ser muy largo para accesibilidad (ej. "Disbiosis Intestinal: Desequilibrio del Microbioma y su Relación con la Inflamación Sistémica").

**Recomendación:** Generar un alt descriptivo más corto o permitir alt personalizado por artículo.

---

## Fase 9 — Artículos de bienestar

### Hallazgo #15 — Parser de FAQPage Schema inconsistente 🟢 BAJO

**Gravedad:** Baja  
**Fase:** Schema + Articles

**Evidencia:** `src/pages/WellnessArticlePage.jsx:75-100` busca el patrón:
```
## Preguntas Frecuentes
### Pregunta
Respuesta
```

Pero muchos artículos usan formato de preguntas en negrita (`**Pregunta?** Respuesta`) en lugar de headers. Esto significa que el schema FAQPage probablemente no se genera para la mayoría de los artículos publicados.

**Impacto:**
- Los artículos publicados no aprovechan los rich results de FAQ
- Se pierde una oportunidad de ocupar más espacio en SERPs

**Recomendación:** Actualizar el parser para reconocer ambos formatos o estandarizar el formato de FAQ en los artículos.

---

## Fase 10 — Search Console

### Hallazgo #16 — No se verificó integración con Google Search Console 🟡 MEDIO

**Gravedad:** Media  
**Fase:** Search Console

**Evidencia:** No se encontró evidencia de que el dominio `tiendafuxion.space` haya sido registrado en Google Search Console como propiedad, ni se verificó la migración de `bienestarenclaro.com`.

**Impacto:**
- Sin visibilidad sobre indexación, errores de rastreo o penalizaciones
- Imposible monitorizar el impacto de la migración
- No se puede solicitar reindexación de las URLs migradas

**Recomendación:** Registrar el dominio en Google Search Console y solicitar reindexación de las URLs de artículos migrados.

---

## Fase 11 — Rendimiento

### Hallazgo #17 — Cache headers de imágenes con immutable 🟢 BAJO

**Gravedad:** Baja  
**Fase:** Performance

**Evidencia:** `vercel.json`:
```json
{
  "source": "/(.*).(jpg|jpeg|png|gif|svg|webp|ico|pdf)",
  "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
}
```

Las imágenes se sirven con `immutable`. Si se actualizan imágenes sin cambiar el nombre, el navegador servirá la versión cacheada.

**Recomendación:** Considerar cambiar a `max-age=31536000` sin `immutable` para imágenes que puedan actualizarse, o usar fingerprinting de archivos.

---

## Hallazgos por gravedad

### 🔴 Críticos (requieren corrección inmediata)

| # | Hallazgo | Ubicación |
|---|----------|-----------|
| 1 | No existe redirección del dominio anterior | `vercel.json` |
| 2 | Sin mapeo de URLs antiguas → nuevas | Código general |

### 🟠 Altos (corregir antes del próximo rastreo)

| # | Hallazgo | Ubicación |
|---|----------|-----------|
| 3 | Brand name contradictorio en footer | `src/components/Footer.jsx` |
| 4 | Artículos de blog usan schema "Bienestar en Claro" | `src/pages/BlogPostPage.jsx` |
| 5 | About page con nombre de marca antiguo | `src/pages/AboutPage.jsx` |

### 🟡 Medios (corregir en 1-2 semanas)

| # | Hallazgo | Ubicación |
|---|----------|-----------|
| 6 | Sin links internos entre artículos migrados | `src/pages/WellnessArticlePage.jsx` |
| 7 | Slugs ilegibles en URLs | `scripts/generate-sitemap.js` |
| 8 | Schema sameAs incorrecto | `src/lib/productSeo.js` |
| 9 | No integrado con Google Search Console | — |

### 🟢 Bajos (mejoras recomendadas)

| # | Hallazgo | Ubicación |
|---|----------|-----------|
| 10 | Breadcrumb con nombre inconsistente | `src/pages/AboutPage.jsx` |
| 11 | Sitemap sin index para artículos | `public/sitemap.xml` |
| 12 | Service sin meta SEO automática | `src/services/wellnessArticleService.js` |
| 13 | Fecha de publicación fallback en schema | `src/pages/WellnessArticlePage.jsx` |
| 14 | Alt de imágenes demasiado largo | `src/pages/WellnessArticlePage.jsx` |
| 15 | Parser FAQPage inconsistente | `src/pages/WellnessArticlePage.jsx` |
| 16 | Cache immutable en imágenes | `vercel.json` |

---

## Lista de URLs afectadas

### URLs que pierden autoridad (sin redirección 301):
- `https://bienestarenclaro.com/*` — todas las URLs antiguas
- Cualquier backlink existente hacia `bienestarenclaro.com`

### URLs con contenido duplicado potencial:
- `https://tiendafuxion.space/sobre-nosotros` — menciona "Bienestar en Claro"
- `https://tiendafuxion.space/articulos/*` — schema de publisher dice "Bienestar en Claro"
- `https://tiendafuxion.space/bienestar/*` — slugificados con caracteres especiales

### URLs con metadata subóptima:
- Todas las URLs — title tag genérico " | Tienda Fuxion Chile"
- Homepage — og:image:url tag deprecated

---

## Acciones recomendadas por prioridad

### Inmediatas (antes del próximo rastreo de Google):

1. Configurar redirección 301 de `bienestarenclaro.com` → `tiendafuxion.space` en Vercel
2. Registrar la migración en Google Search Console
3. Corregir el nombre de marca en footer (reemplazar "Bienestar en Claro")
4. Corregir publisher name en schema de artículos de blog

### Corto plazo (1-2 semanas):

5. Actualizar AboutPage con nombre de marca correcto y "Sobre nosotros"
6. Mejorar algoritmo de slugificación para URLs legibles en español
7. Corregir schema sameAs con redes sociales reales
8. Implementar sección de artículos relacionados en WellnessArticlePage

### Mediano plazo (1 mes):

9. Crear sitemap index con sitemap de artículos de bienestar separado
10. Implementar breadcrumbs con schema.org en todas las páginas
11. Verificar que todos los artículos de bienestar tengan `published_at` válido
12. Revisar y corregir imágenes de productos rotas o sin ALT

---

## Notas sobre el contenido migrado

Los **10 artículos migrados** tienen **excelente calidad editorial**:

- ✅ Bien estructurados con jerarquía H1/H2/H3
- ✅ Con referencias científicas citadas (PubMed, NIH, OMS)
- ✅ Con tablas comparativas
- ✅ Con secciones de desmitificación
- ✅ Con disclaimer médico visible
- ✅ Con FAQ integrado (pero no siempre reconocido por el parser de schema)

### Artículos publicados (10 de 200 planificados):

| # | Título | Slug | Estado |
|---|--------|------|--------|
| 1 | Disbiosis Intestinal | `disbiosis-intestinal-desequilibrio-del-microbioma-y-su-relaci-n-con-la-inflamaci-n-sist-mica` | ✅ Publicado |
| 2 | Permeabilidad Intestinal | `permeabilidad-intestinal-mecanismos-de-la-barrera-epitelial-y-factores-moduladores` | ✅ Publicado |
| 3 | Síndrome del Intestino Irritable | `s-ndrome-del-intestino-irritable-sii-eje-intestino-cerebro-y-alteraciones-de-la-motilidad` | ✅ Publicado |
| 4 | SIBO | `sibo-sobrecrecimiento-bacteriano-migraci-n-microbiana-y-fermentaci-n-prematura` | ✅ Publicado |
| 5 | Eje Intestino-Cerebro | `eje-intestino-cerebro-v-as-de-comunicaci-n-bidireccional-y-neurotransmisores-ent-ricos` | ✅ Publicado |
| 6 | Hígado Graso No Alcohólico | `h-gado-graso-no-alcoh-lico-hgna-acumulaci-n-lip-dica-y-estr-s-oxidativo-hep-tico` | ✅ Publicado |
| 7 | Reflujo Gastroesofágico | `reflujo-gastroesof-gico-erge-e-hipoclorhidria-mecanismos-del-esf-nter-y-acidez` | ✅ Publicado |
| 8 | Celiaquía vs Sensibilidad al Gluten | `celiaqu-a-vs-sensibilidad-al-gluten-no-cel-aca-mecanismos-inmunol-gicos-diferenciados` | ✅ Publicado |
| 9 | Digestión Enzimática Exocrina | `digesti-n-enzim-tica-exocrina-funci-n-pancre-tica-y-descomposici-n-de-macronutrientes` | ✅ Publicado |
| 10 | Fibra Soluble vs Insoluble | `fibra-soluble-vs-insoluble-impacto-en-la-motilidad-y-modulaci-n-del-microbioma` | ✅ Publicado |

### Plan editorial pendiente: 190 artículos restantes

Los artículos restantes cubren 5 dominios temáticos:
1. Salud Digestiva, Microbioma y Eje Entérico (40 temas)
2. Salud Metabólica, Nutrición Celular y Obesidad (40 temas)
3. Neurobiología, Sueño, Estrés y Salud Mental Funcional (40 temas)
4. Endocrinología, Salud Femenina, Inmunidad y Longevidad (40 temas)
5. Fisiología Cardiovascular, Ejercicio, Biomecánica y Funciones Sistémicas Generales (40 temas)

---

*Informe generado el 16 de julio de 2026 — Auditoría SEO de fusión de dominios BienestarEnClaro → TiendaFuXion*
