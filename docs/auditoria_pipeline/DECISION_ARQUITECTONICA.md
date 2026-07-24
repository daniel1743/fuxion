# Decisión arquitectónica

## Veredicto: COMBINAR

Se combinarán dos bases existentes, sin reutilizar sus flujos de escritura:

1. `src/modules/editor-ia/core/`: contratos, máquina de estados, eventos, políticas declarativas y runtimes como punto de partida.
2. `scripts/enrich-wellness-articles.mjs` + `scripts/providers/oneprovider.js`: patrones de lectura, backup, límite de lote, progreso y cliente de proveedor, extraídos detrás de interfaces seguras.

Se construirán los componentes editoriales ausentes: normalizador canónico, diagnóstico A/B/C, recuperación y verificación de evidencia, propuesta restringida, auditor independiente, validación determinista, diff, staging persistente, aprobación humana, publicación bloqueada por defecto y rollback.

No se combinará `api/bienestar-pipeline.js` ni el pipeline WordPress: su objetivo y modelo de seguridad contradicen esta tarea.

## Matriz ponderada

Puntuación 0–5; total ponderado sobre 100. Una falla crítica invalida ejecución masiva aunque la puntuación sea alta.

| Criterio | Peso | Reutilizar script | Adaptar script | Combinar bases | Desde cero |
|---|---:|---:|---:|---:|---:|
| Cobertura funcional | 20 | 1.5 | 3.0 | 4.0 | 4.5 |
| Seguridad de datos | 20 | 0.5 | 3.0 | 4.0 | 4.5 |
| Trazabilidad | 15 | 1.5 | 3.0 | 4.0 | 4.5 |
| Mantenibilidad | 15 | 1.0 | 2.5 | 4.0 | 4.0 |
| Compatibilidad | 10 | 3.0 | 4.0 | 4.5 | 3.5 |
| Soporte pruebas | 10 | 0.5 | 2.5 | 4.0 | 4.5 |
| Costo adaptación | 5 | 4.0 | 3.0 | 3.5 | 1.5 |
| Riesgo regresión | 5 | 0.5 | 2.5 | 3.5 | 4.0 |
| **Resultado / 100** | **100** | **25.5** | **60.0** | **80.5** | **84.0** |

“Desde cero” obtiene una puntuación bruta ligeramente superior, pero duplicaría una inversión real en contratos, estados, eventos y UI. `COMBINAR` reduce ese desperdicio manteniendo límites estrictos: reutilizar interfaces y algoritmos puros, no los caminos de publicación.

## Cobertura aproximada

- Script de enriquecimiento como sistema completo: 30%.
- BAIOS como infraestructura conceptual: 20–25% del pipeline requerido.
- Cobertura combinada, descontando duplicación: 40%.
- Trabajo nuevo estimado: 60%, concentrado en seguridad, evidencia, persistencia y pruebas.

## Condiciones que invalidan ejecución

Aunque se implemente el diseño, no podrá ejecutarse un lote real hasta:

- rotar la credencial incrustada y revisar historial;
- proteger o deshabilitar el endpoint de publicación WordPress;
- hacer `dry_run=true` obligatorio y fail-closed;
- disponer de snapshot verificable, diff y rollback probado;
- separar permisos de lectura, staging y publicación;
- implementar evidencia verificable y gates clínicos;
- disponer de revisión humana y profesional para nivel C;
- aprobar pruebas del piloto.

## Esfuerzo relativo

| Alternativa | Esfuerzo | Riesgo | Resultado |
|---|---|---|---|
| Reutilizar tal cual | Bajo | Inaceptable | Rechazado |
| Adaptar solo el script | Medio-alto | Alto por acoplamiento | Rechazado |
| Combinar | Alto, incremental | Controlable | Elegido |
| Construir todo de cero | Muy alto | Menor deuda heredada, mayor duplicación | Reserva |

## Siguiente paso exacto

Primero ejecutar una fase de contención, autorizada por separado: rotación del secreto, bloqueo del endpoint de publicación y creación de pruebas que demuestren cero escritura. Después implementar solo el “slice 1” del plan: contratos canónicos + extractor read-only + snapshot local con hash + diagnóstico simulado, sin IA real ni migraciones.
