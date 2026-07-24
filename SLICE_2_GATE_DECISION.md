# Decisión de gate para Slice 2

Fecha: 2026-07-23  
Auditor: **subagente independiente Codex sustituto; no Cline auténtico**

## Decisión

**SLICE 2 NO AUTORIZADO**

Veredicto del Slice 1: **SLICE_1_REQUIERE_CORRECCIONES**

El criterio exige cero HIGH sin resolver. Esta auditoría confirmó nueve HIGH, siete mediante reproducción dinámica directa. No debe integrarse IA, mocks de diagnóstico, Supabase, staging ni publicación sobre este núcleo.

## Condiciones aprobadas

- No se identificaron solicitudes de red en la implementación actual.
- No se cargan credenciales ni `.env` desde Slice 1.
- No se importan Supabase, WordPress ni proveedores LLM.
- Los ocho fixtures JSON se restauran con el mismo `source_hash`.
- El fixture original no se modifica en la suite.
- Slug y estado escalares generan blockers en el diff probado.
- Suite oficial: 23/23.
- Cobertura global declarada reproducida: 95.38% de líneas.
- Fase 0: 10/10.
- Escaneo actual de secretos: aprobado.

## Condiciones fallidas

- Confinamiento de rutas: traversal y symlink/junction reproducidos.
- Inmutabilidad integral del snapshot: canonical y metadatos no están cubiertos.
- Hash de todo el registro: colisión entre propiedad `undefined` y propiedad ausente.
- Normalización segura: un `BLOCKER` puede terminar `completed`.
- Schema: snapshot acepta canonical vacío.
- Diff completo: omite objetos y arrays vacíos.
- Idempotencia: reutiliza artefactos sin verificar integridad.
- Reanudación: crea un run nuevo en vez de retomar el anterior.
- Tests críticos: las suites pasan pese a regresiones HIGH presentes.

## Correcciones obligatorias antes de nueva auditoría

1. Confinar lectura y escritura con resolución real de rutas, rechazo de symlinks y validación estricta de todos los IDs.
2. Hacer que cualquier incidencia `BLOCKER` impida `completed`.
3. Proteger y verificar el snapshot completo, no solo `original_record`.
4. Rechazar valores no JSON o definir serialización canónica sin colisiones silenciosas.
5. Validar `canonical_article` completo mediante `$ref`; adoptar Ajv u otro validador estándar.
6. Representar contenedores vacíos en el diff y probar añadidos/eliminados anidados.
7. Verificar hashes de todos los artefactos antes de reutilizar; nunca emitir hashes vacíos.
8. Implementar reanudación real por `run_id`, estados persistidos y transiciones válidas.
9. Añadir pruebas de regresión adversariales para cada HIGH.
10. Endurecer atomicidad, eventos concurrentes y pruebas de red antes de ampliar el pipeline.

## Pendientes no bloqueantes por sí solos

- Sustituir el diff textual posicional por uno más legible.
- Definir retención/cifrado de artefactos reales.
- Mejorar mensajes de validación.
- Elevar cobertura individual de repositorios/restaurador.

Estos pendientes no reducen la obligación de resolver primero todos los HIGH.

## Criterio de reapertura

El gate solo puede reabrirse tras:

- corrección trazable de S1-001 a S1-009;
- nuevas pruebas que fallen contra la implementación actual y pasen con la corregida;
- repetición de pruebas Slice 1 y Fase 0;
- nueva auditoría independiente de confinamiento, integridad, restauración, diff, idempotencia y reanudación;
- confirmación de cero HIGH/CRITICAL.

## Autorización explícita

**Puede comenzar Slice 2: NO.**
