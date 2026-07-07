# Cambio: Confetti Utility

**Fecha:** 2026-06-07 17:30 CLT  
**Archivo:** `src/lib/confetti.js`

---

## Descripción

Utilidad de confeti elegante usando canvas-confetti. Diseñada para ser premium, no infantil. Solo usar en eventos importantes.

## Funciones

### `fireElegantConfetti()`
- **Duración:** 800ms
- **Origen:** Ambos lados (izquierdo y derecho)
- **Colores:** Esmeralda (#059669, #10b981, #34d399) y dorado (#fbbf24, #f59e0b)
- **Partículas:** 3 por frame desde cada lado
- **Uso:** Formulario de oportunidad enviado, pedido completado

### `fireSubtleBurst()`
- **Duración:** Instantáneo
- **Origen:** Centro superior
- **Partículas:** 15
- **Colores:** Solo esmeralda
- **Uso:** Solicitud de asesor enviada

## Características

- Respeta `prefers-reduced-motion` (no ejecuta nada si está activo)
- No requiere configuración adicional
- Tree-shakeable (solo se importa donde se necesita)

## Dependencias

- `canvas-confetti` (añadida a package.json)
