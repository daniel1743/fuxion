-- ============================================================
-- CREACIÓN DE TABLA TAXONOMÍA
-- Bienestar en Claro v3
-- Ejecutar ANTES que SQL_SEED_TAXONOMIA_ENTIDADES.sql
-- ============================================================

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
