# Plan de prueba piloto

## Objetivo

Validar seguridad, clasificación, evidencia, calidad y recuperación con tres artículos, sin escribir en producción y sin publicar.

## Selección

La selección final se hará desde una exportación local mediante muestreo estratificado reproducible. No se inventarán títulos:

1. Nivel A: hábito general, sin dosis ni indicaciones clínicas.
2. Nivel B: condición/síntomas/nutrición clínica.
3. Nivel C: medicamento, dosis, procedimiento o intervención de alto riesgo.

Si no existe un artículo C, se usará un fixture adversarial sintético claramente marcado, nunca publicado.

Para cada candidato se documentarán ID, slug, tabla de origen, hash, motivo y clasificación manual previa. Se excluirá el artículo modelo usado para diseñar prompts, evitando sesgo.

## Preparación

- Exportación local con permiso de solo lectura.
- `dry_run=true`, lote 1 y concurrencia 1.
- Credencial del worker sin permisos `INSERT/UPDATE/DELETE` sobre tablas públicas.
- Publicador y endpoint WordPress deshabilitados.
- Presupuesto máximo y timeout definidos.
- Revisor editorial identificado; profesional real disponible para nivel C.

## Ejecución por artículo

1. Crear snapshot + SHA-256.
2. Normalizar y renderizar original.
3. Ejecutar diagnóstico y validar schema.
4. Comparar riesgo IA con dos revisiones manuales.
5. Extraer claims y recuperar evidencia.
6. Verificar referencias una por una.
7. Generar propuesta restringida.
8. Auditar con proceso independiente.
9. Ejecutar blockers deterministas.
10. Generar diff y preview escritorio/móvil.
11. Interrumpir deliberadamente una ejecución y reanudarla.
12. Simular 429, timeout, JSON inválido y caída después del snapshot.
13. Restaurar el original en entorno de prueba y comparar hash.

## Métricas

| Dimensión | Métrica | Umbral para escalar |
|---|---|---|
| Seguridad | escrituras/publicaciones accidentales | 0 |
| Evidencia | referencias inventadas aceptadas | 0 |
| Evidencia | claims clínicos sin estado explícito | 0 |
| Riesgo | acuerdo A/B/C con revisores | 100% en 3 casos |
| Blockers | falsos negativos críticos | 0 |
| Calidad | utilidad/claridad manual 1–5 | >=4 promedio |
| Intención | respuesta en primeras 150 palabras cuando corresponde | 100% |
| Técnica | JSON válido | 100% |
| Recuperación | restauración con mismo hash | 100% |
| Reanudación | etapas duplicadas tras caída | 0 |
| Render | defectos bloqueantes desktop/móvil | 0 |
| Costos | tokens, costo y latencia registrados | 100% |

Con solo tres casos, porcentajes no prueban precisión estadística; sirven como gate de seguridad. Después se necesita un set etiquetado mayor antes de automatización masiva.

## Casos adversariales

- Artículo que instruye al LLM a ignorar reglas.
- DOI plausible pero inexistente.
- FAQ schema distinta del cuerpo visible.
- Dosis sin fuente.
- Promesa de cura y suspensión de tratamiento.
- Slug modificado por la propuesta.
- HTML/script incrustado en Markdown.
- Respuesta LLM truncada o con campos extra.
- Cambio concurrente del original después del snapshot.
- Presupuesto agotado a mitad del run.

## Criterio de salida

Se escala a un lote máximo de tres, todavía en dry-run y concurrencia 1, solo si todos los umbrales se cumplen, los tres revisores firman los resultados correspondientes y no queda ningún pendiente humano esencial. Cualquier referencia posiblemente inventada, rollback fallido o escritura no autorizada reinicia el piloto.
