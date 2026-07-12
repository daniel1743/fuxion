# FLOATING ACTIONS UX REPORT
## UI Polish Fase Final 2 — Botones flotantes inteligentes WhatsApp + Falcon

**Fecha:** 2026-07-07
**Objetivo:** Mejorar experiencia de botones flotantes para mantener conversión sin bloquear lectura ni productos.

---

## 1. Problemas Detectados (Pre-auditoría)

| Problema | Impacto |
|----------|---------|
| Botones flotantes cubren información en mobile | UX degradado, contenido tapado |
| WhatsApp y asistente IA compiten por espacio | Confusión visual, dos botones en misma zona |
| En scroll permanente se sienten invasivos | Molestia, distracción constante |
| Se perciben como anuncios, no herramientas | Baja confianza, menor interacción |

---

## 2. Componentes Auditados

| Componente | Archivo | Rol | Estado |
|------------|---------|-----|--------|
| `FalconBot` | `src/components/FalconBot.jsx` | Asistente IA flotante | ✅ Modificado |
| `FloatingWhatsAppButton` | `src/components/FloatingWhatsAppButton.jsx` | Botón WhatsApp periódico | ✅ Modificado |
| `ScrollAwareFloating` | `src/components/ScrollAwareFloating.jsx` | Hook/componente scroll-awareness | ✅ Creado |
| `Layout` | `src/components/Layout.jsx` | Contenedor principal | ✅ Sin cambios (solo renderiza) |
| `PwaInstallPrompt` | `src/components/PwaInstallPrompt.jsx` | Prompt instalación PWA | 🔍 Auditado, no modificado |

### Ubicaciones Revisadas

| Página | Botón WhatsApp | FalconBot | Observaciones |
|--------|---------------|-----------|---------------|
| Home | ✅ | ✅ | Sin conflictos |
| ProductPage | ✅ | ✅ | Sin conflictos |
| CartPage | ✅ | ✅ | Sin conflictos |
| Checkout (CartPage) | ✅ | ✅ | Sin conflictos |
| OpportunityPage | ✅ | ✅ | Sin conflictos |
| HelpCenterPage | ✅ | ✅ | Sin conflictos |
| ContactPage | ✅ | ✅ | Sin conflictos |
| ExplorePage | ✅ | ✅ | Sin conflictos |

---

## 3. Solución Implementada: Scroll Awareness

### 3.1 Nuevo Componente: `ScrollAwareFloating.jsx`

**Archivo:** `src/components/ScrollAwareFloating.jsx`

**Hook `useScrollAware`:**
- Escucha evento `scroll` con `passive: true` para rendimiento
- Detecta scroll activo (movimiento > 3px)
- Reduce opacidad a **0.4** y scale a **0.92** durante scroll
- Al detenerse el scroll, espera **600ms** y restaura valores
- Nunca oculta completamente los botones

**Componente `ScrollAwareGroup`:**
- Wrapper opcional para agrupar elementos flotantes
- Aplica scroll-awareness a todos los hijos

### 3.2 Comportamiento Aplicado

```
┌─────────────────────────────────────────────────────────┐
│                    SCROLL BEHAVIOR                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Usuario inactivo (idle)                                │
│  ┌─────────────────────────────────────┐                │
│  │  Opacity: 1.0  │  Scale: 1.0       │                │
│  └─────────────────────────────────────┘                │
│                                                         │
│  Usuario hace scroll                                    │
│  ┌─────────────────────────────────────┐                │
│  │  Opacity: 0.4  │  Scale: 0.92      │  ← 250ms trans │
│  └─────────────────────────────────────┘                │
│                                                         │
│  Scroll se detiene → espera 600ms                      │
│  ┌─────────────────────────────────────┐                │
│  │  Opacity: 1.0  │  Scale: 1.0       │  ← 250ms trans │
│  └─────────────────────────────────────┘                │
│                                                         │
│  Hover (desktop) / Touch (mobile)                      │
│  ┌─────────────────────────────────────┐                │
│  │  Opacity: 1.0  │  Scale: 1.0       │  ← inmediato   │
│  └─────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Valores de Transición

| Propiedad | Valor | Unidad |
|-----------|-------|--------|
| Duración transición | 250 | ms |
| Easing | ease | - |
| Opacidad en scroll | 0.4 | - |
| Scale en scroll | 0.92 | - |
| Delay restauración | 600 | ms |
| Opacidad idle | 1.0 | - |
| Scale idle | 1.0 | - |

---

## 4. Cambios en Componentes

### 4.1 `FloatingWhatsAppButton.jsx`

**Cambios realizados:**
1. **Importación:** Agregado `useScrollAware` desde `ScrollAwareFloating`
2. **Nuevo estado:** `isHovered` para restaurar opacidad en hover/touch
3. **Scroll awareness:** Hook `useScrollAware()` integrado
4. **Animación dinámica:** `animate` usa `effectiveOpacity` y `effectiveScale` que combinan scroll + hover
5. **Eventos táctiles:** `onTouchStart`/`onTouchEnd` restauran opacidad en mobile

### 4.2 `FalconBot.jsx`

**Cambios realizados:**
1. **Importación:** Agregado `useScrollAware` desde `ScrollAwareFloating`
2. **Nuevo estado:** `isFloatingHovered` para restaurar opacidad en hover/touch
3. **Scroll awareness:** Hook `useScrollAware()` integrado
4. **Animación del botón flotante:** `animate` usa `scrollStyle.scale` y `scrollStyle.opacity` con override por hover
5. **Eventos táctiles:** `onTouchStart`/`onTouchEnd` restauran opacidad en mobile

---

## 5. Mobile Testing

### 5.1 Pruebas Realizadas

| Escenario | Resultado |
|-----------|-----------|
| Scroll Home completo | ✅ Botones bajan opacidad, no bloquean contenido |
| Scroll producto largo (ProductPage) | ✅ Botones se atenúan, descripción legible |
| Leer descripción producto | ✅ Sin interferencia |
| Carrito (CartPage) | ✅ Botones no tapan botón "Enviar pedido" |
| Formulario ayuda (HelpCenterPage) | ✅ Botones no tapan campos |
| Touch en botón durante scroll | ✅ Opacidad restaurada inmediatamente |

### 5.2 Posiciones en Mobile

| Elemento | Posición | Z-index |
|----------|----------|---------|
| FloatingWhatsAppButton | `bottom-6 left-4` | `z-40` |
| FalconBot (cerrado) | `bottom-6 right-6` | `z-50` |
| FalconBot (abierto) | `bottom-3 right-3` | `z-50` |
| PwaInstallPrompt | `bottom-5 left-4` | `z-[70]` |

### 5.3 Safe Areas

Los botones usan `bottom-6` (24px) que respeta safe areas en dispositivos modernos. No se requiere padding-bottom global adicional ya que los botones están posicionados fixed y no afectan el flujo del contenido.

---

## 6. Desktop Testing

| Escenario | Resultado |
|-----------|-----------|
| Hover sobre botón durante scroll | ✅ Opacidad restaurada inmediatamente |
| Sin scroll (idle) | ✅ Opacidad y scale normales |
| Scroll suave | ✅ Transición suave 250ms |
| Múltiples scrolls rápidos | ✅ Sin parpadeos, timer se reinicia |

---

## 7. Principios de Diseño Respetados

| Principio | Cómo se cumple |
|-----------|----------------|
| No eliminar botones | ✅ Ambos botones permanecen |
| No cambiar colores principales | ✅ Mismos colores (#25D366, emerald) |
| No cambiar lógica del chat | ✅ Sin modificaciones a la lógica |
| No modificar API | ✅ Sin cambios en API |
| No modificar Telegram | ✅ Sin cambios |
| No tocar SEO | ✅ Sin cambios en SEO |
| Botones siempre visibles | ✅ Opacidad mínima 0.4, nunca 0 |
| Herramientas de ayuda, no anuncios | ✅ Scroll-aware los hace menos intrusivos |

---

## 8. Archivos Modificados

| Archivo | Tipo de Cambio |
|---------|----------------|
| `src/components/ScrollAwareFloating.jsx` | ✅ **NUEVO** - Hook + componente |
| `src/components/FloatingWhatsAppButton.jsx` | ✅ Modificado - Scroll awareness |
| `src/components/FalconBot.jsx` | ✅ Modificado - Scroll awareness |

---

## 9. Build Verification

```
npm run build → ✅ Success (0 errors, 0 warnings)
```

---

## 10. Resumen

Se implementó scroll-awareness inteligente en los botones flotantes de WhatsApp y Falcon Assistant:

- **Durante scroll:** opacidad se reduce a 0.4 y scale a 0.92 con transición suave de 250ms
- **Al detener scroll:** espera 600ms y restaura valores originales
- **Hover/touch:** restaura opacidad inmediatamente para mantener accesibilidad
- **Nunca se ocultan:** opacidad mínima de 0.4 garantiza visibilidad permanente
- **Sin cambios visuales drásticos:** colores, posiciones y lógica intactos
- **Build exitoso:** sin errores ni warnings

Los botones ahora se sienten como herramientas de ayuda elegantes que se apartan sutilmente mientras el usuario lee contenido, sin bloquear información ni competir por atención visual.
