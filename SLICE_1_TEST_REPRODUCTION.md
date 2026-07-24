# Reproducción independiente de pruebas — Slice 1

Auditor: **subagente independiente Codex sustituto; no Cline auténtico**  
Fecha: 2026-07-23

## Entorno

- Windows / PowerShell
- Node usado por el repositorio
- Rama `feature/editorial-pipeline-slice-1`
- Commit base `fe6cb95208ba4cd7b2e2aef6911a19e2211e73db`
- Datos: exclusivamente ocho fixtures sintéticos y registros creados en memoria
- Salidas adversariales: directorios del sistema bajo `%TEMP%`
- Red/credenciales: no utilizadas

## Comandos y resultados

```text
npm run editorial:test
```

Resultado: 23 tests, 23 aprobados, 0 fallidos, 0 skipped.

```text
npm run editorial:coverage
```

Resultado reproducido:

| Archivo | Líneas | Ramas | Funciones |
|---|---:|---:|---:|
| diff.js | 100.00% | 77.27% | 100.00% |
| local-source.js | 96.49% | 82.86% | 100.00% |
| normalizer.js | 96.57% | 93.16% | 90.91% |
| pipeline.js | 100.00% | 79.49% | 100.00% |
| repositories.js | 85.88% | 79.49% | 89.47% |
| restore.js | 85.19% | 83.33% | 100.00% |
| schemas.js | 96.72% | 89.36% | 100.00% |
| stable-json.js | 100.00% | 100.00% | 100.00% |
| Global | **95.38%** | **86.69%** | **95.71%** |

La cobertura global declarada es correcta, pero no prueba las propiedades del gate.

```text
npm run security:scan
npm run security:test
```

Resultados:

- escaneo: cero valores con forma de secreto;
- Fase 0: 10/10 aprobadas;
- endpoint bloqueado por defecto y en producción;
- controles CORS y comandos legacy permanecen contenidos.

## Cero red

La suite bloqueó `globalThis.fetch`, `http.request` y `https.request`; el contador fue cero. La inspección del grafo local de imports encontró únicamente módulos locales y built-ins de filesystem, path, crypto y URL. No aparecen Supabase, WordPress, LLM, `dotenv`, `process.env`, HTTP ni procesos hijos en `src/modules/editor-ia/slice1`.

Conclusión limitada: **el código actual no tiene ruta de red identificada**. El arnés dinámico no cubre todos los mecanismos posibles (`net`, `tls`, `http.get`, DNS, subprocess), por lo que debe endurecerse antes de ampliar el núcleo.

## Restauración

Las ocho restauraciones oficiales preservan `source_hash`. La manipulación de `original_record` se rechaza.

Pruebas adversariales:

- `snapshot_id="../escaped"` escribió fuera de la raíz de restauración: **fallo HIGH**.
- manipular solo `canonical_article` dejó `repository.verify()` en `true`: **fallo HIGH**.
- un destino con alias/junction hacia `public` aceptó escritura: **fallo HIGH**.

## Hash y schema

Resultados adversariales exactos:

```json
{
  "undefinedHashCollision": true,
  "schemaAcceptsEmptyCanonical": true
}
```

Las claves reordenadas, Unicode literal, valores JSON `0`, `false`, `null` y `""`, y los ocho fixtures se comportan de forma estable. CRLF y LF se normalizan intencionalmente y por tanto comparten hash, según la documentación.

## Normalización y estados

Entrada con FAQ visible y schema incompatible:

```json
{
  "blockerRunStatus": "completed",
  "blockerIssues": ["FAQ_SCHEMA_MISMATCH"]
}
```

La fuente queda preservada, pero el estado de éxito contradice la severidad `BLOCKER`.

## Diff

Slug y estado escalares sí generan `SLUG_CHANGED` y `PUBLICATION_STATUS_CHANGED`.

Casos fallidos:

```json
{
  "emptyObjectAdditionDiff": [],
  "emptyArrayAdditionDiff": []
}
```

El diff oculta adiciones/eliminaciones de contenedores vacíos.

## Idempotencia y reanudación

- La repetición conserva la lista de archivos de snapshots.
- No valida la integridad completa antes de reutilizar.
- La referencia de canonical reutilizada puede declarar `sha256` vacío.
- `stopAfterSnapshot` y la ejecución posterior tienen `run_id` diferentes.

Por tanto, hay deduplicación parcial por nombre, pero no reanudación real del run ni idempotencia de integridad demostrada.

## Mutation check manual

La suite actual permanece verde mientras están presentes estas tres regresiones evidentes:

1. un campo `undefined` no afecta el hash;
2. un contenedor vacío no afecta el diff;
3. modificar el canonical de un snapshot no afecta `verify()`.

Esto demuestra que el porcentaje de cobertura no equivale a pruebas críticas suficientes.

## Fallos y límites de reproducción

No se modificó una copia del producto ni se simuló físicamente disco lleno. Los fallos HIGH anteriores son deterministas y suficientes para bloquear el gate. Todos los temporales se mantuvieron fuera del repositorio.
