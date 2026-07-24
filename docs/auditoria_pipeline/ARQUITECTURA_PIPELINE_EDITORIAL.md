# Arquitectura del Editorial Article Review Pipeline

## Principios

- `dry_run=true` por defecto y no anulable accidentalmente.
- Separación de credenciales: lectura, staging y publicación.
- Ningún LLM investiga, redacta, aprueba y publica en una misma etapa.
- Contenido de artículos tratado como datos no confiables, nunca instrucciones.
- Todo estado persistido e idempotente por `article_id + source_hash + pipeline_version`.
- El original se conserva con hash antes de cualquier propuesta.
- El publicador permanece deshabilitado hasta autorización explícita.

## Flujo

```text
Fuente read-only
  -> snapshot inmutable + hash
  -> normalización canónica
  -> diagnóstico editorial estructurado
  -> extracción de claims
  -> recuperación de fuentes permitidas
  -> verificación independiente
  -> mapa de evidencia
  -> propuesta restringida
  -> auditor independiente
  -> validadores deterministas
  -> diff
  -> staging
  -> revisión editorial/profesional
  -> aprobación explícita
  -> publicación transaccional deshabilitada
  -> verificación post-publicación
  -> versión recuperable / rollback
```

## Componentes

### 1. Extractor

Interfaz `ArticleSource.read(ids|slugs)`. Implementaciones: exportación JSON local para piloto; Supabase read-only después. Debe registrar tabla de origen (`wellness_articles` o `blog_posts`) y resolver cuál es canónica antes de procesar.

### 2. Snapshot

Guarda registro original, metadatos, fecha, origen, hash SHA-256 y versión de schema. Escritura atómica en directorio fuera del árbol público. Un manifiesto enlaza cada artefacto. La prueba de restauración es obligatoria.

### 3. Normalizador

Produce un `CanonicalArticle` sin cambiar el original: cuerpo Markdown/HTML, FAQ visibles, referencias, productos, JSON-LD, autoría, categoría, fechas y estado. Conserva fragmentos no interpretables como incidencias; no los descarta.

### 4. Analizador editorial

LLM de baja temperatura con salida validada. Determina intención, utilidad, riesgo A/B/C, problemas y acción sugerida. No decide publicación. Una preclasificación determinista eleva a C ante medicamentos, dosis, procedimientos, crisis o instrucciones clínicas.

### 5. Claims y evidencia

El extractor de claims identifica cifras, dosis, plazos, causalidad, diagnóstico y tratamiento. El recuperador consulta únicamente conectores/dominios permitidos. El verificador coteja metadatos e identificadores; una referencia no recuperada nunca se marca como verificada.

### 6. Generador de propuesta

Recibe solo el artículo canónico, la política vigente y claims/fuentes autorizados. No puede introducir DOI, PMID, cifras o dosis fuera del mapa. Conserva slug por defecto. Produce Markdown y un registro de cambios declarado.

### 7. Auditor independiente

Proceso distinto del generador, con contexto limpio. Busca contradicciones, claims nuevos, omisiones de alarmas, comercialización encubierta y discrepancias entre cuerpo/FAQ/schema. Su aprobación no sustituye revisión humana.

### 8. Validadores deterministas

- JSON Schema y campos obligatorios.
- Toda cita del texto existe en el mapa.
- Dosis/cifra clínica sin evidencia = bloqueo.
- Slug inmutable salvo decisión humana.
- FAQ visible coincide con FAQ schema.
- No productos automáticos no aprobados.
- Autoría/revisión no atribuida sin identidad real.
- Markdown/HTML sanitizado y renderizable.
- Backup, diff y original recuperable.
- Nivel C sin revisión profesional = bloqueo.

### 9. Diff y staging

Diff semántico y textual, con secciones conservadas/eliminadas/corregidas/añadidas, razón y fuente. Staging guarda artefactos y estados, nunca reemplaza el artículo publicado.

### 10. Aprobación y publicación

Estados: `extracted`, `snapshotted`, `normalized`, `diagnosed`, `evidence_pending`, `evidence_verified`, `proposal_generated`, `independent_audit`, `validation_failed`, `human_review`, `professional_review`, `approved`, `rejected`, `publish_ready`, `published`, `rolled_back`, `blocked`.

Solo roles humanos autorizados transicionan a `approved`. La publicación requiere además una autorización operativa separada. Se usa control optimista por `source_hash`; si producción cambió desde el snapshot, se aborta.

## Persistencia propuesta

No crear durante la auditoría. Diseño lógico:

- `editorial_runs`: configuración, modelo, costos, estado y actor.
- `article_snapshots`: original, hash, origen y versión.
- `article_proposals`: propuesta, diagnóstico, diff y estado.
- `evidence_claims`: claims y fuentes verificadas.
- `editorial_reviews`: decisiones humanas/profesionales.
- `publication_versions`: versión previa/nueva y rollback.
- `audit_events`: eventos append-only.

RLS: worker lector sin escritura a producción; worker de análisis solo staging; publicador como función aislada, sin clave expuesta al navegador.

## Colas, fallos y reanudación

- Piloto: lote 1, concurrencia 1.
- Reintentos solo para fallos transitorios (429/5xx/red), con jitter y backoff.
- No reintentar violaciones de schema, autenticación o blockers clínicos.
- Persistir checkpoint por etapa.
- Presupuesto máximo de tokens/costo por run; cancelar de forma segura al excederlo.
- Idempotency key por etapa.
- Dead-letter state para intervención humana.

## Seguridad

- Lista permitida de endpoints y dominios de evidencia.
- Timeout y límites de bytes/tokens.
- Escape/sanitización de Markdown y HTML.
- No registrar prompts completos si contienen datos sensibles.
- Redactar secretos y cabeceras de errores.
- Auth obligatoria, CORS restringido y rate limit real en APIs.
- Escaneo de secretos y dependencias en CI.

## Rollback

Antes de publicar: comprobar snapshot, hash actual, aprobación, gates y versión. Después: registrar versión y verificar render. Rollback restaura por `publication_version_id`, crea un nuevo evento y nunca borra historial. Si el original no puede restaurarse en staging, el publicador continúa deshabilitado.

## Integración con BAIOS

Reutilizar nombres de estados, eventos, contratos y runtime donde encajen, pero reemplazar registries/colas en memoria por repositorios persistentes. Las políticas declarativas deben adquirir un evaluador real. La UI se conecta al API de staging, nunca directamente al service role.
