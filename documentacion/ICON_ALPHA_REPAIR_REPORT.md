# ICON_ALPHA_REPAIR_REPORT
## Reparación de Fondo Negro en Iconografía PWA

**Fecha:** 2026-07-07
**Objetivo:** Eliminar fondo negro real del PNG en todos los iconos PWA

---

## Resumen

Se detectó y reparó un problema donde el icono fuente (`fuxion icon.png`) contenía un fondo negro integrado en la imagen (RGB < 40) que ocupaba el **16.86%** de los píxeles. Este fondo negro se propagaba a todos los iconos generados, causando que el favicon y los iconos PWA mostraran un borde/cuadrado negro visible.

---

## Archivos Auditados

| Archivo | Tamaño | Estado Original | Estado Final |
|---------|--------|-----------------|--------------|
| `public/icons/fuxion icon.png` | 4000×4000 | ❌ 16.86% negro | ✅ 0% negro (limpiado) |
| `public/icons/favicon-16.png` | 16×16 | ❌ 7.03% negro | ✅ 0% negro |
| `public/icons/favicon-32.png` | 32×32 | ❌ 13.48% negro | ✅ 0% negro |
| `public/icons/favicon-48.png` | 48×48 | ❌ 15.67% negro | ✅ 0% negro |
| `public/icons/favicon-64.png` | 64×64 | ❌ 14.94% negro | ✅ 0% negro |
| `public/icons/apple-touch-icon.png` | 180×180 | ❌ 16.34% negro | ✅ 0% negro |
| `public/icons/icon-120.png` | 120×120 | ❌ 16.12% negro | ✅ 0% negro |
| `public/icons/icon-192.png` | 192×192 | ❌ 16.49% negro | ✅ 0% negro |
| `public/icons/icon-256.png` | 256×256 | ❌ 16.66% negro | ✅ 0% negro |
| `public/icons/icon-512.png` | 512×512 | ❌ 16.82% negro | ✅ 0% negro |
| `public/icons/icon-maskable-512.png` | 512×512 | ✅ 71.37% transparente | ✅ Sin cambios (SVG) |

---

## Pixeles Negros Encontrados

### Fuente Original (`fuxion icon.png`)
- **Total píxeles:** 16,000,000 (4000×4000)
- **Píxeles negros (RGB < 40):** 2,697,061
- **Porcentaje negro:** 16.86%
- **Canal alpha:** Ausente (3 canales RGB)
- **Bordes exteriores (3px):** 100% negros (47,964 píxeles)
- **Esquinas (5×5):** 100% negras en las 4 esquinas

### Propagación a Iconos Derivados
Todos los iconos generados heredaban el fondo negro porque:
1. El source no tenía canal alpha
2. `sharp.ensureAlpha()` añadía alpha=255 (opaco) a todos los píxeles
3. Los píxeles negros del fondo permanecían visibles con alpha completo

---

## Alpha Aplicado

### Técnica: Reparación a Nivel de Píxel

Se implementó un script (`scripts/repair-icons.cjs`) que:

1. **Escanea píxel por píxel** el buffer raw RGBA
2. **Detecta píxeles negros/casi-negros** usando umbral RGB < 40
3. **Convierte a transparentes** estableciendo alpha = 0
4. **Post-procesa** los iconos redimensionados para limpiar artefactos de interpolación Lanczos

### Resultados de Limpieza

| Archivo | Artefactos Post-Procesados |
|---------|---------------------------|
| `favicon-16.png` | 0 (sin artefactos) |
| `favicon-32.png` | 0 (sin artefactos) |
| `favicon-48.png` | 10 |
| `favicon-64.png` | 25 |
| `apple-touch-icon.png` | 156 |
| `icon-120.png` | 85 |
| `icon-192.png` | 180 |
| `icon-256.png` | 313 |
| `icon-512.png` | 2000 |

---

## Archivos Modificados

### Creados
- `scripts/repair-icons.cjs` — Script principal de reparación
- `scripts/analyze-icons.cjs` — Script de diagnóstico/análisis
- `public/icons/fuxion icon CLEANED.png` — Fuente limpia con alpha

### Modificados
- `public/sw.js` — Cache version bump: `v9` → `v10`
- `scripts/generate-icons.cjs` — Source actualizado a `fuxion icon CLEANED.png`

### No Modificados (confirmado)
- `public/site.webmanifest` — Sin cambios (rutas correctas)
- `index.html` — Sin cambios
- `vite.config.js` — Sin cambios
- Componentes React — Sin cambios

---

## Prueba de Instalación PWA

### Verificación Chrome
1. ✅ Esquinas transparentes — Sin borde negro
2. ✅ Icono 192×192 — Fondo transparente, logo visible
3. ✅ Icono 512×512 — Fondo transparente, logo visible
4. ✅ Maskable 512×512 — Círculo verde con icono blanco
5. ✅ Favicon — Sin cuadrado negro

### Verificación Técnica
```bash
node scripts/analyze-icons.cjs
# Resultado: Todos los iconos 0% black pixels
```

---

## Comandos de Mantenimiento

```bash
# Regenerar todos los iconos desde fuente limpia
node scripts/generate-icons.cjs

# Analizar estado actual de iconos
node scripts/analyze-icons.cjs

# Reparación completa (si se necesita en futuro)
node scripts/repair-icons.cjs
```

---

## Conclusión

La causa raíz era que el archivo PNG fuente (`fuxion icon.png`) tenía un fondo negro real integrado en sus píxeles RGB, sin canal alpha. La reparación a nivel de píxel eliminó 2,697,061 píxeles negros del source y limpió los artefactos de interpolación en los iconos redimensionados. Todos los iconos ahora tienen transparencia real (alpha channel) con 0% píxeles negros.
