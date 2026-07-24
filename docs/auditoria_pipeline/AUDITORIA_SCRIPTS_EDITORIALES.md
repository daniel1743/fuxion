# Auditoría técnica del sistema editorial

Fecha de corte: 2026-07-23  
Alcance: repositorio local de Bienestar en Claro, inspección estática y de solo lectura.  
No se ejecutaron scripts editoriales, llamadas a IA, escrituras a Supabase ni publicaciones.

## Resumen ejecutivo

Sí existe una base reutilizable, pero no un sistema seguro y completo. La mejor pieza operativa es `scripts/enrich-wellness-articles.mjs`: aporta lectura, backup local, procesamiento secuencial, límite de lote, reanudación, logs y `--dry-run`. Cubre aproximadamente 30% del sistema requerido. El módulo `src/modules/editor-ia/` aporta contratos, estados, eventos y runtimes en memoria; cubre aproximadamente 20% adicional de la infraestructura conceptual, no de la operación editorial.

Veredicto: **COMBINAR**, conservando piezas aisladas y construyendo los adaptadores y controles faltantes. No debe reutilizarse ninguno de los flujos de publicación existentes.

Bloqueos inmediatos:

1. `scripts/polish-articles.mjs` contiene una credencial Supabase privilegiada incrustada en código rastreado. Debe revocarse/rotarse y retirarse también del historial antes de cualquier implementación.
2. `api/bienestar-pipeline.js` acepta solicitudes con CORS abierto, no autentica al llamante y ejecuta una cadena que puede programar publicaciones en WordPress.
3. Los scripts editoriales escriben directamente en tablas publicadas cuando no se usa `--dry-run`; no existe staging, aprobación humana, rollback verificado ni diff.
4. No existe recuperación/verificación real de evidencia, ni separación entre generación y auditoría.
5. No hay pruebas del pipeline editorial ni CI que haga cumplir las barreras.

## Arquitectura y fuentes de verdad observadas

- Aplicación pública: React 18 + Vite.
- Persistencia: Supabase mediante `@supabase/supabase-js`.
- Dos colecciones editoriales coexistentes: `wellness_articles` y `blog_posts`.
- Migraciones copian `wellness_articles` hacia `blog_posts`; no se encontró una definición versionada completa de ambas tablas.
- Cachés/artefactos locales: `public/wellness-articles-cache.json`, `docs/articles/`, `articles_tracker.json`, `posts.json`.
- Renderizado: `WellnessArticlePage.jsx` usa `react-markdown` + `remark-gfm`; `BlogPostPage.jsx` usa HTML generado y `dangerouslySetInnerHTML`, sin sanitizador explícito localizado.
- IA: OneProvider/Claude, Anthropic, DeepSeek, Qwen y Gemini en distintas piezas. No hay interfaz editorial única realmente conectada.
- Despliegue: Vercel. No se encontró configuración de CI en `.github/`.

## Inventario de capacidades

| Componente | Propósito real | E/S y efectos | Controles existentes | Brechas y riesgo | Reutilización |
|---|---|---|---|---|---|
| `scripts/enrich-wellness-articles.mjs` | Reescribir artículos semilla con OneProvider | Lee y actualiza `wellness_articles`; escribe backups/progreso/log local | `--dry-run`, `--limit`, secuencial, backup previo, validación estructural básica | Dry-run no es predeterminado; llama a IA incluso en dry-run; backup mutable/local; marca errores como procesados; sin rollback, staging, evidencia, diff, revisión humana ni clasificación A/B/C; prompt solicita dosis | Base parcial, 30% |
| `scripts/providers/oneprovider.js` | Cliente Anthropic-compatible | Envía prompts y devuelve texto/usage | Variables de entorno; valida respuesta mínima | Sin timeout, retry, backoff, presupuesto, idempotency key, schema JSON, redacción de errores ni defensa contra prompt injection | Cambios mayores, 45% |
| `scripts/enrich-articles.cjs` | Enriquecimiento SEO determinista | Lee ambas tablas; genera JSON/schema; puede actualizar categorías | Separación parcial de funciones, salida local | Consulta producción y puede escribir; `--fix-categories` no equivale a staging; FAQ/productos automáticos; no evidencia ni backup/rollback | Utilidades aisladas, 20% |
| `scripts/polish-articles.mjs` | Pulido por plantillas | Lee y actualiza `wellness_articles` | Procesamiento secuencial | Credencial privilegiada incrustada; sin dry-run, backup, aprobación ni evidencia; contenido clínico predefinido | Inseguro, 0% |
| `scripts/convert-biblia-to-articles.mjs` | Generar/importar artículos desde Biblia | Escribe caché local y hace `upsert` a `wellness_articles` | Lotes de inserción | No dry-run predeterminado, staging, revisión ni rollback; mezcla generación y persistencia | Transformador aislable, 10% |
| `scripts/convert-bible-to-articles.js` | Generador local alternativo | Lee Biblia y escribe JSON local | No toca DB | Duplicado funcional; reglas antiguas; sin validación clínica | Obsoleto/duplicado, 5% |
| `scripts/generate_articles.cjs` | Generación masiva DeepSeek | Escribe Markdown y tracker local | Salida local | Desactiva validación TLS; generación one-shot; marca “published” localmente; sin fuentes verificadas | Inseguro, 0% |
| `scripts/generate_all.cjs` / `generate_sql_for_articles.cjs` | Convertir Markdown a SQL | Escribe archivos SQL | No ejecuta SQL por sí solo | Puede facilitar importación masiva sin gates; duplicados | No usar en pipeline, 0% |
| `scripts/publish_to_supabase.js` y `publish-*.cjs` | Publicación directa | Insert/update en `blog_posts` | Comprobaciones mínimas | Publica con `is_published=true`; algunos desactivan TLS; sin aprobación, backup o rollback | Bloquear, 0% |
| `scripts/sync-model-article-cache.mjs` | Consolidar artículo modelo en caché | Modifica archivo local de caché | Determinista | Acoplado a un caso; no valida schema/render completo | Utilidad local, 25% |
| `src/lib/articleEnricher.js` | FAQ, keywords y JSON-LD | Funciones puras sobre artículo | Determinista y separable | Genera `MedicalWebPage`, FAQ y productos de forma heurística; puede crear schema no respaldado por contenido/revisión | Funciones seleccionadas, 25% |
| `src/lib/articleEnrichmentService.ts` | Entidades, FAQ, productos y schema | Lee `entities`/`relations`; devuelve objeto | Servicio modular | No hay prueba ni migraciones completas para dependencias; no clasifica riesgo/evidencia; FAQ heurísticas | Base parcial, 20% |
| `src/services/wellnessArticleService.js` | CRUD administrativo | Lee/escribe/elimina `wellness_articles` | Centraliza payload | Publicación y borrado no están ligados a gates editoriales; usa cliente de frontend | Solo adaptador de lectura, 15% |
| `src/modules/editor-ia/core/**` | Contratos, estados, eventos, job/workflow/pipeline runtime | Estado en memoria; mocks | Tipos y separación modular | Sin persistencia, locks, retries efectivos, evaluación de políticas, recuperación tras caída o integración editorial | Base conceptual, 35% |
| `src/modules/editor-ia/core/policy-engine/editorial.rules.ts` | Catálogo declarativo de reglas | Sin efectos | Severidades `BLOCKER/WARNING/INFO` | No existe evaluador; reglas rígidas de longitud/citas no consideran intención o riesgo; disclaimer podría duplicarse | Adaptar reglas, 40% |
| `src/modules/editor-ia/pipelines/bienestar-premium/*` | Generar artículo, imagen, subir y programar en WP | LLM + BFL + WordPress | Ejecución secuencial y logs de consola | Publicación automática, sin autenticación, evidencia, staging, backup, auditor independiente, sanitización, retry ni rollback; Markdown a HTML por regex | No reutilizar para revisión, 0% |
| `api/bienestar-pipeline.js` | Webhook del pipeline WP | Dispara todos los efectos anteriores | Validación superficial de tema/fecha | CORS `*`, sin auth, sin rate limit real, devuelve errores internos; superficie crítica de publicación | Deshabilitar/aislar, 0% |
| `BlogPostPage.jsx` / `WellnessArticlePage.jsx` | Render público | Render HTML/Markdown | GFM en wellness | Dos rutas de render distintas; una usa `dangerouslySetInnerHTML`; no se localizó sanitización; riesgo de divergencia y XSS | Requiere prueba/gate |
| Migraciones Supabase | Taxonomía y copias entre tablas | UPDATE/INSERT directo | Versionadas parcialmente | Taxonomías contradictorias; no hay `article_proposals`, versiones, auditoría o rollback; schema base incompleto | Requiere nuevas migraciones |
| Backups en `logs/backups/` | Copias JSON previas | Archivos locales | Evidencian ejecuciones previas | No inmutables, sin hash, retención, cifrado, restaurador ni vínculo transaccional | Patrón reutilizable, no solución |

## Comportamiento del script más cercano

`enrich-wellness-articles.mjs` implementa:

`fetch -> filtro heurístico -> backup local -> una llamada LLM -> validación superficial -> update producción -> progreso`

Problemas concretos:

- `--dry-run` solo evita el `update`; sigue consumiendo API y escribiendo logs/backups.
- El valor seguro no es el predeterminado.
- La “idempotencia” depende de longitud y tres encabezados, no de versión/hash.
- El backup ocurre antes de generar, pero no hay prueba de restauración ni atomicidad.
- La validación no compara afirmaciones con fuentes.
- El prompt llama “fuente absoluta” al artículo existente, por lo que puede conservar errores.
- El prompt solicita “dosis” sin exigir fuente recuperada.
- Se conserva la FAQ previa aunque pueda estar contaminada.
- Un resultado fallido se agrega a `progress.processed`, dificultando un reintento correcto.
- No hay timeout, retry exponencial, clasificación de error, presupuesto o límite de tokens por lote.

## Seguridad, secretos y configuración

Variables observadas por nombre: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ONEPROVIDER_API_KEY`, `ONEPROVIDER_BASE_URL`, `AI_MODEL`, `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `LLM_ENDPOINT`, `LLM_MODEL`, `DEEPSEEK_API_KEY`, `QWEN_API_KEY`, `GEMINI_API_KEY`, `BFL_API_KEY`, `BFL_ENDPOINT`, `WP_BASE_URL`, `WP_USERNAME`, `WP_APP_PASSWORD`.

No se reproducen valores. Se detectó una credencial privilegiada incrustada en `scripts/polish-articles.mjs`; debe considerarse comprometida. La clave anónima de frontend no debe tratarse como permiso editorial. El futuro worker necesita un rol mínimo separado, sin permisos de actualizar contenido publicado.

## Pruebas, observabilidad y despliegue

- No se localizaron pruebas unitarias/integración/E2E del sistema editorial.
- Los tests existentes pertenecen a otras áreas.
- `package.json` no define `test`, `lint` ni typecheck editorial.
- `package.json` referencia `scripts/enrich-article.mjs`, archivo inexistente.
- La documentación de `editor-ia` declara simultáneamente “sin lógica” mientras el árbol contiene runtimes y un pipeline ejecutable; la documentación está desactualizada.
- La cola de BAIOS está en memoria, no persiste tras reinicios serverless.
- No hay métricas persistentes de tokens/costo/modelo/fuentes/responsable.
- No hay CI que impida publicar con schemas inválidos o secretos.

## Tabla final

| Componente | Existe | Ruta | Estado | Reutilización | Riesgo | Acción recomendada |
|---|---:|---|---|---:|---|---|
| Extractor lectura | Sí | script de enriquecimiento + servicio | Parcial | 60% | Medio | Extraer con credencial read-only y snapshot |
| Backup | Sí | `logs/backups` | Parcial | 45% | Alto | Hash, manifiesto y restauración probada |
| Normalizador | Parcial | enrichers/renderers | Disperso | 25% | Alto | Implementar contrato único |
| Diagnóstico IA | No | — | Ausente | 0% | Crítico | Construir con JSON Schema |
| Clasificación A/B/C | No | — | Ausente | 0% | Crítico | Construir determinista + IA asistida |
| Evidencia recuperada | No | — | Ausente | 0% | Crítico | Construir con fuentes permitidas |
| Verificación referencias | No | — | Ausente | 0% | Crítico | Construir independiente |
| Generador propuesta | Parcial | OneProvider/enricher | Inseguro | 35% | Alto | Adaptar a mapa de evidencia |
| Auditor independiente | No | — | Ausente | 0% | Crítico | Construir separado |
| Validador determinista | Parcial | quality gate/policies | Superficial | 25% | Alto | Implementar reglas bloqueantes |
| Diff | No | — | Ausente | 0% | Crítico | Construir |
| Staging/versiones | No | — | Ausente | 0% | Crítico | Diseñar y migrar con aprobación |
| Aprobación humana | UI vacía | `editor-ia/ui` | No operativa | 15% | Crítico | Conectar después de controles |
| Publicador seguro | No | — | Bloqueado | 0% | Crítico | Mantener deshabilitado |
| Rollback | No | — | Ausente | 0% | Crítico | Construir y probar |
| Observabilidad | Parcial | logs + contratos | No persistente | 25% | Alto | Registro estructurado |

## Conclusión

La base sí es aprovechable, pero únicamente por extracción selectiva. Adaptar el script completo conservaría demasiados acoplamientos peligrosos; construir todo desde cero duplicaría contratos y runtimes útiles. La estrategia correcta es **COMBINAR**: BAIOS como núcleo de contratos/estados, adaptadores extraídos del script de enriquecimiento para lectura/backup/proveedor, y módulos nuevos para evidencia, staging, aprobación, diff, gates y rollback.
