# Pendientes SQL — Supabase

> **Fecha de creación:** 2026-07-19  
> **Proyecto:** Bienestar en Claro  
> **Database:** iyloouessyxfvwvzdboc.supabase.co

---

## 1. Agregar columnas de enriquecimiento a `wellness_articles`

**Archivo SQL:** `sql/funcionalidades/SQL_ARTICULOS_BIENESTAR.sql`  
**Problema:** El script `convert-biblia-to-articles.mjs` genera 130 artículos enriquecidos pero falla al subirlos porque la tabla `wellness_articles` no tiene las columnas que el script espera.

**Solución — ejecutar en Supabase SQL Editor:**

```sql
ALTER TABLE public.wellness_articles 
ADD COLUMN IF NOT EXISTS enriched BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS entity_detected TEXT[],
ADD COLUMN IF NOT EXISTS entity_slug TEXT,
ADD COLUMN IF NOT EXISTS evidence_level TEXT,
ADD COLUMN IF NOT EXISTS related_products TEXT[],
ADD COLUMN IF NOT EXISTS semantic_keywords TEXT[],
ADD COLUMN IF NOT EXISTS seo_schema JSONB,
ADD COLUMN IF NOT EXISTS enrichment_score NUMERIC,
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
```

**Después de esto, ejecutar:**
```bash
node scripts/convert-biblia-to-articles.mjs
```

**Resultado esperado:** 130 artículos subidos a Supabase + cache en `public/wellness-articles-cache.json`.

---

## 2. Crear tablas de taxonomía y entidades

**Archivos SQL:**
- `sql/funcionalidades/SQL_ARCHITECTURE_ENRICHMENT_V3.sql` — crea las tablas
- `sql/funcionalidades/SQL_SEED_TAXONOMIA_ENTIDADES.sql` — inserta datos

**Problema 1:** `SQL_SEED_TAXONOMIA_ENTIDADES.sql` hace `INSERT INTO taxonomy` pero la tabla no existe. Primero hay que ejecutar el archivo de creación de tablas.

**Problema 2 (FIXED EN ARCHIVO — no necesita corrección):** La tabla `entities.taxonomy_node_ids` tenía `REFERENCES taxonomy(id)` dentro de un array `UUID[]`. PostgreSQL no soporta FK sobre elementos de array. Se corrigió en el archivo agregando una tabla junction `entity_taxonomy` con la relación muchos-a-muchos correcta.

**Pasos a ejecutar en orden:**

1. Ejecutar `SQL_ARCHITECTURE_ENRICHMENT_V3.sql` (crea tablas)
2. Ejecutar `SQL_SEED_TAXONOMIA_ENTIDADES.sql` (inserta datos)

**Nota:** Estos archivos ya están corregidos en el repo. Solo falta ejecutarlos.

---

## 3. Índices FTS (Full-Text Search) en `entities`

**Problema:** Los índices GIN sobre `to_tsvector()` no pueden definirse directamente en `CREATE INDEX` porque la función no es inmutable.

**Solución — ejecutar en Supabase SQL Editor:**

```sql
-- Opción A: Columna searchable con trigger
ALTER TABLE entities ADD COLUMN IF NOT EXISTS searchable_text TEXT;

CREATE OR REPLACE FUNCTION update_entities_searchable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.searchable_text := NEW.name || ' ' || COALESCE(array_to_string(NEW.synonyms, ' '), '') || ' ' || COALESCE(array_to_string(NEW.popular_terms, ' '), '');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_entities_searchable
BEFORE INSERT OR UPDATE ON entities
FOR EACH ROW EXECUTE FUNCTION update_entities_searchable();

CREATE INDEX idx_entities_searchable ON entities USING gin(to_tsvector('spanish', searchable_text));
```

---

## 4. Revisar tabla `authors`

**Archivo:** `SQL_ARCHITECTURE_ENRICHMENT_V3.sql`

La tabla `authors` referencia `enriched_articles(id)` y `clinical_guidelines(id)` en los arrays `publications` y `related_guidelines`. Verificar que estas columnas existan o cambiar a referencia simple.

---

## Checklist para mañana

- [ ] Ejecutar ALTER TABLE en `wellness_articles` (paso 1)
- [ ] Ejecutar `node scripts/convert-biblia-to-articles.mjs`
- [ ] Ejecutar `SQL_ARCHITECTURE_ENRICHMENT_V3.sql` (paso 2)
- [ ] Ejecutar `SQL_SEED_TAXONOMIA_ENTIDADES.sql` (paso 2)
- [ ] Ejecutar índices FTS (paso 3)
- [ ] Verificar tabla `authors` (paso 4)

---

## Crédenciales de Supabase

- **URL:** `https://iyloouessyxfvwvzdboc.supabase.co`
- **Service Role Key:** retirada del árbol; rotación administrativa pendiente.
- **Anon Key:** retirada del árbol; rotación administrativa pendiente.
