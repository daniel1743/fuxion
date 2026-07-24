# Slice 1.1 — Informe de endurecimiento

Fecha: 2026-07-23  
Rama: `feature/editorial-pipeline-slice-1`  
Estado técnico: **CORRECCIONES IMPLEMENTADAS; REAUDITORÍA PENDIENTE**

## Alcance

Este cambio corrige los hallazgos S1-001 a S1-009 de la auditoría independiente.
Se mantuvo el alcance local: sin Supabase, WordPress, proveedores LLM, credenciales,
red ni modificación de artículos publicados.

## Trazabilidad de hallazgos HIGH

| Hallazgo | Corrección aplicada | Prueba de regresión |
|---|---|---|
| S1-001 | IDs estrictos y confinamiento seguro también en restauración | traversal y ruta absoluta se rechazan |
| S1-002 | `realpath`, rechazo de symlink/junction y de raíces bajo `public` | repositorio y fuente con raíz enlazada se rechazan |
| S1-003 | Toda incidencia `BLOCKER` deja el run en `blocked` | normalización con blocker nunca termina `completed` |
| S1-004 | `snapshot_hash` cubre el snapshot completo y se verifica al leer/restaurar | manipulación de canonical o metadata se detecta |
| S1-005 | Serialización canónica rechaza valores no JSON, ciclos y prototipos peligrosos | `undefined`, no finitos, bigint y otros se rechazan |
| S1-006 | El diff representa objetos y arrays vacíos | adiciones/eliminaciones de contenedores se reportan |
| S1-007 | Reanudación real mediante `resumeRunId`, mismo manifest y mismo `run_id` | no duplica `RUN_CREATED` |
| S1-008 | `$ref` del snapshot valida `CanonicalArticle`; cola de eventos compartida por raíz/run | canonical vacío se rechaza y 40 eventos concurrentes se conservan |
| S1-009 | Todo artefacto reutilizado se valida por contenido/hash; referencias nunca usan hash vacío | corrupción de fuente o canonical bloquea reejecución |

## Endurecimientos adicionales

- Escritura atómica con archivo temporal, `fsync` y publicación exclusiva.
- Reemplazo atómico del manifest mutable.
- Versiones o hashes distintos conservan snapshots anteriores.
- El harness de cero red cubre `fetch`, HTTP(S), sockets, TLS, DNS, datagramas
  y creación de procesos.
- Los `$ref` locales de schemas se resuelven y validan recursivamente.

## Riesgos residuales

- El validador local cubre el vocabulario usado por los schemas actuales, pero no
  sustituye aún una implementación completa y auditada de JSON Schema.
- El JSONL es serializado dentro de un proceso. No se declara coordinación entre
  procesos independientes ni protección criptográfica de la cadena de eventos.
- Retención y cifrado de artefactos reales quedan fuera de Slice 1.
- El diff textual continúa siendo posicional.

## Decisión

Las correcciones reclamadas están implementadas y probadas localmente. Este
informe no reemplaza la auditoría que emitió el gate. **Slice 2 continúa no
autorizado hasta una reauditoría independiente con cero HIGH/CRITICAL.**
