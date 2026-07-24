# Rutas legacy con capacidad de escritura

Estado general: **no ejecutar**. Se retiraron del `package.json` los comandos
editoriales directos; los archivos siguen inventariados para análisis y
eventual retiro controlado.

| Ruta | Comando directo | Destino/efecto | Estado |
|---|---|---|---|
| `scripts/enrich-wellness-articles.mjs` | `node ...` | UPDATE `wellness_articles`, IA | LEGACY_WRITE_PATH |
| `scripts/polish-articles.mjs` | `node ...` | UPDATE `wellness_articles` | LEGACY_WRITE_PATH; secreto retirado; fail-closed por configuración |
| `scripts/convert-biblia-to-articles.mjs` | `node ...` | UPSERT `wellness_articles` | LEGACY_WRITE_PATH; retirado de npm; fail-closed |
| `scripts/enrich-articles.cjs` | `node ... --fix-categories` | UPDATE categorías en dos tablas | LEGACY_WRITE_PATH |
| `scripts/publish_to_supabase.js` | `node ...` | INSERT/UPDATE `blog_posts` publicado | LEGACY_WRITE_PATH |
| `scripts/publish-cirrosis.cjs` | `node ...` | INSERT `blog_posts` publicado | LEGACY_WRITE_PATH |
| `scripts/publish-higado-graso.cjs` | `node ...` | INSERT `blog_posts` publicado | LEGACY_WRITE_PATH |
| `scripts/publish-sintomas-cirrosis.cjs` | `node ...` | INSERT `blog_posts` publicado | LEGACY_WRITE_PATH |
| `scripts/delete_duplicates.cjs` | `node ...` | DELETE `blog_posts` | LEGACY_WRITE_PATH |
| `scripts/update-*-image.cjs` | `node ...` | UPDATE imágenes en `blog_posts` | LEGACY_WRITE_PATH |
| `robot_seo.cjs` | `node ...` | UPDATE taxonomía/SEO en Supabase | LEGACY_WRITE_PATH; secreto retirado; fail-closed |
| `scripts/generate_articles.cjs` | `node ...` | LLM y archivos/tracker | LEGACY_GENERATION_PATH; TLS inseguro |
| `scripts/generate_all.cjs` | `node ...` | Genera SQL de importación | LEGACY_SQL_PATH |
| `scripts/generate_sql_for_articles.cjs` | `node ...` | Genera SQL de importación | LEGACY_SQL_PATH |
| `src/services/wellnessArticleService.js` | vía UI | INSERT/UPDATE/DELETE `wellness_articles` | Ruta CRUD existente; fuera de Fase 0 |
| `api/bienestar-pipeline.js` | HTTP POST | LLM, BFL, WordPress | Bloqueado por defecto y siempre en producción |
| `src/modules/editor-ia/pipelines/bienestar-premium/` | importación interna | BFL, media y posts WordPress | LEGACY_WRITE_PATH; solo accesible detrás del endpoint bloqueado |

## Package scripts

Se eliminó `convert-biblia`, que ejecutaba un UPSERT, y `enrich-article`, que
apuntaba a un archivo inexistente. No se creó un reemplazo. Se añadieron
únicamente `security:scan` y `security:test`.

## Condiciones para reutilización

Ninguna ruta puede reutilizarse hasta contar con dry-run predeterminado,
credencial mínima, staging, backup verificable, diff, aprobación, pruebas de
cero escritura y rollback. Las rutas de publicación ad hoc no deben convertirse
en el publicador futuro.
