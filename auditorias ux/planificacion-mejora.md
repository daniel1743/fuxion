# PLANIFICACIÓN DE MEJORA UX/UI — PROYECTOS DE DANIEL FALCÓN

## Versión 3.0 — Basado en Auditoría PIVF

---

# OBJETIVO

Transformar los 3 proyectos en productos listos para producción enterprise, eliminando todos los hallazgos críticos y mejorando los scores de calidad a nivel mínimo de 7.5/10.

---

# FASE 0 — CORRECCIONES INMEDIATAS (Día 1-3)

## Objetivo: Eliminar riesgos de seguridad y visibilidad de errores

### Tarea 1: Remover credenciales de Supabase
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 30 minutos
**Descripción:** Eliminar `DEFAULT_SUPABASE_URL` y `DEFAULT_SUPABASE_ANON_KEY` de `customSupabaseClient.js`. Validar en build-time que las variables de entorno existan.
**Criterio de aceptación:** El build falla si no se proveen credenciales reales.

### Tarea 2: Remover mensajes de debug visibles
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 10 minutos
**Descripción:** Eliminar toast literal `"This feature isn't implemented yet--but don't worry! You can request it in your next prompt!"` de `CommunityPage.jsx`.
**Criterio de aceptación:** Ningún mensaje de desarrollo visible para usuarios.

### Tarea 3: Remover email de admin hardcodeado
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 30 minutos
**Descripción:** Reemplazar `currentUser.email === 'falcondaniel37@gmail.com'` por verificación de rol desde Supabase.
**Criterio de aceptación:** No hay emails hardcodeados en ningún archivo fuente.

### Tarea 4: Deshabilitar botón "Nuevo Tema"
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 10 minutos
**Descripción:** Mostrar mensaje profesional o deshabilitar botón hasta implementar funcionalidad.
**Criterio de aceptación:** Usuario no ve mensaje de debug al intentar crear tema.

### Tarea 5: Corregir Input y Card components (Shop)
**Proyectos afectados:** Shop
**Esfuerzo:** 20 minutos
**Descripción:** Reemplazar colores hardcodeados por variables semánticas de Tailwind.
- Input: `bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring`
- Card: `bg-card border-border text-card-foreground`
**Criterio de aceptación:** Componentes respetan tema dark y light correctamente.

---

# FASE 1 — CORRECCIONES CRÍTICAS (Semana 1)

## Objetivo: Resolver todos los hallazgos 🔴 Alta severidad

### Tarea 6: Implementar recuperación de contraseña
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 1 hora
**Descripción:** Usar `resetPasswordForEmail()` del contexto de auth ya definido.
**Criterio de aceptación:** Usuario puede solicitar y recibir email de recuperación.

### Tarea 7: Arreglar LandingPage en Chactivo
**Proyectos afectados:** Chactivo
**Esfuerzo:** 2-3 horas
**Descripción:** Migrar contenido de LobbyPage a LandingPage con CTAs, beneficios, testimonios.
**Criterio de aceptación:** Ruta "/" muestra página de presentación completa, no "Redirecting to Lobby..."

### Tarea 8: Corregir reglas de Firestore para reportes
**Proyectos afectados:** Chactivo
**Esfuerzo:** 15 minutos
**Descripción:** Agregar regla `allow read, update, delete: if isAuthenticated() && role == 'admin'` en `firestore.rules`.
**Criterio de aceptación:** Admin puede ver y gestionar reportes.

### Tarea 9: Aumentar contraseña mínima
**Proyectos afectados:** Chactivo
**Esfuerzo:** 30 minutos
**Descripción:** Mínimo 12 caracteres + mayúscula + número + carácter especial.
**Criterio de aceptación:** Registro rechaza contraseñas débiles con feedback claro.

### Tarea 10: Agregar aria-labels a botones principales
**Proyectos afectados:** Todos
**Esfuerzo:** 2 horas
**Descripción:** Agregar `aria-label` a todos los botones interactivos del Header, ChatSidebar, MobileBottomNav.
**Criterio de aceptación:** Lighthouse accessibility pasa sin warnings en controles principales.

### Tarea 11: Agregar JSON-LD Article + BreadcrumbList
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 2-4 horas
**Descripción:** Implementar Schema.org JSON-LD en ArticleDetailPage y HomePage usando react-helmet.
**Criterio de aceptación:** Rich snippets aparecen en Google Search Console.

### Tarea 12: Remover componentes huérfanos
**Proyectos afectados:** Bienestar en Claro
**Esfuerzo:** 30 minutos
**Descripción:** Eliminar `CallToAction.jsx`, `WelcomeMessage.jsx`, `HeroImage.jsx`, `Footer.jsx`, `NewsGrid.jsx`, `NewsCard.jsx`, `FeaturedSection.jsx`, `SettingsPanel.jsx`.
**Criterio de aceptación:** Bundle size reducido, sin componentes muertos.

### Tarea 13: Marcar rutas stub como noindex
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 30 minutos
**Descripción:** Agregar `<meta name="robots" content="noindex, nofollow">` a rutas sin contenido real.
**Criterio de aceptación:** Google no indexa páginas stub.

---

# FASE 2 — CALIDAD DE CONTENIDO (Semana 2-3)

## Objetivo: Mejorar UX, accesibilidad y consistencia

### Tarea 14: Corregir ortografía con acentos
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 3-5 horas
**Descripción:** Revisar y corregir todos los textos en JSX con acentos correctos.
- "articulos" → "artículos"
- "habitos" → "hábitos"
- "empieza aqui" → "empieza aquí"
- "como funciona" → "cómo funciona"
**Criterio de aceptación:** Zero typos de acentuación en español.

### Tarea 15: Refactorizar ChatSidebar (Chactivo)
**Proyectos afectados:** Chactivo
**Esfuerzo:** 2 horas
**Descripción:** Extraer `<RoomList />` y reutilizar para evitar duplicación de ~400 líneas.
**Criterio de aceptación:** Un solo componente de lista de salas reutilizado en desktop y mobile.

### Tarea 16: Migrar colores hardcodeados a variables CSS
**Proyectos afectados:** Todos
**Esfuerzo:** 6-8 horas
**Descripción:** Mover todos los colores hex a variables CSS en `:root` y usar clases semánticas de Tailwind.
**Criterio de aceptación:** Zero `#HEXCODE` en componentes. Todos los colores vienen de variables CSS.

### Tarea 17: Unificar sistema de color
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 4-6 horas
**Descripción:** Consolidar gradientes rosa-púrpura y verde esmeralda en variables CSS del tema.
**Criterio de aceptación:** Paleta consistente en todos los componentes.

### Tarea 18: Agregar skeleton loading states
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 2-3 horas
**Descripción:** Reemplazar "Cargando..." por skeleton screens con animación shimmer.
**Criterio de aceptación:** Transiciones suaves al cargar contenido.

### Tarea 19: Implementar dialog de confirmación al cerrar sesión
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 1 hora
**Descripción:** Usar Radix UI AlertDialog para confirmar logout.
**Criterio de aceptación:** Logout requiere confirmación explícita.

### Tarea 20: Corregir capitalización en contenido
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 2-3 horas
**Descripción:** Aplicar reglas de capitalización apropiadas para títulos y subtítulos en español.
**Criterio de aceptación:** "Leer Artículos", "Empieza Aquí", "Cómo Funciona" — correcto.

---

# FASE 3 — MEJORAS ESTRATÉGICAS (Semana 4-6)

## Objetivo: Escalabilidad, performance y features faltantes

### Tarea 21: Completar sistema de pago Premium
**Proyectos afectados:** Chactivo
**Esfuerzo:** Variable
**Descripción:** Implementar Stripe/PayPal o quitar CTAs de PremiumPage.
**Criterio de aceptación:** Usuario puede pagar premium o no ve CTA falso.

### Tarea 22: Implementar sistema de roles para admin
**Proyectos afectados:** Todos
**Esfuerzo:** 4-6 horas
**Descripción:** Crear campo `role` en tabla de usuarios y verificar en cada lugar.
**Criterio de aceptación:** Admin login basado en base de datos, no en email hardcodeado.

### Tarea 23: Agregar social proof
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 4-6 horas
**Descripción:** Sección con métricas sociales (lectores, suscriptores, artículos publicados).
**Criterio de aceptación:** Homepage muestra contadores de actividad.

### Tarea 24: Implementar modo incognito real
**Proyectos afectados:** Chactivo
**Esfuerzo:** 4-6 horas
**Descripción:** Feature que permite navegar sin dejar rastro visible.
**Criterio de aceptación:** Usuario puede activar/desactivar modo incognito.

### Tarea 25: Refactorizar bot engine a Cloud Functions
**Proyectos afectados:** Chactivo
**Esfuerzo:** 8-12 horas
**Descripción:** Mover lógica de bots del cliente al backend para reducir costos de Firestore.
**Criterio de aceptación:** Bots se ejecutan en Cloud Functions, no en cliente.

### Tarea 26: Agregar test framework
**Proyectos afectados:** Todos
**Esfuerzo:** 16-24 horas
**Descripción:** Configurar Jest/Vitest con tests unitarios para componentes críticos.
**Criterio de aceptación:** Coverage > 70% en componentes principales.

### Tarea 27: Implementar code splitting
**Proyectos afectados:** Chactivo, Shop
**Esfuerzo:** 8-12 horas
**Descripción:** React.lazy + Suspense por rutas.
**Criterio de aceptación:** LCP < 2.5s en mobile.

### Tarea 28: Migrar a Vite 5
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 4-8 horas
**Descripción:** Actualizar de Vite 4 a Vite 5 con mejores optimizaciones.
**Criterio de aceptación:** Build exitoso, dev server funcionando.

### Tarea 29: Implementar WebP/AVIF
**Proyectos afectados:** Shop, Bienestar en Claro
**Esfuerzo:** 4-6 horas
**Descripción:** Convertir imágenes a formatos modernos, usar `<picture>` con srcset.
**Criterio de aceptación:** Imágenes principales < 100KB cada una.

### Tarea 30: Implementar 2FA
**Proyectos afectados:** Todos
**Esfuerzo:** 8-12 horas
**Descripción:** Autenticación de dos factores para cuentas de usuario.
**Criterio de aceptación:** Usuario puede activar 2FA con TOTP.

---

# ESTIMACIÓN TOTAL

| Fase | Tiempo Estimado | Impacto |
|------|-----------------|---------|
| Fase 0 | 1.5 días | 🔴 Crítico |
| Fase 1 | 5 días | 🔴 Crítico |
| Fase 2 | 10 días | 🟡 Medio |
| Fase 3 | 25 días | 🟡 Medio |
| **Total** | **~6 semanas** | **Completo** |

---

# METAS DE CALIDAD POST-IMPLEMENTACIÓN

| Categoría | Actual | Meta |
|-----------|--------|------|
| UI Quality | 6.5/10 | 8.5/10 |
| UX Quality | 6.0/10 | 8.0/10 |
| Accesibilidad | 5.0/10 | 8.0/10 |
| Responsive | 6.7/10 | 8.5/10 |
| Conversión | 5.0/10 | 7.5/10 |
| Consistencia | 5.2/10 | 8.0/10 |
| Performance | 5.8/10 | 7.5/10 |
| Visual Quality | 7.0/10 | 8.5/10 |
| **Promedio** | **5.8/10** | **8.0/10** |

---

# PRIORIDADES POR PROYECTO

## Chactivo — Prioridad 1
1. 🔴 LandingPage rota
2. 🔴 Reglas de Firestore para reportes
3. 🔴 Contraseña mínima insegura
4. 🟡 Sidebar duplicada
5. 🟡 Colores hardcodeados
6. 🟡 Exceso de animaciones
7. 🟡 Falta aria-labels
8. 🟡 Exceso de modales "Coming Soon"

## Bienestar en Claro — Prioridad 2
1. 🔴 Credenciales expuestas
2. 🔴 Email admin hardcodeado
3. 🔴 Recuperación de contraseña rota
4. 🔴 Contenido dummy "Chismes"
5. 🔴 Páginas stub vacías
6. 🟡 Sin Schema.org JSON-LD
7. 🟡 Contenido sin acentos
8. 🟡 Componentes huérfanos

## Shop — Prioridad 3
1. 🔴 Credenciales expuestas
2. 🔴 Mensajes de debug visibles
3. 🔴 Email admin hardcodeado
4. 🔴 Input y Card con colores fijos
5. 🔴 Páginas stub con "Cargando..."
6. 🟡 Sin Schema.org JSON-LD
7. 🟡 Contenido sin acentos
8. 🟡 Capitalización incorrecta

---

# RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Credenciales expuestas en producción | Alta | 🔴 Crítico | Variables de entorno obligatorias |
| LandingPage rota afecta SEO | Alta | 🔴 Crítico | Migrar LobbyPage a LandingPage |
| Paginas stub dañan autoridad de dominio | Media | 🔴 Crítico | noindex o contenido real |
| Bot engine consume costos excesivos | Alta | 🔴 Crítico | Migrar a Cloud Functions |
| Mensajes de debug en producción | Media | 🔴 Crítico | Nunca publicar features incompletas |
| Colores hardcodeados rompen tema | Alta | 🟡 Medio | Variables CSS centralizadas |
| Falta de tests introduce bugs | Alta | 🟡 Medio | Jest/Vitest + CI pipeline |

---

# INDICADORES DE ÉXITO

- [ ] Zero credenciales hardcodeadas en producción
- [ ] Zero mensajes de debug visibles para usuarios
- [ ] Score Lighthouse > 90 en Performance, Accessibility, Best Practices, SEO
- [ ] Schema.org JSON-LD presente en todas las páginas relevantes
- [ ] Todos los botones interactivos tienen aria-label
- [ ] Contenido en español con ortografía correcta
- [ ] Sistema de color unificado (zero colores hex en componentes)
- [ ] LCP < 2.5s en mobile
- [ ] CLS < 0.1
- [ ] Componentes UI respetan tema dark y light
- [ ] Sin componentes huérfanos
- [ ] Sin páginas stub con contenido vacío
- [ ] Sistema de roles para admin basado en base de datos
- [ ] Recuperación de contraseña funcional

---

# PRÓXIMOS PASOS

1. **Hoy:** Ejecutar Fase 0 (5 tareas, 1.5 días)
2. **Mañana:** Iniciar Fase 1 (8 tareas, 5 días)
3. **Semana 2:** Iniciar Fase 2 (7 tareas, 10 días)
4. **Semana 4:** Iniciar Fase 3 (5 tareas, 25 días)
5. **Semana 6:** Validación final con métricas de éxito

---

*Planificación generada basada en auditoría PIVF v1.0*
*Fecha: Julio 2025*
