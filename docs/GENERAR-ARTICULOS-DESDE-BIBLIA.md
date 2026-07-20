# Guía: Generar los 200+ artículos desde la biblia

## ¿Qué hace este script?

`scripts/convert-biblia-to-articles.mjs` lee `biblia_bienestar.json` (6 módulos, 200+ intervenciones médicas) y genera un artículo enriquecido por cada intervención. Cada artículo tiene:

- Título descriptivo: `"Aumento de Proteína — Nutrición, Metabolismo y Peso Corporal"`
- Contenido estructurado: mecanismo, beneficios, evidencia, errores
- FAQs automáticas (3 preguntas)
- Keywords semánticos
- Schema JSON-LD (MedicalWebPage)
- Score de enriquecimiento

## Requisitos previos

### 1. Tabla `wellness_articles` en Supabase

El script asume que la tabla `wellness_articles` ya existe en tu proyecto de Supabase. Si no la tienes, crea la tabla con estas columnas mínimas:

```sql
CREATE TABLE wellness_articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT true,
  enriched BOOLEAN DEFAULT false,
  source_module_id INTEGER,
  source_intervention_id INTEGER,
  entity_detected TEXT,
  entity_slug TEXT,
  evidence_level TEXT,
  faqs JSONB,
  related_products TEXT[],
  semantic_keywords TEXT[],
  seo_schema JSONB,
  enrichment_score NUMERIC,
  status TEXT DEFAULT 'pending',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Dependencia npm

El script usa `@supabase/supabase-js`. Si no está instalado:

```bash
npm install @supabase/supabase-js
```

### 3. Variables de entorno

Copia el archivo `.env.example` y configura tus credenciales:

```bash
cp .env.example .env
```

Luego edita `.env` con tus valores reales:

- `SUPABASE_URL`: Tu URL de proyecto (ej: `https://abc123.supabase.co`)
- `SUPABASE_KEY`: Tu **Service Role Key** (no la Anon key)

Para obtener la Service Role Key:
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. Copia la **service_role** key (no la anon key)

## Ejecución

### Paso 1: Configurar

```bash
# Crear archivo .env si no existe
cp .env.example .env

# Editar con tus credenciales
# Windows: notepad .env
# Mac/Linux: nano .env
```

### Paso 2: Ejecutar el script

```bash
node scripts/convert-biblia-to-articles.mjs
```

### Paso 3: Verificar

```sql
-- En Supabase SQL Editor:
SELECT COUNT(*) FROM wellness_articles WHERE enriched = true;
SELECT * FROM wellness_articles ORDER BY created_at DESC LIMIT 5;
```

### Paso 4: Regenerar sitemap

```bash
npm run sitemap
```

## Qué verás al ejecutar

```
📚 Cargando biblia_bienestar.json...

Proyecto: Bienestar en Claro v2.0 - Completa
Módulos: 6
Fuentes bibliográficas: 70

📝 Módulo 1: Nutrición, Metabolismo y Peso Corporal (50 intervenciones)
   → 50 artículos generados
📝 Módulo 2: Salud Intestinal, Disbiosis y Estreñimiento (30 intervenciones)
   → 30 artículos generados
📝 Módulo 3: Neurobiología del Sueño, Sistema Inmune y Descanso (0 intervenciones)
   ⏭️  Omitido
📝 Módulo 4: Salud Mental, Estrés Crónico y Función Cognitiva (30 intervenciones)
   → 30 artículos generados
📝 Módulo 5: Hidratación Clínica, Termorregulación y Nutrición Celular (20 intervenciones)
   → 20 artículos generados
📝 Módulo 6: Ejercicio, Aparato Cardiovascular y Longevidad Funcional (0 intervenciones)
   ⏭️  Omitido

✅ Total: 130 artículos enriquecidos
💾 Cache guardado: public/wellness-articles-cache.json
⏳ Subiendo 130 artículos a Supabase...
  ✅ Batch 1/3: 50 artículos subidos (50/130)
  ✅ Batch 2/3: 50 artículos subidos (100/130)
  ✅ Batch 3/3: 30 artículos subidos (130/130)

📊 Resumen final:
   Artículos generados: 130
   Artículos subidos: 130
   Errores: 0

✅ ¡Conversión completada exitosamente!
```

## Qué pasa después

### Los artículos quedan disponibles en tu app

Una vez publicados en Supabase, las páginas de tu sitio los muestran automáticamente:

- `/bienestar/{slug}` → WellnessArticlePage
- `/articulos/{slug}` → BlogPostPage (si también están en blog_posts)

### El sitemap se actualiza automáticamente

El script `scripts/generate-sitemap.js` lee `public/wellness-articles-cache.json` y agrega los artículos al sitemap.

### Google indexará los artículos

Una vez en el sitemap, Google los descubre y indexa. En Google Search Console puedes solicitar indexación individual.

## Solución de problemas

### Error: "Variables de entorno no configuradas"

Asegúrate de que el archivo `.env` existe en la raíz del proyecto y tiene las variables `SUPABASE_URL` y `SUPABASE_KEY`.

### Error: "relation wellness_articles does not exist"

Crea la tabla en Supabase siguiendo las instrucciones del "Requisito 1" arriba.

### Error: "invalid API key"

Estás usando la Anon key en vez de la Service Role key. Ve a Settings → API en Supabase y copia la service_role key.

### Error: "EACCES" en Windows

Ejecuta PowerShell como administrador o cambia el directorio de trabajo.

### Artículos no aparecen en el sitemap

1. Verifica que el cache se generó: `cat public/wellness-articles-cache.json`
2. Regenera el sitemap: `npm run sitemap`
3. Verifica que los artículos tienen `is_published = true`

## Notas importantes

- **Módulo 3 y 6 están vacíos** — La biblia tiene 6 módulos, pero solo 4 contienen intervenciones. Los módulos de "Sueño" y "Ejercicio" tienen pathophysiology pero no interventions.
- **Total esperado: ~130 artículos**, no 200+. Los módulos vacíos reducen el total.
- **Los artículos se enriquecen automáticamente** con FAQs, keywords y schema JSON-LD.
- **El cache se guarda en `public/wellness-articles-cache.json`** — este archivo lo usa el generador de sitemap.
