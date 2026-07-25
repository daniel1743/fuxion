# AUDITORÍA COMPLETA DEL SISTEMA DE COLORES Y DESIGN SYSTEM
## Proyecto: Bienestar en Claro / Fuxion

**Fecha:** 2026-07-24  
**Agente:** Codex  
**Modo:** Solo lectura — No se modificó ningún archivo  
**Versión del proyecto:** Vite 4.5 + React 18 + Tailwind CSS 3.3  

---

# 1. RESUMEN EJECUTIVO

## Hallazgo principal

El proyecto **NO tiene un Design System formal**. Lo que existe es un **sistema híbrido de tres capas superpuestas** que evolucionaron orgánicamente sin unificación:

| Capa | Origen | Estado |
|---|---|---|
| **Capa 1: Tailwind CSS semántico** | Configuración inicial con patrón shadcn/ui | Bien definida, usa variables CSS HSL |
| **Capa 2: Colores personalizados Fuxion** | `tailwind.config.js` (`fuxion`, `whatsapp`, `surface`) | Definidos pero no integrados con Capa 1 |
| **Capa 3: Colores hardcodeados** | Crecimiento orgánico en >35 archivos | 300+ ocurrencias sin tokenizar |

### Impacto

- Cambiar el color principal de la aplicación requeriría modificar **más de 35 archivos manualmente**
- El verde del Hero (`#0E5C53` = `fuxion.DEFAULT`) **no es el mismo** que el verde primario de las variables CSS (`151 55% 34%` = `#267A57`)
- El sidebar usa una paleta **morada/violeta** completamente independiente que no existe en ninguna variable
- Coexisten al menos **18 verdes diferentes** dispersos en el código

### Madurez del sistema de diseño: 2/10

Existe buena intención (variables CSS + tokens Tailwind) pero la ejecución está fragmentada en tres sistemas que no conversan entre sí.

---

# 2. ARQUITECTURA ACTUAL

## 2.1 Herramientas y dependencias

| Herramienta | Versión | Rol |
|---|---|---|
| **Tailwind CSS** | ^3.3.3 | Framework utilitario principal |
| **PostCSS** + Autoprefixer | ^8.4.31 | Pipeline de procesamiento CSS |
| **tailwindcss-animate** | ^1.0.7 | Animaciones de acordeón |
| **clsx** + **tailwind-merge** | ^2.0.0 / ^1.14.0 | Merging condicional de clases (patrón shadcn/ui) |
| **class-variance-authority** | ^0.7.0 | Variantes tipadas de componentes |
| **framer-motion** | ^10.16.4 | Animaciones declarativas |
| **Radix UI** | Varias | Primitivas headless (dialog, dropdown, tabs, toast, switch) |
| **Lucide React** | ^0.263.1 | Iconografía |
| **HugeIcons** | @hugeicons/core-free-icons | Iconografía premium |

**No se usan:** styled-components, emotion, CSS Modules, SCSS, Material UI, Chakra UI, Theme UI.

## 2.2 Pipeline de estilos

```
src/index.css
    ↓ @tailwind base/components/utilities
    ↓ @layer base { :root { --variables } }
PostCSS (postcss.config.js)
    ↓ tailwindcss
    ↓ autoprefixer
Vite (vite.config.js)
    ↓ @vitejs/plugin-react
    ↓ resuelve @ alias → src/
```

## 2.3 Estructura de archivos de color

```
📁 Proyecto
├── src/
│   ├── index.css                    ← Variables CSS (:root, .light) + estilos sidebar
│   ├── branding/
│   │   ├── branding.js              ← Logos, nombre del sitio (sin colores)
│   │   ├── manifest.ts              ← Colores PWA (splash, tile_color, theme_color)
│   │   ├── colors.ts                ← PALETA EMERGENTE (no usada por componentes)
│   │   └── constants.ts             ← Colores para OG images y badges
│   ├── lib/
│   │   ├── motionTokens.js          ← Tokens de animación (spring physics)
│   │   ├── confetti.js              ← Colores de confeti hardcodeados
│   │   └── ogImageGenerator.js      ← Colores de OG image hardcodeados
│   ├── components/
│   │   ├── ui/button.jsx            ← Base button con CVA (usa tokens Tailwind)
│   │   ├── ui/card.jsx              ← Base card (mayormente tokens)
│   │   ├── ui/badge.jsx             ← Badge con variant 'success' roto
│   │   ├── ui/PremiumIcon.jsx       ← Iconos premium con fondos de color
│   │   └── ...
│   └── pages/
│       ├── HomePage.jsx             ← Hero principal (verde fuxion)
│       ├── PersonalizedPlanPage.jsx ← Múltiples colores hardcodeados
│       └── ...
├── tailwind.config.js               ← Configuración de colores personalizados
└── package.json                     ← Dependencias de estilo
```

---

# 3. MAPA COMPLETO DEL SISTEMA DE COLORES

## 3.1 Variables CSS oficiales (src/index.css :root)

### Tema oscuro (modo por defecto)

| Variable | Valor HSL | Color | Rol semántico |
|---|---|---|---|
| `--background` | `240 10% 3.9%` | #09090b | Fondo de página |
| `--foreground` | `0 0% 98%` | #fafafa | Texto principal |
| `--card` | `240 10% 3.9%` | #09090b | Fondo de tarjetas |
| `--card-foreground` | `0 0% 98%` | #fafafa | Texto en tarjetas |
| `--popover` | `240 10% 3.9%` | #09090b | Fondo de popovers |
| `--popover-foreground` | `0 0% 98%` | #fafafa | Texto en popovers |
| `--primary` | **`151 55% 34%`** | **#267A57** | **COLOR PRIMARIO (verde esmeralda)** |
| `--primary-foreground` | `0 0% 98%` | #fafafa | Texto sobre primario |
| `--secondary` | `240 3.7% 15.9%` | #27272d | Fondo secundario |
| `--secondary-foreground` | `0 0% 98%` | #fafafa | Texto sobre secundario |
| `--muted` | `240 3.7% 15.9%` | #27272d | Fondo muted |
| `--muted-foreground` | `240 5% 64.9%` | #a1a1aa | Texto muted |
| `--accent` | `240 3.7% 15.9%` | #27272d | Fondo de acento |
| `--accent-foreground` | `0 0% 98%` | #fafafa | Texto sobre acento |
| `--destructive` | `0 62.8% 30.6%` | #7f1d1d | Acción destructiva |
| `--destructive-foreground` | `0 0% 98%` | #fafafa | Texto sobre destructivo |
| `--border` | `240 3.7% 15.9%` | #27272d | Bordes |
| `--input` | `240 3.7% 15.9%` | #27272d | Inputs |
| `--ring` | `151 55% 34%` | #267A57 | Anillo de focus |
| `--radius` | `0.5rem` | — | Radio de borde base |

### Tema claro (.light)

| Variable | Valor HSL | Color | Diferencia con dark |
|---|---|---|---|
| `--background` | `0 0% 100%` | #ffffff | ← |
| `--foreground` | `240 10% 3.9%` | #09090b | ← invertido |
| `--card` | `0 0% 100%` | #ffffff | ← |
| `--secondary` | `240 4.8% 95.9%` | #f4f4f5 | ← más claro |
| `--muted` | `240 4.8% 95.9%` | #f4f4f5 | ← más claro |
| `--muted-foreground` | `240 3.8% 46.1%` | #71717a | ← más oscuro |
| `--accent` | `240 4.8% 95.9%` | #f4f4f5 | ← más claro |
| `--border` | `240 5.9% 90%` | #e4e4e7 | ← más claro |
| `--input` | `240 5.9% 90%` | #e4e4e7 | ← más claro |
| `--ring` | `240 10% 3.9%` | #09090b | ← diferente al dark |

## 3.2 Colores personalizados de Tailwind (tailwind.config.js)

| Token | Valor | Uso principal |
|---|---|---|
| **`fuxion.DEFAULT`** | **`#0E5C53`** | 🌿 **Verde Hero**, Header mobile, gradientes principales |
| `fuxion.light` | `#136a64` | Gradiente más claro del Hero |
| `whatsapp.DEFAULT` | `#25D366` | Botón de WhatsApp |
| `whatsapp.hover` | `#1fb85a` | Hover del botón |
| `whatsapp.bg` | `#F1FDF8` | Fondo de chat WhatsApp |
| `surface.dark` | `#0a1410` | Fondo oscuro alternativo |
| `surface.muted` | `#0f1f18` | Superficie muted oscura |
| `surface.elevated` | `#1a2e25` | Superficie elevada oscura |

### ⚠️ Conflicto de verdes

| Origen | Valor | Dónde se usa |
|---|---|---|
| `--primary` (CSS var) | `151 55% 34%` → **#267A57** | Componentes shadcn/ui (botones, badges, inputs) |
| `fuxion.DEFAULT` (Tailwind) | **#0E5C53** | Hero, Header mobile, gradientes de página |
| `emerald-*` (Tailwind nativo) | Escala estándar | Badges, hover states, enlaces |

**Son dos verdes distintos** compitiendo como "color principal":
- `#267A57` → más claro, verde esmeralda medio (usado en el sistema de componentes)
- `#0E5C53` → más oscuro, verde petróleo/bosque (usado en Hero y branding)

## 3.3 Sistema de sombras y elevación (tailwind.config.js)

| Token | Valor | Uso |
|---|---|---|
| `elevation-1` | `0 1px 3px 0 rgba(0,0,0,0.08)` | Elevación mínima |
| `elevation-2` | `0 4px 6px -1px rgba(0,0,0,0.08)` | Elevación baja |
| `elevation-3` | `0 10px 15px -3px rgba(0,0,0,0.08)` | Elevación media |
| `elevation-4` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Elevación alta |
| `elevation-5` | `0 25px 50px -12px rgba(0,0,0,0.25)` | Elevación máxima |
| `premium-soft` | `0 12px 30px -10px rgba(14,92,83,0.3)` | **Sombra verde Fuxion** |
| `premium-hover` | `0 8px 32px -4px rgba(0,0,0,0.12)` | Hover cards |
| `premium-dark` | `0 8px 32px -4px rgba(0,0,0,0.4)` | Modo oscuro |

## 3.4 Jerarquía de z-index (tailwind.config.js)

| Token | Valor | Uso en la app |
|---|---|---|
| `z-hide` | -1 | Elementos ocultos detrás |
| `z-base` | 0 | Contenido base |
| `z-content` | 10 | Contenido de página |
| `z-sticky` | 20 | Elementos sticky |
| `z-header` | 30 | Header |
| `z-nav` | 40 | Navegación inferior |
| `z-floating` | 45 | Botones flotantes |
| `z-backdrop` | 50 | Overlay/backdrop |
| `z-modal` | 60 | Drawer/Modal |
| `z-dropdown` | 70 | Dropdowns |
| `z-toast` | 80 | Toasts |
| `z-max` | 9999 | Override máximo |

---

# 4. COLORES HARDCODEADOS ENCONTRADOS

## 4.1 Resumen cuantitativo

| Tipo | Ocurrencias totales | Archivos afectados |
|---|---|---|
| **Hex (#)** | ~250+ | ~30 archivos |
| **rgb() / rgba()** | ~35+ | ~15 archivos |
| **hsl() / hsla()** | ~8 | 2 archivos (branding y confeti) |

**Total estimado: 300+ ocurrencias de colores sin tokenizar.**

## 4.2 Top 10 colores hex más repetidos

| Hex | Conteo | Tailwind equivalente | Uso principal |
|---|---|---|---|
| **`#10b981`** | ~18 | emerald-500 | Branding, confeti, OG images, splash |
| **`#0E5C53`** | ~15 | fuxion | Hero, Header mobile, gradientes (definido como token pero repetido hardcoded en múltiples lugares) |
| **`#ffffff`** | ~15 | white | Fondos, textos, iconos |
| **`#18181B`** | ~10 | zinc-900 | Textos del sidebar, badges |
| **`#71717A`** | ~10 | zinc-500 | Textos muted del sidebar |
| **`#F4E8FF`** | ~8 | — | Gradiente activo sidebar (morado claro) |
| **`#6D28D9`** | ~8 | violet-700 | Texto e iconos sidebar activo |
| **`#D8B4FE`** | ~6 | violet-300 | Brillo morado sidebar |
| **`#F0ABFC`** | ~6 | fuchsia-300 | Brillo rosa sidebar |
| **`#A78BFA`** | ~6 | violet-400 | Brillo morado inferior sidebar |

## 4.3 TOP 5 Archivos con más colores hardcodeados

| Archivo | Ocurrencias ~ | Colores principales |
|---|---|---|
| `src/index.css` | ~30 | Sidebar premium: morados, blancos, zinc, sombras |
| `src/components/Header.jsx` | ~20 | Morados sidebar, zinc textos, violet activos |
| `src/pages/HomePage.jsx` | ~15 | Verdes, emerald, blancos |
| `src/components/FalconBot.jsx` | ~12 | Emerald, slate, white |
| `src/lib/confetti.js` | ~10 | Colores vibrantes para animación |

## 4.4 Colores del sidebar (Header.jsx + index.css)

El sidebar usa una paleta **morada/violeta independiente** que no existe en ninguna variable CSS ni en tailwind.config.js:

| Hex | Uso | Dónde |
|---|---|---|
| `#D8B4FE` (35% opacity) | Brillo superior izquierdo | Header.jsx:370 |
| `#F0ABFC` (25% opacity) | Brillo derecho | Header.jsx:371 |
| `#A78BFA` (30% opacity) | Brillo inferior | Header.jsx:372 |
| `#18181B` | Texto principal del sidebar | Header.jsx:365, 431, 440 |
| `#71717A` | Texto secundario | Header.jsx:435, 444 |
| `#27272A` | Texto de ítems inactivos | Header.jsx:474 |
| `#52525B` | Iconos de ítems | Header.jsx:477 |
| `#6D28D9` | Texto/íconos activos | Header.jsx:421, 473 |
| `#7C3AED` | Hover de iconos | Header.jsx:478 |
| `#3F3F46` | WhatsApp button text | Header.jsx:503 |
| `#F4E8FF` → `#E9D5FF` | Gradiente ítem activo | Header.jsx:469 |
| `#ffffff` | Fondo drawer y botón cierre | Header.jsx:365, 411, 421 |
| `black/[.08]` | Divider del sidebar | Header.jsx:459, 500 |
| `black/10` | Borde footer session | Header.jsx:517 |
| `#ffffff` | Texto botón cierre | index.css (premium-drawer-close) |

### Esta paleta de 15 colores morados/rosados NO está documentada en ninguna parte.

## 4.5 Verdes duplicados

| Valor | Cuenta | Sistema |
|---|---|---|
| `#0E5C53` (fuxion) | ~15 | Hero, header mobile, gradientes |
| `#10b981` (emerald-500) | ~18 | Branding, confeti, splash, badges |
| `#059669` (emerald-600) | ~10 | Hover states, botones |
| `#047857` (emerald-700) | ~6 | Textos activos |
| `#064e3b` (emerald-900) | ~4 | Textos en print, dark mode |
| `#267A57` (primary CSS) | ~8 | Componentes shadcn (vía var) |
| `#25D366` (whatsapp) | ~4 | Botón WhatsApp |
| `#34d399` (emerald-400) | ~3 | Estados activos |

---

# 5. EVALUACIÓN DE IDENTIDAD VISUAL

## 5.1 Por componente

| Componente/Zona | Sistema de color | Consistencia | Nota |
|---|---|---|---|
| **Hero (HomePage)** | `bg-gradient-to-br from-fuxion to-fuxion-light` | ✅ Consistente | Usa tokens Fuxion. Bien definido. |
| **Header mobile** | Mismo gradiente Fuxion | ✅ Consistente | Mismo sistema que Hero. |
| **Sidebar drawer** | Paleta morada hardcodeada | ❌ Desconectado | No usa ningún token del sistema. Otro universo visual. |
| **Productos / Cards** | `bg-card`, `border-border`, `text-card-foreground` | ✅ Consistente | Usa variables CSS del tema. |
| **Botones (Button)** | CVA con `bg-fuxion`, `bg-destructive`, `bg-secondary` | ✅ Bueno | Ejemplar: usa tokens semánticos. |
| **Badges** | `bg-primary`, `bg-secondary`, pero variant `success` usa `green-500` | ⚠️ Parcial | El variant `success` rompe con el sistema. |
| **Footer** | `bg-fuxion`, `text-white`, `border-emerald-600/30` | ✅ Consistente | Usa tokens. |
| **FalconBot (chat)** | Emerald, slate, white hardcodeados | ⚠️ Parcial | Mezcla tokens con hardcodeados. |
| **BottomNav mobile** | `bg-white/90`, `text-emerald-*`, `dark:bg-surface-dark/90` | ✅ Consistente | Usa tokens y dark mode. |
| **WellnessReportPDF** | Múltiples hex hardcodeados | ❌ Desconectado | Sin tokens, sin variables. |
| **Confeti** | Hex vibrantes hardcodeados | ✅ Aceptable | Es animación decorativa. |
| **Splash screen** | `#10b981` hardcodeado | ⚠️ Parcial | Debería usar `fuxion` o `primary`. |

## 5.2 Veredicto de identidad visual

**La aplicación NO transmite una identidad visual consistente.** Existen al menos tres "personalidades" visuales compitiendo:

1. **Personalidad Fuxion** (verde petróleo `#0E5C53`) → Hero, Header, Footer
2. **Personalidad Premium Morada** (violetas `#6D28D9`, `#D8B4FE`) → Sidebar drawer
3. **Personalidad Genérica Shadcn** (emerald `#267A57`) → Componentes base

Un usuario que ve el Hero (verde oscuro) y abre el sidebar (morado brillante) percibe dos marcas distintas.

---

# 6. EVALUACIÓN DE MADUREZ DEL DESIGN SYSTEM

## ¿Existe un Design System?

**No.** Lo que existe es un conjunto de herramientas bien elegidas (Tailwind + CVA + Radix) usadas sin una arquitectura unificada.

### Lo que SÍ tiene el proyecto (fortalezas)

| Elemento | Estado |
|---|---|
| Variables CSS para tema claro/oscuro | ✅ Bien definidas en `:root` y `.light` |
| Sistema de elevación (sombras) | ✅ 5 niveles + variantes premium |
| Escala de z-index | ✅ 12 niveles semánticos |
| Componentes base tipados (CVA) | ✅ Button, Card, Badge, Input |
| Primitivas headless (Radix) | ✅ Dialog, Dropdown, Tabs, Toast |
| Utilidades de merging (clsx + tailwind-merge) | ✅ Evitan conflictos de clases |
| Configuración de marca (branding.js) | ✅ Logos y nombre centralizados |
| Tokens de animación (motionTokens.js) | ✅ Spring physics consistentes |

### Lo que NO tiene (debilidades)

| Elemento | Impacto |
|---|---|
| **Paleta de colores unificada** | 🔴 Crítico. Dos verdes compiten como primario. |
| **Tokens de color semánticos** | 🔴 Crítico. `fuxion` y `primary` no son el mismo color. |
| **Documentación de colores** | 🔴 No existe. El sidebar morado no está documentado. |
| **ThemeProvider global** | 🟡 No existe. Dark mode se maneja con clase `.light`. |
| **Estandarización de sidebar** | 🔴 El sidebar es un universo visual independiente. |
| **Guía de contribución visual** | 🔴 No existe. Cada página decide sus colores. |
| **Tests de regresión visual** | 🔴 No existen. |

---

# 7. EVALUACIÓN DE ESCALABILIDAD

## ¿Qué tan fácil sería cambiar el color principal?

**Respuesta: Muy difícil.** Requeriría modificar 300+ ocurrencias en 35+ archivos porque:

1. Los componentes base usan `--primary` (CSS var) → **se puede cambiar en 1 línea**
2. El Hero usa `bg-fuxion` (Tailwind token) → **se puede cambiar en 1 línea**
3. Los colores hardcodeados (#hex) → **requieren búsqueda y reemplazo manual en 35+ archivos**
4. El sidebar morado → **requiere rediseño completo de 15+ valores**
5. Los archivos JS (confeti, OG images) → **lógica de negocio mezclada con colores**

**Escalabilidad actual: 3/10** — Cambiar el color primario de forma segura sin romper nada es un proyecto de varias semanas.

---

# 8. RIESGOS DE UNA MIGRACIÓN

| Riesgo | Severidad | Descripción |
|---|---|---|
| **Regresiones visuales masivas** | 🔴 Crítico | Sin tests de regresión visual, cualquier cambio puede romper páginas enteras. |
| **Inconsistencia sidebar** | 🔴 Crítico | La paleta morada del sidebar es estructuralmente diferente. Migrarla a verde requiere rediseño UX. |
| **Colores en JS (lógica)** | 🟡 Alto | Archivos como `confetti.js` y `ogImageGenerator.js` tienen colores mezclados con lógica. |
| **Dark mode frágil** | 🟡 Alto | El sistema de tema actual depende de la clase `.light`. Una migración podría romper el dark mode. |
| **Componentes de terceros** | 🟡 Medio | Radix UI y framer-motion no se ven afectados, pero sus wrappers podrían. |
| **PDF y reportes** | 🟡 Medio | `WellnessReportPDF.jsx` tiene colores hardcodeados que afectan documentos generados. |
| **Falta de documentación** | 🟡 Medio | Sin documentar el sistema actual, cualquier migración opera a ciegas. |

---

# 9. PROPUESTA DE DESIGN SYSTEM

## 9.1 Arquitectura objetivo

```
src/
├── design-system/                  ← NUEVO: Única fuente de verdad
│   ├── tokens/
│   │   ├── colors.ts              ← Paleta base (50-950)
│   │   ├── semantic.ts            ← Tokens semánticos (primary, surface, text)
│   │   ├── typography.ts          ← Escala tipográfica
│   │   ├── spacing.ts             ← Escala espacial
│   │   ├── shadows.ts             ← Sombras y elevación
│   │   ├── radius.ts              ← Radios de borde
│   │   └── z-index.ts             ← Jerarquía z-index
│   ├── theme/
│   │   ├── ThemeProvider.tsx       ← Proveedor de tema (light/dark)
│   │   ├── useTheme.ts            ← Hook de acceso al tema
│   │   └── theme.config.ts        ← Configuración de temas
│   └── presets/
│       ├── fuxion-green.ts        ← Tema verde Fuxion
│       ├── sidebar-premium.ts     ← Tema sidebar (morado actual)
│       └── wellness-light.ts      ← Tema claro bienestar
├── index.css                       ← Simplificado: solo @tailwind + imports
└── tailwind.config.js              ← Extendido con tokens del DS
```

## 9.2 Paleta unificada propuesta

### Color primario único: `fuxion-green`

```
fuxion-green-50:  #ECFDF5  (emerald-50 equivalent)
fuxion-green-100: #D1FAE5
fuxion-green-200: #A7F3D0
fuxion-green-300: #6EE7B7
fuxion-green-400: #34D399
fuxion-green-500: #10B981  ← Color de acento (CTAs, badges, links)
fuxion-green-600: #059669
fuxion-green-700: #047857
fuxion-green-800: #065F46
fuxion-green-900: #064E3B
fuxion-green-950: #0E5C53  ← Color de identidad (Hero, Header, Footer)
```

### Mapeo semántico

| Token semántico | Valor | Uso |
|---|---|---|
| `color-primary` | `fuxion-green-950` (#0E5C53) | Hero, Header, Footer |
| `color-accent` | `fuxion-green-500` (#10B981) | CTAs, badges, links |
| `color-surface` | white / zinc-900 | Fondos de página |
| `color-surface-elevated` | zinc-50 / zinc-800 | Cards, modals |
| `color-text-primary` | zinc-900 / white | Texto principal |
| `color-text-secondary` | zinc-500 / zinc-400 | Texto muted |
| `color-sidebar-bg` | white (por ahora) | Sidebar (migraría a verde en fase 2) |
| `color-sidebar-accent` | violet-700 → fuxion-green-500 | Sidebar activo (migraría en fase 2) |

---

# 10. PLAN DE MIGRACIÓN POR FASES

## 🔴 Fase 0: Preparación (1 día)

**Objetivo:** Crear red de seguridad antes de tocar nada.

| Tarea | Archivos |
|---|---|
| Instalar y configurar **Chromatic** o **Percy** para tests de regresión visual | `package.json`, CI |
| Capturar screenshots de referencia de TODAS las páginas | — |
| Crear el directorio `src/design-system/tokens/` con archivos vacíos | Nuevos archivos |
| Documentar la paleta actual en `colors.ts` (solo lectura) | `src/design-system/tokens/colors.ts` |
| Crear tests de snapshot de los tokens | `src/design-system/__tests__/` |

**Criterio de éxito:** Podemos detectar cualquier cambio visual en CI.

---

## 🟡 Fase 1: Unificación de verdes (3-5 días)

**Objetivo:** Eliminar los dos verdes competidores. Un solo `--primary`.

| Tarea | Cambio |
|---|---|
| **Paso 1:** Cambiar `--primary` en `:root` de `151 55% 34%` (#267A57) a `171 48% 20%` (#0E5C53) — mismo valor que `fuxion.DEFAULT` | `src/index.css` línea 14 |
| **Paso 2:** Verificar que TODOS los componentes sigan viéndose bien | Regresión visual |
| **Paso 3:** Eliminar el token `fuxion` de Tailwind y mapearlo a `primary` | `tailwind.config.js` |
| **Paso 4:** Reemplazar `emerald-*` → `primary` en componentes base (Button, Badge, Input) | `src/components/ui/` |
| **Paso 5:** Unificar `#10b981` → `primary` en branding, splash, confeti | `src/branding/`, `src/lib/confetti.js` |

**Criterio de éxito:** Un solo verde en toda la app. `bg-primary` funciona en todas partes.

---

## 🟡 Fase 2: Tokenización del sidebar (3-5 días)

**Objetivo:** Llevar los 15 colores hardcodeados del sidebar a tokens reutilizables.

| Tarea | Cambio |
|---|---|
| **Paso 1:** Crear `sidebar-premium.ts` con todos los colores actuales del sidebar | `src/design-system/tokens/sidebar.ts` |
| **Paso 2:** Reemplazar hex hardcodeados en `Header.jsx` por clases Tailwind que apunten a los tokens | `src/components/Header.jsx` |
| **Paso 3:** Extraer estilos `.premium-mobile-drawer` de `index.css` a una hoja separada | `src/styles/sidebar.css` |
| **Paso 4:** Evaluar UX: ¿mantener sidebar morado como "personalidad premium" o migrar a verde? | Decisión de diseño |
| **Paso 5 (opcional):** Si se decide verde, crear variante `sidebar-bienestar` con paleta verde | Nuevo tema |

**Criterio de éxito:** El sidebar se puede cambiar de color modificando 1 archivo de tokens.

---

## 🟢 Fase 3: Eliminación de hardcodeados (5-7 días)

**Objetivo:** Cero colores hardcodeados en el proyecto.

| Tarea | Cambio |
|---|---|
| **Paso 1:** Reemplazar los 300+ hex en 35+ archivos por tokens Tailwind o CSS vars | Todos los archivos JSX/TSX |
| **Paso 2:** Crear tokens semánticos para colores repetidos (success, warning, info) | `src/design-system/tokens/semantic.ts` |
| **Paso 3:** Migrar `WellnessReportPDF.jsx` y `PersonalizedPlanPage.jsx` | Páginas con más hardcodeados |
| **Paso 4:** Extraer colores de `lib/confetti.js` y `lib/ogImageGenerator.js` | Lógica JS |
| **Paso 5:** Activar regla de ESLint `no-hardcoded-colors` (si existe plugin) | `eslint.config.js` |

**Criterio de éxito:** `grep -r "#[0-9A-Fa-f]" src/` retorna 0 resultados.

---

## 🔵 Fase 4: ThemeProvider y dark mode robusto (3-5 días)

**Objetivo:** Sistema de temas profesional con soporte para múltiples esquemas.

| Tarea | Cambio |
|---|---|
| **Paso 1:** Crear `ThemeProvider.tsx` con Context API | `src/design-system/theme/` |
| **Paso 2:** Migrar lógica de `.light` a un estado React controlado | `src/App.jsx` |
| **Paso 3:** Persistir preferencia en localStorage | `useTheme.ts` |
| **Paso 4:** Soporte para `prefers-color-scheme` del sistema | `useTheme.ts` |
| **Paso 5:** Agregar toggle de tema en la UI (sol/luna) | `src/components/ThemeToggle.jsx` |

**Criterio de éxito:** El tema se cambia con un botón y persiste entre recargas.

---

## 🟣 Fase 5: Documentación y gobernanza (2-3 días)

**Objetivo:** Que cualquier dev nuevo entienda el sistema en 10 minutos.

| Tarea | Entregable |
|---|---|
| **Paso 1:** Crear `DESIGN_SYSTEM.md` con guía de uso | Documentación |
| **Paso 2:** Storybook o ladle para catálogo de componentes | `storybook` config |
| **Paso 3:** Guía de contribución: cómo agregar un color nuevo | `CONTRIBUTING.md` |
| **Paso 4:** Checklist de PR: ¿el cambio usa tokens, no hardcodeados? | GitHub PR template |
| **Paso 5:** Publicar paleta en Figma para diseñadores | Figma library |

**Criterio de éxito:** Un desarrollador nuevo puede crear una página con los colores correctos sin preguntar.

---

# 11. RECOMENDACIONES INMEDIATAS (sin migrar aún)

1. **NO agregar más colores hardcodeados.** Cualquier PR nuevo debe usar clases Tailwind o tokens existentes.

2. **Definir YA el verde canónico** — Elegir entre `#0E5C53` (fuxion) o `#267A57` (primary CSS) como EL color de la marca. Este documento recomienda `#0E5C53` por ser el usado en el Hero (lo primero que ve el usuario).

3. **Documentar la paleta del sidebar** — Aunque no se migre aún, dejar por escrito qué colores usa y por qué son morados.

4. **Crear el directorio `src/design-system/tokens/`** — Aunque esté vacío, marca la intención arquitectónica.

5. **Activar tests de regresión visual** — Sin esto, cualquier cambio de color es jugar a la ruleta.

---

# 12. ARCHIVOS DEL PROYECTO RELEVANTES

## Archivos que definen colores (fuentes de verdad parciales)

| Archivo | Rol | Estado |
|---|---|---|
| `src/index.css` | Variables CSS + estilos sidebar | 🟡 Fuente parcial |
| `tailwind.config.js` | Tokens Fuxion, sombras, z-index | 🟡 Fuente parcial |
| `src/branding/branding.js` | Logos y nombre del sitio | ✅ Centralizado |
| `src/branding/manifest.ts` | Colores PWA | 🟡 Repite `#10b981` |
| `src/branding/colors.ts` | Paleta emergente (no usada) | 🔴 Sin uso real |
| `src/branding/constants.ts` | Colores de badges/og | 🟡 Repite colores |

## Archivos con más colores hardcodeados (ordenados por impacto)

| Archivo | Colores ~ | Prioridad de migración |
|---|---|---|
| `src/index.css` | ~30 | 🔴 Fase 2 (sidebar) |
| `src/components/Header.jsx` | ~20 | 🔴 Fase 2 (sidebar) |
| `src/pages/HomePage.jsx` | ~15 | 🟡 Fase 1 (verdes) |
| `src/components/FalconBot.jsx` | ~12 | 🟡 Fase 3 |
| `src/lib/confetti.js` | ~10 | 🟢 Fase 3 |
| `src/pages/PersonalizedPlanPage.jsx` | ~10 | 🟢 Fase 3 |
| `src/components/WellnessReportPDF.jsx` | ~8 | 🟢 Fase 3 |
| `src/lib/ogImageGenerator.js` | ~6 | 🟢 Fase 3 |
| `src/branding/manifest.ts` | ~5 | 🟡 Fase 1 |
| `src/components/BienestarEnClaroSplash.jsx` | ~4 | 🟡 Fase 1 |

---

# 13. CONCLUSIÓN

**El proyecto tiene bases sólidas pero no unificadas.** Tailwind CSS, CVA y Radix UI proporcionan un excelente punto de partida técnico. Las variables CSS en `:root` demuestran intención de tener un sistema. Sin embargo, la falta de:

1. Un solo color primario canónico
2. Tokens semánticos documentados
3. Un ThemeProvider centralizado
4. Gobernanza sobre colores hardcodeados

...convierte lo que podría ser un sistema de diseño ejemplar en una colección fragmentada de estilos que requieren conocimiento tribal para mantener.

**La buena noticia:** Con las 5 fases de migración propuestas (empezando por tests de regresión visual y unificación del verde), el proyecto puede alcanzar un nivel de madurez 8/10 en aproximadamente 3-4 semanas de trabajo.

**La mala noticia:** Cada día que pasa sin tokenizar, se agregan más colores hardcodeados que harán la migración más costosa.

---

*Auditoría completada en modo solo lectura. Cero archivos modificados.*  
*Próximo paso recomendado: Fase 0 — Configurar tests de regresión visual.*