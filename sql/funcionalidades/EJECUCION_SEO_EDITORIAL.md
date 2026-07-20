# 📋 Guía de Ejecución — SEO Editorial v3

## Archivos SQL (ejecutar EN ORDEN)

### Paso 1: Auth, Roles y Branding
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: sql/funcionalidades/SQL_AUTH_ROLES_BRANDING_EVIDENCIAS.sql
```
- Crea buckets de almacenamiento
- Crea tablas de admin y settings
- Inserta admin por defecto

### Paso 2: Taxonomía (tabla)
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: sql/funcionalidades/SQL_CREATE_TAXONOMY_TABLE.sql
```
- Crea la tabla `taxonomy` con índices

### Paso 3: Seed de Taxonomía + Entidades
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: sql/funcionalidades/SQL_SEED_TAXONOMIA_ENTIDADES.sql
```
- Inserta taxonomía (nivel 1-2)
- Crea tabla `entities` con índice
- Inserta 45+ entidades (condiciones, productos, ingredientes)
- Inserta relaciones iniciales
- Inserta 4 artículos enriquecidos de ejemplo

### Paso 4: Alter Table wellness_articles
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: sql/funcionalidades/SQL_WELLNESS_ARTICLES_ALTER.sql
```
- Agrega columnas: enriched, entity_detected, entity_slug, evidence_level,
  related_products, semantic_keywords, seo_schema, enrichment_score, views

### Paso 5: Arquitectura de Enriquecimiento
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: sql/funcionalidades/SQL_ARCHITECTURE_ENRICHMENT_V3.sql
```
- Tablas: relations, studies, clinical_guidelines, authors, enriched_articles
- Triggers de actualización automática
- Funciones auxiliares

---

## Scripts de Código

### Paso 6: Convertir Biblia → Artículos
```bash
node scripts/convert-biblia-to-articles.mjs
```
- Lee biblia_bienestar.json
- Genera 130 artículos enriquecidos
- Los sube a Supabase en batches de 50
- Guarda cache en public/wellness-articles-cache.json

> ⚠️ Antes de ejecutar: editar el archivo y poner el `OWNER_USER_ID` correcto.
> Para obtenerlo: `SELECT id, email FROM auth.users LIMIT 1;` en Supabase.

### Paso 7: Regenerar Sitemap
```bash
npm run sitemap
```

---

## Verificaciones

```sql
-- Tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN (
  'taxonomy', 'entities', 'relations', 'studies',
  'clinical_guidelines', 'authors', 'enriched_articles',
  'wellness_articles', 'entity_taxonomy'
) ORDER BY table_name;

-- Entidades insertadas
SELECT COUNT(*) FROM entities;
SELECT type, COUNT(*) FROM entities GROUP BY type;

-- Taxonomía insertada
SELECT COUNT(*) FROM taxonomy;
SELECT level, COUNT(*) FROM taxonomy GROUP BY level;

-- Artículos enriquecidos
SELECT COUNT(*) FROM wellness_articles WHERE enriched = true;
SELECT category, COUNT(*) FROM wellness_articles WHERE enriched = true GROUP BY category;

-- Relación con entidades
SELECT e.name, COUNT(*) as count
FROM wellness_articles wa
JOIN entities e ON e.id = ANY(wa.entity_detected)
GROUP BY e.name
ORDER BY count DESC
LIMIT 10;
```

---

## Correcciones Aplicadas

1. **SQL_AUTH_ROLES_BRANDING_EVIDENCIAS.sql**
   - Owner name: "Daniel Falcon" → "Daniel Falcón"
   - Added admin@bienestarenclaro.com as secondary admin
   - Added `update_updated_at_column()` function before triggers
   - Added `current_user_is_main_admin()` function
   - Fixed delete policy to exclude both admin emails

2. **SQL_ARCHITECTURE_ENRICHMENT_V3.sql**
   - Removed non-existent references to `authors(id)`, `enriched_articles(id)`, `clinical_guidelines(id)` in foreign keys
   - Removed `taxonomys` index → renamed to `taxonomys` → `taxonomy_node_ids`
   - Removed `to_tsvector('spanish', ...)` indexes (requires pg_trgm extension)
   - Removed `taxonomy_nodes` column (replaced with junction table)
   - Created junction table `entity_taxonomy` for many-to-many
   - Added `searchable_text` computed column trigger
   - Made all CREATE TABLE IF NOT EXISTS
   - Removed `update_taxonomy_content_count` trigger (function didn't exist)

3. **SQL_SEED_TAXONOMIA_ENTIDADES.sql**
   - Fixed entity-taxonomy relationship (uses junction table now)
   - Fixed entities table creation (IF NOT EXISTS)
   - Fixed entity_taxonomy table creation
   - All references use subqueries instead of direct UUIDs
   - Proper CASCADE on delete for junction table

4. **SQL_WELLNESS_ARTICLES_ALTER.sql**
   - Wrapped in DO $$ BEGIN ... END $$ for safe execution
   - Checks each column before adding (IF NOT EXISTS)
   - Won't error if columns already exist

5. **convert-biblia-to-articles.mjs**
   - Fixed INSERT to only use columns that exist
   - Removed non-existent columns: faqs, seo_schema, status, enrichment_score
   - Added required owner_user_id column
   - Fixed seo_schema to match actual column in table
   - Added OWNER_USER_ID constant (needs to be set)
