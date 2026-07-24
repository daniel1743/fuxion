# Slice 1 — Informe de implementación

Fecha: 2026-07-23  
Rama: `feature/editorial-pipeline-slice-1`  
Estado: **SLICE_1_COMPLETADO_CON_PENDIENTES**

## Arquitectura implementada

El módulo `src/modules/editor-ia/slice1/` es un núcleo ESM local y aislado:

`LocalJsonArticleSource -> fuente inmutable -> SHA-256 -> CanonicalArticle -> ArticleSnapshot -> diff -> restore -> RunManifest + eventos`

No carga `.env`, no importa Supabase/LLM/WordPress y no contiene llamadas de red.

## Piezas reutilizadas

- Convenciones de contratos y severidades de `editor-ia/core`.
- Arquitectura de eventos append-only y estados conceptuales BAIOS.
- Node ESM ya configurado en el proyecto.

No se reutilizaron enrichers ni scripts legacy porque mezclan heurísticas
editoriales o efectos externos.

## Piezas nuevas

- Contratos TypeScript locales y cuatro JSON Schemas versionados.
- Serialización determinista, normalización de saltos y SHA-256.
- Fuente JSON con confinamiento de rutas.
- Repositorios locales atómicos de artefactos, snapshots y auditoría.
- Normalizador descriptivo sin corrección de contenido.
- Diff textual/estructural con blockers de slug/publicación.
- Restaurador con verificación exacta.
- Pipeline reanudable/idempotente y CLI local.
- Ocho fixtures sintéticos y pruebas unitarias/integración/seguridad.

## Decisiones técnicas

- JavaScript ESM ejecutable para evitar compilador/dependencias nuevas; contratos
  TypeScript quedan disponibles para BAIOS.
- JSON Schema validado con un validador local mínimo, sin instalar paquetes.
- Se crea primero un artefacto `immutable-source`; así un fallo del normalizador
  no pierde la fuente. El `ArticleSnapshot` completo se crea al obtener un
  `CanonicalArticle` válido.
- Identidad: `article_id + source_hash + pipeline_version`.
- El hash incluye todas las claves/valores, con claves ordenadas, UTF-8 y saltos
  normalizados; no elimina espacios internos.
- Los artefactos usan create-exclusivo; no se sobrescriben.

## Archivos modificados

- Nuevos: `src/modules/editor-ia/slice1/**`,
  `src/modules/editor-ia/core/contracts/local-review.contracts.ts`,
  `src/modules/editor-ia/core/schemas/**`,
  `src/modules/editor-ia/tests/fixtures/**`,
  `tests/editorial-slice1/**`.
- Actualizados: `package.json`, `.gitignore`.
- No se tocó código editorial público ni controles de Fase 0.

## Resultados

- 8 fixtures procesados.
- Snapshot verificable y restauración exacta para cada fixture.
- Idempotencia y reanudación demostradas.
- Diff JSON/Markdown generado.
- Fallo de normalización conserva la fuente inmutable y bloquea el run.
- Cero red y cero servicios externos demostrados.

## Limitaciones y pendientes

- El validador JSON Schema implementa el subconjunto usado por Slice 1; antes de
  contratos más complejos conviene adoptar un validador estándar auditado.
- La comparación textual inicial es por posición de línea, no algoritmo Myers.
- HTML se conserva como datos; no se renderiza ni sanitiza en Slice 1.
- Eventos JSONL son append-only por comportamiento local, no por controles de
  sistema de archivos.
- La cobertura de líneas global supera 95%; algunos repositorios tienen ramas
  excepcionales menos cubiertas.
- Se requiere auditoría posterior de Cline antes de Slice 2.

## Riesgos residuales

- Artefactos locales reales podrían contener datos sensibles; el directorio está
  ignorado, pero retención/cifrado dependen del operador.
- Persistencia local no ofrece bloqueo multiproceso; concurrencia autorizada es 1.
- Pendientes humanos de rotación de Fase 0 continúan abiertos.
