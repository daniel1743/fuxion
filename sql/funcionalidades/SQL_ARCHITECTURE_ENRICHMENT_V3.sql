-- ============================================================
-- ARCHITECTURA DE ENRIQUECIMIENTO EDITORIAL — TABLAS SQL
-- Bienestar en Claro v3
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- =============================================
-- TABLA: TAXONOMÍA (Nivel 1-4)
-- =============================================
CREATE TABLE IF NOT EXISTS taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
  parent_id UUID REFERENCES taxonomy(id),
  description TEXT,
  child_topics UUID[],
  evidence_level TEXT DEFAULT 'medium' CHECK (evidence_level IN ('high','medium','low')),
  content_count INTEGER DEFAULT 0,
  search_volume INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_taxonomy_parent ON taxonomy(parent_id);
CREATE INDEX IF NOT EXISTS idx_taxonomy_level ON taxonomy(level);
CREATE INDEX IF NOT EXISTS idx_taxonomy_slug ON taxonomy(slug);

-- =============================================
-- TABLA: ENTIDADES
-- =============================================
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('condition','symptom','product',
    'ingredient','study','habit','organ','nutrient','vitamin','mineral',
    'compound','test')),
  synonyms TEXT[],
  aliases TEXT[],
  medical_terms TEXT[],
  popular_terms TEXT[],
  scientific_terms TEXT[],
  parent_id UUID REFERENCES entities(id),
  taxonomy_node_ids UUID[],
  taxonomy_nodes UUID[],
  searchable_text TEXT,
  confidence NUMERIC(3,2) DEFAULT 0.5,
  evidence_level TEXT DEFAULT 'medium' CHECK (evidence_level IN ('high','medium','low','speculative')),
  properties JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(type);
CREATE INDEX IF NOT EXISTS idx_entities_taxonomys ON entities USING gin(taxonomy_node_ids);

-- =============================================
-- JUNCTION TABLE: entities <-> taxonomy (muchos-a-muchos)
-- =============================================
CREATE TABLE IF NOT EXISTS entity_taxonomy (
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  taxonomy_id UUID NOT NULL REFERENCES taxonomy(id) ON DELETE CASCADE,
  PRIMARY KEY (entity_id, taxonomy_id)
);
CREATE INDEX IF NOT EXISTS idx_entity_taxonomy_entity ON entity_taxonomy(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_taxonomy_taxonomy ON entity_taxonomy(taxonomy_id);

-- =============================================
-- TRIGGER: actualizar searchable_text automáticamente
-- =============================================
CREATE OR REPLACE FUNCTION update_entities_searchable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.searchable_text := NEW.name || ' ' || COALESCE(array_to_string(NEW.synonyms, ' '), '') || ' ' || COALESCE(array_to_string(NEW.popular_terms, ' '), '');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_entities_searchable ON entities;
CREATE TRIGGER trg_entities_searchable
  BEFORE INSERT OR UPDATE ON entities
  FOR EACH ROW EXECUTE FUNCTION update_entities_searchable();

-- =============================================
-- TABLA: RELACIONES
-- =============================================
CREATE TABLE IF NOT EXISTS relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity UUID NOT NULL REFERENCES entities(id),
  to_entity UUID NOT NULL REFERENCES entities(id),
  type TEXT NOT NULL CHECK (type IN ('treats','causes','prevents',
    'contains','relatedTo','symptomOf','diagnosedBy',
    'contraindicatedWith','recommendedWith','studies','mentionedIn',
    'partOf','hasSymptom','hasTreatment','hasPrevention')),
  strength NUMERIC(3,2) DEFAULT 0.5,
  evidence TEXT,
  evidence_level TEXT DEFAULT 'medium' CHECK (evidence_level IN ('high','medium','low','speculative')),
  editorial_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_relation UNIQUE(from_entity, to_entity, type)
);

CREATE INDEX IF NOT EXISTS idx_relations_from ON relations(from_entity);
CREATE INDEX IF NOT EXISTS idx_relations_to ON relations(to_entity);
CREATE INDEX IF NOT EXISTS idx_relations_type ON relations(type);
CREATE INDEX IF NOT EXISTS idx_relations_strength ON relations(strength);

-- =============================================
-- TABLA: ESTUDIOS CIENTÍFICOS
-- =============================================
CREATE TABLE IF NOT EXISTS studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  authors TEXT[],
  journal TEXT,
  doi TEXT,
  pmid TEXT,
  type TEXT NOT NULL CHECK (type IN ('randomized_controlled_trial','cohort',
    'case_control','cross_sectional','review','meta_analysis',
    'systematic_review','guideline','editorial')),
  evidence_level TEXT DEFAULT 'medium' CHECK (evidence_level IN ('high','medium','low','speculative')),
  sample_size INTEGER,
  population TEXT,
  intervention TEXT,
  outcome TEXT,
  effect_size TEXT,
  conclusions TEXT,
  related_entities UUID[],
  related_authors UUID[],
  related_guidelines UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_studies_type ON studies(type);
CREATE INDEX IF NOT EXISTS idx_studies_evidence ON studies(evidence_level);

-- =============================================
-- TABLA: GUÍAS CLÍNICAS
-- =============================================
CREATE TABLE IF NOT EXISTS clinical_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  year INTEGER NOT NULL,
  url TEXT,
  related_entities UUID[],
  related_studies UUID[],
  evidence_level TEXT DEFAULT 'medium',
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: AUTORES
-- =============================================
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT,
  photo_url TEXT,
  role TEXT,
  specialties UUID[],
  publications UUID[],
  citations INTEGER DEFAULT 0,
  h_index INTEGER DEFAULT 0,
  experience_years INTEGER DEFAULT 0,
  education TEXT[],
  affiliations TEXT[],
  social_profiles JSONB,
  taxonomy_node_ids UUID[],
  eeat_score NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);

-- =============================================
-- TABLA: ARTÍCULOS ENRIQUECIDOS
-- =============================================
CREATE TABLE IF NOT EXISTS enriched_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL,
  detected_entities UUID[],
  primary_taxonomy_node UUID REFERENCES taxonomy(id),
  semantic_keywords TEXT[],
  faqs JSONB,
  related_products UUID[],
  seo_schema JSONB,
  enrichment_score NUMERIC(3,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','error')),
  metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enriched_article_entities ON enriched_articles USING gin(detected_entities);
CREATE INDEX IF NOT EXISTS idx_enriched_article_status ON enriched_articles(status);
CREATE INDEX IF NOT EXISTS idx_enriched_article_primary_node ON enriched_articles(primary_taxonomy_node);

-- =============================================
-- TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_taxonomy_updated_at ON taxonomy;
CREATE TRIGGER update_taxonomy_updated_at
  BEFORE UPDATE ON taxonomy
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_entities_updated_at ON entities;
CREATE TRIGGER update_entities_updated_at
  BEFORE UPDATE ON entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_relations_updated_at ON relations;
CREATE TRIGGER update_relations_updated_at
  BEFORE UPDATE ON relations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_studies_updated_at ON studies;
CREATE TRIGGER update_studies_updated_at
  BEFORE UPDATE ON studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
