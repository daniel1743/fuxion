# 🌿 Bienestar en Claro — Design System Oficial

**Versión:** 1.0.0  
**Fecha:** 2026-07-24  
**Autor:** Codex  
**Estado:** Aprobado — Fuente única de verdad visual  
**Color canónico:** `#0E5C53` (Hero Green)

---

# 1. FILOSOFÍA VISUAL

## 1.1 Principios fundamentales

| Principio | Significado |
|---|---|
| **La salud es calma** | Nada de colores agresivos. Todo respira. |
| **La ciencia es clara** | Tipografía legible. Sin adornos innecesarios. |
| **La cercanía es humana** | Espacios generosos. Curvas suaves. Toques de calidez. |
| **Lo premium no grita** | Se siente en los detalles: sombras, transiciones, proporciones. |

## 1.2 Personalidad de la marca

```
Bienestar en Claro es:
  - Científico pero cercano
  - Premium pero accesible
  - Moderno pero cálido
  - Profesional pero humano
  - Verde pero no genérico

No es:
  - Clínico / hospitalario
  - Corporativo / frío
  - Genérico / anónimo
  - Sobrecargado / barroco
```

## 1.3 Lenguaje visual

Toda la interfaz debe sentirse como **una sola superficie verde que respira**. El verde oscuro del Hero (`#0E5C53`) es el ancla. Los verdes más claros son acentos. Los grises cálidos (zinc) son el lienzo. El blanco es el espacio. Las sombras verdes sutiles (`premium-soft`) son la profundidad.

---

# 2. PALETA DE COLORES OFICIAL

## 2.1 Color primario: Bienestar Green

**Color canónico:** `#0E5C53`

### Justificación

Este verde fue elegido como color principal porque:
1. **Es lo primero que ve el usuario** — El Hero de la Home usa este verde desde el día uno.
2. **Es distintivo** — No es el verde esmeralda genérico de Tailwind. Tiene personalidad: profundo, botánico, premium.
3. **Transmite los valores correctos** — Salud (verde), seriedad (oscuro), naturaleza (tono tierra).
4. **Funciona en dark mode** — Suficientemente oscuro para contrastar con texto blanco, suficientemente claro para distinguirse del fondo negro.
5. **Es el verde de Fuxion** — Coherencia con la marca del ecosistema de productos.

### Escala cromática completa

| Token | Hex | HSL | Contraste con blanco | Uso |
|---|---|---|---|---|
| `bienestar-50` | `#ECFDF5` | `155 70% 96%` | ⬜ 1.1:1 | Fondos très clairs |
| `bienestar-100` | `#D1FAE5` | `156 80% 90%` | ⬜ 1.2:1 | Badges fondo |
| `bienestar-200` | `#A7F3D0` | `152 76% 83%` | ⬜ 1.6:1 | Hover suave |
| `bienestar-300` | `#6EE7B7` | `157 71% 69%` | ⬜ 2.1:1 | Indicadores |
| `bienestar-400` | `#34D399` | `158 64% 51%` | ⬜ 1.8:1 | ❌ No usar en texto |
| `bienestar-500` | `#10B981` | `160 84% 39%` | ⬜ 3.2:1 | **Acento** (CTAs, links, badges) |
| `bienestar-600` | `#059669` | `163 94% 30%` | ⬜ 4.7:1 ✅ | Hover de botones |
| `bienestar-700` | `#047857` | `165 94% 25%` | ⬜ 5.8:1 ✅ | Texto activo |
| `bienestar-800` | `#065F46` | `169 84% 20%` | ⬜ 7.2:1 ✅ | Texto en dark mode |
| `bienestar-900` | `#064E3B` | `167 86% 17%` | ⬜ 8.3:1 ✅ | Fondos oscuros |
| **`bienestar-950`** | **`#0E5C53`** | **`171 48% 20%`** | **⬜ 7.8:1 ✅** | **COLOR PRIMARIO** |

## 2.2 Paleta de neutros (Zinc)

| Token | Hex | Uso |
|---|---|---|
| `neutral-50` | `#FAFAFA` | Fondo de página (light mode) |
| `neutral-100` | `#F4F4F5` | Fondo de cards |
| `neutral-200` | `#E4E4E7` | Bordes |
| `neutral-300` | `#D4D4D8` | Bordes interactivos |
| `neutral-400` | `#A1A1AA` | Placeholder text |
| `neutral-500` | `#71717A` | Texto secundario |
| `neutral-600` | `#52525B` | Iconos inactivos |
| `neutral-700` | `#3F3F46` | Texto principal (light) |
| `neutral-800` | `#27272A` | Títulos (light) |
| `neutral-900` | `#18181B` | Texto fuerte |
| `neutral-950` | `#09090B` | Fondo dark mode |

## 2.3 Colores semánticos

| Token | Hex | Uso |
|---|---|---|
| **success** | `#10B981` (bienestar-500) | Éxito, confirmación, badges positivos |
| **warning** | `#F59E0B` (amber-500) | Advertencias, badges "pendiente" |
| **danger** | `#EF4444` (red-500) | Destructivo, errores, eliminar |
| **info** | `#3B82F6` (blue-500) | Información, badges "info" |
| **whatsapp** | `#25D366` | Botón de WhatsApp (único color externo permitido) |

## 2.4 Colores de superficie

| Token | Hex | Uso |
|---|---|---|
| `surface-dark` | `#0A1410` | Fondo alternativo oscuro (dark mode) |
| `surface-muted` | `#0F1F18` | Superficie sutil (dark mode) |
| `surface-elevated` | `#1A2E25` | Cards elevadas (dark mode) |

---

# 3. TOKENS SEMÁNTICOS

## 3.1 Mapeo completo

| Token semántico | Valor (light) | Valor (dark) | Uso |
|---|---|---|---|
| `color-primary` | `bienestar-950` (#0E5C53) | `bienestar-400` (#34D399) | Hero, Header, Footer, identidad |
| `color-primary-hover` | `bienestar-800` (#065F46) | `bienestar-300` (#6EE7B7) | Hover de botones primarios |
| `color-primary-active` | `bienestar-900` (#064E3B) | `bienestar-200` (#A7F3D0) | Active/press |
| `color-accent` | `bienestar-500` (#10B981) | `bienestar-500` (#10B981) | CTAs, links, badges, iconos activos |
| `color-accent-hover` | `bienestar-600` (#059669) | `bienestar-400` (#34D399) | Hover de links |
| `color-success` | `#10B981` | `#34D399` | Badges success, íconos check |
| `color-warning` | `#F59E0B` | `#FBBF24` | Badges warning |
| `color-danger` | `#EF4444` | `#F87171` | Botones destructivos, errores |
| `color-info` | `#3B82F6` | `#60A5FA` | Badges info |
| `color-background` | `neutral-50` (#FAFAFA) | `neutral-950` (#09090B) | Fondo de página |
| `color-surface` | `#FFFFFF` | `surface-dark` (#0A1410) | Cards, modals |
| `color-surface-elevated` | `#FFFFFF` | `surface-elevated` (#1A2E25) | Cards elevadas |
| `color-surface-muted` | `neutral-100` (#F4F4F5) | `surface-muted` (#0F1F18) | Fondos secundarios |
| `color-border` | `neutral-200` (#E4E4E7) | `neutral-800` (#27272A) | Bordes de cards/inputs |
| `color-divider` | `neutral-100` (#F4F4F5) | `neutral-800` (#27272A) | Separadores |
| `color-text-primary` | `neutral-900` (#18181B) | `#FAFAFA` | Títulos, cuerpo principal |
| `color-text-secondary` | `neutral-500` (#71717A) | `neutral-400` (#A1A1AA) | Subtítulos, metadata |
| `color-text-muted` | `neutral-400` (#A1A1AA) | `neutral-500` (#71717A) | Placeholders, texto inactivo |
| `color-text-on-primary` | `#FFFFFF` | `neutral-950` (#09090B) | Texto sobre fondo primario |
| `color-icon-primary` | `neutral-700` (#3F3F46) | `neutral-300` (#D4D4D8) | Íconos principales |
| `color-icon-secondary` | `neutral-400` (#A1A1AA) | `neutral-500` (#71717A) | Íconos secundarios |
| `color-shadow-soft` | `rgba(14,92,83,0.06)` | `rgba(0,0,0,0.3)` | Sombra sutil |
| `color-shadow-medium` | `rgba(14,92,83,0.12)` | `rgba(0,0,0,0.4)` | Sombra media |
| `color-shadow-strong` | `rgba(14,92,83,0.20)` | `rgba(0,0,0,0.5)` | Sombra fuerte |

### ⚠️ Regla de oro

**NUNCA usar valores hex directamente en componentes.** Siempre usar:
1. Clases Tailwind semánticas (`bg-primary`, `text-muted-foreground`)
2. Tokens CSS (`var(--primary)`)
3. Tokens del tema (`colors.bienestar[950]`)

---

# 4. TIPOGRAFÍA

## 4.1 Familia tipográfica

| Rol | Fuente | Peso |
|---|---|---|
| **Títulos (serif)** | Cormorant Garamond, Playfair Display, Georgia | 700 (Bold) |
| **Cuerpo (sans)** | Inter, SF Pro Display, Manrope, system-ui | 400, 500, 600 |

### ¿Por qué serif para títulos?

La serif transmite tradición, ciencia, editorial. El sans-serif transmite modernidad, claridad. La combinación de ambas crea la tensión justa: **ciencia con alma**.

## 4.2 Escala tipográfica

| Token | Tamaño | Line-height | Uso |
|---|---|---|---|
| `text-xxs` | 0.625rem (10px) | 1rem (16px) | Badges pequeños, overline |
| `text-xs` | 0.75rem (12px) | 1rem (16px) | Captions, metadata |
| `text-sm` | 0.875rem (14px) | 1.25rem (20px) | Cuerpo secundario, listas |
| `text-base` | 1rem (16px) | 1.5rem (24px) | Cuerpo principal |
| `text-lg` | 1.125rem (18px) | 1.75rem (28px) | Subtítulos |
| `text-xl` | 1.25rem (20px) | 1.75rem (28px) | Títulos de sección |
| `text-2xl` | 1.5rem (24px) | 2rem (32px) | Títulos de página |
| `text-3xl` | 1.875rem (30px) | 2.25rem (36px) | Títulos Hero (mobile) |
| `text-4xl` | 2.25rem (36px) | 2.5rem (40px) | Títulos Hero (desktop) |
| `text-5xl` | 3rem (48px) | 1.1 | Hero principal |

## 4.3 Jerarquía

```
H1 → Cormorant Garamond, 3rem/48px, 700, tracking-tight
  └── Usar UNA sola vez por página (Hero)

H2 → Inter, 1.5rem/24px, 700
  └── Títulos de sección

H3 → Inter, 1.25rem/20px, 600
  └── Subtítulos dentro de secciones

Body → Inter, 1rem/16px, 400, leading-relaxed
  └── Texto principal

Caption → Inter, 0.75rem/12px, 400, text-secondary
  └── Metadata, fechas, autores
```

---

# 5. ESPACIADO

## 5.1 Escala oficial (basada en 4px)

| Token | Valor | Uso |
|---|---|---|
| `space-0` | 0px | Sin espacio |
| `space-1` | 4px | Ícono + texto, gaps mínimos |
| `space-2` | 8px | Elementos relacionados |
| `space-3` | 12px | Padding interno de cards |
| `space-4` | 16px | Padding de cards |
| `space-5` | 20px | Separación entre cards |
| `space-6` | 24px | Padding de secciones |
| `space-8` | 32px | Separación entre secciones |
| `space-10` | 40px | Márgenes de página (mobile) |
| `space-12` | 48px | Márgenes de página (desktop) |
| `space-16` | 64px | Separación Hero → contenido |
| `space-20` | 80px | Separación máxima |

## 5.2 Container

```
max-w-5xl (1024px) → Contenido de lectura (artículos)
max-w-6xl (1152px) → Contenido general
max-w-7xl (1280px) → Catálogo de productos
```

---

# 6. SOMBRAS Y ELEVACIÓN

## 6.1 Escala oficial

| Token | Valor | Uso |
|---|---|---|
| **Elevation 1** | `0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.08)` | Cards planas, inputs |
| **Elevation 2** | `0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.08)` | Cards con hover |
| **Elevation 3** | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.08)` | Dropdowns, popovers |
| **Elevation 4** | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.08)` | Modals, dialogs |
| **Elevation 5** | `0 25px 50px -12px rgba(0,0,0,0.25)` | Toasts, tooltips |
| **Premium Soft** | `0 12px 30px -10px rgba(14,92,83,0.3)` | Sombra verde distintiva (Hero, cards destacadas) |
| **Premium Hover** | `0 8px 32px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)` | Hover de cards interactivas |

### Regla de uso

- **Premium Soft** solo se usa en elementos que tocan el color primario (Hero, Footer, Cards de producto destacadas).
- El resto de la UI usa **Elevation 1-5** según jerarquía.
- En dark mode, las sombras se oscurecen (opacidad 2x) porque no hay luz ambiental.

---

# 7. RADIOS DE BORDE

| Token | Valor | Uso |
|---|---|---|
| `radius-xs` | 4px | Inputs, badges pequeños |
| `radius-sm` | 6px | Botones pequeños, chips |
| `radius-md` | 8px | Botones, cards internas |
| `radius-lg` | 12px | Cards, modals |
| `radius-xl` | 16px | Cards grandes, sheet bottoms |
| `radius-2xl` | 20px | Hero containers |
| `radius-3xl` | 28px | Secciones premium |
| `radius-full` | 9999px | Pills, avatars, badges redondos |

### Regla de consistencia

- **Botones:** `radius-lg` (12px). Todos los botones. Sin excepción.
- **Cards:** `radius-xl` (16px) borde exterior, `radius-md` (8px) imágenes internas.
- **Inputs:** `radius-xs` (4px) o `radius-full` (pills).
- **Sheet/Drawer:** `radius-3xl` (28px) en el borde expuesto.

---

# 8. ICONOGRAFÍA

## 8.1 Librerías oficiales

| Librería | Uso |
|---|---|
| **HugeIcons** (`@hugeicons/core-free-icons`) | Navegación, acciones, sidebar |
| **Lucide React** (`lucide-react`) | Iconos utilitarios (search, cart, calendar) |

### Regla: HugeIcons para la UI estructural. Lucide para detalles funcionales.

## 8.2 Estilo

- **Stroke width:** 2 (HugeIcons), 2 (Lucide)
- **Tamaños estándar:** 16px, 20px, 24px, 32px
- **Color:** `icon-primary` por defecto. `icon-secondary` para estados inactivos. `color-accent` para activos.
- **No usar íconos de más de 3 librerías distintas.**

---

# 9. ANIMACIONES Y MICROINTERACCIONES

## 9.1 Principios

1. **Rápido pero suave** — Nadie espera una animación. Esta ya terminó.
2. **Propósito, no decoración** — Cada animación comunica algo (dónde estoy, qué pasó).
3. **Respetar `prefers-reduced-motion`** — Si el usuario no quiere movimiento, no lo forzamos.

## 9.2 Tokens de duración

| Token | Valor | Uso |
|---|---|---|
| `duration-instant` | 100ms | Hover de botones, color changes |
| `duration-fast` | 150ms | Microinteracciones, focus rings |
| `duration-normal` | 200ms | Transiciones de página, drawer |
| `duration-slow` | 300ms | Modals, diálogos |
| `duration-glacial` | 500ms | Splash screen, celebraciones |

## 9.3 Tokens de easing

| Token | Valor | Uso |
|---|---|---|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transiciones estándar |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Entradas (elementos que aparecen) |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Salidas (elementos que desaparecen) |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Microinteracciones con rebote |

## 9.4 Spring physics (Framer Motion)

```js
SPRING_FAST   = { type: 'spring', stiffness: 400, damping: 30 }  // Botones, toggles
SPRING_NORMAL = { type: 'spring', stiffness: 350, damping: 25 }  // Cards, listas
SPRING_SLOW   = { type: 'spring', stiffness: 200, damping: 20 }  // Modals, drawers
SPRING_BOUNCE = { type: 'spring', stiffness: 500, damping: 15 }  // Notificaciones
```

---

# 10. REGLAS POR COMPONENTE

## 10.1 Hero

```
Fondo:     bg-gradient-to-br from-color-primary to-bienestar-800
Texto:     text-white
Título:    Cormorant Garamond, 700, tracking-tight
Overlay:   Color primario + blur decorativo (emerald-400/15)
Curva:     SVG wave en la parte inferior (white fill)
Padding:   pt-[env(safe-area-inset-top)] pb-24 px-4 md:px-8
```

## 10.2 Header (Desktop y Mobile)

```
Fondo:     glassmorphism (bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl)
Borde:     border-b border-neutral-200/50 dark:border-bienestar-800/50
Texto:     neutral-900 dark:text-white
Altura:    py-2 sm:py-3
Sticky:    fixed top-0, se oculta al hacer scroll down
```

### Mobile Header (Hero verde)

```
Fondo:     bg-gradient-to-br from-bienestar-950 to-bienestar-800
Texto:     text-white
Botones:   bg-black/10 rounded-full border border-white/10
```

## 10.3 Sidebar (Drawer móvil)

### Decisión de diseño

**El sidebar debe abandonar completamente la paleta morada/violeta actual.**

**Justificación:**
- El morado no pertenece a la identidad visual de Bienestar en Claro.
- Crea una disonancia: Hero verde → Sidebar morado = dos marcas distintas.
- La paleta morada actual son 15 colores hardcodeados sin tokenizar.

### Propuesta: Sidebar Bienestar

```
Fondo del drawer:        bg-white dark:bg-surface-dark
Overlay:                 bg-black/40 backdrop-blur-[2px]
Botón flotante cierre:   bg-white text-bienestar-950
                          posicionado en el borde derecho del drawer
                          sombra premium-soft (verde)
                          z-[9999] (por encima de todo)
```

**Región Hero del sidebar:**
```
Fondo:     bg-gradient-to-br from-bienestar-950 to-bienestar-800
           con blurs decorativos en bienestar-300/20 y bienestar-400/15
Curva:     SVG wave blanca en la parte inferior
Avatar:    borde blanco 4px, fondo blanco
```

**Ítems de navegación:**
```
Inactivo:   text-neutral-800 hover:bg-bienestar-50
Activo:     bg-gradient-to-r from-bienestar-100 to-bienestar-50
            text-bienestar-950 font-semibold
Ícono:      text-neutral-600 (inactivo) → text-bienestar-700 (activo)
Divider:    border-t border-neutral-100
```

**Footer del sidebar:**
```
Fondo:     bg-white
Borde:     border-t border-neutral-200
Botones:   text-neutral-800 hover:bg-bienestar-50 rounded-2xl
```

### ¿Debe mantener el botón flotante blanco?

**Sí.** El botón flotante blanco sobre el borde derecho del drawer es un excelente patrón de UX: contrasta con el drawer, es fácil de ver, invita a tocarlo. Lo único que cambia es el color del ícono: de morado (`#6D28D9`) a verde primario (`bienestar-950`).

---

## 10.4 Bottom Navigation (Mobile)

```
Fondo:     bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl
Borde:     border-t border-neutral-200/50 dark:border-bienestar-800/50
Ícono inactivo:   text-neutral-400 dark:text-neutral-500
Ícono activo:     text-bienestar-600 dark:text-bienestar-400
Indicador activo: bg-bienestar-50 dark:bg-bienestar-900/30 rounded-2xl
Texto:            text-xxs font-medium
Altura:           h-[68px] + padding-bottom: env(safe-area-inset-bottom)
```

---

## 10.5 Cards

```
Fondo:              bg-white dark:bg-surface-dark
Borde:              border border-neutral-200 dark:border-neutral-800
Sombra:             shadow-elevation-1
Hover:              shadow-premium-hover border-bienestar-500/50
Radio:              rounded-xl (16px)
Imagen interna:     rounded-md (8px)
Padding:            p-5
```

### Cards de producto (variante premium)

```
Fondo:    bg-white dark:bg-surface-dark
Sombra:   shadow-premium-soft
Borde:    border-bienestar-100/50 dark:border-bienestar-800/30
```

---

## 10.6 Botones

### Variantes oficiales

| Variante | Clases | Uso |
|---|---|---|
| **Primary** | `bg-bienestar-950 text-white hover:bg-bienestar-800 active:bg-bienestar-900 shadow-premium-soft` | Acción principal, CTAs |
| **Secondary** | `bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white` | Acción secundaria |
| **Ghost** | `bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800` | Navegación, breadcrumbs |
| **Outline** | `border border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700` | Acciones terciarias |
| **Success** | `bg-success text-white hover:bg-emerald-600` | Confirmar, guardar |
| **Danger** | `bg-danger text-white hover:bg-red-600` | Eliminar, cancelar |
| **WhatsApp** | `bg-whatsapp text-white hover:bg-[#1fb85a]` | Contacto WhatsApp |

### Reglas

- **Radio fijo:** `rounded-xl` (12px) para TODOS los botones
- **Padding:** `px-5 py-2.5` mínimo (44px altura para accesibilidad táctil)
- **Tipografía:** `text-sm font-semibold`
- **Focus:** `ring-2 ring-bienestar-500/40 ring-offset-2`
- **Disabled:** `opacity-50 pointer-events-none`

---

## 10.7 Inputs

```
Fondo:              bg-white dark:bg-neutral-900
Borde:              border border-neutral-300 dark:border-neutral-700
Focus:              ring-2 ring-bienestar-500/30 border-bienestar-500
Placeholder:        text-neutral-400
Disabled:           bg-neutral-100 opacity-60
Error:              border-danger ring-danger/30
Radio:              rounded-full (pills) o rounded-xs (4px)
Padding:            px-4 py-2.5
Tipografía:         text-sm
Altura mínima:      44px (accesibilidad táctil)
```

---

## 10.8 Badges

| Variante | Clases |
|---|---|
| **Success** | `bg-bienestar-100 text-bienestar-800 border-bienestar-200` |
| **Warning** | `bg-amber-100 text-amber-800 border-amber-200` |
| **Info** | `bg-blue-100 text-blue-800 border-blue-200` |
| **Neutral** | `bg-neutral-100 text-neutral-700 border-neutral-200` |
| **Danger** | `bg-red-100 text-red-800 border-red-200` |

### Reglas

- **Radio:** `rounded-full` (pill)
- **Padding:** `px-2.5 py-0.5`
- **Tipografía:** `text-xs font-medium`

---

# 11. Z-INDEX — JERARQUÍA OFICIAL

| Capa | Token | Valor | Componentes |
|---|---|---|---|
| Base | `z-base` | 0 | Contenido principal |
| Contenido | `z-content` | 10 | Páginas, secciones |
| Sticky | `z-sticky` | 20 | Elementos con position: sticky |
| Header | `z-header` | 30 | Barra de navegación superior |
| Bottom Nav | `z-nav` | 40 | Navegación inferior móvil |
| Floating | `z-floating` | 45 | Botones flotantes (FalconBot, WhatsApp) |
| Backdrop | `z-backdrop` | 50 | Overlay del drawer, fondos de modal |
| Modal | `z-modal` | 60 | Drawer, modals, diálogos |
| Dropdown | `z-dropdown` | 70 | Menús desplegables |
| Toast | `z-toast` | 80 | Notificaciones toast |
| Botón cierre | `z-close` | 9999 | Botón flotante del drawer |

---

# 12. RESPONSIVE — REGLAS OFICIALES

## 12.1 Breakpoints

| Token | Min-width | Dispositivo |
|---|---|---|
| `xs` | 0px | Móvil (por defecto) |
| `sm` | 640px | Móvil grande |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop pequeño |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop grande |

## 12.2 Mobile First

**Todo se diseña para móvil primero.** El breakpoint `md` (768px) activa la vista desktop.

### Reglas específicas

```
Mobile (<768px):
  - Sidebar drawer (full-screen, slide from left)
  - Bottom navigation (fixed, 68px)
  - Hero con padding reducido (px-4)
  - Cards en 1 columna
  - Tipografía más pequeña (max 2xl)
  - Touch targets mínimos 44px

Tablet (768px - 1023px):
  - Header desktop (horizontal nav)
  - Sin bottom navigation
  - Cards en 2 columnas
  - Sidebar NO disponible (usar header nav)

Desktop (≥1024px):
  - Cards en 3-4 columnas
  - Tipografía completa (hasta 5xl)
  - Espaciado generoso (px-8, py-12)
  - Sidebar NO disponible
```

---

# 13. ACCESIBILIDAD

## 13.1 Contraste mínimo

| Elemento | Ratio requerido | Cumple con bienestar-950 |
|---|---|---|
| Texto normal (<18px) | 4.5:1 | ✅ 7.8:1 sobre blanco |
| Texto grande (≥18px) | 3:1 | ✅ 7.8:1 sobre blanco |
| Íconos, bordes | 3:1 | ✅ |

## 13.2 Focus visibles

- **Siempre** visible: `ring-2 ring-bienestar-500/40 ring-offset-2`
- **Nunca** usar `outline-none` sin un focus ring alternativo

## 13.3 Prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 13.4 Touch targets

- Mínimo **44x44px** para cualquier elemento interactivo (WCAG 2.5.5)
- Espaciado entre elementos táctiles: mínimo 8px

---

# 14. REGLAS PARA FUTUROS DESARROLLADORES

## 14.1 Checklist antes de escribir CSS

```
☐ ¿Mi color está en la paleta oficial? (Sección 2)
☐ ¿Estoy usando un token semántico, no un hex? (Sección 3)
☐ ¿Mi tipografía respeta la escala? (Sección 4)
☐ ¿Mi espaciado usa la escala de 4px? (Sección 5)
☐ ¿Mi sombra usa un token de elevación? (Sección 6)
☐ ¿Mi radio de borde es consistente? (Sección 7)
☐ ¿Mis íconos son de HugeIcons o Lucide? (Sección 8)
☐ ¿Mis animaciones respetan reduced-motion? (Sección 9)
☐ ¿Mi componente sigue las reglas de su tipo? (Sección 10)
☐ ¿Mi z-index usa la jerarquía oficial? (Sección 11)
```

## 14.2 Lo que NUNCA se debe hacer

```
❌ Usar un hex directamente (#0E5C53 en vez de bg-primary)
❌ Inventar un verde nuevo (bg-[#1a7a6b])
❌ Usar opacity para "aclarar" un color (bg-primary/50 → usar bienestar-500)
❌ Sombras con valores arbitrarios (shadow-[0_4px_20px_rgba(...)])
❌ Radios inconsistentes (rounded-[14px] en vez de rounded-xl)
❌ Íconos de una tercera librería
❌ Animaciones de más de 300ms sin justificación
❌ z-index arbitrarios (z-[123] → usar z-dropdown, z-modal, etc.)
```

## 14.3 Cómo agregar un color nuevo

1. ¿Existe ya en la paleta? → Usarlo.
2. ¿Es un nuevo tono de verde? → Agregarlo a la escala `bienestar-*` en `tailwind.config.js`.
3. ¿Es un color semántico nuevo? → Definirlo en `src/design-system/tokens/semantic.ts`.
4. Documentarlo en ESTE archivo.

---

# 15. IMPLEMENTACIÓN TÉCNICA (Referencia)

Cuando se implemente este Design System, la estructura de archivos será:

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts              ← Escala bienestar + zinc + semánticos
│   │   ├── typography.ts          ← Fuentes, tamaños, pesos
│   │   ├── spacing.ts             ← Escala 4px
│   │   ├── shadows.ts             ← Elevation 1-5 + Premium
│   │   ├── radius.ts              ← xs → full
│   │   └── z-index.ts             ← base → close
│   ├── theme/
│   │   ├── ThemeProvider.tsx       ← Context de tema
│   │   ├── useTheme.ts            ← Hook useTheme()
│   │   └── theme.config.ts        ← Light/Dark config
│   └── presets/
│       ├── bienestar-light.ts     ← Tema claro
│       └── bienestar-dark.ts      ← Tema oscuro
├── index.css                       ← Solo @tailwind + imports de tokens
└── tailwind.config.js              ← Extendido con bienestar-*, elevation-*, z-*
```

---

*Design System oficial de Bienestar en Claro. Versión 1.0.0.*  
*Cualquier duda sobre cómo debe verse la aplicación debe responderse con este documento.*  
*Última actualización: 2026-07-24.*