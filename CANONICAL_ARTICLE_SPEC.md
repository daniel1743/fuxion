# Especificación de CanonicalArticle

Versión: `1.0.0`

## Semántica

`CanonicalArticle` representa una fuente heterogénea sin corregirla. No es una
versión publicable ni una afirmación de calidad clínica.

| Grupo | Campos | Null |
|---|---|---|
| `identity` | article_id, source_table, source_record_id, slug, url, status | solo `url` |
| `editorial` | title, subtitle, excerpt, body, body_format, author, reviewer, category, tags, language | subtitle, excerpt, category; autor/revisor conservan tipo original |
| `dates` | published_at, updated_at, reviewed_at | permitido si fuente no informa |
| `structured_content` | visible_faq, schema_faq, references, products, json_ld, table_of_contents, health_notice | arrays vacíos, no null |
| `seo` | seo_title, meta_description, canonical_url, keywords | metadatos ausentes pueden ser null |
| `source` | raw_record, unparsed_fragments, normalization_issues, schema_version | no |

## Mapeo

- Identidad: `article_id`, luego `id`, luego `slug`.
- Cuerpo: `body`, luego `content`, luego `content_html`.
- Estado: `status`; si falta, se describe desde `is_published`.
- Autor: `author`, luego `author_name`.
- Revisor: `reviewer`, luego `reviewed_by`; nunca se convierte en revisión médica.
- FAQ visible: campo `faq/faqs` o sección Markdown.
- FAQ schema: `faq_schema` y nodos FAQPage de JSON-LD.
- Referencias: `references` o `bibliography`.
- Productos: `products` o `related_products`.
- SEO: campos explícitos; no se inventan.

## Formatos

`body_format`: `markdown`, `html`, `plain_text` o `unknown`. El contenido se
conserva literalmente salvo la representación JSON necesaria cuando la fuente
entrega un cuerpo no textual; esto genera una incidencia.

## Contenido no interpretable

Todo campo desconocido se copia en `source.unparsed_fragments` y produce
`UNPARSED_CONTENT`. Nada se elimina silenciosamente. `source.raw_record`
mantiene el registro completo.

## Incidencias

Severidades: `BLOCKER`, `WARNING`, `INFO`. Slice 1 detecta, entre otras:
`UNKNOWN_SOURCE_SCHEMA`, `UNPARSED_CONTENT`, `VISIBLE_WARNING_MARKUP`,
`FAQ_SCHEMA_MISMATCH`, `DUPLICATED_TITLE`, `MISSING_H1`, `MULTIPLE_H1`,
`MULTIPLE_HEALTH_NOTICES` y `AMBIGUOUS_AUTHORSHIP`.

## Slug y publicación

El normalizador copia ambos sin modificarlos. Cualquier diferencia posterior
aparece en diff como `SLUG_CHANGED` o `PUBLICATION_STATUS_CHANGED`, ambos blockers.

## Versionado

Cambios incompatibles requieren una nueva versión de schema y pipeline. Una
nueva versión permite nuevos artefactos sin destruir los anteriores.
