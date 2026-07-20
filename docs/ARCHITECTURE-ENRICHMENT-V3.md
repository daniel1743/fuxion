# Arquitectura de Enriquecimiento Editorial — Bienestar en Claro

**Versión:** 3.0  
**Fecha:** Julio 2026  
**Autor:** Daniel Falcón  
**Tipo:** Plataforma Editorial Inteligente para SEO, AEO y GEO  

---

## Índice

1. Visión General
2. Arquitectura de Capas
3. Taxonomía Editorial Maestra
4. Knowledge Graph
5. Graph de Evidencia Científica
6. Graph de Autores
7. Graph de Aprendizaje del Usuario
8. Motor de Clasificación Híbrido
9. Sistema de Ponderación y Confianza
10. FAQs Inteligentes
11. Motor de Recomendación de Productos
12. Hub Pages
13. Editorial AI Layer
14. Content Intelligence Layer
15. Digital Twin Integration
16. Métricas Editoriales
17. Arquitectura AEO/GEO
18. Automatización
19. Validación
20. Roadmap
21. Decisiones Actuales a Cambiar

---

## 1. Visión General

### Filosofía del Sistema

El sistema actual se basa en palabras clave (`text.includes()`). La nueva arquitectura se basa en entidades y relaciones.

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
→ Evidencia: Vinculada a estudios científicos con nivel de evidencia
→ Autor: Vinculado a autor con credenciales verificables
```

### Arquitectura de Capas

```
┌────────────────────────────────────────────────────────────────┐
│                    CAPA DE SALIDA (OUTPUT)                     │
│                                                                │
│  • JSON-LD Schemas (MedicalWebPage, FAQPage, Article, etc.)   │
│  • OG Metadata (title, description, image, tags)              │
│  • Hub Pages (generadas dinámicamente)                         │
│  • Sitemap XML (regenerado automáticamente)                    │
│  • Caché (wellness-articles-cache.json)                        │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌────────────────────────────────────────────────────────────────┐
│               CAPA DE INTELIGENCIA EDITORIAL                    │
│                                                                │
│  • Editorial AI Layer                                          │
│    - Detectar vacíos de contenido                              │
│    - Detectar oportunidades SEO                                │
│    - Detectar artículos duplicados                             │
│    - Detectar enlaces internos faltantes                       │
│    - Detectar entidades huérfanas                              │
│    - Detectar categorías débiles                               │
│    - Detectar contenido desactualizado                         │
│  • Content Intelligence Layer                                  │
│    - Detectar temas en tendencia                               │
│    - Detectar artículos faltantes                              │
│    - Detectar oportunidades de expansión                       │
│  • Métricas Editoriales                                        │
│    - Autoridad, Cobertura, AEO Score, SEO Score, Trust Score   │
│    - Conversion Score, Scientific Level, Update Frequency      │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌────────────────────────────────────────────────────────────────┐
│                  CAPA DE ENRIQUECIMIENTO                         │
│                                                                │
│  1. Entity Extraction                                          │
│  2. Taxonomy Resolution                                        │
│  3. Knowledge Graph Query                                      │
│  4. Scoring & Classification                                   │
│  5. FAQ Generation                                             │
│  6. Product Matching                                           │
│  7. Schema Generation                                          │
│  8. Metric Calculation                                         │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌────────────────────────────────────────────────────────────────┐
│              KNOWLEDGE GRAPH (PostgreSQL)                       │
│                                                                │
│  • Taxonomy (9 dominios × 4 niveles)                           │
│  • Entities (enfermedades, síntomas, productos, estudios, etc.) │
│  • Relations (treats, causes, prevents, contains, etc.)        │
│  • Evidence (estudios, guías, revisiones, meta-análisis)       │
│  • Authors (autores, especialidades, publicaciones)            │
│  • UserLearning (hábitos, progreso, preferencias)              │
│  • EnrichedArticles (resultado del pipeline)                   │
│                                                                │
│  • pg_trgm (búsqueda fuzzy)                                   │
│  • tsvector (búsqueda full-text)                               │
│  • JSONB (flexibilidad)                                        │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌────────────────────────────────────────────────────────────────┐
│                        FUENTES DE DATOS                         │
│                                                                │
│  • Supabase: blog_posts, wellness_articles, users              │
│  • Biblioteca_bienestar.json (biblia)                          │
│  • fuxion_database.json (productos)                            │
│  • Estudios científicos (PubMed, Cochrane, ADA, etc.)          │
│  • Google Trends (volumen de búsqueda)                         │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Taxonomía Editorial Maestra

### Diseño de Niveles Jerárquicos

```
Nivel 1 — DOMINIO (9 dominios)
├── Nutrición y Metabolismo
├── Salud Digestiva
├── Bienestar Cardiovascular
├── Salud Mental y Emocional
├── Sistema Inmune
├── Salud Hormonal
├── Bienestar Físico y Deportivo
├── Salud Sexual y Reproductiva
└── Envejecimiento Saludable

Nivel 2 — SISTEMA CORPORAL (subsistemas de cada dominio)
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

### Estructura de Datos — Taxonomía

```typescript
interface TaxonomyNode {
  id: string;
  name: string;
  slug: string;
  level: 1 | 2 | 3 | 4;
  parentId: string | null;
  description: string;
  relatedEntities: string[];
  relatedProducts: string[];
  childTopics: string[];
  evidenceLevel: 'high' | 'medium' | 'low';
  contentCount: number;
  searchVolume: number;
  createdAt: string;
  updatedAt: string;
}
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

---

## 4. Graph de Evidencia Científica

### Definición

Un grafo separado que organiza la evidencia científica:

```
Entidad (ej. Microbiota Intestinal)
    ↓ studiedBy
Estudio Clínico (ej. "Study X, 2024")
    ↓ supports
Nivel de Evidencia (ej. "Alto")
    ↓ referencedBy
Guía Clínica (ej. "ADA 2026")
    ↓ partOf
Revisión Sistemática (ej. "Cochrane Review")
    ↓ includes
Meta-Análisis (ej. "Meta-Analysis Y, 2025")
```

### Estructura de Datos

```typescript
interface Study {
  id: string;
  title: string;
  year: number;
  authors: string[];
  journal: string;
  doi: string;
  pmid: string;
  type: 'randomized_controlled_trial' | 'cohort' | 'case_control' |
        'cross_sectional' | 'review' | 'meta_analysis' |
        'systematic_review' | 'guideline' | 'editorial';
  evidenceLevel: 'high' | 'medium' | 'low' | 'speculative';
  sampleSize: number;
  population: string;
  intervention?: string;
  outcome: string;
  effectSize: string;
  conclusions: string;
  relatedEntityIds: string[];
  relatedAuthorIds: string[];
  relatedGuidelineIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface ClinicalGuideline {
  id: string;
  name: string;
  organization: string; // ADA, AHA, ESPEN, etc.
  year: number;
  url: string;
  relatedEntityIds: string[];
  relatedStudyIds: string[];
  evidenceLevel: 'high' | 'medium' | 'low';
  recommendations: Recommendation[];
}

interface Recommendation {
  statement: string;
  strength: 'strong' | 'conditional';
  evidenceLevel: 'high' | 'medium' | 'low';
  relatedEntityIds: string[];
}
```

### Tablas en Supabase

```sql
CREATE TABLE studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  authors TEXT[],
  journal TEXT,
  doi TEXT,
  pmid TEXT,
  type TEXT NOT NULL CHECK (type IN ('randomized_controlled_trial', 'cohort',
    'case_control', 'cross_sectional', 'review', 'meta_analysis',
    'systematic_review', 'guideline', 'editorial')),
  evidence_level TEXT DEFAULT 'medium' CHECK (evidence_level IN ('high','medium','low','speculative')),
  sample_size INTEGER,
  population TEXT,
  intervention TEXT,
  outcome TEXT,
  effect_size TEXT,
  conclusions TEXT,
  related_entities UUID[] REFERENCES entities(id),
  related_authors UUID[] REFERENCES authors(id),
  related_guidelines UUID[] REFERENCES clinical_guidelines(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clinical_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  year INTEGER NOT NULL,
  url TEXT,
  related_entities UUID[] REFERENCES entities(id),
  related_studies UUID[] REFERENCES studies(id),
  evidence_level TEXT DEFAULT 'medium',
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Graph de Autores

### Definición

Un grafo dedicado que organiza la autoridad editorial:

```
Autor (Daniel Falcón)
    ↓ specializes_in
Entidades (Salud Digestiva, Microbiota, etc.)
    ↓ authored
Artículos publicados
    ↓ cites
Estudios científicos
    ↑ demonstrates_expertise_in
Taxonomía (Nivel 2-3)
```

### Estructura de Datos

```typescript
interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  photoUrl: string;
  role: string;
  specialties: string[];           // IDs de entidades
  publications: string[];          // IDs de artículos
  citations: number;               // Total de citas
  hIndex: number;
  experienceYears: number;
  education: string[];
  affiliations: string[];
  socialProfiles: {
    linkedin?: string;
    twitter?: string;
    orcid?: string;
  };
  taxonomyNodeIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Ejemplo

```
Daniel Falcón
├── Especializa en: Salud Digestiva, Microbiota, Nutrición
├── Publicaciones: 47 artículos
├── Citas: 234
├── Experiencia: 5 años
├── Educación: Investigador de Salud y Bienestar
└── Perfil: E-E-A-T Score calculado automáticamente
```

---

## 6. Graph de Aprendizaje del Usuario

### Definición

Un grafo que registra el comportamiento del usuario para generar recomendaciones personalizadas:

```
Usuario
    ↓ reads
Artículos
    ↓ interests_in
Entidades
    ↓ explores
Productos
    ↓ completes
Tests y Evaluaciones
    ↓ leads_to
Plan Personalizado
```

### Estructura de Datos

```typescript
interface UserLearning {
  userId: string;
  readArticles: {
    articleId: string;
    readAt: string;
    readDuration: number;
    engagement: number;  // 0-1
  }[];
  viewedProducts: {
    productId: string;
    viewedAt: string;
    engagement: number;
  }[];
  completedTests: {
    testId: string;
    completedAt: string;
    score: number;
  }[];
  interests: {
    entityId: string;
    strength: number;
    lastInteracted: string;
  }[];
  objectives: {
    type: string;
    target: string;
    progress: number;
    status: string;
  }[];
  habits: {
    name: string;
    frequency: string;
    adherence: number;
  }[];
  createdAt: string;
  updatedAt: string;
}
```

### Recomendaciones Personalizadas

```typescript
function getNextArticle(userId: string): RecommendedContent {
  const user = getUserLearning(userId);
  
  // 1. Entidades no exploradas en los mismos dominios
  const unexploredEntities = findUnexploredEntities(user.interests);
  
  // 2. Artículos relacionados con intereses recientes
  const recentInterests = user.interests
    .filter(i => i.lastInteracted > 30 * 24 * 60 * 60 * 1000) // últimos 30 días
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 3);
  
  // 3. Artículos que complementan la lectura reciente
  const complementaryArticles = findComplementaryArticles(user.readArticles);
  
  return {
    articles: complementaryArticles,
    products: user.viewedProducts.map(p => getRelatedProducts(p.productId)),
    tests: user.completedTests.map(t => getFollowUpTests(t.testId)),
  };
}
```

---

## 7. Motor de Clasificación Híbrido

### Algoritmo Propuesto: Hybrid Entity Resolution Engine

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

Paso 3: Lexical Fallback (keyword matching con pesos)
  → Keywords del contenido → entidades conocidas
  → Peso: 0.5 (bajo, porque es impreciso)
  → Solo si los pasos anteriores no dieron resultado claro

Paso 4: Embeddings (futuro, opcional)
  → Embedding del contenido del artículo
  → Cosine similarity con embeddings de entidades
  → Solo cuando el Knowledge Graph tenga suficientes entidades
```

### Implementación Técnica

```typescript
interface ClassificationResult {
  primaryNode: TaxonomyNode;
  confidence: number;
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
  source: 'title' | 'heading' | 'content' | 'synonym' | 'lexical';
  term: string;
  strength: number;
}
```

### Por Qué Este Algoritmo es Mejor que `text.includes()`

| Aspecto | `text.includes()` | Hybrid Entity Resolution |
|---------|-------------------|--------------------------|
| Orden del diccionario importa | SÍ (crítico) | NO |
| Conflicto "hígado" vs "ejercicio" | Frecuente | Resuelto por pesos |
| Sinónimos | No soportados | Soportados |
| Confianza numérica | No | Sí |
| Explicable | No | Sí (score breakdown) |
| Escalable a 10K artículos | Difícil | Sí |

---

## 8. Sistema de Ponderación y Confianza

### Pesos por Fuente de Coincidencia

| Fuente | Peso | Razón |
|--------|------|-------|
| Título del artículo | 0.40 | Máxima relevancia semántica |
| Subtítulos (H2, H3) | 0.20 | Relevancia editorial |
| Contenido — primeras 200 palabras | 0.15 | Introducción define el tema |
| Contenido — resto | 0.05 | Contexto secundario |
| Sinónimos detectados | 0.10 | Respaldo lexical |
| Entidades co-ocurrentes | 0.05 | Confirmación contextual |
| Embedding semántico | 0.05 | Significado profundo (futuro) |

### Pesos por Posición en el Texto

| Posición | Multiplicador | Razón |
|----------|---------------|-------|
| Título | ×2.0 | Máxima importancia |
| Primer párrafo | ×1.5 | Contexto principal |
| Subtítulos | ×1.3 | Secciones importantes |
| Cuerpo del texto | ×1.0 | Referencia |
| Disclaimer / footer | ×0.1 | No relevante |

### Sistema de Confianza Adaptativo

```
confidence = normalized_score * (1 + match_count * 0.1)

Umbral adaptativo por tipo de contenido:
  • Artículo médico (cirrosis, cáncer): confidence >= 0.90
  • Artículo de bienestar (nutrición, ejercicio): confidence >= 0.75
  • Artículo informativo (qué es X): confidence >= 0.60
  • Artículo de opinión: confidence >= 0.50

Acción según confianza:
  • confidence >= umbral → Clasificado automáticamente
  • 0.50 <= confidence < umbral → Revisión editorial recomendada
  • confidence < 0.50 → No clasificado (requiere intervención manual)
```

---

## 9. FAQs Inteligentes

### Nueva Arquitectura

Las FAQs se generan desde 3 fuentes que se combinan:

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
```

**Fuente C: Preguntas de la Bibliografía**
```
Los estudios científicos citados generan preguntas:
  • Según estudios de la ADA 2026, ¿cuál es el impacto...?
```

### Ejemplo — Artículo sobre Cirrosis Hepática

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

## 10. Motor de Recomendación de Productos

### Regla de Oro

**Los productos Fuxion solo se muestran cuando hay una relación clara entre el objetivo del artículo y el beneficio del producto.**

### Motor de Matching

```typescript
interface ProductMatch {
  productId: string;
  productName: string;
  matchReason: string;
  matchStrength: number;
  matchType: 'direct' | 'supportive' | 'preventive' | 'complementary';
  confidence: number;
}

function matchProducts(article: Article, entity: Entity): ProductMatch[] {
  const matches: ProductMatch[] = [];
  matches.push(...directMatches);
  matches.push(...supportiveMatches);
  matches.push(...preventiveMatches);
  return matches.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}
```

### Cuándo NO Mostrar Productos

1. Artículos con tono muy médico/científico (sin intención comercial)
2. Artículos sobre enfermedades graves (cirrosis, cáncer)
3. Artículos con intención puramente educativa
4. Artículos donde el producto no tiene relación directa

---

## 11. Hub Pages

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
├── Productos
├── Guías
├── FAQ
├── Herramientas
└── Artículos Relacionados
```

---

## 12. Editorial AI Layer

### Definición

Una capa de inteligencia que detecta automáticamente oportunidades de mejora editorial:

```
Editorial AI Layer
├── Detecta vacíos de contenido
│   → "No hay artículos sobre Hígado Graso en España"
│   → "No hay artículos sobre Hígado Graso en México"
│   → "No hay artículos sobre Hígado Graso en Argentina"
├── Detecta oportunidades SEO
│   → "La palabra 'hígado graso' tiene volumen creciente"
│   → "Hay un artículo sobre Hígado Graso que podría optimizarse"
├── Detecta artículos duplicados
│   → "El artículo X y el artículo Y cubren el mismo tema"
├── Detecta enlaces internos faltantes
│   → "El artículo X debería enlazar al artículo Y"
├── Detecta entidades huérfanas
│   → "La entidad 'Cirrosis' no está relacionada con ningún artículo"
├── Detecta categorías débiles
│   → "La categoría 'Hígado' tiene solo 2 artículos"
├── Detecta contenido desactualizado
│   → "El artículo X fue publicado hace 2 años y necesita actualización"
├── Detecta necesidades de contenido multimedia
│   → "El artículo X debería incluir un gráfico"
│   → "El artículo X debería incluir una infografía"
└── Detecta necesidades de FAQ
    → "El artículo X debería incluir una FAQ sobre prevención"
```

### Implementación

```typescript
interface EditorialInsight {
  type: 'missing_content' | 'duplicate' | 'weak_category' |
        'orphan_entity' | 'outdated' | 'seo_opportunity' |
        'missing_internal_links' | 'needs_multimedia' |
        'needs_faq';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affectedArticleIds: string[];
  affectedEntityIds: string[];
  suggestedAction: string;
  createdAt: string;
}

function detectInsights(): EditorialInsight[] {
  const insights: EditorialInsight[] = [];

  // Detectar vacíos de contenido
  const emptyCategories = taxonomyNodes.filter(n => n.contentCount === 0);
  emptyCategories.forEach(cat => {
    insights.push({
      type: 'missing_content',
      severity: 'high',
      description: `No hay artículos en la categoría "${cat.name}"`,
      affectedEntityIds: cat.relatedEntities,
      suggestedAction: `Crear contenido sobre los temas de "${cat.name}"`,
      createdAt: new Date().toISOString(),
    });
  });

  // Detectar entidades huérfanas
  const orphanedEntities = entities.filter(e =>
    !getRelatedArticles(e.id).length && !getRelatedProducts(e.id).length
  );
  orphanedEntities.forEach(ent => {
    insights.push({
      type: 'orphan_entity',
      severity: 'medium',
      description: `La entidad "${ent.name}" no está relacionada con ningún artículo`,
      affectedEntityIds: [ent.id],
      suggestedAction: `Crear contenido sobre "${ent.name}"`,
      createdAt: new Date().toISOString(),
    });
  });

  // Detectar contenido desactualizado
  const outdatedArticles = articles.filter(a =>
    a.updatedAt < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  );
  outdatedArticles.forEach(article => {
    insights.push({
      type: 'outdated',
      severity: 'medium',
      description: `El artículo "${article.title}" fue publicado hace más de 1 año`,
      affectedArticleIds: [article.id],
      suggestedAction: `Actualizar el artículo "${article.title}"`,
      createdAt: new Date().toISOString(),
    });
  });

  return insights;
}
```

---

## 13. Content Intelligence Layer

### Definición

Una capa de inteligencia que analiza el Knowledge Graph y detecta oportunidades estratégicas:

```
Content Intelligence Layer
├── Detecta vacíos de contenido
├── Detecta oportunidades SEO
├── Detecta artículos faltantes
├── Detecta temas en tendencia (Google Trends)
├── Detecta enlaces internos faltantes
├── Detecta entidades huérfanas
└── Detecta categorías débiles
```

### Métricas Editoriales

```typescript
interface EditorialMetrics {
  articleId: string;
  authorityScore: number;       // 0-100
  topicCoverage: number;        // 0-100
  scientificLevel: number;      // 0-100
  readLevel: number;            // 0-100
  freshness: number;            // 0-100
  citationCount: number;        // absoluta
  faqCount: number;             // absoluta
  semanticCoverage: number;     // 0-100
  aeoScore: number;             // 0-100
  seoScore: number;             // 0-100
  trustScore: number;           // 0-100
  conversionScore: number;      // 0-100
  updatedAt: string;
}
```

### Ejemplo de Métricas

```
Artículo: "Cirrosis Hepática"
├── Authority Score: 85/100 (autor con 5 años de experiencia)
├── Topic Coverage: 70/100 (cubre 7 de 10 subtemas de cirrosis)
├── Scientific Level: 90/100 (cita 15 estudios)
├── Read Level: 60/100 (lectura intermedia)
├── Freshness: 40/100 (publicado hace 2 años)
├── Citation Count: 15
├── FAQ Count: 3
├── Semantic Coverage: 75/100 (cubre 75% de entidades relevantes)
├── AEO Score: 65/100
├── SEO Score: 70/100
├── Trust Score: 80/100
└── Conversion Score: 20/100 (artículo médico, no comercial)
```

---

## 14. Digital Twin Integration

### Definición

Integración del perfil de bienestar del usuario con el Knowledge Graph:

```
Usuario
├── Objetivos (ej. "Perder 5 kg en 3 meses")
├── Hábitos (ej. "Camina 30 minutos diarios")
├── Contenido Leído (ej. "Cirrosis, Microbiota, Hígado Graso")
├── Productos Vistos (ej. "Rexet, Prunex 1")
├── Artículos Recomendados (basados en intereses)
└── Plan Personalizado (generado automáticamente)
```

### Tablas en Supabase

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  age INTEGER,
  gender TEXT,
  health_goals TEXT[],
  current_habits TEXT[],
  medical_conditions TEXT[],
  medications TEXT[],
  allergies TEXT[],
  preferences JSONB,
  privacy_settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_learning_graph (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  read_articles JSONB,
  viewed_products JSONB,
  completed_tests JSONB,
  interests JSONB,
  objectives JSONB,
  habits JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Privacidad

```typescript
// El perfil del usuario se almacena localmente (localStorage/sessionStorage)
// Nunca se envía al servidor sin consentimiento explícito
// Los datos sensibles se encriptan antes de almacenar
function encryptSensitiveData(data: UserLearning): string {
  return encrypt(data, getUserEncryptionKey());
}
```

---

## 15. Arquitectura AEO/GEO

### Principios Fundamentales

**AEO (Answer Engine Optimization):**
1. Respuestas directas
2. Definiciones claras
3. Tablas para datos comparativos
4. FAQs con formato pregunta-respuesta
5. Citas de estudios reales
6. Estructura limpia con headings jerárquicos

**GEO (Generative Engine Optimization):**
1. Datos estructurados JSON-LD
2. Contenido con autoridad
3. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
4. Contenido único
5. Contenido actualizado

---

## 16. Automatización

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
  8. Metric Calculation
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

---

## 17. Validación

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

---

## 18. Roadmap

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

### Fase 3: Graph de Evidencia y Autores (4-6 semanas)

**Dificultad:** Media-Alta  
**Impacto:** Alto  
**Prioridad:** Alta  
**Riesgo:** Medio  

- [ ] Crear tablas de estudios y guías clínicas
- [ ] Poblar el Graph de Evidencia con la biblia_bienestar.json
- [ ] Crear el Graph de Autores
- [ ] Implementar versionado del Knowledge Graph
- [ ] Integrar con el pipeline de enriquecimiento

### Fase 4: Hub Pages y Automatización (4-6 semanas)

**Dificultad:** Media-Alta  
**Impacto:** Alto  
**Prioridad:** Alta  
**Riesgo:** Medio  

- [ ] Implementar generación automática de Hub Pages
- [ ] Configurar webhooks de Supabase
- [ ] Crear dashboard de monitoreo
- [ ] Implementar validaciones automáticas
- [ ] Configurar alertas de errores

### Fase 5: Editorial AI Layer y Content Intelligence (6-8 semanas)

**Dificultad:** Alta  
**Impacto:** Muy Alto  
**Prioridad:** Media  
**Riesgo:** Alto  

- [ ] Implementar Editorial AI Layer
- [ ] Implementar Content Intelligence Layer
- [ ] Crear sistema de métricas editoriales
- [ ] Implementar detección de vacíos y oportunidades
- [ ] Configurar alertas automáticas

### Fase 6: Digital Twin y Learning Graph (6-8 semanas)

**Dificultad:** Alta  
**Impacto:** Alto  
**Prioridad:** Media  
**Riesgo:** Alto  

- [ ] Implementar perfil de bienestar del usuario
- [ ] Crear el Learning Graph
- [ ] Integrar con el Knowledge Graph
- [ ] Implementar recomendaciones personalizadas
- [ ] Configurar privacidad y cifrado

### Fase 7: Embeddings y Escalabilidad (8-12 semanas)

**Dificultad:** Alta  
**Impacto:** Muy Alto  
**Prioridad:** Baja  
**Riesgo:** Alto  

- [ ] Implementar embeddings con pgvector
- [ ] Crear pipeline de embeddings para entidades y artículos
- [ ] Implementar búsqueda semántica
- [ ] Optimizar rendimiento para 10K+ artículos
- [ ] Implementar caché inteligente
- [ ] Testing de escala

---

## 19. Decisiones Actuales a Cambiar

### Decisión 1: `text.includes()` como método principal
**Problema:** Frágil, no escalable, dependiente de orden de diccionario.  
**Alternativa:** Hybrid Entity Resolution Engine (ver sección 7).

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
**Alternativa:** Embeddings con pgvector (Fase 7, no prioritario ahora).

### Decisión 7: Sitemap regenerado manualmente
**Problema:** No refleja cambios en tiempo real.  
**Alternativa:** Webhook de Supabase → regeneración automática del sitemap.

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
| **Editorial AI Layer** | Capa de inteligencia que detecta oportunidades editoriales |
| **Content Intelligence** | Análisis del Knowledge Graph para detectar vacíos y oportunidades |
| **Digital Twin** | Perfil personalizado del usuario integrado con el Knowledge Graph |
| **Learning Graph** | Registro del aprendizaje y comportamiento del usuario |
