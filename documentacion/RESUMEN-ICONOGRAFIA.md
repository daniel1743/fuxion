# Resumen de Cambios en Iconografía

> **Fecha:** 7 de agosto 2026
> **Propósito:** Documentar el estado actual de la iconografía, qué se cambió, qué se unificó y qué quedó pendiente.

---

## 1. Estado Actual: 3 Familias de Iconos Conviviendo

| Librería | Estado | Uso |
|----------|--------|-----|
| **lucide-react** v0.292.0 | ✅ Dominante (~95%) | ~60 componentes en todo el proyecto |
| **@hugeicons/react** + **@hugeicons/core-free-icons** | ⚠️ Solo en Header | 7 iconos en el sidebar drawer del Header |
| **BrandIcons.jsx** (SVG manual) | ⚠️ Híbrido | AiRobotIcon + WhatsAppIcon en múltiples componentes |

---

## 2. Intentos de Migración Fallidos

### ❌ Migración lucide-react → @hugeicons/react (REVERTIDA)

- **Objetivo:** Reemplazar TODA la iconografía de `lucide-react` por `@hugeicons/react` para unificar hacia un estilo premium 2026.
- **Resultado:** `@hugeicons/react` v1.1.9 solo exporta el componente genérico `HugeiconsIcon`, NO exporta componentes individuales (`Search01Icon`, `HeartIcon`, etc.).
- **Archivos modificados:** 57 archivos (todos revertidos vía `git checkout -- src/`).
- **Estado final:** ✅ Build exitoso con `lucide-react` (migración revertida por completo).

> **Lección aprendida:** La arquitectura de `@hugeicons/react` no es compatible con el patrón de importación nombrada que usa el proyecto.

---

## 3. Cambios SÍ Implementados (Unificación Parcial)

### ✅ Footer — Sección Ayuda unificada con iconos Lucide

- **Problema original:** La columna **TIENDA** tenía iconos Lucide, la columna **AYUDA** solo texto plano.
- **Solución:** Se agregaron 4 iconos Lucide a los enlaces de Ayuda:
  - `HelpCircle` → Centro de ayuda
  - `MessageCircle` → Contacto
  - `Truck` → Envíos y Devoluciones
  - `MessagesSquare` → FAQ
- **Estilo:** Mismo tamaño (15x15), color (`text-muted-foreground/60`), hover y transiciones que la columna Tienda.
- **Archivo:** `src/components/Footer.jsx`
- **Estado:** ✅ COMPLETADO

### ✅ Iconos PWA — Transparencia y calidad

- **Problema:** Iconos PWA con fondo negro integrado (16.86% píxeles negros en source).
- **Solución:** Se regeneraron todos los iconos PWA (10 PNGs) con canal alpha real usando `sharp`.
- **Scripts creados:** `scripts/repair-icons.cjs`, `scripts/analyze-icons.cjs`, `scripts/generate-icons.cjs`
- **Archivos eliminados:** 5 iconos `.ico` obsoletos.
- **Estado:** ✅ COMPLETADO

---

## 4. Auditoría de Inconsistencias Detectadas (PENDIENTE)

La auditoría (`ICONOGRAFIA_AUDIT_REPORT.md`) identificó estos problemas **aún no resueltos**:

### 4.1 Header usa HugeIcons + Lucide (Dual)

El `Header.jsx` importa de **ambas** librerías:
- **HugeIcons** (7): `Home11Icon`, `ShoppingBag03Icon`, `WellnessIcon`, `BookOpen02Icon`, `Rocket01Icon`, `CustomerSupportIcon`, `Store04Icon`
- **Lucide** (12+): `ShoppingCart`, `Menu`, `X`, `Leaf`, `ExternalLink`, `Home`, `Package`, `BookOpen`, `Sparkles`, `Instagram`, `MessageCircle`, `ChevronRight`, `HelpCircle`, `User`, `LogOut`

**Problema:** Dependencia adicional innecesaria (`@hugeicons/react` + `@hugeicons/core-free-icons`) para solo 7 iconos.

### 4.2 BrandIcons.jsx — SVG manual fuera del sistema

- **AiRobotIcon:** SVG manual con `strokeWidth="1.8"` (no sigue estándar Lucide)
- **WhatsAppIcon:** SVG fill verde sólido (vs `MessageCircle` outline de Lucide en Header)
- **Uso en:** Header, Footer, HomePage, ExplorePage, ProductPage, CartPage, FalconBot

### 4.3 Redes Sociales Inconsistentes

| Red | Header | Footer |
|-----|--------|--------|
| Instagram | Lucide, 21px, strokeWidth 2.2 | Lucide, 18px, strokeWidth 1.8 |
| Facebook | SVG manual fill, 21px | Lucide, 18px, strokeWidth 1.8 |
| TikTok | SVG manual fill, 21px | ❌ No existe |
| WhatsApp | `MessageCircle` (Lucide outline) | `WhatsAppIcon` (BrandIcons SVG fill) |

### 4.4 strokeWidth Disperso

| Valor | Dónde se usa |
|-------|-------------|
| 1.6 | AiRobotIcon (BrandIcons.jsx) |
| 1.8 | Footer nav, Header nav |
| 2.2 | Header social icons |

### 4.5 ~35+ Emojis Usados como Iconos Funcionales

Emojis como 💚, 🌱, 🚀, ⚠️, ✅, 🛒, 🗑️, ❌, 🎁, ✨, ▶ reemplazan iconos Lucide en:
- FalconBot (~10+ ocurrencias)
- CartPage (~5+)
- HelpCenterPage, ContactPage, OpportunityPage
- AdminPanel, AdminContext
- CartContext (toasts)

---

## 5. Plan de Acción Recomendado (No Implementado)

| Fase | Acción | Impacto |
|------|--------|---------|
| **Fase 1** | Migrar HugeIcons → Lucide en Header (7 iconos) | Eliminar dependencia `@hugeicons/react` |
| **Fase 2** | Reemplazar BrandIcons con Lucide + CSS | Eliminar `BrandIcons.jsx` |
| **Fase 3** | Estandarizar strokeWidth (1.8 nav, 2.0 acciones, 2.0 redes) | Consistencia visual |
| **Fase 4** | Reemplazar ~35+ emojis funcionales por Lucide | Accesibilidad + consistencia |
| **Fase 5** | Unificar redes sociales Header/Footer | Mismos iconos, tamaños y strokeWidth |

---

## 6. Resumen Visual

```
Estado Actual:
┌─────────────────────────────────────────────────────┐
│  lucide-react (95%)  │  @hugeicons (Header)  │  SVG Manual (BrandIcons)  │
│  ✅ Dominante        │  ⚠️ 7 iconos          │  ⚠️ AiRobot + WhatsApp     │
└─────────────────────────────────────────────────────┘

Meta (Auditoría propone):
┌─────────────────────────────────────────┐
│           lucide-react 100%             │
│  ✅ Única librería, strokeWidth unificado │
└─────────────────────────────────────────┘
```

---

## 7. Conclusión

- **NO se logró la unificación completa** de la iconografía.
- El intento de migrar a `@hugeicons/react` **fracasó** por incompatibilidad técnica y fue revertido.
- **Solo se unificó parcialmente** el Footer (sección Ayuda) y se repararon los iconos PWA (transparencia).
- El proyecto sigue con **3 familias de iconos conviviendo**: Lucide (dominante), HugeIcons (Header) y SVG manual (BrandIcons).
- La **auditoría completa** está documentada en `ICONOGRAFIA_AUDIT_REPORT.md` con un plan de 5 fases pendiente de implementación.

---

*Documento generado el 7 de agosto 2026*
