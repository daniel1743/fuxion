# Security baseline — Fase 0

Fecha: 2026-07-23  
Commit base: `fe6cb95208ba4cd7b2e2aef6911a19e2211e73db`  
Rama inicial: `main`  
Rama de trabajo: `security/phase-0-containment`  
Despliegue: Vercel (`vercel.json`, build mediante `npm run build`).

## Estado inicial del árbol

Se preservaron los cambios previos del usuario. Antes de esta fase ya estaban modificados:

- `package-lock.json`, `package.json`, `posts.json`
- `public/sitemap.xml`, `public/wellness-articles-cache.json`
- `scripts/generate-sitemap-final.cjs`
- `src/App.jsx`, `src/components/mobile/MobileAppShell.jsx`
- `src/pages/BlogPostPage.jsx`, `src/pages/WellnessArticlePage.jsx`
- archivos no rastreados bajo `auditorias/`, `docs/auditoria_pipeline/`,
  `docs/modelo_editorial/` y `scripts/sync-model-article-cache.mjs`

No se descartó ni sobrescribió ninguno.

## Secretos detectados inicialmente

Sin reproducir valores:

| Ruta | Tipo | Estado al cerrar Fase 0 |
|---|---|---|
| `scripts/polish-articles.mjs` | JWT Supabase `service_role` | Retirado del árbol actual; rotación pendiente |
| `scripts/convert-biblia-to-articles.mjs` | JWT Supabase `service_role` | Retirado del árbol actual; rotación pendiente |
| `robot_seo.cjs` | JWT Supabase `anon` | Retirado del árbol actual; rotación pendiente |
| `PENDIENTES_SQL.md` | JWT `service_role` y JWT `anon` | Retirados del árbol actual; rotación pendiente |

También se revisaron referencias a secretos de Supabase, WordPress, Anthropic,
OneProvider, Gemini, DeepSeek, Qwen y BFL. Los nombres de variables no son
secretos; sus valores deben permanecer en entornos de servidor.

## Endpoint con efectos externos

`api/bienestar-pipeline.js` podía ejecutar:

1. proveedor LLM;
2. generación BFL;
3. descarga y subida de media;
4. creación/programación de un post WordPress.

No se localizaron llamadas internas, cron o webhooks del repositorio que
consuman este endpoint. Una automatización externa no puede descartarse desde
el código local y debe verificarse en Vercel, WordPress, Airtable y Notion.

## Rutas con escritura/publicación

Se localizaron operaciones `insert`, `update`, `upsert`, `delete`, generación
de SQL y publicación en los scripts enumerados en `LEGACY_WRITE_PATHS.md`.
Ninguno se ejecutó durante la fase.

## Historial

El análisis de historial confirmó apariciones en:

- `715a77abdc94fd646f04f1822fd64c710afbbf81` — `robot_seo.cjs`
- `794b83aec7ee3c2e01e1a2ae7e162b9a3032bed2` —
  `PENDIENTES_SQL.md`, `scripts/convert-biblia-to-articles.mjs` y
  `scripts/polish-articles.mjs`

No se reescribió historial, no se borraron ramas/tags y no se hizo force push.
