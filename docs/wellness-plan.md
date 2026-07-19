# Plan: Informe Personalizado de Bienestar — Bienestar en Claro

## Visión

Transformar el cuestionario de bienestar en una experiencia premium: el usuario responde ~50 preguntas y recibe un informe PDF de 20-40 páginas con análisis personalizado, gráficos, plan de acción de 90 días, y un Índice de Bienestar (IB) 0-100.

## Principio de diseño

**Código = scores, lógica, estructura.**
**IA = explicaciones, recomendaciones específicas, insights.**

Esto nos permite generar un PDF rico con solo 3-5 llamadas a la IA (no decenas), manteniendo costos bajos.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend                               │
│                                                             │
│  WellnesTwinContext  →  captura respuestas                  │
│       │                                                   │
│       ▼                                                   │
│  Engine (calculadora)  →  scores por 12 áreas             │
│       │                                                   │
│       ├── IB (Índice Bienestar)                             │
│       ├── edad biológica estimada                         │
│       ├── fortalezas / riesgos                            │
│       └── prioridades                                     │
│       │                                                   │
│       ▼                                                   │
│  AI Generator (3-5 llamadas)                               │
│       │                                                   │
│       ├── Llamada 1: Análisis general (500 tokens)         │
│       ├── Llamada 2: Alimentación personalizada            │
│       ├── Llamada 3: Sueño + cronotipo                     │
│       ├── Llamada 4: Actividad física                      │
│       └── Llamada 5: Plan de acción 90 días               │
│       │                                                   │
│       ▼                                                   │
│  PDF Renderer (@react-pdf/renderer)                        │
│       │                                                   │
│       └── PDF de 20-40 páginas con gráficos y tablas       │
└─────────────────────────────────────────────────────────────┘
```

## Fases de implementación

### Fase 1: Motor de Scoring (1 semana)

**Sin IA. Código puro. Determinista. Gratis.**

- [ ] `src/services/healthEngine.js` — Motor de cálculo de scores
  - Scores por 12 áreas: nutrición, hidratación, sueño, estrés, ejercicio, digestión, salud intestinal, hígado, peso, sistema inmune, riesgo cardiovascular, salud metabólica
  - Cada score: 0-100 con desglose de puntos por respuesta
  - IB (Índice de Bienestar): promedio ponderado
  - Edad biológica estimada (basada en hábitos)
  - Fortalezas y riesgos principales
  - Top 3 prioridades absolutas

- [ ] `src/services/foodDatabase.js` — Base de datos de alimentos
  - Alimentos buenos para cada condición
  - Alimentos a reducir/evitar
  - Ejemplos de platos por categoría

- [ ] `src/services/activityDatabase.js` — Base de datos de actividades físicas
  - Planes por edad, peso, objetivo
  - Rutinas semanales por nivel

- [ ] `src/services/hydrationStrategies.js` — Estrategias de hidratación
  - Trucos prácticos según preferencias

- [ ] `src/services/sleepPatterns.js` — Patrones de sueño
  - Cronotipos y rutinas
  - Errores comunes

### Fase 2: Templates de PDF (1 semana)

**Diseño fijo, contenido dinámico.**

- [ ] `src/components/PDFDocument.jsx` — Documento principal
  - Portada con logo, nombre, fecha
  - Índice de bienestar
  - Gráfico radar de 12 áreas
  - Gráfico de barras por categoría

- [ ] `src/components/PDFSections/` — Secciones modulares
  - `ExecutiveSummary.jsx` — Resumen ejecutivo
  - `DigitalTwin.jsx` — Gemelo digital de bienestar
  - `Radiography.jsx` — Radiografía completa
  - `Nutrition.jsx` — Alimentación personalizada
  - `Hydration.jsx` — Hidratación
  - `Sleep.jsx` — Sueño
  - `Activity.jsx` — Actividad física
  - `Digestion.jsx` — Salud digestiva
  - `Stress.jsx` — Estrés
  - `FutureRisks.jsx` — Riesgos futuros
  - `ActionPlan.jsx` — Plan de acción 90 días
  - `Goals.jsx` — Metas medibles
  - `Products.jsx` — Productos complementarios
  - `TopActions.jsx` — Top 10 acciones con mayor impacto

- [ ] `src/components/PDFRenderer.jsx` — Generador del PDF
  - Renderiza todos los componentes a un archivo descargable
  - Opciones de descarga directa o compartir

### Fase 3: Generador de IA (1 semana)

**Solo 5 llamadas. Cada una enfocada y corta.**

- [ ] `src/services/AIPersonalizedReport.js` — Generador de texto personalizado
  - `generateExecutiveSummary(data)` — Análisis general
  - `generateNutritionPlan(data)` — Alimentación + horarios + ejemplos
  - `generateSleepPlan(data)` — Cronotipo + rutina + errores
  - `generateActivityPlan(data)` — Plan semanal personalizado
  - `generateActionPlan(data)` — Plan de 90 días semana a semana

- [ ] `src/services/aiPrompts.js` — Prompts optimizados
  - Cada prompt con contexto específico del usuario
  - Instrucciones de formato (sin markdown, solo texto limpio)
  - Límites de extensión por respuesta
  - Tone: médico profesional, empático, concreto

### Fase 4: Integración y UX (1 semana)

- [ ] `src/pages/WellnessAssessmentPage.jsx` — Página del cuestionario
  - Progreso visual
  - Botón "Generar Informe" al finalizar

- [ ] `src/pages/PDFReportPage.jsx` — Vista previa del PDF
  - Preview con scroll
  - Botón de descarga
  - Botón de compartir

- [ ] `src/hooks/usePDFDownload.js` — Hook de descarga
  - Genera PDF al vuelo
  - Maneja errores y carga

- [ ] `src/components/WellnessPlanManager.jsx` — Gestión del plan
  - Historial de planes
  - Comparación entre evaluaciones
  - Evolución del Índice de Bienestar

- [ ] `supabase/migrations/002_wellness_plans.sql` — Tabla de planes
  - `wellness_plans` — historial por usuario
  - `wellness_plans_scores` — scores por evaluación

### Fase 5: Mejoras (iteración continua)

- [ ] Notificaciones de recordatorios inteligentes
- [ ] Gráficos de evolución en el tiempo
- [ ] Sección de productos (solo si aplica)
- [ ] Versión móvil del informe (HTML, no PDF)
- [ ] Exportar como imagen para redes sociales

## Detalles técnicos

### Motor de scoring

Cada respuesta tiene un peso:
- Sí/No: +10 o -10
- Escala 1-10: mapeado a 0-20
- Selección múltiple: pesos específicos

Ejemplo para **Sueño**:
- Horas de sueño: 7-9h = +20, 5-6h = +10, <5h = 0
- Calidad percibida: 10 = +20, 5 = +10, 1 = 0
- Despertares nocturnos: 0 = +20, 1-2 = +10, 3+ = 0
- Uso de pantallas antes de dormir: No = +15, Sí = 0
- Temperatura ambiente adecuada: Sí = +10, No = 0
- Total máximo posible: 85 puntos → normalizado a 100

### IA: solo 5 llamadas

Cada llamada tiene contexto mínimo del usuario (solo lo relevante):

```
Llamada 1: "Analiza este perfil: [datos resumidos]. Dame 3 prioridades."
Llamada 2: "Usuario con puntuación nutricional 35. Sugiere qué comer más, reducir y evitar."
Llamada 3: "Usuario con puntuación sueño 28. Determina cronotipo y sugiere rutina."
Llamada 4: "Usuario de 45 años, 78kg, objetivo perder peso. Sugiere plan semanal."
Llamada 5: "Basado en [prioridades], crea plan de acción de 90 días."
```

**Costo estimado:** 3-5 llamadas × ~500 tokens entrada + ~1500 tokens salida = ~10,000 tokens totales. Muy económico.

### PDF con @react-pdf/renderer

Ventajas:
- Se ejecuta en el cliente (no servidor)
- No requiere backend
- Formatos profesionales
- Descarga directa
- Gráficos nativos (líneas, barras, radar)

### Caché de respuestas

Las respuestas se guardan en Supabase (`wellness_plans`). Cada evaluación es un registro. Esto permite:
- Ver evolución en el tiempo
- Comparar planes
- Mostrar gráfico de progreso del IB

## Timeline estimado

| Fase | Duración | Entrega |
|------|----------|---------|
| 1. Motor de scoring | 1 semana | Scores funcionales, sin PDF |
| 2. Templates de PDF | 1 semana | PDF visual, sin IA |
| 3. Generador de IA | 1 semana | PDF con textos personalizados |
| 4. Integración | 1 semana | Flujo completo: cuestionario → PDF |
| 5. Mejoras | iterativo | Recordatorios, gráficos evolución |

**Total: ~4 semanas de desarrollo dedicado.**

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| IA genera texto genérico | Prompts con contexto específico + límite de extensión |
| PDF muy grande (>20MB) | Optimizar imágenes, comprimir |
| Costos de API | Máximo 5 llamadas, cachear resultados |
| Tiempo de generación lento | Mostrar spinner, permitir cancelar |
| Usuarios no leen el PDF | Versión móvil HTML como alternativa |
