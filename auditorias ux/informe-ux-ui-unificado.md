# INFORME DE AUDITORÍA UX/UI — PROYECTOS DE DANIEL FALCÓN

## Versión 3.0 — Metodología PIVF

---

# RESUMEN EJECUTIVO

Se realizó una auditoría completa de **3 proyectos** en producción, aplicando la metodología PIVF (Progressive Implementation & Validation Framework) con evaluación de nivel Staff Engineer.

| Proyecto | Tipo | Stack | URL |
|----------|------|-------|-----|
| **Chactivo** | Comunidad social LGBTQ+ | Vite + React 18 + Firebase | github.com/daniel1743/pagina-gay |
| **Bienestar en Claro** | Revista editorial de salud | Vite + React 18 + Supabase | bienestarenclaro.com |
| **Bienestar en Claro Shop** | Tienda editorial de bienestar | Vite + React 18 + Supabase | github.com/daniel1743/shop |

### Hallazgos Globales por Proyecto

| Categoría | Chactivo | Bienestar en Claro | Shop |
|-----------|----------|-------------------|------|
| 🔴 Críticos | 6 | 8 | 8 |
| 🟡 Medios | 11 | 10 | 12 |
| 🟢 Menores | 6 | 7 | 7 |
| **Score UI** | 7/10 | 6.5/10 | 6/10 |
| **Score UX** | 7/10 | 6/10 | 5/10 |
| **Score Accesibilidad** | 5/10 | 5/10 | 5/10 |
| **Score Responsive** | 6/10 | 7/10 | 7/10 |
| **Score Conversión** | 4/10 | 5/10 | 6/10 |
| **Score Consistencia** | 6/10 | 5.5/10 | 4/10 |
| **Score Performance** | 5/10 | 6.5/10 | 6/10 |
| **Score Visual** | 7/10 | 7/10 | 7/10 |

---

# PROYECTO 1 — CHACTIVO (Comunidad Social LGBTQ+)

## Descripción
Plataforma de chat gay para Chile con salas temáticas, mensajería privada, sistema de bots, gamificación (Top Activos), y autenticación Firebase.

### Archivos Escaneados
- **140+ archivos** en `src/`
- Directorios auditados: `src/`, `public/`, `plugins/`, `tests/`, `api/`

## Hallazgos Críticos

### H1. LandingPage rota — Solo muestra "Redirecting to Lobby..."
- **Archivo:** `src/pages/LandingPage.jsx` (líneas 1-9)
- **Problema:** El componente LandingPage no muestra ningún contenido real. Solo muestra texto estático "Redirecting to Lobby...". La ruta "/" debería mostrar una landing page de presentación del producto.
- **Impacto UX:** Visitantes desde SEO/Google ven una página sin contenido. Bounce rate alto.
- **Impacto Negocio:** Anula toda la estrategia SEO de 10k+ keywords configuradas.
- **Solución:** Migrar contenido de LobbyPage a LandingPage con CTAs, beneficios, testimonios.
- **Esfuerzo:** 2-3 horas | **Riesgo:** Bajo | **ROI:** Alto

### H2. Autenticación automática anónima sin estado de carga visible
- **Archivo:** `src/contexts/AuthContext.jsx` (líneas 40-92)
- **Problema:** Durante el loading no se muestra NADA al usuario. Flash blanco al cargar la app.
- **Solución:** Implementar `<AppLoading />` con spinner animado.
- **Esfuerzo:** 1 hora | **Riesgo:** Muy bajo | **ROI:** Medio

### H3. Contraseña mínima de 6 caracteres es insegura
- **Archivo:** `src/contexts/AuthContext.jsx` (línea 176)
- **Problema:** 6 caracteres es extremadamente débil. OWASP recomienda mínimo 12 caracteres con complejidad.
- **Impacto Seguridad:** Riesgo grave para comunidad LGBT+.
- **Solución:** Aumentar a 12 caracteres + requisitos de complejidad.
- **Esfuerzo:** 30 min | **Riesgo:** Bajo | **ROI:** Alto

### H4. Sistema de bots consume Firestore reads masivamente
- **Archivo:** `src/services/botEngine.js` (líneas 252-272)
- **Problema:** Cada bot escribe/lee presencia constantemente en Firestore. Con múltiples bots y salas, costos de Firestore se disparan.
- **Solución:** Mover bots a Cloud Functions (backend).
- **Esfuerzo:** 8-12 horas | **Riesgo:** Medio | **ROI:** Alto

### H5. Reportes solo lectura para admin (imposible gestionar)
- **Archivo:** `firestore.rules` (línea 180)
- **Problema:** Reglas de Firestore prohíben tanto lectura como actualización de reportes. El reporte se crea pero nunca se puede revisar ni cerrar.
- **Solución:** Agregar regla `allow read, update, delete: if isAuthenticated() && role == 'admin'`
- **Esfuerzo:** 15 min | **Riesgo:** Bajo | **ROI:** Alto

### H6. Datos sensibles expuestos en el registro
- **Archivo:** `src/pages/AuthPage.jsx` (líneas 145-152)
- **Problema:** Se solicita número de teléfono como campo opcional en el registro. Riesgo serio de privacidad para comunidad LGBT+.
- **Solución:** Eliminar campo teléfono o hacerlo explícitamente no recopilable.
- **Esfuerzo:** 15 min | **Riesgo:** Bajo | **ROI:** Alto

## Hallazgos Medios

### H7. Sidebar de chat duplicada (~400 líneas duplicadas)
- **Archivo:** `src/components/chat/ChatSidebar.jsx` (líneas 63-506)
- **Solución:** Extraer `<RoomList />` y reutilizarlo.

### H8. Colores hardcodeados fuera de Tailwind
- **Archivo:** `src/index.css` (varias líneas)
- **Solución:** Mover todos los colores a variables CSS y usar `hsl(var(--accent))`.

### H9. Botón cerrar sesión dentro del nombre de usuario (clicks accidentales)
- **Archivo:** `src/components/chat/ChatSidebar.jsx` (líneas 254-263)

### H10. Gradientes inline inconsistentes
- **Archivo:** `src/components/lobby/LobbyPage.jsx` (líneas 238-250)

### H11. Animaciones excesivas con framer-motion
- **Impacto:** Problemas de accesibilidad (WCAG 2.3.3), performance en móviles.

### H12. Botones sin aria-labels consistentes
- **Archivos:** ChatSidebar, MobileBottomNav, ChatHeader
- **Violación WCAG 4.1.2**

### H13. Tab title set manual en cada página
- **Solución:** Usar react-helmet-async o configurar titles en el router.

### H14. Exceso de modales "Coming Soon"
- **Archivos:** Header.jsx (notificaciones, cambiar estado, modo oculto), ProfilePage.jsx, PremiumPage.jsx, ChatInput.jsx
- **Impacto:** Frustración constante del usuario.

### H15. Colores de fondo en MobileBottomNav hardcodeados
- **Archivo:** `src/components/chat/MobileBottomNav.jsx` (línea 14)

### H16. Iconos de salas de chat genéricos
- **Archivo:** `src/config/rooms.js` (líneas 53-68)
- **Problema:** "Activos Buscando", "Pasivos Buscando" y "Osos" comparten el mismo icono `UserCheck`.

### H17. Inyección de estilos CSS dinámica (potencial XSS)
- **Archivo:** `src/App.jsx` (líneas 27-34)
- **Problema:** Inyecta estilos CSS dinámicamente del usuario. Potencial XSS si `theme.colors` no se valida.

## Hallazgos Menores

### H18. Uso inconsistente de `React.useEffect` vs `useEffect`
### H19. Botón "Cerrar Sesión" con variante destructive
### H20. Sin indicador de error de red en ChatInput
### H21. Textarea sin resize control
### H22. Sin lazy loading en componentes pesados
### H23. Service Worker PWA incompleto

## Análisis por Categoría

| Categoría | Score | Observaciones |
|-----------|-------|---------------|
| **Design System** | 7/10 | Tokens bien definidos pero usados inconsistente. Colores hardcodeados. |
| **Responsive** | 6/10 | Breakpoints con solapamiento mobile/desktop. Sidebar duplicado. |
| **Accesibilidad** | 5/10 | Faltan aria-labels, skip links, focus management. Tiene prefers-reduced-motion. |
| **Performance** | 5/10 | Sin code splitting, bot engine consume Firestore excesivamente. |
| **UX Heurísticas** | 7/10 | Buenas salas y funcionalidades. Exceso de animaciones y modales "coming soon". |
| **Conversión** | 4/10 | LandingPage rota, sin pasarela de pago, sin social proof. |
| **Seguridad** | 5/10 | Contraseña mínima débil, sin 2FA, sin bloqueos, sin verificación de edad. |
| **Código** | 6/10 | Buena organización pero duplicación significativa. |

---

# PROYECTO 2 — BIENESTAR EN CLARO (Revista Editorial)

## Descripción
Revista editorial de bienestar cotidiano en React + Vite + Supabase. Sitio de contenido con artículos, comunidad, perfiles de usuario, newsletter y panel de administración.

### Archivos Escaneados
- **~80 archivos fuente** (.jsx/.js)
- Directorios auditados: `src/`, `public/`, `tools/`, `plugins/`

## Hallazgos Críticos

### H1. Credencial Supabase expuesta en código fuente
- **Archivo:** `src/lib/customSupabaseClient.js` (líneas 3-5)
- **Problema:** La clave anon de Supabase está hardcodeada como valor por defecto.
- **Impacto Negocio:** Cualquier usuario puede leer la clave desde el bundle y acceder a la base de datos.
- **Solución:** Eliminar valores por defecto y validar en build-time que las variables de entorno estén presentes.
- **Esfuerzo:** 15 min | **Riesgo:** Bajo | **ROI:** Muy alto

### H2. Email de administrador hardcodeado en múltiples lugares
- **Archivos:** `src/components/Header.jsx:68`, `src/pages/AdminLoginPage.jsx:29`, `src/components/CommentsSection.jsx:16`, `src/components/ProtectedRoute.jsx:20`
- **Problema:** `falcondaniel37@gmail.com` aparece hardcodeado como criterio de acceso admin.
- **Solución:** Mover a variable de entorno `ADMIN_EMAIL` y validar desde `adminConfig`.
- **Esfuerzo:** 15 min | **Riesgo:** Bajo | **ROI:** Medio

### H3. Funcionalidad de recuperación de contraseña no implementada
- **Archivo:** `src/pages/LoginPage.jsx:48-50`
- **Problema:** El botón de "¿Olvidaste tu contraseña?" muestra un toast con mensaje de desarrollo: *"This feature isn't implemented yet..."*
- **Solución:** Implementar `resetPassword()` del contexto de autenticación con flujo real.
- **Esfuerzo:** 30 min | **Riesgo:** Bajo | **ROI:** Alto

### H4. Contenido dummy de "Chismes & Farándula" en traducciones
- **Archivo:** `src/i18n/i18n.js`
- **Problema:** Las traducciones contienen contenido de un proyecto de farándula completamente ajeno al proyecto de bienestar.
- **Solución:** Reemplazar con textos reales del proyecto de bienestar.
- **Esfuerzo:** 1 hora | **Riesgo:** Bajo | **ROI:** Bajo

### H5. Componentes huérfanos no utilizados
- **Archivos:** `src/components/CallToAction.jsx`, `WelcomeMessage.jsx`, `HeroImage.jsx`, `Footer.jsx`, `NewsGrid.jsx`, `NewsCard.jsx`, `FeaturedSection.jsx`, `SettingsPanel.jsx`
- **Problema:** Usan i18n "CHISMES" y no aparecen referenciados en `App.jsx` ni en ninguna página pública.
- **Impacto:** Peso innecesario en bundle (~20KB), confusión para desarrolladores.
- **Solución:** Eliminar o integrar en la nueva versión.
- **Esfuerzo:** 30 min | **Riesgo:** Bajo | **ROI:** Bajo

### H6. localPublishedArticles.js vacío
- **Archivo:** `src/content/localPublishedArticles.js`
- **Problema:** `LOCAL_PUBLISHED_ARTICLES` es un array vacío y `getLocalPublishedArticleBySlug` siempre retorna null.
- **Solución:** Populate con artículos críticos o eliminar la referencia.
- **Esfuerzo:** 1 hora | **Riesgo:** Bajo | **ROI:** Bajo

### H7. Sin Schema Markup JSON-LD en páginas públicas
- **Archivos:** `HomePage.jsx`, `ArticleDetailPage.jsx`, `ArticlesListPage.jsx`
- **Problema:** No se genera ningún Schema.org (Article, WebSite, BreadcrumbList, Organization) en el HTML.
- **Impacto Negocio:** Google no entiende la semántica del contenido, pierde rich snippets y Knowledge Graph signals.
- **Solución:** Agregar JSON-LD en `<Helmet>` con `Article` y `BreadcrumbList` para cada artículo.
- **Esfuerzo:** 1-2 horas | **Riesgo:** Bajo | **ROI:** Muy alto

## Hallazgos de Accesibilidad

### H8. Botones sin aria-label consistente
- **Archivos:** `src/components/Header.jsx:60,96,99`
- **Problema:** Botones de toggle de tema (sol/luna) y menú hamburguesa sin `aria-label` descriptivo.

### H9. Contenido con caracteres desprovistos de tilde (sin acentos)
- **Archivos:** `HomePage.jsx`, `ArticleDetailPage.jsx`, `ArticlesListPage.jsx`, `LegalPage.jsx`, `FooterV2.jsx`
- **Problema:** Prácticamente TODO el texto del frontend está escrito SIN acentos: "articulos" en vez de "artículos", "habitos" en vez de "hábitos".
- **Impacto UX:** Alto — deteriora la legibilidad y la percepción de profesionalismo en español.
- **Impacto SEO:** Medio.
- **Solución:** Revisar y corregir todos los textos en JSX con acentos correctos.
- **Esfuerzo:** 2-3 horas | **Riesgo:** Bajo | **ROI:** Alto

### H10. Tablas sin encabezados accesibles
- **Archivo:** `src/index.css:306-319`
- **Problema:** Las tablas no tienen atributos `scope="col"` en los `<th>`.

## Hallazgos de Diseño Visual

### H11. Inconsistencia entre Footer (FooterV2) y Footer (legacy)
- **Archivos:** `src/components/FooterV2.jsx` vs `src/components/Footer.jsx`
- **Problema:** FooterV2 se usa en `App.jsx` pero Footer existe como código muerto.

### H12. Tipografía editorial inconsistente
- **Archivo:** `src/index.css`
- **Problema:** Dos sistemas tipográficos mezclados:
  - `editorial-content` usa Cormorant Garamond (serif)
  - `article-content` usa Inter (sans-serif)
  - H1-H3 en article-content usan Lora (serif)
- **Solución:** Unificar a un sistema coherente: Inter para cuerpo, Lora para títulos.

### H13. Blobs animados definidos pero no usados
- **Archivo:** `src/index.css:64-89`
- **Problema:** `@keyframes blob`, `.animate-blob` están definidos pero no referenciados en ningún componente.

### H14. Gradientes de colores inconsistentes entre componentes
- **Problema:** Header usa verde esmeralda (`#34D399`) como CTA, NewsCard usa gradientes rosa-púrpura, Hero usa azul oscuro (`#0B1220`).
- **Solución:** Consolidar en las variables CSS del tema (primary ya está definido como verde).

## Hallazgos de Responsive Design

### H15. Admin Dashboard no usable en móvil
- **Archivo:** `src/pages/AdminDashboard.jsx:83`
- **Problema:** Sidebar lateral solo se muestra en `lg:` (1024px+). En pantallas menores, el header móvil tiene un dropdown select que no es ideal.

### H16. Modal de perfil cubre toda pantalla en móvil
- **Archivo:** `src/components/EditProfileModal.jsx:50`
- **Problema:** `fixed inset-0` con `max-w-2xl` — en pantallas pequeñas ocupa todo el ancho.

## Hallazgos de SEO

### H17. Sin robots.txt dinámico
- **Archivo:** `public/robots.txt` (124 bytes)
- **Problema:** Archivo estático, no generado por script. No refleja artículos dinámicos de Supabase.

### H18. Sitemap generado en build-time pero no se refresca con cambios en tiempo real
- **Archivo:** `tools/generate-sitemap.js`
- **Solución:** Configurar webhook o edge function para actualización inmediata.

### H19. Meta tags duplicados entre index.html y Helmet
- **Problema:** `index.html` tiene meta tags hardcodeados y cada página también los inyecta via Helmet.

## Hallazgos de Rendimiento

### H20. Imágenes del hero no optimizadas
- **Archivo:** `public/images/articles/higado-graso-chile-diagnostico-que-hacer-desde-hoy.jpg`
- **Problema:** Imagen grande sin indicar si se usa `srcset` o formatos modernos (WebP/AVIF).

### H21. Framer Motion importado en muchos componentes
- **Archivos:** NewsCard, FeaturedSection, SettingsPanel, AdminLoginPage, UserProfilePage, NotificationsPage

### H22. Lazy loading inconsistente
- **Problema:** Imágenes de tarjetas tienen `loading="lazy"` ✅, pero imágenes del footer (logo) sí tienen `loading="lazy"` aunque están en el render inicial.

### H23. Vite 4.x (obsoleto)
- **Archivo:** `package.json:82`
- **Problema:** Vite 4.4.5 — la última versión es 5.x con mejores optimizaciones.

## Hallazgos de Código

### H24. `dangerouslySetInnerHTML` usado extensivamente
- **Archivos:** `ArticleDetailPage.jsx:280`, `LegalPage.jsx:214`
- **Mitigado por:** `sanitizeEditorialHtml()` con DOMParser y whitelist.

### H25. Estrategia de consulta de artículos con fallback
- **Archivo:** `src/lib/articleQueries.js`
- **Positivo:** Robusto ante cambios de esquema.

### H26. Contenido sensible vaciado intencionalmente
- **Archivo:** `src/lib/contentSensitivity.js:1-4`
- **Positivo:** Decisión consciente de no bloquear contenido de bienestar/salud.

## Hallazgos de Conversión

### H27. CTA del hero con texto en minúsculas
- **Archivo:** `src/pages/HomePage.jsx:77`
- **Problema:** `"Leer articulos"` y `"Empieza aqui"` — deberían capitalizarse.

### H28. Sin social proof ni testimonios
- **Impacto Negocio:** Alto — reduce confianza y conversión.
- **Solución:** Agregar sección con métricas sociales (lectores, suscriptores, artículos publicados).

### H29. Formulario de newsletter sin feedback claro
- **Archivo:** `src/components/FooterV2.jsx`
- **Problema:** El honeypot (`name="company"`) es engañoso y no accesible para screen readers correctamente.

## Hallazgos de Navegación

### H30. Muchas rutas stub/informativas sin contenido real
- **Problema:** `/guias/`, `/categorias/`, `/empieza-aqui/`, `/transparencia`, `/metodologia-editorial`, `/faq`, `/glosario`, `/newsletter` son páginas stub con texto genérico.
- **Impacto SEO:** Alto — páginas thin content que diluyen la autoridad del dominio.
- **Solución:** Desarrollar contenido real o marcar como `noindex`.

## Hallazgos de Formularios

### H31. Validación mínima de contraseñas
- **Archivo:** `src/pages/LoginPage.jsx:38`
- **Problema:** Solo verifica longitud mínima de 6 caracteres.

### H32. No hay feedback visual de errores de formulario
- **Problema:** Los inputs no muestran estados de error visuales (rojo, iconos de advertencia).

## Hallazgos de Contenido

### H33. Medical Disclaimer en artículos
- **Archivo:** `src/pages/ArticleDetailPage.jsx:267-275`
- **Positivo:** Presente ✅, bien diseñado. E-E-A-T signal positivo.

### H34. Author presentation hardcodeada
- **Archivo:** `src/pages/ArticleDetailPage.jsx:25-31`
- **Problema:** `Daniel Falcón` como autor principal con avatar hardcodeado. No escala a múltiples autores.

### H35. Glosario metabólico de 35+ términos
- **Archivo:** `src/content/metabolicGlossary.js`
- **Positivo:** Contenido de alta calidad para SEO semántico y E-E-A-T, pero no se usa en la UI pública.

## Quick Wins (bajo esfuerzo, alto impacto)

| # | Acción | Esfuerzo |
|---|--------|----------|
| 1 | Corregir ortografía con acentos en todo el frontend | 2-3 horas |
| 2 | Implementar recuperación de contraseña | 1 hora |
| 3 | Agregar aria-labels a botones de tema y menú | 15 minutos |
| 4 | Eliminar componentes huérfanos (CallToAction, WelcomeMessage, HeroImage, Footer, NewsGrid, NewsCard, FeaturedSection, SettingsPanel) | 30 minutos |
| 5 | Capitalizar textos de CTAs | 10 minutos |
| 6 | Remover email hardcodeado y mover a variable de entorno | 15 minutos |
| 7 | Agregar JSON-LD Article + BreadcrumbList en ArticleDetailPage | 1-2 horas |
| 8 | Marcar routes stub como `noindex` si no tienen contenido real | 30 minutos |

## Scores Finales

| Métrica | Puntuación | Justificación |
|---------|-----------|---------------|
| **UI Quality** | 6.5/10 | Buena paleta, buen uso de sombras y bordes. Inconsistencia entre componentes. |
| **UX Quality** | 6/10 | Navegación clara. Sin social proof, formularios sin validación visual, recuperación de contraseña rota. |
| **Accessibility** | 5/10 | Sin aria-labels, sin scope en tablas, contenido sin acentos, sin skip links. |
| **Responsive** | 7/10 | Breakpoints decentes, pero admin dashboard limitado en móvil. |
| **Conversion** | 5/10 | CTAs con texto incorrecto, sin testimonios, rutas thin content. |
| **Design Consistency** | 5.5/10 | 3 familias tipográficas mezcladas, gradientes rosa-púrpura vs verde esmeralda. |
| **Performance** | 6.5/10 | Lazy loading parcial, Vite 4 obsoleto, framer-motion pesado. |
| **Visual Quality** | 7/10 | Buenos gradientes, sombras, bordes redondeados. Inconsistencia entre secciones. |

## Hoja de Ruta Recomendada

### Sprint 1 (Semana 1-2) — Crítico
- [ ] Remover credenciales hardcodeadas de Supabase
- [ ] Mover email de admin a variable de entorno
- [ ] Implementar recuperación de contraseña
- [ ] Corregir ortografía con acentos en todo el frontend

### Sprint 2 (Semana 2-3) — Calidad
- [ ] Agregar JSON-LD en ArticleDetailPage y HomePage
- [ ] Unificar sistema de color (eliminar gradientes rosa-púrpura)
- [ ] Agregar aria-labels y accesibilidad básica
- [ ] Eliminar componentes huérfanos
- [ ] Marcar como noindex las rutas thin content

### Sprint 3 (Semana 3-4) — Conversión
- [ ] Agregar social proof (contadores)
- [ ] Mejorar validación visual de formularios
- [ ] Desarrollar contenido real para stub pages o consolidar
- [ ] Agregar testimonios o métricas

### Sprint 4 (Semana 4-5) — Performance
- [ ] Migrar a Vite 5
- [ ] Implementar WebP/AVIF para imágenes
- [ ] Agregar `fetchpriority="high"` a LCP image
- [ ] Audit bundle size y tree-shaking

## Lecciones Aprendidas

1. **Un proyecto bien intencionado puede acumular deuda técnica rápidamente.** La mezcla de componentes de un proyecto anterior (farándula) con el nuevo proyecto de bienestar indica una transición incompleta.

2. **La accesibilidad en español requiere acentos correctos.** Escribir textos sin tilde no solo afecta la lectura sino también la experiencia del usuario hispanohablante.

3. **Hardcoding de credenciales es el error más común.** Aparece tanto en Supabase como en email de admin — ambos remediables con variables de entorno.

4. **Las rutas stub son un riesgo silencioso de SEO.** Tener 15+ páginas con contenido genérico diluye la autoridad del dominio.

5. **El sistema de sanitización editorial es robusto.** `sanitizeEditorialHtml` con DOMParser y whitelist de tags/attributes es una implementación seria de seguridad.

6. **El glosario metabólico es un activo valioso.** 35+ términos con definiciones es material excelente para SEO semántico y E-E-A-T, pero está sin usar en la UI pública.

---

# PROYECTO 3 — BIENESTAR EN CLARO SHOP (Tienda Editorial)

## Descripción
Revista digital editorial de bienestar cotidiano con Supabase. Sitio de contenido (artículos, comunidad, perfiles de usuario), NO un e-commerce — no tiene carrito de compras, catálogo de productos ni pasarela de pagos.

### Archivos Escaneados
- **~80 archivos fuente** (.jsx/.js)
- Directorios auditados: `src/pages/`, `src/components/`, `src/components/ui/`, `src/contexts/`, `src/hooks/`, `src/lib/`, `supabase/functions/`, `plugins/`, `public/`

## Hallazgos Críticos

### H1. Credenciales de Supabase expuestas en código fuente
- **Archivo:** `src/lib/customSupabaseClient.js` (líneas 3-5)
- **Problema:** URL y anon key de Supabase están hardcodeados como constantes DEFAULT y se usan como fallback.
- **Impacto Negocio:** Cualquiera que vea el repositorio puede acceder al proyecto de Supabase.
- **Solución:** Eliminar constantes DEFAULT. Lanzar error en build-time si no se proporcionan credenciales reales.
- **Esfuerzo:** 15 min | **Riesgo:** Bajo | **ROI:** Muy alto

### H2. Input component ignora completamente las variables CSS y el tema dark
- **Archivo:** `src/components/ui/input.jsx` (líneas 8-9)
- **Problema:** Usa `border-slate-600 bg-slate-700/50 text-slate-100` — colores fijos que NO respetan variables CSS `--background`, `--foreground`, `--input`.
- **Impacto UX:** En tema light, el input se ve como fondo oscuro sobre fondo claro.
- **Solución:** Reemplazar con `bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring`.
- **Esfuerzo:** 10 min | **Riesgo:** Muy bajo | **ROI:** Alto

### H3. Card component ignora completamente las variables CSS y el tema dark
- **Archivo:** `src/components/ui/card.jsx` (línea 8)
- **Problema:** Usa `bg-slate-800/50 backdrop-blur-sm text-slate-50 border-slate-700 shadow-lg` — colores fijos oscuros.
- **Impacto UX:** Cards en páginas públicas son ilegibles o visualmente incorrectas.
- **Solución:** Reemplazar con `bg-card border-border text-card-foreground`.
- **Esfuerzo:** 10 min | **Riesgo:** Muy bajo | **ROI:** Alto

### H4. Páginas stub con contenido mínimo
- **Archivos:** `src/pages/EditorialStubPage.jsx`, `src/pages/InfoStubPage.jsx`
- **Problema:** 14 rutas en App.jsx apuntan a estas páginas stub (`/guias`, `/categorias/*`, `/metodologia-editorial`, `/transparencia`, `/contacto`, `/faq`, `/glosario`, `/newsletter`). Todas muestran "Cargando..." o contenido vacío.
- **Solución:** Implementar contenido real o redirigir 301. Si no se va a implementar, agregar `noindex, nofollow`.
- **Esfuerzo:** 4-8 horas | **Riesgo:** Bajo | **ROI:** Muy alto

### H5. Feature incompleta: Crear temas de comunidad muestra mensaje de debug
- **Archivo:** `src/pages/CommunityPage.jsx` (línea 48)
- **Problema:** `handleCreateTopic` muestra un toast literal: *"This feature isn't implemented yet--but don't worry! You can request it in your next prompt!"*
- **Impacto UX:** Revela que están trabajando con un desarrollador IA. Daña la credibilidad del sitio.
- **Solución:** Deshabilitar el botón hasta que la función esté lista, o mostrar un mensaje profesional.
- **Esfuerzo:** 5 min | **Riesgo:** Muy bajo | **ROI:** Alto

### H6. Feature incompleta: Detalles de tema de comunidad muestra mensaje de debug
- **Archivo:** `src/pages/CommunityPage.jsx` (línea 106)
- **Solución:** Implementar página de detalle de tema o redirigir a artículo relacionado.

### H7. Feature incompleta: Recuperación de contraseña en login
- **Archivo:** `src/pages/LoginPage.jsx` (línea 49)
- **Problema:** El flujo de recuperación de contraseña muestra un toast de "feature no implementada".
- **Solución:** Usar `supabase.auth.resetPasswordForEmail()` ya definido en el contexto.
- **Esfuerzo:** 30 min | **Riesgo:** Bajo | **ROI:** Alto

### H8. Email de administrador codificado en múltiples lugares
- **Archivos:** `src/components/Header.jsx` (línea 68, 126), `src/components/CommentsSection.jsx` (línea 16)
- **Problema:** `currentUser.email === 'falcondaniel37@gmail.com'` se usa para verificar permisos de admin en 3 archivos diferentes.
- **Solución:** Crear un campo `role` en la tabla `user_profiles` y verificarlo en cada lugar.
- **Esfuerzo:** 2 horas | **Riesgo:** Bajo | **ROI:** Medio

## Hallazgos Medios

### M1. Componentes UI con estilos inconsistentes entre tema
- **Archivos:** `input.jsx`, `card.jsx`, `select.jsx`, `slider.jsx`
- **Problema:** Los componentes UI base no respetan las variables CSS del tema.
- **Solución:** Refactorizar todos los componentes UI para usar variables semánticas de Tailwind.
- **Esfuerzo:** 2-3 horas | **ROI:** Alto

### M2. Estilos inline en index.css con valores hardcoded
- **Archivo:** `src/index.css` (líneas 64-90, 91-331)
- **Problema:** Numerosas reglas CSS inline con valores específicos hardcodeados: `min-height: 320px`, `font-size: 1.03rem`, `border-left: 4px solid #3b82f6`.
- **Solución:** Migrar a clases de Tailwind o variables CSS personalizadas.
- **Esfuerzo:** 4-6 horas | **ROI:** Medio

### M3. Duplicación de estilos tipográficos
- **Archivo:** `src/index.css` (líneas 91-165 vs 336-491)
- **Problema:** Dos bloques duplicados de estilos tipográficos para `.editorial-content` y `.article-content`.
- **Solución:** Unificar en un único sistema tipográfico reutilizable.
- **Esfuerzo:** 1-2 horas | **ROI:** Medio

### M4. ThemeContext establece variables CSS manualmente junto con clases
- **Archivo:** `src/contexts/ThemeContext.jsx` (líneas 18-24)
- **Problema:** Usa tanto `classList.add('dark')` como `root.style.setProperty('--bg-color', ...)` con variables que no coinciden con las de Tailwind.
- **Solución:** Eliminar la lógica de `style.setProperty` y confiar únicamente en las clases de Tailwind.
- **Esfuerzo:** 30 min | **ROI:** Alto

### M5. Page title con "Hola mundo"
- **Archivo:** `index.html` (línea 6)
- **Problema:** Title en HTML es "Bienestar en Claro", pero HomePage.jsx setea el title dinámicamente como "Revista de bienestar cotidiano | Bienestar en Claro".
- **Solución:** El title en index.html debería ser un placeholder generico o eliminarse cuando se usa react-helmet.
- **Esfuerzo:** 5 min

### M6. Servicio Worker registrado pero sin funcionalidad
- **Archivos:** `src/main.jsx` (línea 15), `public/sw.js`
- **Problema:** Se registra un Service Worker pero sw.js probablemente no tiene funcionalidad de PWA completa.
- **Solución:** Verificar que sw.js tenga un workbox config apropiado.
- **Esfuerzo:** 1-2 horas

### M7. SEO: Faltan datos estructurados (Schema.org)
- **Archivos:** Todas las páginas
- **Problema:** No hay metadatos Schema.org (JSON-LD). Faltan: `Article`, `WebSite`, `Organization`, `BreadcrumbList`.
- **Solución:** Agregar JSON-LD en cada página relevante usando react-helmet.
- **Esfuerzo:** 4-6 horas | **ROI:** Alto (mejora de rich snippets en Google)

### M8. Accesibilidad: Controles de navegación del header sin aria-labels
- **Archivo:** `src/components/Header.jsx` (líneas 60, 62, 96-101)
- **Problema:** Los botones de cambio de tema y hamburger menu sin `aria-label` o `aria-expanded`.
- **Solución:** Agregar `aria-label` a cada botón y `aria-expanded` al menú mobile.
- **Esfuerzo:** 30 min | **ROI:** Alto

### M9. Contenido sin capitalización correcta en español
- **Archivos:** múltiples (HomePage.jsx, ArticleDetailPage.jsx, FooterV2.jsx)
- **Problema:** Palabras escritas en minúsculas que en español van con mayúscula: "articulos" (debe ser "Artículos"), "Empieza aquí" (debe ser "Empieza Aquí"), "Como funciona" (debe ser "Cómo Funciona").
- **Solución:** Revisar todo el copy en español y aplicar reglas de capitalización apropiadas.
- **Esfuerzo:** 1-2 horas | **ROI:** Medio

### M10. Botón de "Salir" sin confirmación
- **Archivos:** `Header.jsx` (línea 76), `AdminDashboard.jsx` (línea 115)
- **Problema:** Los botones de logout no piden confirmación. Un clic accidental cierra la sesión.
- **Solución:** Usar un dialog de confirmación (Radix UI AlertDialog ya disponible).
- **Esfuerzo:** 30 min

### M11. Admin panel con tema oscuro hardcodeado
- **Archivo:** `src/pages/AdminDashboard.jsx` (línea 77)
- **Problema:** Todo el admin usa `className="dark"` hardcodeado en el div raíz.
- **Solución:** Remover el `dark` hardcodeado y permitir que el admin herede el tema global.
- **Esfuerzo:** 1 hora

### M12. Imágenes sin dimensiones explícitas (CLS)
- **Archivos:** múltiples páginas
- **Problema:** Las imágenes de artículos no tienen atributos `width` y `height` explícitos.
- **Solución:** Agregar dimensiones fijas o usar aspect-ratio CSS.
- **Esfuerzo:** 2 horas

## Hallazgos Menores

### F1. Falta de skeleton/loading states en páginas públicas
- **Archivos:** HomePage, ArticlesListPage, UserProfilePage
- **Problema:** Solo las páginas de perfil muestran "Cargando..." como texto plano.

### F2. Meta og:image apunta a logo horizontal en vez de imagen de artículo
- **Archivos:** HomePage.jsx (línea 57), ArticlesListPage.jsx (línea 94)

### F3. Fecha de actualización del sitio en footer
- **Archivo:** `src/components/FooterV2.jsx` (línea 362)
- **Problema:** "Última actualización del sitio: Feb 2026" — fecha estática que parece desactualizada.

### F4. Enlaces de redes sociales sin indicador de "abre en nueva ventana"
- **Archivo:** `src/pages/UserProfilePage.jsx` (líneas 164-167)

### F5. Breadcrumbs inconsistentes entre páginas
- **Archivos:** ArticleDetailPage, ArticlesListPage, GetStartedPage

### F6. Botón de "Nuevo Tema" en comunidad deshabilitado con pointer-events-none
- **Archivo:** `src/pages/CommunityPage.jsx` (línea 74)

### F7. Comentarios sin paginación
- **Archivo:** `src/components/CommentsSection.jsx` (línea 32)
- **Problema:** Los comentarios se cargan con `.limit(500)` — sin paginación ni lazy loading.

## Quick Wins (menos de 1 hora)

| # | Acción | Esfuerzo |
|---|--------|----------|
| 1 | Fix Input y Card components — Cambiar colores hardcodeados a variables semánticas de Tailwind | 15 min |
| 2 | Remover mensajes de debug de CommunityPage.jsx | 5 min |
| 3 | Agregar aria-labels a botones del Header | 15 min |
| 4 | Fix title duplicado en index.html y HomePage.jsx | 5 min |
| 5 | Eliminar credenciales hardcodeadas de customSupabaseClient.js | 15 min |
| 6 | Deshabilitar botón "Nuevo Tema" o mostrar mensaje profesional | 5 min |
| 7 | Implementar recuperación de contraseña con función ya existente en AuthContext | 30 min |

## Recomendaciones Priorizadas

### Fase 1 — Seguridad y Correcciones Críticas (Semana 1)
1. Remover credenciales de Supabase del código fuente
2. Corregir componentes Input y Card para respetar tema
3. Implementar o remover páginas stub (agregar noindex a las no implementadas)
4. Remover mensajes de debug visibles para usuarios

### Fase 2 — Calidad de Contenido (Semana 2)
5. Corregir capitalización en todo el contenido en español
6. Implementar Schema.org JSON-LD
7. Mejorar OG images dinámicas por artículo
8. Implementar recuperación de contraseña
9. Agregar dialog de confirmación al cerrar sesión

### Fase 3 — Accesibilidad y UX (Semana 3)
10. Agregar aria-labels a controles de navegación
11. Implementar skeleton loading states
12. Implementar breadcrumbs consistentes
13. Unificar estilos tipográficos de index.css
14. Corregir ThemeContext para usar solo variables Tailwind

### Fase 4 — Performance y Escalabilidad (Semana 4)
15. Agregar dimensiones explícitas a imágenes
16. Implementar paginación en comentarios
17. Migrar estilos inline de index.css a clases de Tailwind
18. Unificar sistema de variables CSS
19. Implementar sistema de roles para admin en lugar de email hardcodeado

## Scores Finales

| Criterio | Puntuación | Justificación |
|----------|-----------|---------------|
| **UI (Interfaz Visual)** | 6/10 | Buena estructura general con buena tipografía, pero componentes UI base rompen el tema visual por colores hardcodeados. |
| **UX (Experiencia Usuario)** | 5/10 | Flujo básico funcional pero con features publicadas incompletas (debug messages), recuperación de contraseña rota, páginas stub vacías. |
| **Accesibilidad (WCAG)** | 5/10 | Falta aria-labels en controles interactivos, falta contraste verificado, falta skip navigation links. |
| **Responsive Design** | 7/10 | Breakpoints básicos presentes (md/lg), menú hamburguesa funciona, pero componentes UI no adaptan bien a distintos tamaños. |
| **Conversión** | 6/10 | Newsletter bien implementado con honeypot, rate limiting, y feedback. Login/registro funcional. |
| **Consistencia** | 4/10 | Puntaje bajo debido a Input y Card components que no respetan el tema, estilos duplicados en CSS, capitalización inconsistente. |
| **Performance** | 6/10 | Lazy loading en imágenes, decoding async, SW registrado. Pero sin lazy loading de páginas ni de módulos. |
| **Visual Quality** | 7/10 | Paleta coherente (verde esmeralda #34D399 + azul oscuro #0B1220), buena jerarquía tipográfica, sombras sutiles. |

## Lecciones Aprendidas

1. **Los componentes UI base deben respetar el sistema de tokens.** Copiar componentes de templates sin adaptar las variables CSS causa problemas visuales que se propagan a toda la aplicación.

2. **No publicar features incompletas con mensajes de debug.** El mensaje *"This feature isn't implemented yet--but don't worry! You can request it in your next prompt!"* es un caso extremo de lo que no debe aparecer en producción.

3. **Las credenciales de backend NUNCA deben estar hardcodeadas en el frontend.** Incluso las anon keys de Supabase pueden comprometer datos.

4. **Las páginas stub con "Cargando..." son peores que una página de 404.** Generan señales negativas tanto para UX como para SEO.

5. **La consistencia del tema es más importante que los detalles visuales.** Un diseño uniforme vale más que componentes individualmente bonitos que no encajan entre sí.

6. **El contenido editorial necesita Schema.org para SEO.** Sin datos estructurados, Google no puede generar rich snippets de artículos.

7. **Las funciones existentes en el código fuente deben usarse.** El contexto de auth ya tenía `resetPassword` definido pero no se usaba en el formulario de login.

---

# ANÁLISIS TRANSVERSAL — HALLAZGOS RECURRENTES

## Problemas Comunes en los 3 Proyectos

### 1. Credenciales Expuestas (CRÍTICO en 3/3 proyectos)
- **Chactivo:** Email hardcodeado en reglas de Firestore
- **Bienestar en Claro:** Credenciales Supabase + email de admin hardcodeado
- **Shop:** Credenciales Supabase + email de admin hardcodeado
- **Solución General:** Eliminar todas las credenciales hardcodeadas, usar variables de entorno obligatorias.

### 2. Colores Hardcodeados Fuera del Sistema de Tokens (CRÍTICO en 3/3 proyectos)
- **Chactivo:** `#E4007C`, `#22203a`, `#413e62` en lugar de variables CSS
- **Shop:** Input y Card con `bg-slate-800/50` fijo
- **Bienestar en Claro:** Estilos inline con valores específicos hardcodeados
- **Solución General:** Migrar todos los colores a variables CSS y usar clases semánticas de Tailwind.

### 3. Features Publicadas Incompletas con Mensajes de Debug (CRÍTICO en 2/3 proyectos)
- **Shop:** "This feature isn't implemented yet..."
- **Bienestar en Claro:** "This feature isn't implemented yet..."
- **Solución General:** Nunca publicar features incompletas. Si no está lista, deshabilitar o ocultar.

### 4. Páginas Stub Vacías (CRÍTICO en 2/3 proyectos)
- **Shop:** 14 rutas con "Cargando..."
- **Bienestar en Claro:** Varias rutas con contenido mínimo
- **Solución General:** Implementar contenido real, redirigir 301, o marcar como noindex.

### 5. Recuperación de Contraseña Rota (CRÍTICO en 2/3 proyectos)
- **Shop:** Toast de "feature no implementada"
- **Bienestar en Claro:** Toast de "feature no implementada"
- **Solución General:** Usar `resetPassword()` ya definido en los contextos de auth.

### 6. Email de Admin Hardcodeado (CRÍTICO en 2/3 proyectos)
- **Shop:** `falcondaniel37@gmail.com` en 3 archivos
- **Bienestar en Claro:** `falcondaniel37@gmail.com` en 4 archivos
- **Solución General:** Campo `role` en tabla de usuarios + variable de entorno `ADMIN_EMAIL`.

### 7. Controles sin aria-labels (MEDIO en 3/3 proyectos)
- **Chactivo:** ChatSidebar, MobileBottomNav, ChatHeader
- **Bienestar en Claro:** Header botones de tema y menú
- **Shop:** Header botones de tema y menú
- **Solución General:** Agregar aria-label a cada botón interactivo.

### 8. Contenido sin Acentos en Español (MEDIO en 2/3 proyectos)
- **Bienestar en Claro:** "articulos", "habitos", "empieza aqui"
- **Shop:** "articulos", "empieza aqui", "como funciona"
- **Solución General:** Revisar todo el copy en español y aplicar acentos correctos.

### 9. Animaciones Excesivas (MEDIO en 1/3 proyectos)
- **Chactivo:** Framer Motion en casi todos los componentes
- **Solución General:** Reducir a animaciones esenciales. Respetar prefers-reduced-motion.

### 10. Sin Schema.org JSON-LD (CRÍTICO en 2/3 proyectos)
- **Bienestar en Claro:** Sin Article, WebSite, Organization, BreadcrumbList
- **Shop:** Sin Article, WebSite, Organization, BreadcrumbList
- **Solución General:** Agregar JSON-LD en cada página relevante.

---

# PLANIFICACIÓN DE MEJORA GLOBAL

## Prioridad 0 — Inmediato (Día 1-3)

| # | Acción | Proyecto | Esfuerzo | Impacto |
|---|--------|----------|----------|---------|
| 1 | Remover credenciales de Supabase del código fuente | Shop + Bienestar | 30 min | 🔴 Crítico |
| 2 | Remover mensajes de debug de CommunityPage.jsx | Shop + Bienestar | 10 min | 🔴 Crítico |
| 3 | Remover email de admin hardcodeado | Shop + Bienestar | 30 min | 🔴 Crítico |
| 4 | Deshabilitar botón "Nuevo Tema" o mostrar mensaje profesional | Shop + Bienestar | 10 min | 🔴 Crítico |
| 5 | Corregir Input y Card components (colores hardcodeados) | Shop | 20 min | 🔴 Crítico |

## Prioridad 1 — Semana 1

| # | Acción | Proyecto | Esfuerzo | Impacto |
|---|--------|----------|----------|---------|
| 6 | Implementar recuperación de contraseña | Shop + Bienestar | 1 hora | 🔴 Crítico |
| 7 | Arreglar LandingPage en Chactivo | Chactivo | 2-3 horas | 🔴 Crítico |
| 8 | Corregir reglas de Firestore para reportes | Chactivo | 15 min | 🔴 Crítico |
| 9 | Aumentar contraseña mínima a 12 caracteres | Chactivo | 30 min | 🔴 Crítico |
| 10 | Agregar aria-labels a botones principales | Todos | 2 horas | 🟡 Medio |
| 11 | Agregar JSON-LD Article + BreadcrumbList | Shop + Bienestar | 2-4 horas | 🔴 Crítico |
| 12 | Remover componentes huérfanos | Bienestar | 30 min | 🟡 Medio |
| 13 | Marcar rutas stub como noindex | Shop + Bienestar | 30 min | 🟡 Medio |

## Prioridad 2 — Semana 2-3

| # | Acción | Proyecto | Esfuerzo | Impacto |
|---|--------|----------|----------|---------|
| 14 | Corregir ortografía con acentos en todo el frontend | Shop + Bienestar | 3-5 horas | 🟡 Medio |
| 15 | Refactorizar ChatSidebar (eliminar duplicación) | Chactivo | 2 horas | 🟡 Medio |
| 16 | Migrar colores hardcodeados a variables CSS | Todos | 6-8 horas | 🟡 Medio |
| 17 | Unificar sistema de color | Shop + Bienestar | 4-6 horas | 🟡 Medio |
| 18 | Agregar skeleton loading states | Shop + Bienestar | 2-3 horas | 🟢 Bajo |
| 19 | Implementar dialog de confirmación al cerrar sesión | Shop + Bienestar | 1 hora | 🟢 Bajo |
| 20 | Corregir capitalización en todo el contenido | Shop + Bienestar | 2-3 horas | 🟡 Medio |

## Prioridad 3 — Semana 4-6

| # | Acción | Proyecto | Esfuerzo | Impacto |
|---|--------|----------|----------|---------|
| 21 | Completar sistema de pago Premium | Chactivo | Variable | 🔴 Crítico |
| 22 | Implementar sistema de roles para admin | Todos | 4-6 horas | 🟡 Medio |
| 23 | Agregar social proof (contadores) | Shop + Bienestar | 4-6 horas | 🟡 Medio |
| 24 | Implementar modo incognito real | Chactivo | 4-6 horas | 🟡 Medio |
| 25 | Refactorizar bot engine a Cloud Functions | Chactivo | 8-12 horas | 🔴 Crítico |
| 26 | Agregar test framework y tests unitarios | Todos | 16-24 horas | 🟡 Medio |
| 27 | Implementar code splitting por rutas | Chactivo + Shop | 8-12 horas | 🟡 Medio |
| 28 | Migrar a Vite 5 | Shop + Bienestar | 4-8 horas | 🟢 Bajo |
| 29 | Implementar WebP/AVIF para imágenes | Shop + Bienestar | 4-6 horas | 🟢 Bajo |
| 30 | Implementar 2FA | Todos | 8-12 horas | 🟡 Medio |

---

# PUNTUACIÓN GLOBAL DE CALIDAD

| Proyecto | UI | UX | Accesibilidad | Responsive | Conversión | Consistencia | Performance | Visual | **Promedio** |
|----------|----|----|---------------|------------|------------|--------------|-------------|--------|--------------|
| **Chactivo** | 7 | 7 | 5 | 6 | 4 | 6 | 5 | 7 | **5.8/10** |
| **Bienestar en Claro** | 6.5 | 6 | 5 | 7 | 5 | 5.5 | 6.5 | 7 | **6.0/10** |
| **Shop** | 6 | 5 | 5 | 7 | 6 | 4 | 6 | 7 | **5.6/10** |
| **GLOBAL** | **6.5** | **6.0** | **5.0** | **6.7** | **5.0** | **5.2** | **5.8** | **7.0** | **5.8/10** |

---

# DECISIÓN FINAL

**Estado: FAIL** — Los 3 proyectos requieren correcciones significativas antes de considerarlos listos para producción a nivel enterprise.

### Razones de Fail:
1. 🔴 **Credenciales expuestas** en 3/3 proyectos
2. 🔴 **Features publicadas con mensajes de debug** visibles para usuarios
3. 🔴 **Colores hardcodeados** que rompen el tema en 3/3 proyectos
4. 🔴 **Páginas stub vacías** que dañan SEO en 2/3 proyectos
5. 🔴 **Recuperación de contraseña rota** en 2/3 proyectos
6. 🔴 **Sin Schema.org JSON-LD** en 2/3 proyectos
7. 🟡 **Accesibilidad deficitaria** en 3/3 proyectos (aria-labels, skip links)
8. 🟡 **Contenido sin acentos** en 2/3 proyectos
9. 🟡 **Consistencia de diseño baja** en 2/3 proyectos

### Umbral de Pass:
- Todos los hallazgos críticos (🔴) deben ser resueltos
- Todos los hallazgos medios (🟡) deben ser resueltos o documentados como deuda intencional
- Score promedio mínimo: 7.5/10
- Score mínimo por categoría: 7/10
- Todos los componentes UI deben respetar el sistema de tokens
- No debe haber mensajes de debug visibles para usuarios

---

# LECCIONES GLOBALES DEL PROYECTO

1. **La seguridad de credenciales es el primer fallo recurrente.** Hardcodear URLs y keys de Supabase/Firebase es el error más común y más peligroso. Siempre usar variables de entorno obligatorias en build-time.

2. **Los componentes UI base son la columna vertebral.** Si Input y Card no respetan el tema, toda la aplicación se ve inconsistente. Invertir tiempo en hacer que los componentes base sean correctos ahorra decenas de horas de correcciones posteriores.

3. **Nunca publicar features incompletas con mensajes de desarrollo.** Un mensaje como *"This feature isn't implemented yet"* visible para usuarios es el equivalente digital de mostrar el backstage de una obra de teatro.

4. **Las páginas stub son peores que una 404.** Generan señales negativas tanto para UX como para SEO. Si no hay contenido, mejor no hay ruta.

5. **La accesibilidad no es opcional.** Faltar aria-labels, skip links, y contenido sin acentos en español afecta directamente la experiencia de todos los usuarios, especialmente aquellos con discapacidades.

6. **Schema.org JSON-LD es esencial para sitios editoriales.** Sin datos estructurados, Google no puede generar rich snippets, y el tráfico orgánico cae significativamente.

7. **La consistencia del tema es más importante que los detalles visuales.** Un diseño uniforme vale más que componentes individualmente bonitos que no encajan entre sí.

8. **Los glosarios y contenido técnico son activos de SEO semántico.** Tener 35+ términos definidos es excelente para E-E-A-T, pero solo si se usa en la UI pública.

9. **La separación entre admin y público es necesaria pero compleja.** El admin necesita su propio diseño oscuro, pero el login de admin no debe exponer credenciales en el frontend.

10. **Las herramientas de desarrollo (Horizons IDE, plugins de Vite) agregan complejidad.** Cada plugin añadido aumenta el riesgo de errores y dificulta el debugging.

---

*Informe generado con metodología PIVF v1.0 — Progressive Implementation & Validation Framework*
*Auditoría realizada con evaluación de nivel Staff Engineer*
*Fecha: Julio 2025*
