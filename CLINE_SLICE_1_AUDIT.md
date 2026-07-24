# Auditoría independiente del Slice 1

Fecha: 2026-07-23  
Rama observada: `feature/editorial-pipeline-slice-1`  
Commit base observado: `fe6cb95208ba4cd7b2e2aef6911a19e2211e73db`  
Auditor: **subagente independiente Codex sustituto; no Cline auténtico**  
Modo: solo lectura del producto; únicamente se crearon los cuatro informes autorizados.

## Resumen ejecutivo

El núcleo es local, no importa clientes remotos ni carga `.env`, las suites declaradas son reproducibles y la Fase 0 continúa pasando sus controles. Sin embargo, la auditoría adversarial encontró siete fallos HIGH:

1. `restoreSnapshot` permite traversal mediante `snapshot_id`.
2. El control de `public/` y de raíces permitidas es léxico y se evade mediante symlinks/junctions.
3. Un artículo con incidencia `BLOCKER` termina con run `completed`.
4. La verificación del snapshot ignora la integridad de `canonical_article` y metadatos.
5. El hash no distingue una propiedad con `undefined` de una propiedad ausente.
6. El diff no detecta la adición/eliminación de objetos o arrays vacíos.
7. La supuesta reanudación crea otro run y no conserva ni retoma el estado de la ejecución interrumpida.

Además, el schema de snapshot acepta un `canonical_article` vacío y la reutilización de artefactos existentes no verifica su hash. Estas condiciones impiden confiar en integridad, confinamiento, diff e idempotencia.

**Veredicto: `SLICE_1_REQUIERE_CORRECCIONES`. Slice 2 no puede comenzar.**

## Alcance y estado previo

Se inspeccionaron:

- `src/modules/editor-ia/slice1/**`
- contratos y cuatro schemas de `src/modules/editor-ia/core/`
- ocho fixtures sintéticos
- `tests/editorial-slice1/**`
- pruebas y controles de Fase 0
- `package.json`, `.gitignore` y documentación declarativa del Slice 1

El Slice 1 no está contenido en commits diferenciables: sus archivos aparecen sin seguimiento. La rama comparte numerosos cambios previos/no relacionados en artículos, sitemap, UI, scripts y endpoint. No se modificó, descartó ni añadió al índice ningún cambio preexistente.

## Comandos ejecutados

```text
git status --short --branch
git branch --show-current
git rev-parse HEAD
git log -5 --oneline
git diff --stat
git diff --name-status
rg --files ...
rg -n -i "fetch|node:http|...|dotenv|process.env" ...
npm run editorial:test
npm run editorial:coverage
npm run security:scan
npm run security:test
node --input-type=module -   # arnés adversarial en directorio temporal
```

No se ejecutaron scripts legacy, build, proveedores, Supabase, WordPress ni solicitudes de red. No se leyeron valores secretos.

## Hallazgos

| ID | Severidad | Componente | Archivo/línea | Hallazgo | Impacto | Reproducción | ¿Bloquea Slice 2? |
|---|---|---|---|---|---|---|---|
| S1-001 | HIGH | Restauración | `restore.js:10-17` | `snapshot_id` se concatena sin validación ni comprobación de confinamiento. | Escritura fuera de la raíz autorizada. | `snapshot_id="../escaped"` creó `escaped.restored.json` fuera de `restore-root`. | Sí |
| S1-002 | HIGH | Rutas/repositorios | `local-source.js:13,21-25`; `repositories.js:25-29` | Se valida la ruta lexical, no su destino real. | Lectura fuera de raíz y escritura dentro de `public/` mediante symlink/junction. | Un alias “seguro” enlazado a un directorio `public` aceptó `probe.json`. | Sí |
| S1-003 | HIGH | Pipeline/normalización | `pipeline.js:81-82,133-168` | Las incidencias `BLOCKER` no alteran el estado. | Un artículo no normalizable se declara completado. | FAQ visible/schema incompatibles produjo `FAQ_SCHEMA_MISMATCH` y `status="completed"`. | Sí |
| S1-004 | HIGH | Snapshot/integridad | `repositories.js:87-109,124-129` | Solo se verifica el hash de `original_record`. | `canonical_article`, identidad y metadatos pueden manipularse sin detección. | Se cambió el título canónico almacenado; `verify()` devolvió `true`. | Sí |
| S1-005 | HIGH | Hash | `stable-json.js:3-15,23-24` | `JSON.stringify` omite propiedades `undefined`. | Registros distintos pueden compartir `source_hash`. | `{a:1, hidden:undefined}` y `{a:1}` produjeron el mismo hash. | Sí |
| S1-006 | HIGH | Diff | `diff.js:3-13,32-55` | `flatten()` no representa contenedores vacíos. | Campos añadidos/eliminados pueden quedar invisibles. | `structuralDiff({}, {added:{}})` y con `[]` devolvieron `[]`. | Sí |
| S1-007 | HIGH | Reanudación | `pipeline.js:37,111-113,166-178`; prueba `integration-security.test.js:84-102` | No existe reanudación del mismo run; se inicia un UUID nuevo. | Estado y eventos del run interrumpido no se retoman; la afirmación de reanudación es falsa. | Las dos llamadas del test producen runs distintos y solo reutilizan snapshot. | Sí |
| S1-008 | HIGH | Schemas | `article-snapshot.schema.json:18-19`; `schemas.js:19-47` | El snapshot solo exige que `canonical_article` sea objeto, sin validar CanonicalArticle. | Snapshot semánticamente inválido aceptado. | Un snapshot con `canonical_article:{}` produjo cero errores. | Sí |
| S1-009 | HIGH | Reutilización/idempotencia | `pipeline.js:71-78,84-99,116-132` | Artefactos existentes se reutilizan sin verificar bytes/hash; referencia canónica reutilizada lleva `sha256:""`. | Corrupción persistente puede aceptarse y propagarse. | Inspección directa; S1-004 demuestra la misma clase de omisión en snapshot. | Sí |
| S1-010 | MEDIUM | Atomicidad | `repositories.js:13-21`; `pipeline.js:176-178`; `restore.js:14-17` | Se usa copia exclusiva o escritura directa, no rename atómico para todos los artefactos. | Lectores concurrentes pueden observar archivos parciales; recuperación tras corte no está implementada. | Revisión de implementación; ramas de interrupción/disco lleno no están probadas. | No por sí solo |
| S1-011 | MEDIUM | Auditoría | `repositories.js:138-168` | JSONL es append-only por convención, sin bloqueo ni tolerancia a línea parcial. | Dos procesos o una interrupción pueden corromper eventos. | `appendFile` concurrente y parseo estricto de todas las líneas. | No por sí solo |
| S1-012 | MEDIUM | Cero red dinámico | `integration-security.test.js:32-69` | El bloqueo solo instrumenta `fetch`, `http.request` y `https.request`. | No demostraría `http.get`, `net`, `tls`, sockets o procesos hijos si se añadieran. | Inspección del arnés. El análisis estático actual sí confirma que Slice 1 no los importa. | No |

## Pruebas reproducidas

- Suite Slice 1: 23/23 aprobadas.
- Cobertura declarada reproducida: líneas 95.38%, ramas 86.69%, funciones 95.71%.
- Fase 0: 10/10 aprobadas.
- Escaneo de secretos: aprobado, cero hallazgos reportados.
- Cero imports/referencias de Supabase, WordPress, LLM, `dotenv` o `process.env` en el núcleo.

Que las suites pasen no valida el gate: los casos S1-001 a S1-009 también se reprodujeron con el código sin modificar.

## Mutation check manual

Tres regresiones que deberían romper pruebas críticas pero no están cubiertas adecuadamente:

1. Ignorar un campo no JSON/`undefined` en el hash ya ocurre y la suite sigue verde.
2. Ignorar un contenedor vacío en el diff ya ocurre y la suite sigue verde.
3. Aceptar manipulación de `canonical_article` ya ocurre y la suite sigue verde.

Los tests sí detectan sobrescritura simple del mismo artefacto, manipulación de `original_record` y eliminación de la comprobación básica de slug/estado.

## Discrepancias con el informe de implementación

- “confinamiento de rutas”: falso frente a symlinks y traversal del restaurador.
- “hash incluye todas las claves/valores”: falso para propiedades `undefined`.
- “snapshots inmutables/verificables”: solo se protege `original_record`, no el snapshot completo.
- “pipeline reanudable”: el test inicia otro run; no reanuda el anterior.
- “normalización bloqueante”: la incidencia se registra, pero el run se completa.
- “diff detecta campos añadidos/eliminados”: falso para contenedores vacíos.
- “artefactos enlazados mediante hash”: al reutilizar canonical se emite hash vacío.

## Respuestas expresas

- ¿Existe alguna ruta de red? **No en el código actual inspeccionado.**
- ¿Se carga alguna credencial? **No en Slice 1.**
- ¿Se importa algún servicio externo? **No.**
- ¿El hash cubre todo el registro fuente? **No para entradas JavaScript con valores no representables por JSON.**
- ¿Los snapshots son realmente inmutables? **No de extremo a extremo; canonical y metadatos pueden alterarse sin detección.**
- ¿El normalizador pierde o modifica contenido? **`raw_record` conserva entradas JSON; no se observó ejecución de HTML/JS. El pipeline sí acepta como completados artículos con blockers.**
- ¿La restauración produce el mismo hash? **Sí para los ocho fixtures y entradas JSON válidas no manipuladas; no confina la ruta de salida.**
- ¿La idempotencia funciona? **Solo parcialmente para nombres derivados; reutiliza contenido sin verificarlo.**
- ¿La reanudación funciona después de fallos? **No como reanudación del mismo run.**
- ¿El diff detecta slug y publicación? **Sí en valores escalares probados; no detecta todos los campos estructurales.**
- ¿Los tests detectarían regresiones reales? **Algunas; no las siete regresiones HIGH reproducidas.**
- ¿La Fase 0 continúa intacta? **Sus 10 pruebas y escaneo pasan.**
- ¿Slice 1 puede aprobarse? **No.**
- ¿Puede comenzar Slice 2? **No.**

## Riesgos residuales

No se simularon disco lleno o permisos denegados a nivel de kernel, ni se hizo mutation testing permanente. No fue necesario para el gate: los HIGH reproducibles ya obligan a bloquear. La rotación administrativa pendiente de Fase 0 sigue siendo una dependencia humana externa.

## Veredicto

**SLICE_1_REQUIERE_CORRECCIONES**

**SLICE 2 BLOQUEADO** hasta corregir y volver a auditar todos los HIGH.
