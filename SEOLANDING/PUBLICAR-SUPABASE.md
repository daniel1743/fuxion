# GUÍA: Publicar artículos en Supabase

**Archivo de origen:** `public/converted-articles.json`
**Cantidad de artículos:** 130
**Tablas de destino:** `blog_posts` (Supabase)

---

## PASO 1: Preparar la tabla blog_posts

1. Abrir [app.supabase.com](https://app.supabase.com)
2. Seleccionar tu proyecto
3. Ir a **Table Editor** → seleccionar tabla `blog_posts`
4. Verificar que las columnas existen:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `title` | text | Título del artículo |
| `slug` | text | Slug único (URL) |
| `content` | text | Contenido en Markdown |
| `excerpt` | text | Resumen breve |
| `category` | text | Categoría (ej: "Nutrición, Metabolismo y Peso Corporal") |
| `tags` | text[] | Array de tags |
| `reading_time_minutes` | integer | Tiempo estimado de lectura |
| `is_published` | boolean | true = publicado, false = borrador |
| `created_at` | timestamp | Fecha de creación |
| `updated_at` | timestamp | Fecha de actualización |

Si alguna columna no existe, crearla con el tipo indicado.

---

## PASO 2: Importar los 130 artículos

### Opción A: Desde el Panel de Supabase (recomendado para pocos registros)

1. Ir a **Table Editor** → seleccionar `blog_posts`
2. Clic en **Import CSV** o **Insert row**
3. Como son 130, es mejor usar **SQL Editor**

### Opción B: Usando SQL Editor (recomendado)

1. Ir a **SQL Editor** en el panel de Supabase
2. Copiar el contenido de `public/converted-articles.json`
3. Usar este SQL template (adaptarlo):

```sql
INSERT INTO blog_posts (title, slug, content, excerpt, category, tags, reading_time_minutes, is_published, created_at, updated_at)
VALUES 
  ('¿Qué es Terapia farmacológica (Agonistas GLP-1/GIP)?', 'nutricion-metabolismo-y-peso-corporal-terapia-farmacologica-agonistas-glp-1-gip', '...', '...', 'Nutrición, Metabolismo y Peso Corporal', ARRAY['nutricion-metabolismo-y-peso-corporal', 'terapia-farmacologica-agonistas-glp-1-g'], 2, false, NOW(), NOW()),
  ('...', '...', '...', '...', '...', ARRAY['...'], 2, false, NOW(), NOW()),
  ...;
```

### Opción C: Usando un script Node.js (automatizado)

Si tienes acceso al proyecto, puedes usar este script:

```javascript
// scripts/import-to-supabase.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const articles = JSON.parse(fs.readFileSync('./public/converted-articles.json', 'utf-8'));

async function importArticles() {
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(
      articles.map(a => ({
        title: a.title,
        slug: a.slug,
        content: a.content,
        excerpt: a.excerpt,
        category: a.category,
        tags: a.tags,
        reading_time_minutes: a.reading_time_minutes,
        is_published: false,
        created_at: a.created_at,
        updated_at: a.updated_at,
      })),
      { onConflict: 'slug' }
    );
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`✅ ${data.length} artículos importados`);
}

importArticles();
```

---

## PASO 3: Activar los artículos (PUBLICAR)

Después de importar, hay que marcar los artículos como publicados:

```sql
UPDATE blog_posts 
SET is_published = true 
WHERE is_published = false;
```

O individualmente:

```sql
UPDATE blog_posts 
SET is_published = true 
WHERE slug = 'nutricion-metabolismo-y-peso-corporal-terapia-farmacologica-agonistas-glp-1-gip';
```

---

## PASO 4: Verificar que aparecen en el frontend

1. Ir a tu sitio: `https://www.bienestarenclaro.com/bienestar/<slug>`
2. Verificar que el artículo se muestra correctamente
3. Verificar que el schema JSON-LD es correcto

---

## PASO 5: Actualizar el sitemap

1. Ejecutar en la terminal del proyecto:
```bash
node scripts/generate-sitemap.js
```

2. Verificar `public/sitemap.xml` — deben aparecer las nuevas URLs:
```xml
<url>
  <loc>https://www.bienestarenclaro.com/bienestar/nutricion-metabolismo-y-peso-corporal-terapia-farmacologica-agonistas-glp-1-gip</loc>
  <lastmod>2026-07-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.65</priority>
</url>
```

---

## PASO 6: Enviar a Google

1. Ir a [Google Search Console](https://search.google.com/search-console)
2. Verificar dominio (si aún no está verificado)
3. Subir el sitemap: **Sitemaps** → pegar `https://www.bienestarenclaro.com/sitemap.xml`
4. Solicitar indexación de URLs individuales:
   - Ir a **Inspección de URL** → pegar la URL del artículo → clic en **Solicitar indexación**

---

## ⚠️ Cosas que debes hacer MANUALMENTE

1. **Configurar las credenciales de Supabase** — no las comparto por seguridad
2. **Verificar el dominio en Search Console** — es un proceso manual
3. **Revisar los artículos antes de publicar** — revisar calidad, ortografía, accuracy
4. **Subir imágenes** — cada artículo debería tener una imagen (actualmente no tienen)
5. **Configurar el email corporativo** — `contacto@bienestarenclaro.com` para LocalBusiness
6. **Registrar Google Business Profile** — para LocalBusiness schema

---

## 🤖 ¿Puede un agente IA hacer esto por ti?

**Lo que un agente IA puede hacer:**
- ✅ Generar el SQL de inserción
- ✅ Crear el script de importación
- ✅ Actualizar el sitemap
- ✅ Generar los artículos

**Lo que un agente IA NO puede hacer:**
- ❌ Acceder a tu cuenta de Supabase
- ❌ Acceder a Google Search Console
- ❌ Verificar el dominio
- ❌ Revisar la calidad del contenido
- ❌ Subir imágenes

**Mi recomendación:** Que un agente genere el SQL y el script, pero tú ejecutes la importación y verifiques los resultados.

---

## 📋 Checklist de publicación

- [ ] Tabla `blog_posts` tiene todas las columnas necesarias
- [ ] 130 artículos importados en Supabase
- [ ] Artículos marcados como `is_published = true`
- [ ] Artículos visibles en el frontend
- [ ] Sitemap actualizado (`node scripts/generate-sitemap.js`)
- [ ] Sitemap enviado a Google Search Console
- [ ] URLs solicitadas para indexación en Google
- [ ] Revisión manual de 5-10 artículos aleatorios
