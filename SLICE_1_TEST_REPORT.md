# Reporte de pruebas — Slice 1

Fecha: 2026-07-23

## Comandos

```text
npm run editorial:test
npm run editorial:coverage
npm run security:scan
npm run security:test
node --check <archivos Slice 1>
```

También se probaron localmente los comandos `process`, `verify` y `restore`
usando un fixture sintético y un directorio temporal del sistema.

## Resultado

- Suite Slice 1: 23/23 aprobadas.
- Suite Fase 0: 10/10 aprobadas.
- Escaneo de secretos: aprobado, cero hallazgos actuales.
- CLI: proceso completado; snapshot verificado; restauración verificada.
- Pruebas fallidas finales: 0.

## Cobertura

Medición final:

- líneas globales Slice 1: 95.38%;
- branches: 86.69%;
- funciones: 95.71%;
- normalizador: 96.57% de líneas;
- hashing y diff: 100% de líneas.

Los repositorios y el restaurador quedan por debajo del objetivo orientativo
individual de 95% de líneas, aunque sus escenarios críticos obligatorios
(atomicidad, no sobrescritura, corrupción, idempotencia y hash exacto) sí están
cubiertos. Se declara como pendiente de endurecimiento, no como fallo oculto.

## Cero red y escritura remota

Durante integración se reemplazaron `fetch`, `http.request` y `https.request`
por funciones que fallan. Contador observado: cero llamadas.

Una prueba estática rechaza imports/referencias a Supabase, OneProvider,
Anthropic, DeepSeek, Gemini, Qwen, WordPress, dotenv o `process.env` dentro del
nuevo núcleo.

No se proporcionaron credenciales, no se cargó `.env`, no se ejecutaron scripts
legacy y no se escribió dentro de `public/`.

## Casos cubiertos

Hash estable, schemas, atomicidad, no sobrescritura, corrupción, idempotencia,
Markdown/HTML, FAQ discrepante, campos desconocidos, contenido adversarial,
blockers de slug/publicación, restauración, interrupción/reanudación, fallo de
normalización, confinamiento de rutas y ocho fixtures heterogéneos.
