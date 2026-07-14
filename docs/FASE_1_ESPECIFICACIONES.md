# Especificaciones y Cambios — Fase 1: Sistema Global de Z-Index

## Resumen del Problema Original
Antes de esta fase, la aplicación sufría de "guerras de z-index" debido a valores arbitrarios (ej. `z-[60]`, `z-[99999]`) dispersos en múltiples archivos. Esto provocaba que:
1. El menú de navegación móvil (`MobileBottomNav`) quedara por encima de los modales y ventanas de diálogo.
2. Los botones flotantes (WhatsApp, FalconBot) estorbaran la interacción cuando se abría el menú lateral (Drawer) o el panel de productos.
3. El uso intensivo de primitivas de Radix UI (`z-50` por defecto) colisionara constantemente con componentes locales.

## Cambios Realizados y Especificaciones Técnicas

### 1. Extensión del Theme de Tailwind (`tailwind.config.js`)
Se eliminó la dependencia de valores hardcodeados integrando un mapa semántico predecible dentro de `extend: { zIndex: { ... } }`. 

**Escala Implementada:**
- `hide`: `-1` *(Ocultamiento visual o posicionamiento detrás del fondo)*
- `base`: `0` *(Capa base del DOM)*
- `content`: `10` *(Gradientes decorativos, fondos hero relativos)*
- `sticky`: `20` *(Tablas sticky, headers secundarios o contenedores locales)*
- `header`: `30` *(Navegación superior principal - `Header.jsx`, `MobileAppShell.jsx`)*
- `nav`: `40` *(Navegación inferior móvil - `MobileBottomNav.jsx`)*
- `floating`: `45` *(Botones de acción que flotan sobre el contenido y la navegación, pero bajo los modales - WhatsApp, FalconBot)*
- `backdrop`: `50` *(El fondo oscuro desdibujado detrás de los modales)*
- `modal`: `60` *(Contenedor de modales, ventanas emergentes, Drawers)*
- `dropdown`: `70` *(Menús desplegables, sugerencias de búsqueda predictiva)*
- `toast`: `80` *(Notificaciones efímeras, Popups de instalación PWA)*
- `max`: `9999` *(Elementos de fuerza bruta que JAMÁS deben ser bloqueados: Cookie Banners, Pantalla de Carga/Splash, Overlays de Emergencia)*

### 2. Migración de Componentes Críticos
Todos los componentes han sido actualizados para utilizar **exclusivamente** las clases generadas (ej. `z-header`, `z-modal`).

#### Navegación y Estructura
- **`Header.jsx`**: El top nav pasó de `z-50` a `z-header`. El fondo del menú lateral móvil a `z-backdrop` y el contenedor del menú a `z-modal`.
- **`MobileBottomNav.jsx`**: Pasó de `z-[60]` a `z-nav`. Esto soluciona el problema de que el bottom nav bloqueaba los diálogos.
- **`MobileAppShell.jsx`**: El header degradado móvil pasó de `z-50` a `z-header`.

#### Flotantes y Chat
- **`FloatingWhatsAppButton.jsx` & `FalconBot.jsx`**: Pasaron de `z-50` a `z-floating`. Esto permite que se mantengan sobre el navbar (`40`) pero queden ocultos debajo del telón oscuro de cualquier modal (`50`/`60`).
- **`SmartSearchAutocomplete.jsx`**: El menú desplegable de resultados pasó de `z-50` a `z-dropdown`.

#### Modales, Overlays y UI Primitives
- **`ProductModal.jsx`**: Migrado de `z-[100]` a `z-modal` y su fondo a `z-backdrop`. El header pegajoso local a `z-sticky`.
- **`ProfileEditModal.jsx`**: Migrado de `z-[9999]` a `z-modal`.
- **`CookieConsentBanner.jsx`**: El banner inferior pasó de `z-[9999]` a `z-max`.
- **`PwaInstallPrompt.jsx`**: Migrado de `z-[70]` a `z-toast`.
- **Primitivas Shadcn/Radix** (`dialog.jsx`, `dropdown-menu.jsx`, `toast.jsx`): Se actualizaron los valores por defecto de Radix (`z-50`) hacia las variables semánticas (`z-modal`, `z-backdrop`, `z-dropdown`, `z-toast`).

## Lo que se espera con estos cambios (Resultados)

1. **Jerarquía 100% Predecible:** Un desarrollador que trabaje en el proyecto ya no necesitará adivinar si debe usar `z-50` o `z-[99]`. Usar la clase semántica (ej. `z-modal`) garantiza la posición correcta de inmediato.
2. **Corrección de Bugs Visuales Mobile-First:** El menú de navegación inferior ya no traspasará las pantallas de detalle de producto o los menús del carrito.
3. **Escalabilidad para Diseño Modular:** Los menús tipo Drawer (que deslizan desde los lados) y los Dropdowns nativos no chocarán. Un dropdown (`z-70`) siempre podrá sobreponerse al modal (`z-60`) desde el cual fue invocado.
4. **Mejora en UX (Focus Loss Prevention):** Al evitar que componentes como el chat de FalconBot se dibujen por encima de un cuadro de diálogo, evitamos clicks erróneos o frustración por parte del usuario.
