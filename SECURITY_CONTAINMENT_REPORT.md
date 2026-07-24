# Informe de contención de seguridad — Fase 0

Fecha: 2026-07-23  
Rama: `security/phase-0-containment`  
Estado: **CONTENCIÓN_TÉCNICA_COMPLETADA_CON_PENDIENTES_HUMANOS**

## Hallazgos confirmados

- Se localizaron dos JWT `service_role` en scripts y otro en documentación.
- Se localizaron JWT `anon` en código/documentación.
- El endpoint editorial importaba de inmediato un pipeline con efectos y tenía CORS wildcard.
- Había comandos npm para un importador con UPSERT y para un archivo inexistente.
- No existían pruebas negativas ni CI de secretos.

## Cambios realizados

- Retirados todos los JWT literales detectados en el árbol actual.
- Scripts afectados usan variables de servidor y fallan antes de crear el cliente.
- Eliminada la desactivación TLS en `robot_seo.cjs`.
- Endpoint bloqueado si falta habilitación y siempre bloqueado en producción.
- Importación del pipeline movida después del gate.
- CORS cambiado a allowlist explícita, sin wildcard.
- Errores externos sustituidos por mensaje genérico.
- Retirados comandos npm editoriales peligrosos/confusos.
- Añadidos escáner local, suite negativa y workflow CI.
- Reforzado `.gitignore` para variantes `.env.*`.
- Documentadas rutas legacy, rotación e historial.

## Archivos de contención

- Código/configuración: `.gitignore`, `.env.example`, `package.json`,
  `api/bienestar-pipeline.js`, `scripts/polish-articles.mjs`,
  `scripts/convert-biblia-to-articles.mjs`, `robot_seo.cjs`,
  `PENDIENTES_SQL.md`.
- Pruebas/CI: `scripts/security-scan.cjs`,
  `tests/security/phase-zero-containment.test.cjs`,
  `.github/workflows/security-containment.yml`.
- Documentación: este informe, `SECURITY_BASELINE.md`,
  `SECRET_ROTATION_RUNBOOK.md`, `GIT_HISTORY_CLEANUP_PLAN.md`,
  `LEGACY_WRITE_PATHS.md`.

## Pruebas ejecutadas

- `npm run security:scan`: aprobado, cero valores detectados.
- `npm run security:test`: aprobado, 10/10 pruebas.
- No se suministraron credenciales reales.
- No se llamó a Supabase, WordPress, LLM, BFL ni APIs de pago.
- No se ejecutó ningún script editorial.

## Validación final

| Pregunta | Respuesta |
|---|---|
| ¿El secreto sigue en el árbol actual? | No, según escaneo reproducible |
| ¿Se confirmó revocación administrativa? | Pendiente humano |
| ¿El endpoint ejecuta efectos sin habilitación explícita? | No |
| ¿Puede ejecutar efectos en producción? | No |
| ¿Existe CORS wildcard en esa ruta? | No |
| ¿Alguna prueba tocó producción? | No |
| ¿Se ejecutaron APIs de pago? | No |
| ¿Pasan las pruebas negativas? | Sí |
| ¿Se reescribió historial? | No |

## Pendientes humanos

1. Rotar/revocar `service_role` y `anon` en Supabase.
2. Revisar logs de uso y alcance del incidente.
3. Actualizar consumidores legítimos y demostrar que claves anteriores fallan.
4. Verificar automatizaciones externas que llamen al endpoint.
5. Autorizar, si procede, limpieza destructiva del historial.
6. Revisar forks, clones, caches, artefactos y despliegues.
7. Activar protección de rama que exija el workflow de seguridad.

## Riesgos residuales

- Las credenciales permanecen en historial remoto hasta limpieza.
- No hay evidencia administrativa de revocación.
- Scripts legacy siguen presentes y podrían ejecutarse manualmente con credenciales.
- CRUD administrativo existente queda fuera del alcance de esta fase.
- Una automatización externa no visible podría depender del endpoint, aunque producción ahora lo bloquea.

## Rollback del código

Revertir el commit de Fase 0 restauraría configuraciones inseguras y no se
recomienda. Si una incompatibilidad exige rollback, conservar primero el retiro
de secretos y el gate de producción; revertir solo documentación/CI de forma
selectiva. No usar `git reset --hard` sobre este árbol con cambios del usuario.
