# PROJECT_APEX_IMPLEMENTATION_MASTER_PLAN.md

## Plan Maestro de Arquitectura de Implementación Enterprise (PROJECT APEX - FASE 04)
**Versión:** 2.0 (Estructura de 15 Fases Secuenciales)  
**Proyecto:** FuXion / Daniel Falcón E-commerce & PWA  
**Fase:** 04_IMPLEMENTATION_ARCHITECTURE  
**Metodología de Gobierno:** Aprobación Hito a Hito (Fase por Fase con Sign-Off del Usuario).  
**Base de Entrada:** `UI_MASTER_BIBLE_2026.md` y `Biblia Mobile Premium 2026`.

---

# 1. Modelo de Gobierno de 15 Fases Secuenciales

Para garantizar una ejecución ordenada, auditable y libre de regresiones visuales o técnicas, la totalidad de los hallazgos de las auditorías forenses se ha organizado en **15 Fases de Mejora Secuenciales (APEX_IMP_PHASE_01 a APEX_IMP_PHASE_15)**.

### Reglas Inflexibles de Ejecución:
1. **Secuencialidad Estricta:** No se iniciará la Fase N+1 sin la verificación técnica completa y el **visto bueno (aprobación explícita)** del usuario sobre la Fase N.
2. **Cero Omisiones:** El 100% de los 89 elementos arquitectónicos auditados y los 20 Capítulos de la Biblia 2026 están cubiertos dentro del alcance de las 15 fases.
3. **Puertas de Calidad por Fase:** Al término de cada fase se ejecutará una lista de comprobación de calidad (compilación, WCAG, responsive y cero regresiones) antes de solicitar la aprobación del usuario.

---

# 2. Mapa Maestro de las 15 Fases Secuenciales

```
[FASE 01] ──► [FASE 02] ──► [FASE 03] ──► [FASE 04] ──► [FASE 05]
Spring Motion   Sombras/Radios   Touch Targets   Safe Areas    Form Labels Pt1
    │
    ▼
[FASE 06] ──► [FASE 07] ──► [FASE 08] ──► [FASE 09] ──► [FASE 10]
Forms Pt2       Sheet Product   Sheets Auth    Cmd Palette ⌘K   Fuzzy Search
    │
    ▼
[FASE 11] ──► [FASE 12] ──► [FASE 13] ──► [FASE 14] ──► [FASE 15]
Icons Hugeicons SVG Abstraction  Header Refactor PWA & Skeletons  Premium CRO Finish
```

---

# 3. Planificación Detallada Fase por Fase

### 🔴 APEX_IMP_PHASE_01: Infraestructura de Tokens Kinestésicos y Motion Base (Spring Physics Global)
* **Objetivo:** Establecer la capa base de tokens kinestésicos y erradicar duraciones e interpolaciones lineales/ease-out estáticas.
* **Problemas Resueltos:** Hallazgo H-001 (Spring Physics).
* **Alcance Técnico:** Crear `src/lib/motionTokens.js` exportando `SPRING_PHYSICS = { type: 'spring', stiffness: 400, damping: 28 }`. Reemplazar las duraciones estáticas `duration: 0.5, ease: 'easeOut'` en `MobileAppShell.jsx` y `Header.jsx`.
* **Archivos Modificados:** `src/lib/motionTokens.js`, `src/components/mobile/MobileAppShell.jsx`, `src/components/Header.jsx`.
* **Criterio de Aprobación de la Fase 1:** Apertura suave kinestésica en la cabecera móvil sin saltos bruscos ni duraciones de 500ms.

---

### 🔴 APEX_IMP_PHASE_02: Tokens de Elevación Tonal, Sombras M3 y Radios de Borde
* **Objetivo:** Estandarizar la jerarquía del eje Z según Material Design 3 y unificar radios de curvatura.
* **Problemas Resueltos:** Inconsistencia de 8 sombras arbitrarias y mezcla de radios (`rounded-[28px]`).
* **Alcance Técnico:** Extender `tailwind.config.js` con tokens de elevación M3 (`shadow-elevation-1` a `shadow-elevation-5`) y radios semánticos (`rounded-card: 16px`, `rounded-sheet: 24px`, `rounded-pill: 9999px`).
* **Archivos Modificados:** `tailwind.config.js`, `src/index.css`.
* **Criterio de Aprobación de la Fase 2:** Eliminación de sombras duras y visualización limpia de elevaciones en tarjetas.

---

### 🔴 APEX_IMP_PHASE_03: Accesibilidad Táctil (Enforce Touch Target >= 44pt)
* **Objetivo:** Garantizar que el 100% de los botones e iconos interactivos móviles posean un área activa mínima de 44x44px.
* **Problemas Resueltos:** Hallazgo H-002 (Touch Targets < 44pt en cabecera móvil).
* **Alcance Técnico:** Modificar la variante móvil de `button.jsx` e incorporar `min-h-[44px] min-w-[44px]` en los botones de notificaciones, carrito y bot en `MobileAppShell.jsx` y `Header.jsx`.
* **Archivos Modificados:** `src/components/ui/button.jsx`, `src/components/mobile/MobileAppShell.jsx`, `src/components/Header.jsx`.
* **Criterio de Aprobación de la Fase 3:** Inspección DOM confirmando áreas interactivas `>= 44x44px` en móviles.

---

### 🔴 APEX_IMP_PHASE_04: Integración de Zona Segura Hardware (Safe Area Insets)
* **Objetivo:** Prevenir colisiones entre botones flotantes anclados y el *Home Indicator* de iOS / Android.
* **Problemas Resueltos:** Hallazgo H-006 (Ausencia de Safe Area Insets).
* **Alcance Técnico:** Aplicar las utilidades `pb-[env(safe-area-inset-bottom)]` y `mb-[env(safe-area-inset-bottom)]` en `MobileBottomNav.jsx`, `FalconBot.jsx`, `FloatingWhatsAppButton.jsx` y `CookieConsentBanner.jsx`.
* **Archivos Modificados:** `src/components/mobile/MobileBottomNav.jsx`, `src/components/FalconBot.jsx`, `src/components/FloatingWhatsAppButton.jsx`, `src/components/CookieConsentBanner.jsx`.
* **Criterio de Aprobación de la Fase 4:** Distancia visual adecuada entre la barra de inicio nativa del teléfono y la botonera del sitio.

---

### 🔴 APEX_IMP_PHASE_05: Usabilidad de Formularios - Etiquetas Permanentes y Floating Labels (Parte 1)
* **Objetivo:** Erradicar el patrón de *Placeholders como Labels* en formularios de contacto y soporte.
* **Problemas Resueltos:** Hallazgo H-007 (Inputs sin etiquetas en Contacto y Ayuda).
* **Alcance Técnico:** Reemplazar los inputs estándar por `<PremiumInput>` con etiquetas flotantes permanentes en `ContactPage.jsx` y `HelpCenterPage.jsx`.
* **Archivos Modificados:** `src/pages/ContactPage.jsx`, `src/pages/HelpCenterPage.jsx`.
* **Criterio de Aprobación de la Fase 5:** Contexto de etiquetas 100% visible al escribir datos en el formulario.

---

### 🔴 APEX_IMP_PHASE_06: Usabilidad de Formularios - Teclados Adaptativos y Validación WCAG (Parte 2)
* **Objetivo:** Optimizar la experiencia de tipeo e ingresar datos sin errores en autenticación y checkout.
* **Problemas Resueltos:** Cumplimiento del Capítulo 2 y 4 de la Biblia 2026.
* **Alcance Técnico:** Configurar `type="email"`, `type="tel"`, `autocomplete` explícito y validación al perder el foco (`onBlur`) en `AuthModal.jsx` y `CartPage.jsx`.
* **Archivos Modificados:** `src/components/AuthModal.jsx`, `src/pages/CartPage.jsx`.
* **Criterio de Aprobación de la Fase 6:** Despliegue automático del teclado adecuado en móvil (teclado numérico/email) y validación clara.

---

### 🔴 APEX_IMP_PHASE_07: Primitiva Responsiva Bottom Sheet y Rediseño de ProductModal.jsx
* **Objetivo:** Transformar la vista modal rápida de productos en un panel emergente táctil (*Bottom Sheet*) en teléfonos.
* **Problemas Resueltos:** Hallazgo H-005 (Modales centrados flotantes en móvil).
* **Alcance Técnico:** Extender `@/components/ui/dialog.jsx` para comportarse como `<Sheet>` anclado a la base en pantallas `< 768px` y adaptar `ProductModal.jsx`.
* **Archivos Modificados:** `src/components/ui/dialog.jsx`, `src/components/ProductModal.jsx`.
* **Criterio de Aprobación de la Fase 7:** Despliegue de la ficha de producto desde la base de la pantalla móvil al hacer clic en un producto.

---

### 🔴 APEX_IMP_PHASE_08: Transformación de Modales de Autenticación y Perfil a Bottom Sheets
* **Objetivo:** Llevar el patrón de *Bottom Sheet* a todos los cuadros emergentes restantes del sitio.
* **Problemas Resueltos:** Hallazgo H-005 (Fase 2 de contención móvil).
* **Alcance Técnico:** Migrar `AuthModal.jsx`, `ProfileEditModal.jsx` y `WellnessPlanDialog.jsx` al patrón nativo `Bottom Sheet` en pantallas móviles.
* **Archivos Modificados:** `src/components/AuthModal.jsx`, `src/components/ProfileEditModal.jsx`, `src/components/WellnessPlanDialog.jsx`.
* **Criterio de Aprobación de la Fase 8:** Todos los modales de la app se deslizan desde la base en celulares.

---

### 🔴 APEX_IMP_PHASE_09: Sistema de Navegación por Intenciones - Command Palette (⌘K) Global
* **Objetivo:** Implementar la barra de comandos e intenciones global accesible por teclado o toque rápido.
* **Problemas Resueltos:** Hallazgo H-003 (Ausencia de Command Palette).
* **Alcance Técnico:** Integrar la librería `cmdk` en `Layout.jsx` con atajo global `⌘K` / `Ctrl+K` y disparador de búsqueda rápida en `MobileSearchBar.jsx`.
* **Archivos Modificados:** `src/components/Layout.jsx`, `src/components/mobile/MobileSearchBar.jsx`, `package.json`.
* **Criterio de Aprobación de la Fase 9:** Apertura instantánea de la Command Palette al presionar `⌘K` o tocar el campo de búsqueda.

---

### 🔴 APEX_IMP_PHASE_10: Tolerancia a Errores en Búsqueda y Autocompletado Difuso (Fuzzy Search)
* **Objetivo:** Asegurar que el usuario encuentre productos incluso escribiendo con errores de tipeo.
* **Problemas Resueltos:** Capítulo 7 (Selectores y Autocompletado de la Biblia 2026).
* **Alcance Técnico:** Potenciar `SmartSearchAutocomplete.jsx` incorporando lógica de emparejamiento difuso (*fuzzy matching*) y resaltado de coincidencias.
* **Archivos Modificados:** `src/components/SmartSearchAutocomplete.jsx`.
* **Criterio de Aprobación de la Fase 10:** Búsqueda efectiva mostrando resultados precisos ante errores ortográficos leves.

---

### 🔴 APEX_IMP_PHASE_11: Unificación de Lenguaje Visual - Migración a @hugeicons/react
* **Objetivo:** Erradicar la duplicidad de librerías de iconos estandarizando el 100% de los assets en `Hugeicons`.
* **Problemas Resueltos:** Hallazgo H-004 (Fragmentación de librerías de iconos).
* **Alcance Técnico:** Migrar las referencias de `lucide-react` a `@hugeicons/react` en `ProductModal.jsx` y `ProductNeedSearch.jsx`, desinstalando `lucide-react`.
* **Archivos Modificados:** `src/components/ProductModal.jsx`, `src/components/ProductNeedSearch.jsx`, `package.json`.
* **Criterio de Aprobación de la Fase 11:** Cero importaciones de `lucide-react` y peso reducido del bundle final.

---

### 🔴 APEX_IMP_PHASE_12: Abstracción de Iconos Nativos SVG Inline
* **Objetivo:** Limpiar el código fuente reemplazando vectores SVG incrustados manualmente por el componente unificado `PremiumIcon`.
* **Problemas Resueltos:** Deuda técnica visual y mantenibilidad de assets.
* **Alcance Técnico:** Reemplazar etiquetas `<svg>` codificadas inline en `MobileHero.jsx`, `Header.jsx` y `PwaSplashScreen.jsx` por `PremiumIcon.jsx`.
* **Archivos Modificados:** `src/components/mobile/MobileHero.jsx`, `src/components/Header.jsx`, `src/components/PwaSplashScreen.jsx`.
* **Criterio de Aprobación de la Fase 12:** Código fuente modularizado libre de SVG inline verbosos.

---

### 🔴 APEX_IMP_PHASE_13: Refactorización Estructural de Cabecera (Consolidación Header / MobileAppShell)
* **Objetivo:** Eliminar la duplicidad de lógica entre la cabecera móvil y de escritorio, resolviendo flickering en HMR.
* **Problemas Resueltos:** Hallazgo H-008 (Redundancia y desincronización de cabeceras).
* **Alcance Técnico:** Unificar la gestión de estado de navegación y carrito en un gestor compartido de cabecera responsiva.
* **Archivos Modificados:** `src/components/Header.jsx`, `src/components/mobile/MobileAppShell.jsx`.
* **Criterio de Aprobación de la Fase 13:** Navegación fluida sin parpadeos ni recargas dobles al hacer scroll.

---

### 🔴 APEX_IMP_PHASE_14: Resiliencia PWA & Optimización del Service Worker (Offline & Skeletons)
* **Objetivo:** Elevar la puntuación PWA y ofrecer resiliencia en conexiones inestables.
* **Problemas Resueltos:** Capítulo 1 y 4 (Skeletons vs Spinners, PWA Performance).
* **Alcance Técnico:** Modernizar `public/sw.js` con estrategias de caché dinámico (Stale-While-Revalidate) e integrar esqueletos de carga (*Skeletons*) en sustitución de spinners opacos en `CartPage.jsx` y `ExplorePage.jsx`.
* **Archivos Modificados:** `public/sw.js`, `src/pages/CartPage.jsx`, `src/pages/ExplorePage.jsx`.
* **Criterio de Aprobación de la Fase 14:** Carga instantánea con esqueletos en modo sin conexión o red lenta.

---

### 🔴 APEX_IMP_PHASE_15: Pulido Premium Final, CRO & Auditoría de Calificación Target (> 92%)
* **Objetivo:** Aplicar el refinamiento final de lujo visual, contraste estricto WCAG 2.2 AA y optimización de conversión.
* **Problemas Resueltos:** Capítulo 14 (Diseño Premium) y Capítulo 13 (CRO).
* **Alcance Técnico:** Aplicar iluminación ambiental CSS (*ambient glows*), efectos de micro-escala al presionar botones (`scale: 0.96`), verificación de contraste 4.5:1 en textos secundarios y auditoría final de Lighthouse.
* **Archivos Modificados:** `src/index.css`, `src/pages/HomePage.jsx`, `src/pages/CartPage.jsx`.
* **Criterio de Aprobación de la Fase 15:** Calificación global en la Biblia Mobile Premium **superior al 92%**.

---

# 4. Protocolo de Transición entre Fases

Para avanzar de una fase a la siguiente, se seguirá el siguiente procedimiento de Sign-Off:

1. **Finalización de la Fase N:** El asistente AI implementará únicamente el alcance especificado en la Fase N.
2. **Puerta de Calidad (Quality Gate):** Se verificará que el código compila limpiamente y no genera errores en consola.
3. **Presentación de Evidencia:** Se informará al usuario la culminación del hito con la demostración de cambios.
4. **Visto Bueno del Usuario:** El desarrollo se pausará hasta que el usuario responda otorgando la aprobación para iniciar la Fase N+1.

---
*Fin del documento oficial PROJECT_APEX_IMPLEMENTATION_MASTER_PLAN.md — 15 Fases Secuenciales.*
