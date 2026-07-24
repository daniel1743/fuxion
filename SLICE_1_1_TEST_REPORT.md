# Slice 1.1 — Reporte de pruebas

Fecha: 2026-07-23

## Resultado final

- Suite editorial: **36/36 aprobadas**.
- Suite de seguridad Fase 0: **10/10 aprobadas**.
- Escaneo de secretos: **aprobado, cero hallazgos**.
- Cobertura Slice 1: **95.97% líneas, 88.96% branches, 94.74% funciones**.
- Servicios externos utilizados: **ninguno**.

## Comandos ejecutados

```text
npm run editorial:test
npm run editorial:coverage
npm run security:test
npm run security:scan
```

## Evidencia nueva

Las pruebas adversariales cubren individualmente S1-001 a S1-009, además de:

- raíz enlazada mediante symlink/junction;
- corrupción de fuente inmutable y canonical reutilizados;
- manipulación del canonical y metadatos dentro del snapshot;
- reanudación con el mismo `run_id`;
- concurrencia de dos instancias del repositorio sobre un mismo log;
- coexistencia de snapshots por cambio de hash o versión;
- ausencia de llamadas por APIs de red de Node durante la integración.

No se ejecutaron scripts legacy, no se cargó `.env` y no se escribió en
`public/`.
