# Preparación para Slice 2

## Listo

- Contrato canónico y schemas versionados.
- Fuente local confinada.
- Fuente original inmutable y hash determinista.
- Snapshots idempotentes.
- Normalización descriptiva con preservación.
- Diff y blockers técnicos.
- Restore exacto.
- Manifiestos y eventos.
- CLI, fixtures y pruebas sin red.

## No listo

- Diagnóstico editorial simulado.
- Clasificación de riesgo A/B/C.
- Evaluador de políticas.
- Claims/evidencia.
- Proveedores reales o mocks de LLM.
- Supabase, staging, UI, aprobación, publicación y rollback remoto.

## Bloqueos

- Auditoría independiente de Cline pendiente.
- Rotación administrativa de secretos de Fase 0 pendiente.
- Decidir si se adopta un validador JSON Schema estándar antes de ampliar schemas.
- Definir política de retención/cifrado para exportaciones reales.
- Ampliar fixtures etiquetados para casos editoriales reales sin usar producción.

## Recomendación

Slice 2 debe comenzar solo con diagnóstico simulado determinista/mocks, usando
los artefactos canónicos. Debe mantener cero red y no añadir proveedores,
Supabase ni publicación hasta una autorización posterior específica.
