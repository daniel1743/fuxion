# Plan de implementación propuesto

Este plan no fue ejecutado. Cada fase requiere revisión antes de avanzar.

## Fase 0 — Contención

1. Rotar/revocar la credencial privilegiada incrustada.
2. Eliminarla del archivo y del historial mediante procedimiento aprobado.
3. Deshabilitar o autenticar estrictamente `/api/bienestar-pipeline`.
4. Confirmar que ninguna automatización externa llama ese endpoint.
5. Añadir escaneo de secretos y una prueba negativa de escritura.

Salida verificable: credencial anterior inválida, endpoint incapaz de publicar sin autorización y repositorio limpio de secretos. Esta fase modifica seguridad y requiere autorización explícita.

## Fase 1 — Núcleo local sin red

1. Definir `CanonicalArticle`, `ArticleSnapshot`, `RunManifest` y estados.
2. Adoptar los JSON Schemas de esta auditoría.
3. Crear repositorios por interfaz: source, artifacts, staging y audit.
4. Implementar extractor desde fixture/exportación local.
5. Implementar snapshot atómico con SHA-256.
6. Implementar normalizador Markdown/HTML/FAQ/referencias/schema.
7. Implementar diff.
8. Probar idempotencia y restauración con fixtures.

Gate: suite unitaria verde y ninguna dependencia de Supabase/LLM.

## Fase 2 — Diagnóstico simulado y políticas

1. Adaptar estados/eventos de BAIOS.
2. Implementar evaluador de políticas real.
3. Implementar preclasificador determinista A/B/C.
4. Conectar un proveedor LLM simulado que entregue casos válidos e inválidos.
5. Validar toda salida; rechazar propiedades/campos desconocidos.
6. Probar prompt injection, salida truncada, JSON inválido y artículo enorme.

Gate: todo blocker produce `publication_blocked=true`.

## Fase 3 — Evidencia

1. Aprobar lista de fuentes y conectores.
2. Implementar extracción de claims.
3. Implementar recuperación con caché y provenance.
4. Implementar verificador de metadatos/identificadores.
5. Prohibir referencias creadas por el generador.
6. Añadir revisión manual por claim.

Gate: cero referencias no recuperadas marcadas como verificadas.

## Fase 4 — Propuesta y auditor independiente

1. Adaptar cliente de proveedor detrás de interfaz.
2. Añadir timeout, backoff, jitter, presupuesto, trazas y redacción.
3. Generar únicamente desde mapa autorizado.
4. Ejecutar auditor independiente con contexto separado.
5. Validar cuerpo, FAQ, productos, schema, autoría, categoría y enlaces.
6. Generar diff y paquete completo de revisión.

Gate: el mismo proceso no puede generar y autoaprobar.

## Fase 5 — Supabase read-only y staging

1. Inventariar schema real y decidir fuente canónica.
2. Diseñar migraciones reversibles para staging/versiones/auditoría.
3. Crear roles mínimos y RLS.
4. Conectar extractor read-only.
5. Conectar staging writer sin permiso sobre tablas públicas.
6. Probar fallos a mitad de transacción y reanudación.

Gate: credencial del worker no puede actualizar `wellness_articles` ni `blog_posts`.

## Fase 6 — Revisión humana

1. Adaptar UI BAIOS para lista, detalle, evidencia, diff y preview.
2. Implementar RBAC y registro de actor.
3. Estados aprobar, rechazar, devolver y solicitar profesional.
4. Exigir identidad real del revisor profesional.
5. Probar accesibilidad, escritorio y móvil.

Gate: nivel C no llega a `publish_ready` sin revisión profesional.

## Fase 7 — Publicador y rollback

1. Crear servicio aislado, inicialmente apagado.
2. Revalidar hash, aprobaciones y blockers al publicar.
3. Crear versión previa y actualización transaccional.
4. Verificar render/schema/enlaces post-publicación.
5. Implementar rollback por versión y probarlo en staging.
6. Requerir autorización operativa para habilitar producción.

Gate: rollback probado y publicación accidental imposible en tests.

## Fase 8 — Piloto y escalado

1. Ejecutar tres artículos en dry-run, concurrencia 1.
2. Revisión manual claim por claim.
3. Medir calidad, errores, costo, latencia y recuperación.
4. Corregir falsos positivos/negativos.
5. Repetir hasta cumplir todos los criterios.
6. Solo entonces evaluar lote máximo 3; nunca diez inicialmente.

## Definición de terminado

- Tests unitarios, integración, seguridad y render verdes.
- Backups, hashes, diffs y rollback demostrados.
- Salidas estructuradas válidas.
- Permisos mínimos comprobados.
- Costo y límites documentados.
- Revisión humana operativa.
- Autorización explícita antes de cualquier publicación.
