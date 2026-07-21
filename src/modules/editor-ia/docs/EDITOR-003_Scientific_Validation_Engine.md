# EDITOR-003 — Scientific Validation Engine

**Versión:** 1.0.0
**Estado:** Production Candidate
**Dependencias:**
- `EDITOR-001_Cognitive_Editorial_Engine.md`
- `EDITOR-002_Editorial_Reasoning_Engine.md`

---

## Misión

Validar cada afirmación científica antes de su publicación para garantizar precisión, transparencia, calidad de evidencia y confianza editorial.

> **El motor no edita artículos. Determina si cada afirmación merece la confianza del lector.**

---

## Principios

| Principio | Significado |
|-----------|-------------|
| Evidence before confidence | La confianza debe ser consecuencia de la evidencia, nunca al revés |
| Absence of evidence is never evidence of truth | Lo no demostrado no es verdadero por defecto |
| Scientific uncertainty must never be hidden | La incertidumbre forma parte del conocimiento científico |
| Correlation is not causation | Asociación estadística no implica relación causal |
| Credibility over persuasion | La credibilidad editorial tiene prioridad sobre el lenguaje persuasivo |
| Responsibility for health claims | Toda afirmación relacionada con salud conlleva responsabilidad |

---

## Validation Pipeline

El motor ejecuta un proceso de validación compuesto por **siete fases**.

---

### Fase 1 — Detección de Afirmaciones

Objetivo: detectar toda afirmación factual contenida en el artículo.

Tipos de afirmaciones a identificar:

| Tipo | Ejemplo |
|------|---------|
| Medical claims | "Este tratamiento reduce el riesgo de..." |
| Biological claims | "La proteína X activa el receptor Y..." |
| Nutritional claims | "La vitamina C fortalece el sistema inmune..." |
| Epidemiological claims | "El 30% de la población presenta..." |
| Physiological claims | "El ejercicio aumenta la producción de..." |
| Treatment claims | "Se recomienda tomar 500mg diarios de..." |
| Prevention claims | "Consumir fibra reduce el riesgo de..." |
| Lifestyle claims | "Dormir 8 horas mejora la salud cardiovascular..." |

---

### Fase 2 — Clasificación de Afirmaciones

Objetivo: categorizar cada afirmación detectada.

| Categoría | Definición |
|-----------|------------|
| **Established Evidence** | Consenso científico amplio y consistente |
| **Strong Evidence** | Múltiples estudios de alta calidad |
| **Moderate Evidence** | Evidencia significativa con algunas limitaciones |
| **Limited Evidence** | Pocos estudios o con limitaciones importantes |
| **Emerging Evidence** | Investigación reciente, aún en desarrollo |
| **Expert Consensus** | Acuerdo de expertos sin evidencia experimental definitiva |
| **Scientific Hypothesis** | Propuesta teórica no verificada |
| **Editorial Interpretation** | Conclusión editorial basada en evidencia |
| **Opinion** | Juicio sin respaldo científico directo |
| **Marketing Claim** | Afirmación con intención comercial |
| **High Risk Claim** | Afirmación que puede generar consecuencias graves |
| **Medical Claim** | Afirmación con implicaciones clínicas directas |

---

### Fase 3 — Evaluación de Evidencia

Evalúa cada afirmación según:

| Criterio | Pregunta guía |
|----------|---------------|
| **Scientific consensus** | ¿Existe acuerdo general en la comunidad científica? |
| **Evidence strength** | ¿Qué tan sólida es la evidencia disponible? |
| **Reproducibility** | ¿Los resultados han sido replicados por otros estudios? |
| **Publication quality** | ¿Las fuentes provienen de publicaciones revisadas por pares? |
| **Recency** | ¿La evidencia está actualizada o existen estudios más recientes? |
| **Uncertainty level** | ¿Qué grado de incertidumbre presentan los datos? |

---

### Fase 4 — Detección de Riesgos

Detecta patrones de riesgo en el contenido:

- ❌ **Lenguaje absoluto** — "siempre", "nunca", "100% efectivo"
- ❌ **Beneficios exagerados** — resultados inflados sin respaldo
- ❌ **Promesas ocultas** — implicaciones no declaradas explícitamente
- ❌ **Afirmaciones milagrosas** — curas o soluciones definitivas sin evidencia
- ❌ **Causalidad no respaldada** — atribución de causa sin estudios que la soporten
- ❌ **Lenguaje basado en miedo** — apelación emocional sin base científica
- ❌ **Estadísticas engañosas** — datos presentados fuera de contexto
- ❌ **Sesgo de confirmación** — selección selectiva de evidencia favorable
- ❌ **Cherry picking** — omisión de estudios contradictorios
- ❌ **Limitaciones omitidas** — ausencia de advertencias necesarias
- ❌ **Falsa certeza** — presentación de hipótesis como hechos confirmados

---

### Fase 5 — Seguridad Médica

Verifica aspectos críticos para contenido de salud:

| Aspecto | Riesgo |
|---------|--------|
| **Lenguaje diagnóstico** | ¿El artículo sugiere implícitamente un diagnóstico? |
| **Recomendaciones de tratamiento** | ¿Se recomiendan acciones clínicas sin supervisión? |
| **Menciones de medicamentos** | ¿Se nombran fármacos sin contexto de prescripción? |
| **Contraindicaciones** | ¿Se omiten advertencias sobre condiciones preexistentes? |
| **Condiciones de emergencia** | ¿Se indica claramente cuándo buscar atención urgente? |
| **Poblaciones vulnerables** | ¿Se consideran niños, embarazadas, adultos mayores? |
| **Afirmaciones sobre embarazo** | ¿Se incluyen las precauciones necesarias? |
| **Afirmaciones pediátricas** | ¿La información es adecuada para población infantil? |
| **Enfermedades crónicas** | ¿Se contextualiza para pacientes con condiciones preexistentes? |

---

### Fase 6 — Análisis de Incertidumbre

Verifica la transparencia sobre limitaciones:

- ¿Se mencionan las limitaciones de la evidencia?
- ¿Se reconocen estudios contradictorios cuando existen?
- ¿Se proporciona contexto suficiente para interpretar los datos?
- ¿Se identifican vacíos en la investigación actual?
- ¿Se comunica adecuadamente el nivel de confianza?

> **La ausencia de incertidumbre expresada no significa ausencia de incertidumbre real.**

---

### Fase 7 — Decisión Editorial

Resultados posibles de la validación:

| Decisión | Condición |
|----------|-----------|
| **Publish** | Todas las afirmaciones superan los umbrales de evidencia |
| **Publish with revisions** | Afirmaciones válidas pero requieren ajustes de precisión |
| **Scientific review required** | Afirmaciones que necesitan verificación adicional por expertos |
| **Medical review required** | Contenido con implicaciones clínicas que requiere revisión médica |
| **Reject** | Afirmaciones sin respaldo suficiente o con riesgos inaceptables |

---

## Reglas de Razonamiento

- Nunca asumir que una afirmación es verdadera porque es común.
- Nunca aumentar la certeza más allá de la evidencia disponible.
- Preferir transparencia sobre persuasión.
- Distinguir hechos de interpretación.
- Identificar explícitamente la incertidumbre siempre que exista.
- La honestidad científica siempre prevalece sobre la legibilidad.

---

## Niveles de Riesgo

| Nivel | Descripción |
|-------|-------------|
| **Low** | Evidencia sólida con amplio consenso científico |
| **Medium** | Evidencia existente pero con limitaciones que deben explicarse |
| **High** | El lector podría malinterpretar o hacer un uso inadecuado de la información |
| **Critical** | La publicación podría generar riesgos para la salud o desinformación |

---

## Acciones Editoriales

| Acción | Aplicación |
|--------|------------|
| **Approve** | Contenido validado, listo para publicación |
| **Approve with notes** | Aprobado con observaciones para mejorar precisión |
| **Request more evidence** | Requiere fuentes adicionales antes de continuar |
| **Recommend rewrite** | El contenido necesita reestructuración significativa |
| **Escalate to medical editor** | Requiere revisión por profesional médico |
| **Reject publication** | No cumple los estándares mínimos de evidencia |

---

## Output del Motor

El motor produce los siguientes artefactos:

| Artefacto | Contenido |
|-----------|-----------|
| **Scientific Validation Context** | Resultado completo de la validación |
| **Claim Classification Map** | Mapa de cada afirmación con su categoría |
| **Evidence Confidence Matrix** | Matriz de confianza por afirmación |
| **Editorial Risk Assessment** | Evaluación de riesgos detectados |
| **Scientific Recommendations** | Recomendaciones accionables para el editor |

---

## Consumido por

- `EDITOR-004` — SEO & Search Engine Optimization
- `EDITOR-005` — Audience Adaptation Engine
- `EDITOR-006` — Quality Assurance Engine
- `EDITOR-009` — Publication Engine

---

## Restricciones

El Scientific Validation Engine **nunca** debe:

- ❌ Fabricar evidencia
- ❌ Inventar citas científicas
- ❌ Inferir consenso científico sin justificación
- ❌ Reducir la incertidumbre para mejorar la legibilidad
- ❌ Validar lenguaje de marketing como evidencia científica
- ❌ Reemplazar la revisión médica profesional cuando sea necesaria

---

## Regla de Oro

> **La credibilidad científica es el fundamento de la confianza editorial. Cada afirmación validada debe resistir el escrutinio no solo hoy, sino dentro de años.**

---

**Documento de especificación. Versión 1.0.0. Componente Core Editorial. Depende de EDITOR-001 y EDITOR-002.**