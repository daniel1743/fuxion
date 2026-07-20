# Arquitectura de Enriquecimiento Editorial — Bienestar en Claro

**Versión:** 2.0  
**Fecha:** Julio 2026  
**Autor:** Daniel Falcón  
**Tipo:** Arquitectura de Knowledge Graph Editorial para SEO, AEO y GEO  

---

## Índice

1. Visión General
2. Taxonomía Editorial Maestra
3. Knowledge Graph
4. Motor de Clasificación Híbrido
5. Sistema de Ponderación
6. FAQs Inteligentes
7. Motor de Recomendación de Productos
8. Hub Pages
9. Arquitectura AEO/GEO
10. Automatización
11. Validación
12. Roadmap
13. Decisiones Actuales a Cambiar

---

## 1. Visión General

### Filosofía del Sistema

El sistema actual se basa en **palabras clave** (`text.includes()`). La nueva arquitectura se basa en **entidades y relaciones**.

**Antes:**
```
Texto del artículo → ¿contiene "hígado"? → Sí → Módulo 6
```

**Después:**
```
Texto del artículo → Entidades detectadas → Relación con Entidad "Cirrosis Hepática"
→ Tipo: Enfermedad → Sistema: Hepático → Módulo de conocimiento correspondiente
→ FAQs: Generadas desde entidad madre
→ Productos: Relacionados por objetivo, no por palabra
```

### Arquitectura General

```
┌──────────────────────────────────────────────────────────────┐
│                     SUPABASE (CMS)                           │
│  blog_posts | wellness_articles | products | users           │
└──────────────────────────┬───────────────────────────────────┘
                           │ Webhook / Trigger
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              ENRICHMENT PIPELINE                              │
│                                                              │
│  1. Entity Extraction                                       │
│  2. Taxonomy Resolution                                      │
│  3. Knowledge Graph Query                                    │
│  4. Scoring & Classification                                 │
│  5. FAQ Generation                                           │
│  6. Product Matching                                         │
│  7. Schema Generation                                        │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│               KNOWLEDGE GRAPH (PostgreSQL)                   │
│                                                              │
│  entities | relations | taxonomy | synonyms | evidence        │
│                                                              │
│  • Tablas relacionales para integridad                        │
│  • JSONB para flexibilidad                                   │
│  • Full-text search (pg_trgm + tsvector)                    │
│  • pgvector para embedding semántico                         │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│               OUTPUT LAYERS                                   │
│                                                              │
│  • JSON-LD Schemas (MedicalWebPage, FAQPage, Article, etc.)  │
│  • OG Metadata (title, description, image, tags)            │
│  • Hub Pages (generadas dinámicamente)                       │
│  • Sitemap XML (regenerado automáticamente)                  │
│  • Cache (wellness-articles-cache.json)                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Taxonomía Editorial Maestra

### Diseño de Niveles Jerárquicos

```
Nivel 1 — DOMINIO
├── Nutrición y Metabolismo
├── Salud Digestiva
├── Bienestar Cardiovascular
├── Salud Mental y Emocional
├── Sistema Inmune
├── Salud Hormonal
├── Bienestar Físico y Deportivo
├── Salud Sexual y Reproductiva
└── Envejecimiento Saludable

Nivel 2 — SISTEMA CORPORAL
│ (Subdivisiones de cada dominio)
├── Nutrición y Metabolismo
│   ├── Macronutrientes
│   ├── Micronutrientes
│   ├── Metabolismo Energético
│   └── Control de Peso
├── Salud Digestiva
│   ├── Tracto Digestivo Superior
│   ├── Microbiota Intestinal
│   ├── Tracto Digestivo Inferior
│   └── Hígado y Sistema Biliar
├── Bienestar Cardiovascular
│   ├── Presión Arterial
│   ├── Colesterol y Lípidos
│   ├── Circulación Sanguínea
│   └── Prevención Cardiovascular
├── Salud Mental y Emocional
│   ├── Estrés y Ansiedad
│   ├── Sueño y Descanso
│   ├── Cognición y Memoria
│   └── Estado de Ánimo
├── Sistema Inmune
│   ├── Defensa Inmunológica
│   ├── Inflamación
│   └── Respuesta Alérgica
├── Salud Hormonal
│   ├── Eje Hipotalámico-Hipofisario
│   ├── Hormonas Sexuales
│   ├── Hormonas Tiroideas
│   └── Hormonas del Estrés
├── Bienestar Físico y Deportivo
│   ├── Rendimiento Atlético
│   ├── Recuperación Muscular
│   └── Longevidad Funcional
├── Salud Sexual y Reproductiva
│   ├── Salud Femenina
│   ├── Salud Masculina
│   └── Fertilidad
└── Envejecimiento Saludable
    ├── Anti-Edad
    ├── Longevidad
    └── Calidad de Vida
```

### Estructura de Datos — Taxonomía

```typescript
interface TaxonomyNode {
  id: string;
  name: string;
  slug: string;
  level: 1 | 2 | 3 | 4;
  parentId: string | null;
  description: string;
  relatedEntities: string[];        // IDs de entidades relacionadas
  relatedProducts: string[];        // IDs de productos relacionados
  childTopics: string[];            // IDs de subtemas
  evidenceLevel: 'high' | 'medium' | 'low';
  contentCount: number;             // Número de artículos en este nodo
  searchVolume: number;             // Volumen de búsqueda mensual (Google Trends)
  createdAt: string;
  updatedAt: string;
}
```

### Instancias de Taxonomía — Nivel 3 y 4 (Ejemplos)

```
Nivel 3 — SUBDOMINIOS
├── Salud Digestiva
│   ├── Microbiota Intestinal
│   ├── Disbiosis
│   ├── Tránsito Intestinal
│   ├── Inflamación Intestinal
│   ├── Hígado Graso
│   └── Reflujo Gastroesofágico
├── Nutrición y Metabolismo
│   ├── Obesidad
│   ├── Resistencia a la Insulina
│   ├── Macronutrientes
│   └── Microbiota
├── Salud Mental y Emocional
│   ├── Estrés Crónico
│   ├── Ansiedad
│   ├── Insomnio
│   └── Depresión Leve
├── Bienestar Cardiovascular
│   ├── Hipertensión
│   ├── Colesterol Alto
│   └── Placas de Colesterol
├── Salud Hormonal
│   ├── Menopausia
│   ├── Perimenopausia
│   ├── Síndrome Premenstrual
│   └── Tiroides
├── Sistema Inmune
│   ├── Defensas Bajas
│   ├── Inflamación Crónica
│   └── Infecciones Recurrentes
├── Bienestar Físico y Deportivo
│   ├── Rendimiento Atlético
│   ├── Recuperación Muscular
│   └── Prevención de Lesiones
├── Salud Sexual y Reproductiva
│   ├── Salud Femenina Integral
│   ├── Salud Masculina Integral
│   └── Fertilidad
└── Envejecimiento Saludable
    ├── Vitalidad y Energía
    ├── Salud Articular
    └── Prevención Cognitiva
```

### Instancias de Taxonomía — Nivel 4 (Ejemplos)

```
Microbiota Intestinal → Síntomas
Microbiota Intestinal → Diagnóstico
Microbiota Intestinal → Tratamientos Convencionales
Microbiota Intestinal → Enfoques Naturales
Microbiota Intestinal → Productos Relacionados
Microbiota Intestinal → Estudios Clave

Hígado Graso → Etiología
Hígado Graso → Diagnóstico
Hígado Graso → Tratamiento
Hígado Graso → Prevención
Hígado Graso → Productos Relacionados
Hígado Graso → Estudios Clave

Estreñimiento → Tipos
Estreñimiento → Causas
Estreñimiento → Tratamiento
Estreñimiento → Prevención
Estreñimiento → Productos Relacionados
Estreñimiento → Estudios Clave
```

---

## 3. Knowledge Graph

### Definición

Un Knowledge Graph es un grafo dirigido donde:
- **Nodos** = Entidades (enfermedades, síntomas, productos, ingredientes, estudios, hábitos)
- **Aristas** = Relaciones (causa, trata, previene, contiene, está relacionado con)

### Estructura de Nodos

```typescript
interface Entity {
  id: string;
  name: string;
  type: 'condition' | 'symptom' | 'product' | 'ingredient' |
        'study' | 'habit' | 'organ' | 'nutrient' |
        'vitamin' | 'mineral' | 'compound' | 'test';
  synonyms: string[];
  aliases: string[];
  medicalTerms: string[];
  popularTerms: string[];
  scientificTerms: string[];
  parentId: string | null;
  taxonomyNodeIds: string[];
  confidence: number;
  evidenceLevel: 'high' | 'medium' | 'low' | 'speculative';
  relatedEntityIds: string[];
  properties: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}
```

### Estructura de Relaciones

```typescript
interface Relation {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  type: 'treats' | 'causes' | 'prevents' | 'contains' |
        'relatedTo' | 'symptomOf' | 'diagnosedBy' |
        'contraindicatedWith' | 'recommendedWith' |
        'studies' | 'mentionedIn' | 'partOf';
  strength: number;           // 0.0 a 1.0
  evidence: string;           // Referencia al estudio
  evidenceLevel: 'high' | 'medium' | 'low' | 'speculative';
  editorialNote: string;
  createdAt: string;
  updatedAt: string;
}
```

### Ejemplo de Grafo — Microbiota Intestinal

```
Microbiota Intestinal
├──(isPartOf)→ Salud Digestiva (Taxonomía)
├──(hasSymptom)→ Disbiosis
├──(hasSymptom)→ Inflamación Intestinal
├──(hasTreatment)→ Probióticos
├──(hasTreatment)→ Prebióticos
├──(hasTreatment)→ Fibra Soluble
├──(contains)→ Flora Liv
├──(contains)→ Prunex 1
├──(studiedBy)→ 47 estudios científicos
├──(relatedTo)→ Eje Intestino-Cerebro
├──(relatedTo)→ Sistema Inmune
├──(relatedTo)→ Salud Mental
├──(relatedTo)→ Obesidad
└──(relatedTo)→ Hígado Graso
```

### Modelo de Base de Datos

```sql
-- Tabla de entidades
CREATE TABLE entities (
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
  confidence NUMERIC(3,2) DEFAULT 0.5,
  evidence_level TEXT DEFAULT 'medium' CHECK (evidence_level IN ('high','medium','low','speculative')),
  properties JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de relaciones
CREATE TABLE relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity UUID NOT NULL REFERENCES entities(id),
  to_entity UUID NOT NULL REFERENCES entities(id),
  type TEXT NOT NULL CHECK (type IN ('treats','causes','prevents',
    'contains','relatedTo','symptomOf','diagnosedBy',
    'contraindicatedWith','recommendedWith','studies','mentionedIn','partOf')),
  strength NUMERIC(3,2) DEFAULT 0.5,
  evidence TEXT,
  evidence_level TEXT DEFAULT 'medium' CHECK (evidence_level IN ('high','medium','low','speculative')),
  editorial_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_relation UNIQUE(from_entity, to_entity, type)
);

-- Tabla de taxonomía
CREATE TABLE taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
  parent_id UUID REFERENCES taxonomy(id),
  description TEXT,
  child_topics UUID[] REFERENCES entities(id),
  evidence_level TEXT DEFAULT 'medium',
  content_count INTEGER DEFAULT 0,
  search_volume INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de artículos enriquecidos
CREATE TABLE enriched_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES blog_posts(id),
  detected_entities UUID[] REFERENCES entities(id),
  primary_taxonomy_node UUID REFERENCES taxonomy(id),
  semantic_keywords TEXT[],
  faqs JSONB,
  related_products UUID[] REFERENCES products(id),
  seo_schema JSONB,
  enrichment_score NUMERIC(3,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas eficientes
CREATE INDEX idx_entities_type ON entities(type);
CREATE INDEX idx_entities_synonyms ON entities USING gin(to_tsvector('spanish', name));
CREATE INDEX idx_relations_from ON relations(from_entity);
CREATE INDEX idx_relations_to ON relations(to_entity);
CREATE INDEX idx_relations_type ON relations(type);
CREATE INDEX idx_enriched_article_entities ON enriched_articles USING gin(detected_entities);
CREATE INDEX idx_enriched_article_status ON enriched_articles(status);
```

---

## 4. Motor de Clasificación Híbrido

### Algoritmo Propuesto: **Hybrid Entity Resolution Engine**

El motor combina 4 estrategias en cascada:

```
Paso 1: Exact Match (taxonomía)
  → ¿El título del artículo coincide exactamente con una entidad?
  → Peso: 1.0
  → Si hay match → clasificación directa

Paso 2: Synonym Resolution (sinónimos)
  → ¿El título coincide con un sinónimo de alguna entidad?
  → Peso: 0.95
  → Si hay match → clasificación directa

Paso 3: Semantic Search (embedding vectorial)
  → Embedding del contenido del artículo
  → Cosine similarity con embeddings de entidades
  → Top-K entidades con score > umbral
  → Peso: 0.85

Paso 4: Lexical Fallback (keyword matching con pesos)
  → Keywords del contenido → entidades conocidas
  → Peso: 0.5 (bajo, porque es impreciso)
  → Solo si los pasos anteriores no dieron resultado claro
```

### Implementación Técnica

```typescript
interface ClassificationResult {
  primaryNode: TaxonomyNode;
  confidence: number;       // 0.0 a 1.0
  detectedEntities: DetectedEntity[];
  taxonomyNodes: TaxonomyNode[];
  algorithm: string;
  scores: ScoreBreakdown[];
}

interface DetectedEntity {
  entityId: string;
  entityType: string;
  name: string;
  score: number;
  matches: Match[];
}

interface Match {
  source: 'title' | 'heading' | 'content' | 'synonym' | 'semantic';
  term: string;
  strength: number;
}
```

### Sistema de Scores

```typescript
function computeClassificationScore(
  article: Article,
  entity: Entity,
  taxonomyNode: TaxonomyNode
): ClassificationResult {
  let totalScore = 0;
  let matchCount = 0;

  // 1. Title match (peso máximo)
  if (article.title.toLowerCase().includes(entity.name.toLowerCase())) {
    totalScore += 0.40;
    matchCount++;
  }

  // 2. Heading match
  const headings = article.headings || [];
  const headingMatches = headings.filter(h =>
    h.toLowerCase().includes(entity.name.toLowerCase())
  ).length;
  totalScore += Math.min(0.20, headingMatches * 0.05);
  matchCount += headingMatches;

  // 3. Content density (frecuencia ponderada)
  const contentFreq = countOccurrences(article.content, entity.name);
  const contentDensity = contentFreq / (article.content.length / 100);
  totalScore += Math.min(0.15, contentDensity * 0.01);
  matchCount += contentFreq;

  // 4. Semantic embedding (si disponible)
  if (article.embedding && entity.embedding) {
    const cosineSim = cosineSimilarity(article.embedding, entity.embedding);
    totalScore += cosineSim * 0.20;
    matchCount++;
  }

  // 5. Synonym resolution
  const synonymMatches = entity.synonyms.filter(s =>
    article.text.includes(s.toLowerCase())
  ).length;
  totalScore += Math.min(0.10, synonymMatches * 0.02);
  matchCount += synonymMatches;

  // 6. Contextual co-occurrence (otras entidades del mismo tema)
  const coOccurringEntities = entity.relatedEntityIds.filter(relId =>
    article.text.includes(getEntityName(relId).toLowerCase())
  ).length;
  totalScore += Math.min(0.05, coOccurringEntities * 0.01);

  // Normalizar y calcular confianza
  const normalizedScore = totalScore / (0.40 + 0.20 + 0.15 + 0.20 + 0.10 + 0.05);
  const confidence = Math.min(1.0, normalizedScore * (1 + matchCount * 0.1));

  return {
    primaryNode: taxonomyNode,
    confidence: confidence,
    detectedEntities: [{ entityId: entity.id, entityType: entity.type, name: entity.name, score: confidence, matches }],
    taxonomyNodes: [taxonomyNode],
    algorithm: 'hybrid_entity_resolution_v2',
    scores: [{ source: 'classification', value: confidence, breakdown: [...scores] }]
  };
}
```

### Por Qué Este Algoritmo es Mejor que `text.includes()`

| Aspecto | `text.includes()` | Hybrid Entity Resolution |
|---------|-------------------|--------------------------|
| Orden del diccionario importa | SÍ (crítico) | NO |
| Conflicto "hígado" vs "ejercicio" | Frecuente | Resuelto por pesos |
| Sinónimos | No soportados | Soportados |
| Embbeddings semánticos | No | Sí |
| Confianza numérica | No | Sí |
| Explicable | No | Sí (score breakdown) |
| Escalable a 10K artículos | Difícil | Sí |

---

## 5. Sistema de Ponderación

### Pesos por Fuente de Coincidencia

| Fuente | Peso | Razón |
|--------|------|-------|
| Título del artículo | 0.40 | Máxima relevancia semántica |
| Subtítulos (H2, H3) | 0.20 | Relevancia editorial |
| Contenido — primeras 200 palabras | 0.15 | Introducción define el tema |
| Contenido — resto | 0.05 | Contexto secundario |
| Embedding semántico | 0.20 | Significado profundo |
| Sinónimos detectados | 0.10 | Respaldo lexical |
| Entidades co-ocurrentes | 0.05 | Confirmación contextual |

### Pesos por Posición en el Texto

| Posición | Multiplicador | Razón |
|----------|---------------|-------|
| Título | ×2.0 | Máxima importancia |
| Primer párrafo | ×1.5 | Contexto principal |
| Subtítulos | ×1.3 | Secciones importantes |
| Cuerpo del texto | ×1.0 | Referencia |
| Disclaimer / footer | ×0.1 | No relevante |

### Sistema de Confianza

```
confidence = normalized_score * (1 + match_count * 0.1)

Umbral de clasificación:
  • confidence >= 0.85 → Clasificado automáticamente (alta confianza)
  • 0.60 <= confidence < 0.85 → Revisión editorial recomendada
  • confidence < 0.60 → No clasificado (requiere intervención manual)
```

---

## 6. FAQs Inteligentes

### Problema del Actual

Las FAQs actuales son genéricas:
```
¿Qué es Polietilenglicol (PEG 3350)?
¿Qué es Suplementación con Psyllium?
¿Qué es Postura de Defecación (Squatting)?
```

### Nueva Arquitectura

Las FAQs se generan desde **3 fuentes** que se combinan:

**Fuente A: Preguntas de la Entidad Madre**
```
Entidad "Cirrosis Hepática" tiene preguntas frecuentes:
  • ¿Qué es la cirrosis hepática?
  • ¿Cuáles son los síntomas de la cirrosis hepática?
  • ¿Se puede revertir la cirrosis hepática?
```

**Fuente B: Preguntas de la Intención de Búsqueda**
```
Si el artículo tiene intención "informacional":
  • ¿Qué causa...?
  • ¿Cuáles son los síntomas...?
  • ¿Cómo se diagnostica...?

Si el artículo tiene intención "comparativa":
  • ¿Cuál es la diferencia entre...?
  • ¿Qué es mejor...?
  • ¿Cuáles son los pros y contras...?
```

**Fuente C: Preguntas de la Bibliografía**
```
Los estudios científicos citados generan preguntas:
  • Según estudios de la ADA 2026, ¿cuál es el impacto...?
  • Lo que dicen las guías de la Endocrine Society sobre...
```

### Generador de FAQs

```typescript
interface FAQGeneratorConfig {
  article: Article;
  primaryEntity: Entity;
  taxonomyNode: TaxonomyNode;
  intent: 'informational' | 'comparative' | 'transactional' | 'investigational';
  userStage: 'awareness' | 'consideration' | 'decision';
  maxFaqs: number;
}

function generateFAQs(config: FAQGeneratorConfig): FAQ[] {
  const faqs: FAQ[] = [];

  // Fuente A: Preguntas de la Entidad
  const entityFaqs = getEntityFAQs(config.primaryEntity);
  faqs.push(...entityFaqs.slice(0, 3));

  // Fuente B: Preguntas de Intención
  const intentFaqs = getIntentFAQs(config.intent);
  faqs.push(...intentFaqs.slice(0, 2));

  // Fuente C: Preguntas de la Bibliografía
  const biblioFaqs = getBiblioFAQs(config.article.studies);
  faqs.push(...biblioFaqs.slice(0, 2));

  // Eliminar duplicados y limitar
  const uniqueFaqs = deduplicateFAQs(faqs);
  return uniqueFaqs.slice(0, config.maxFaqs);
}
```

### Ejemplo — Artículo sobre Cirrosis Hepática

**Antes (genérico):**
```
Q: ¿Qué es Polietilenglicol (PEG 3350)?
A: Laxante osmótico de polímeros largos.
Q: ¿Qué es Suplementación con Psyllium?
A: Única fibra soluble que normaliza la reología fecal.
```

**Después (específico):**
```
Q: ¿Qué es la cirrosis hepática?
A: Es la etapa avanzada de fibrosis del hígado donde el tejido sano es reemplazado por tejido cicatricial, afectando la capacidad del hígado para filtrar toxinas y sintetizar proteínas.

Q: ¿Cuáles son los síntomas de la cirrosis hepática?
A: Los síntomas incluyen fatiga, ictericia, hinchazón abdominal, confusión mental, hemorragias y fácil aparición de moretones.

Q: ¿Se puede revertir la cirrosis hepática?
A: La cirrosis en etapas tempranas puede estabilizarse y en algunos casos mejorar con tratamiento adecuado, cambios de estilo de vida y control de la causa subyacente. Las etapas avanzadas requieren intervención médica especializada.
```

---

## 7. Motor de Recomendación de Productos

### Regla de Oro

**Los productos Fuxion solo se muestran cuando hay una relación clara entre el objetivo del artículo y el beneficio del producto.**

### Motor de Matching

```typescript
interface ProductMatch {
  productId: string;
  productName: string;
  matchReason: string;
  matchStrength: number;  // 0.0 a 1.0
  matchType: 'direct' | 'supportive' | 'preventive' | 'complementary';
  confidence: number;
}

function matchProducts(article: Article, entity: Entity): ProductMatch[] {
  const matches: ProductMatch[] = [];

  // 1. Direct match: producto tiene relación directa con la entidad
  const directMatches = queryRelations(
    entity.id, 'treats', 'product'
  ).filter(r => r.strength >= 0.7);
  matches.push(...directMatches);

  // 2. Supportive match: producto apoya el tratamiento
  const supportiveMatches = queryRelations(
    entity.id, 'recommendedWith', 'product'
  ).filter(r => r.strength >= 0.5);
  matches.push(...supportiveMatches);

  // 3. Preventive match: producto previene el problema
  const preventiveMatches = queryRelations(
    entity.id, 'prevents', 'product'
  ).filter(r => r.strength >= 0.5);
  matches.push(...preventiveMatches);

  // 4. Semantic match (fallback)
  const semanticMatches = semanticSearchProducts(article.content, entity);
  matches.push(...semanticMatches);

  return matches
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
```

### Cuándo Mostrar Productos

| Condición | Acción |
|-----------|--------|
| Artículo médico serio (cirrosis, cáncer) | **NO mostrar productos** |
| Artículo preventivo (hábitos, nutrición) | Mostrar productos preventivos |
| Artículo informativo (qué es X) | Mostrar productos de soporte |
| Artículo de tratamiento | Mostrar productos terapéuticos |
| Artículo de bienestar general | Mostrar productos de bienestar |

### Cuándo NO Mostrar Productos

1. Artículos con tono muy médico/científico (sin intención comercial)
2. Artículos sobre enfermedades graves
3. Artículos con intención puramente educativa
4. Artículos donde el producto no tiene relación directa

---

## 8. Hub Pages

### Estructura de Hub Page

```
Salud Digestiva (Hub Principal)
├── ¿Qué es la Salud Digestiva?
├── Condiciones
│   ├── Hígado Graso
│   ├── Cirrosis Hepática
│   ├── Estreñimiento
│   ├── Colon Irritable
│   ├── Disbiosis
│   └── Reflujo Gastroesofágico
├── Síntomas
│   ├── Hinchazón
│   ├── Flatulencia
│   ├── Dolor Abdominal
│   └── Náuseas
├── Productos
│   ├── Prunex 1
│   ├── Flora Liv
│   ├── Liquid Fiber
│   └── Rexet
├── Guías
│   ├── Guía del Estreñimiento
│   ├── Guía de la Flora Intestinal
│   └── Guía del Hígado Graso
├── FAQ
│   ├── Preguntas sobre Estreñimiento
│   ├── Preguntas sobre Flora Intestinal
│   └── Preguntas sobre Hígado Graso
├── Herramientas
│   ├── Calculadora de Fibra Diaria
│   ├── Test de Salud Digestiva
│   └── Diario de Síntomas
└── Artículos Relacionados
    ├── Microbiota Intestinal
    ├── Eje Intestino-Cerebro
    └── Permeabilidad Intestinal
```

### Generación Automática

Las Hub Pages se generan automáticamente a partir de la Taxonomía:

```typescript
function generateHubPage(node: TaxonomyNode): HubPage {
  return {
    title: node.name,
    description: node.description,
    sections: [
      {
        type: 'overview',
        content: generateOverview(node),
      },
      {
        type: 'conditions',
        items: getChildrenOfType(node, 'condition'),
      },
      {
        type: 'products',
        items: getRelatedProducts(node),
      },
      {
        type: 'guides',
        items: getChildrenOfType(node, 'guide'),
      },
      {
        type: 'faq',
        items: generateHubFAQ(node),
      },
      {
        type: 'articles',
        items: getRelatedArticles(node),
      },
    ],
    schema: buildHubSchema(node),
    internalLinks: buildInternalLinks(node),
  };
}
```

---

## 9. Arquitectura AEO/GEO

### Principios Fundamentales

**AEO (Answer Engine Optimization)** — Optimizar para que los motores generativos respondan con tu contenido:

1. **Respuestas directas** — La primera respuesta debe ser clara y concisa
2. **Definiciones** — Cada entidad debe tener una definición de 1-2 oraciones
3. **Tablas** — Usar tablas para datos comparativos
4. **FAQs** — Formato pregunta-respuesta claro
5. **Citas claras** — Referenciar estudios y fuentes
6. **Estructura limpia** — Headings jerárquicos, listas, negritas

**GEO (Generative Engine Optimization)** — Optimizar para que los LLMs citen tu contenido:

1. **Datos estructurados** — JSON-LD completo
2. **Contenido con autoridad** — Citas de estudios reales
3. **E-E-A-T** — Autoría verificable, experiencia, autoridad
4. **Contenido único** — No contenido duplicado
5. **Contenido actualizado** — Fechas de actualización visibles

### Estructura de Artículo Optimizado para AEO/GEO

```
# Título del Artículo (H1)
## ¿Qué es [ENTIDAD]? (H2)
Definición clara de 1-2 oraciones. [CITA 1] [CITA 2]

## Síntomas (H2)
- Síntoma 1
- Síntoma 2
- Síntoma 3

## Causas (H2)
- Causa 1
- Causa 2

## Tratamientos (H2)
### Tratamientos convencionales (H3)
- Tratamiento A
- Tratamiento B

### Tratamientos naturales (H3)
- Tratamiento C
- Tratamiento D

## Prevención (H2)
- Hábito 1
- Hábito 2

## Preguntas Frecuentes (H2)
### ¿Pregunta 1?
Respuesta directa de 1-2 oraciones.

### ¿Pregunta 2?
Respuesta directa de 1-2 oraciones.

## Fuentes y Referencias (H2)
- [1] Estudio X
- [2] Estudio Y
- [3] Guía Z
```

---

## 10. Automatización

### Flujo Completo

```
Editor publica artículo en Supabase
    ↓
Webhook / Edge Function dispara
    ↓
Pipeline de Enriquecimiento:
  1. Entity Extraction (NLP)
  2. Taxonomy Resolution
  3. Knowledge Graph Query
  4. Scoring & Classification
  5. FAQ Generation
  6. Product Matching
  7. Schema Generation
    ↓
Guarda en enriched_articles
    ↓
Genera JSON-LD schemas
    ↓
Actualiza wellness-articles-cache.json
    ↓
Regenera sitemap.xml
    ↓
Notifica al editor: "Artículo enriquecido correctamente"
```

### Implementación en Supabase

```sql
-- Edge Function trigger
CREATE OR REPLACE FUNCTION handle_new_article()
RETURNS TRIGGER AS $$
BEGIN
  -- Llamar a Edge Function para enriquecer
  PERFORM net.http_post(
    'https://your-edge-function-url.enrich-article',
    json_build_object('article_id', NEW.id, 'content', NEW.content)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER article_enrich_trigger
  AFTER INSERT OR UPDATE ON blog_posts
  WHEN (NEW.is_published = true)
  EXECUTE FUNCTION handle_new_article();
```

---

## 11. Validación

### Mecanismos Automáticos de Validación

| Validación | Método | Frecuencia |
|------------|--------|------------|
| Relaciones incorrectas | Detectar ciclos en el grafo | Cada enriquecimiento |
| Productos mal asociados | Verificar que strength >= 0.7 | Cada enriquecimiento |
| FAQs repetidas | Hash de similitud entre FAQs | Cada enriquecimiento |
| Keywords irrelevantes | Verificar que density > umbral | Cada enriquecimiento |
| Entidades duplicadas | Fuzzy matching de nombres | Diario |
| Conflictos de taxonomía | Verificar consistencia de niveles | Diario |
| Errores de clasificación | Verificar que confidence >= umbral | Cada enriquecimiento |

### Script de Validación

```typescript
function validateEnrichment(articleId: string): ValidationReport {
  const article = getArticle(articleId);
  const enriched = getEnrichedArticle(articleId);
  const report: ValidationReport = {
    valid: true,
    warnings: [],
    errors: [],
  };

  // 1. Relación artículo-producto
  for (const productId of enriched.relatedProducts) {
    const relation = getRelation(article.primaryEntity, productId);
    if (!relation || relation.strength < 0.7) {
      report.warnings.push(`Producto ${productId} tiene relación débil con artículo`);
    }
  }

  // 2. FAQs duplicadas
  const faqHashes = enriched.faqs.map(f => hash(f.question + f.answer));
  if (faqHashes.length !== new Set(faqHashes).size) {
    report.errors.push('Existen FAQs duplicadas');
  }

  // 3. Keywords irrelevantes
  for (const keyword of enriched.semanticKeywords) {
    if (countOccurrences(article.content, keyword) < 2) {
      report.warnings.push(`Keyword "${keyword}" aparece menos de 2 veces en el artículo`);
    }
  }

  return report;
}
```

---

## 12. Roadmap

### Fase 1: Fundamentos del Knowledge Graph (6-8 semanas)

**Dificultad:** Media  
**Impacto:** Alto  
**Prioridad:** Crítica  
**Riesgo:** Medio  

- [ ] Modelar la Taxonomía Editorial Maestra (9 dominios × 4 niveles)
- [ ] Crear tablas en Supabase (entities, relations, taxonomy)
- [ ] Poblar el Knowledge Graph con las entidades existentes
- [ ] Crear el Motor de Clasificación Híbrido
- [ ] Implementar el Sistema de Ponderación
- [ ] Migrar el pipeline actual al nuevo sistema

**Entregable:** Pipeline funcionando con clasificación basada en entidades, no en keywords.

### Fase 2: FAQs Inteligentes y Productos (4-6 semanas)

**Dificultad:** Media  
**Impacto:** Alto  
**Prioridad:** Alta  
**Riesgo:** Bajo  

- [ ] Implementar el generador de FAQs con 3 fuentes
- [ ] Crear el motor de recomendación de productos
- [ ] Integrar reglas editoriales (cuándo mostrar productos)
- [ ] Validar FAQs contra la biblia_bienestar.json
- [ ] Ajustar pesos del sistema de scoring

**Entregable:** FAQs específicas por artículo, productos correctamente asociados.

### Fase 3: Hub Pages y Automatización (4-6 semanas)

**Dificultad:** Media-Alta  
**Impacto:** Alto  
**Prioridad:** Alta  
**Riesgo:** Medio  

- [ ] Implementar generación automática de Hub Pages
- [ ] Configurar webhooks de Supabase
- [ ] Crear dashboard de monitoreo
- [ ] Implementar validaciones automáticas
- [ ] Configurar alertas de errores

**Entregable:** Hub Pages generadas automáticamente, sistema de validación activo.

### Fase 4: Embeddings y Escalabilidad (8-12 semanas)

**Dificultad:** Alta  
**Impacto:** Muy Alto  
**Prioridad:** Media  
**Riesgo:** Alto  

- [ ] Implementar embeddings con pgvector
- [ ] Crear pipeline de embeddings para entidades y artículos
- [ ] Implementar búsqueda semántica
- [ ] Optimizar rendimiento para 10K+ artículos
- [ ] Implementar caché inteligente
- [ ] Testing de escala

**Entregable:** Sistema escalable a 10,000 artículos con búsqueda semántica.

---

## 13. Decisiones Actuales a Cambiar

### Decisión 1: `text.includes()` como método principal
**Problema:** Frágil, no escalable, dependiente de orden de diccionario.  
**Alternativa:** Hybrid Entity Resolution Engine (ver sección 4).

### Decisión 2: Diccionarios de keywords estáticos
**Problema:** Cada nuevo tema requiere modificación manual.  
**Alternativa:** Knowledge Graph con entidades y relaciones dinámicas.

### Decisión 3: FAQs generadas de forma genérica
**Problema:** Todas las FAQs del mismo módulo son similares.  
**Alternativa:** FAQ Generator con 3 fuentes (entidad, intención, bibliografía).

### Decisión 4: Productos relacionados por keyword matching
**Problema:** Productos aparecen por coincidencia léxica, no por relevancia.  
**Alternativa:** Motor de recomendación basado en relaciones del Knowledge Graph.

### Decisión 5: No hay validación automática
**Problema:** Errores de clasificación pasan desapercibidos.  
**Alternativa:** Sistema de validación con reportes automáticos.

### Decisión 6: No hay embeddings
**Problema:** El sistema no entiende el significado profundo del contenido.  
**Alternativa:** Embeddings con pgvector para búsqueda semántica.

### Decisión 7: Sitemap regenerado manualmente
**Problema:** No refleja cambios en tiempo real.  
**Alternativa:** Webhook de Supabase → regeneración automática del sitemap.

---

## Conclusión

Esta arquitectura transforma Bienestar en Claro de un sitio con un pipeline básico de enriquecimiento a una plataforma editorial de nivel profesional. Los principios clave son:

1. **Entidades sobre palabras** — El significado, no la lexica, es la base del sistema.
2. **Relaciones sobre diccionarios** — Las conexiones entre entidades son más valiosas que las listas de keywords.
3. **Confianza sobre certeza** — El sistema sabe cuándo clasificar automáticamente y cuándo necesita revisión humana.
4. **Validación continua** — Cada enriquecimiento se valida contra reglas editoriales y datos del Knowledge Graph.
5. **Escalabilidad por diseño** — PostgreSQL + pgvector soporta 10,000+ artículos sin cambios arquitectónicos.

---

## Glosario

| Término | Definición |
|---------|-----------|
| **Knowledge Graph** | Grafo de conocimiento que organiza entidades y sus relaciones |
| **Entity** | Unidad de conocimiento (enfermedad, producto, síntoma, etc.) |
| **Taxonomy** | Sistema jerárquico de clasificación (nivel 1-4) |
| **Embedding** | Representación vectorial del significado de un texto |
| **AEO** | Answer Engine Optimization — optimización para motores de respuesta |
| **GEO** | Generative Engine Optimization — optimización para LLMs |
| **E-E-A-T** | Experience, Expertise, Authoritativeness, Trustworthiness |
| **JSON-LD** | Formato de datos estructurados para SEO |
| **Semantic Search** | Búsqueda basada en significado, no en palabras exactas |
