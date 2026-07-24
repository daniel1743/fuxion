# Riesgos y bloqueos

## Bloqueos críticos actuales

| ID | Hallazgo | Impacto | Condición para levantar |
|---|---|---|---|
| B-01 | Credencial Supabase privilegiada incrustada en `scripts/polish-articles.mjs` | Compromiso total del proyecto según permisos | Rotar/revocar, retirar del árbol/historial y auditar uso |
| B-02 | Endpoint WordPress sin autenticación, CORS abierto y publicación encadenada | Publicación/costo abusivo remoto | Deshabilitar o autenticar, CORS allowlist, autorización y publicador separado |
| B-03 | Escritura directa a producción en scripts | Pérdida o corrupción editorial | Rol mínimo, dry-run default, staging y aprobación |
| B-04 | Sin evidencia recuperada/verificada | Daño clínico y reputacional | Recuperador + verificador + revisión |
| B-05 | Sin rollback probado ni fuente canónica definida | Original no recuperable/divergencia | Inventario DB, snapshots hash y restauración |
| B-06 | Sin pruebas editoriales/CI | Regresiones silenciosas | Suite y gates automatizados |

## Riesgos técnicos

- **Doble fuente de verdad:** `wellness_articles`, `blog_posts` y cachés pueden divergir. Resolver antes del primer snapshot.
- **Cola efímera:** BAIOS almacena jobs en memoria; serverless pierde estado. Persistir checkpoints y locks.
- **Idempotencia débil:** longitud/encabezados no representan versión. Usar hash y pipeline version.
- **Errores marcados como procesados:** el progreso actual puede impedir reintento correcto.
- **Renderer divergente:** Markdown GFM frente a HTML manual. El preview debe usar el renderer de producción.
- **XSS:** `dangerouslySetInnerHTML` sin sanitizador localizado y conversión Markdown por regex.
- **Schema incompleto:** migraciones no definen íntegramente tablas canónicas/RLS.
- **Script npm inexistente:** `enrich-article` apunta a archivo ausente.
- **TLS deshabilitado:** scripts de generación/publicación anulan validación TLS.
- **Errores externos filtrados:** algunos endpoints devuelven mensajes crudos de proveedores.

## Riesgos científicos y clínicos

- El artículo original se trata como “verdad absoluta”; puede perpetuar errores.
- El prompt actual solicita dosis sin fuente recuperada.
- Asociación puede reescribirse como causalidad.
- Referencias plausibles pueden ser inventadas.
- Un conteo mínimo de citas no garantiza calidad o pertinencia.
- Una estructura larga obligatoria puede crear relleno SEO.
- Señales de alarma pueden omitirse o exagerarse.
- Nivel C podría publicarse sin profesional real.
- “Revisión médica” o autoría podrían declararse sin evidencia.

## Riesgos editoriales y SEO

- FAQ y productos generados automáticamente pueden no responder al lector.
- `MedicalWebPage`/FAQ schema puede contradecir el contenido visible.
- Cambio de slug puede romper enlaces y autoridad.
- Artículos duplicados pueden requerir fusión/301, no reescritura.
- Taxonomías contradictorias generan categorías erróneas.
- Optimizar densidad de keywords puede degradar claridad y confianza.
- Despublicar sin plan de redirección puede dañar usuarios y SEO.

## Riesgos de seguridad y privacidad

- Service role usado fuera de un servicio aislado.
- Endpoint de publicación susceptible a abuso y costos.
- Contenido no confiable puede realizar prompt injection.
- Logs pueden capturar contenido sensible o respuestas con secretos.
- URLs de evidencia o imágenes pueden habilitar SSRF si no hay allowlist.
- Credenciales WordPress Basic deben permanecer solo en backend aislado.

## Riesgos económicos y operativos

- Varias llamadas por artículo multiplican tokens y latencia.
- Reintentos sin clasificación duplican costos.
- Modelos declarados pueden no existir o cambiar; fijar versión y validar disponibilidad.
- No hay presupuesto por run ni kill switch.
- Revisión profesional es un cuello de botella real que debe planificarse.
- Archivos de backup locales no garantizan retención, cifrado o disponibilidad.

## Priorización

1. Contener secreto y publicación remota.
2. Establecer fuente canónica y permisos mínimos.
3. Construir snapshots/dry-run/tests.
4. Construir evidencia y blockers.
5. Añadir staging/revisión.
6. Solo al final considerar publicación y escala.

## Regla de detención

Detener inmediatamente cualquier ejecución si falta backup/hash, aparece una referencia no verificable, el rol puede escribir en producción, el contenido cambió desde el snapshot, se excede presupuesto, falla sanitización/render o existe un pendiente humano esencial.
