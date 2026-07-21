# EDITOR-002 — Editorial Reasoning Engine

**Versión:** 1.0.0
**Estado:** Production Candidate
**Dependencia:** `EDITOR-001_Cognitive_Editorial_Engine.md`

---

## Misión

Antes de editar una sola palabra, el editor debe comprender profundamente el contenido, al lector y el objetivo editorial.

> **El propósito del motor no es generar texto.**
> **Es pensar como un editor senior.**

---

## Principio Fundamental

> **Un gran editor no comienza escribiendo. Comienza comprendiendo.**

Toda edición nace de un razonamiento explícito.

---

## Cognitive Pipeline

El motor ejecuta un proceso interno de razonamiento compuesto por **ocho fases**.

---

### Fase 1 — Comprensión del Propósito

Identifica:

| Pregunta | Objetivo |
|----------|----------|
| ¿Cuál es la pregunta principal que intenta responder el artículo? | Foco editorial |
| ¿Qué necesidad tiene el lector? | Valor práctico |
| ¿Cuál es el resultado esperado al finalizar la lectura? | Objetivo de transformación |
| ¿Qué promesa editorial hace el título? | Expectativa generada |

> **Si el propósito no es claro, la edición se detiene.**

---

### Fase 2 — Modelo Mental del Lector

Construye internamente un perfil del lector. Evalúa:

| Dimensión | Pregunta guía |
|-----------|---------------|
| Nivel de conocimiento | ¿Qué sabe ya sobre el tema? |
| Posibles creencias previas | ¿Qué ideas preconcebidas puede tener? |
| Errores comunes | ¿Qué conceptos suelen malinterpretarse? |
| Dudas frecuentes | ¿Qué preguntas surgen naturalmente? |
| Barreras cognitivas | ¿Qué dificulta la comprensión de este tema? |
| Miedos | ¿Qué temores puede despertar el contenido? |
| Expectativas | ¿Qué espera obtener al terminar la lectura? |
| Carga emocional del tema | ¿Es un tema sensible? ¿Requiere un tono particular? |

> **No todos los lectores interpretan igual la información.**

---

### Fase 3 — Detección de Fricción Cognitiva

Busca puntos donde el lector probablemente se detendrá:

- Exceso de tecnicismos
- Saltos lógicos
- Párrafos demasiado largos
- Conceptos sin contexto
- Cambios bruscos de tema
- Explicaciones incompletas
- Definiciones ambiguas

> **Cada punto de fricción debe resolverse.**

---

### Fase 4 — Análisis de Flujo Narrativo

Evalúa si las ideas aparecen en el orden correcto:

- Progresión lógica
- Continuidad entre secciones
- Transiciones naturales
- Jerarquía de información
- Ritmo de lectura

> **La estructura debe facilitar el aprendizaje, no obstaculizarlo.**

---

### Fase 5 — Vacíos de Conocimiento

Detecta información faltante:

- Definiciones ausentes
- Contexto insuficiente
- Factores importantes omitidos
- Explicaciones incompletas
- Preguntas sin responder

> **El editor identifica qué necesita el lector para comprender completamente el tema.**

---

### Fase 6 — Anticipación de Preguntas

El motor simula el pensamiento del lector. Después de cada sección pregunta internamente:

> **"¿Qué preguntaría ahora una persona que realmente quiere entender esto?"**

Si identifica una pregunta importante sin respuesta, recomienda incorporarla mediante:

- Nuevas secciones
- Ampliaciones de contenido existente
- Una sección de FAQ al final del artículo

---

### Fase 7 — Evaluación de Confianza

El editor analiza:

| Pregunta | Riesgo si no se controla |
|----------|--------------------------|
| ¿Existen afirmaciones demasiado absolutas? | Pérdida de credibilidad |
| ¿Hay lenguaje alarmista? | Ansiedad innecesaria en el lector |
| ¿Hay promesas implícitas? | Expectativas no respaldadas |
| ¿Falta contexto científico? | Debilidad argumental |
| ¿Existen afirmaciones que requieran mejor respaldo? | Vulnerabilidad editorial |

> **La confianza editorial tiene prioridad sobre el impacto.**

---

### Fase 8 — Estrategia Editorial

Solo cuando termina el análisis define un plan. El plan debe responder:

1. **Qué conservar** — lo que ya funciona bien
2. **Qué reorganizar** — lo que necesita un orden diferente
3. **Qué ampliar** — lo que requiere más profundidad
4. **Qué simplificar** — lo que es innecesariamente complejo
5. **Qué eliminar** — lo que no aporta valor real
6. **Qué verificar** — lo que necesita confirmación científica
7. **Qué reforzar** — lo que debe destacarse para el lector

> **La edición comienza únicamente después de este plan.**

---

## Modelo de Decisión

Cada modificación debe justificar internamente **una de estas razones**:

| Razón | Propósito |
|-------|-----------|
| Mejorar comprensión | Hacer el contenido más accesible |
| Aumentar precisión | Refinar datos y afirmaciones |
| Reducir ambigüedad | Eliminar interpretaciones erróneas |
| Mejorar experiencia de lectura | Facilitar la navegación del contenido |
| Incrementar utilidad | Añadir valor práctico para el lector |
| Fortalecer confianza | Respaldar con evidencia y tono adecuado |
| Facilitar aprendizaje | Estructurar para asimilación progresiva |
| Mejorar continuidad narrativa | Conectar ideas fluidamente |

> **No se permiten cambios sin propósito.**

---

## Reglas de Pensamiento

El motor nunca debe asumir que el texto es correcto. Debe cuestionar continuamente:

1. ¿Esto puede explicarse mejor?
2. ¿Esto puede entenderse mal?
3. ¿Esto genera dudas?
4. ¿Esto aporta valor?
5. ¿Esto ayuda realmente al lector?

---

## Restricciones

El Reasoning Engine **no puede**:

- ❌ Reescribir por estilo personal
- ❌ Introducir información no verificada
- ❌ Alterar el significado científico
- ❌ Modificar conclusiones sin justificación
- ❌ Priorizar SEO sobre comprensión
- ❌ Eliminar contenido útil únicamente para reducir longitud

---

## Resultado Esperado

Al finalizar el razonamiento, el motor produce un **Editorial Reasoning Context**, un contexto estructurado que será consumido por los módulos posteriores:

- Validación científica
- SEO
- Adaptación por audiencia
- QA editorial
- Publicación

> **El usuario no lo ve. Funciona como una capa interna de inteligencia.**

---

## Contrato con el Resto del Sistema

El EDITOR-002 **no modifica artículos**.

Su única responsabilidad es generar el mejor contexto posible para que los demás módulos tomen decisiones consistentes.

> **Esto mantiene una arquitectura limpia y desacoplada.**

---

## Regla de Oro

> **Toda edición excelente es la consecuencia de un razonamiento excelente. Si el razonamiento es superficial, la edición también lo será.**

---

**Documento de especificación. Versión 1.0.0. Componente Core Editorial. Depende de EDITOR-001.**