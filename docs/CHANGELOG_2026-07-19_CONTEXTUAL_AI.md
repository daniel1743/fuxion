# Registro de Cambios — 19/Jul/2026

## Motor de IA Contextual para Páginas Editoriales + Corrección Splash PWA

---

## Tarea 1: Corrección de Bug — Splash PWA

### Archivo: `src/components/BienestarEnClaroSplash.jsx`

### Diagnóstico

| Bug | Causa | Impacto |
|-----|-------|---------|
| Splash se muestra en desktop (debe ser solo PWA) | No existía validación de `display-mode: standalone` | Usuarios desktop veían el splash innecesariamente |
| Splash reaparece al navegar entre rutas | `useState(true)` reiniciaba el estado al remontar el componente `App`. Si el splash se remontaba por cambio de ruta, volvía a ejecutarse | Flash de splash al navegar Home → Artículos, etc. |
| Código muerto: `handleClose()` | Buscaba `document.getElementById('initial-splash')`, elemento que no existe en el DOM | Función no-op, código confuso |
| Doble llamada a `onFinish` | `onExitComplete={onFinish}` en `<AnimatePresence>` + llamada en timeout del `useEffect` | Callback ejecutado 2 veces |

### Solución aplicada

1. **Función `isPwaStandalone()`**: Detecta `window.matchMedia('(display-mode: standalone)')` + `navigator.standalone` (Safari)
2. **Función `shouldBypassSplash()`**: Lazy initializer que consulta localStorage + `isPwaStandalone()` antes del primer render
3. **Estado `bypass` inicializado con lazy init**: `useState(() => shouldBypassSplash())` — evita flash al remontar
4. **Eliminado `handleClose()`**: No tenía efecto real
5. **Eliminado `onExitComplete={onFinish}`**: Evita doble ejecución del callback

### Evidencia del código corregido

```jsx
// Líneas 6-21: Nuevas funciones de detección
function isPwaStandalone() {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    if (window.navigator.standalone === true) return true;
  } catch (_) { /* ignore */ }
  return false;
}

function shouldBypassSplash() {
  try {
    return !!localStorage.getItem(SPLASH_KEY) || !isPwaStandalone();
  } catch (_) {
    return !isPwaStandalone();
  }
}

// Línea 25: Lazy initializer
const [bypass, setBypass] = useState(() => shouldBypassSplash());
```

---

## Tarea 2: Motor de IA Contextual — Páginas Editoriales

### Arquitectura

```
Página (BlogPostPage / WellnessArticlePage)
  │
  ├─ trackEvent('ARTICLE_VIEW', { title, slug, category, entities, taxonomy })
  │
  ▼
sessionStorage (fuxion-journey-context)
  │
  ├─ pageMode: 'MODE_ARTICLE'
  ├─ currentArticle: { title, slug, category, entities, taxonomy }
  ├─ currentReading: { progress, startTime }
  └─ currentEditorialContext: { scroll, time, links, shared }
  │
  ▼
FalconBot abre chat → consume:
  ├─ getContextualGreeting()  → "Estoy aquí para ayudarte a entender mejor este tema..."
  ├─ getSmartSuggestions()   → chips dinámicos según taxonomía/entidades
  └─ getContextForAI()       → "Modo de página: MODE_ARTICLE. Artículo: Hígado graso..."
  │
  ▼
deepseekService → api/chat → ConversationEngine
  (backend recibe frontendContext enriquecido SIN cambios en su lógica)
```

### 3 archivos modificados (cambios 100% aditivos)

#### 1. `src/lib/userJourneyContext.js`

**Fase 1 — Eventos editoriales:**

```js
// Nuevo case en trackEvent()
case 'ARTICLE_VIEW': {
  const { title, slug, category, type, entities, taxonomy } = data;
  context.currentArticle = { title, slug, category, entities, taxonomy, type };
  context.currentPage = type === 'wellness' ? 'wellness_article' : 'blog_article';
  context.pageMode = 'MODE_ARTICLE';
  context.currentReading = { progress: 0, startTime: Date.now() };
  context.currentEditorialContext = { lastScroll: 0, totalTime: 0, internalLinks: 0, shared: false };
  break;
}

// Stubs preparados para fase futura:
case 'ARTICLE_SCROLL_25':  // → currentReading.progress = 25
case 'ARTICLE_SCROLL_50':  // → currentReading.progress = 50
case 'ARTICLE_SCROLL_75':  // → currentReading.progress = 75
case 'ARTICLE_SCROLL_100': // → currentReading.progress = 100
case 'ARTICLE_TIME_60S':   // → currentReading.totalTime += 60
case 'ARTICLE_INTERNAL_LINK': // → editorialContext.internalLinks++
case 'ARTICLE_SHARE':         // → editorialContext.shared = true
```

**Fase 2 — Contexto extendido en default:**

```js
const getDefaultContext = () => ({
  // ... campos existentes intactos ...
  pageMode: 'MODE_HOME',           // MODE_HOME | MODE_ARTICLE | MODE_PRODUCT | ...
  currentArticle: null,            // { title, slug, category, entities, taxonomy, type }
  currentReading: {},              // { progress, startTime, totalTime }
  currentEditorialContext: {},     // { lastScroll, totalTime, internalLinks, shared }
});
```

**Fase 4 — Saludo contextual:**

```js
// Añadido como prioridad #6 (después de búsqueda, antes del return null)
if ((context.currentPage === 'blog_article' || context.currentPage === 'wellness_article') && context.currentArticle) {
  const greeting = `Estoy aquí para ayudarte a entender mejor este tema. Si tienes dudas sobre lo que estás leyendo o quieres profundizar, puedo ayudarte.`;
  return { text: greeting, slug: context.currentArticle.slug };
}
```

**Fase 5 — Chips inteligentes dinámicos:**

```js
// Chips según taxonomía del artículo:
if (article.taxonomy) {
  chips.push({ emoji: '🔬', label: 'Más sobre esto', text: `Profundiza sobre ${article.taxonomy}` });
}

// Chips según entidades:
if (article.entities?.length > 0) {
  chips.push({ emoji: '🤔', label: `¿${entities[0]}?`, text: `¿Cómo sé si tengo problemas de ${entities[0].toLowerCase()}?` });
}

// Fallbacks base si no hay suficientes dinámicos:
// → Síntomas, Alimentación, Productos, Hablar con asesor
```

**Fase 6+7 — Contexto enriquecido para IA:**

```js
// getContextForAI() ahora incluye:
if (context.pageMode && context.pageMode !== 'MODE_HOME') {
  parts.push(`Modo de página: ${context.pageMode}`);
}
if (context.currentArticle) {
  parts.push(`Artículo actual: "${article.title}"`);
  parts.push(`Categoría: ${article.category}`);
  parts.push(`Taxonomía: ${article.taxonomy}`);
  parts.push(`Entidades: ${article.entities.join(', ')}`);
  if (reading.progress > 0) parts.push(`Progreso de lectura: ${reading.progress}%`);
  parts.push(`Nota: El usuario está leyendo este artículo educativo...`);
}
```

#### 2. `src/pages/BlogPostPage.jsx`

```diff
+ import { trackEvent } from '@/lib/userJourneyContext';

  useEffect(() => {
    const loadPost = async () => {
      const data = await getPostBySlug(slug);
      if (data) {
        setPost(data);
+       trackEvent('ARTICLE_VIEW', {
+         title: data.title || data.meta_title,
+         slug: data.slug || slug,
+         category: data.categoria || data.category || 'General',
+         type: 'blog',
+         entities: extractSemanticKeywords(data.title || ''),
+         taxonomy: data.taxonomia || data.taxonomy || null,
+       });
      }
    };
    loadPost();
  }, [slug]);
```

#### 3. `src/pages/WellnessArticlePage.jsx`

```diff
+ import { trackEvent } from '@/lib/userJourneyContext';

  useEffect(() => {
    const load = async () => {
      const data = await fetchWellnessArticleBySlug(slug);
      if (data) {
        setArticle(data);
        trackArticleOpen(slug, data.title);
+       trackEvent('ARTICLE_VIEW', {
+         title: data.title,
+         slug: data.slug || slug,
+         category: data.categoria || data.category || 'Bienestar',
+         type: 'wellness',
+         entities: extractSemanticKeywords(data.title || ''),
+         taxonomy: data.taxonomia || data.taxonomy || null,
+       });
      }
    };
    load();
  }, [slug]);
```

### Archivos NO modificados (confirmación de compatibilidad)

| Archivo | Razón |
|---------|-------|
| `FalconBot.jsx` | Ya consume `getContextualGreeting()`, `getSmartSuggestions()`, `getContextForAI()` del pipeline |
| `deepseekService.js` | Ya envía `frontendContext` al backend — los nuevos campos viajan automáticamente |
| `api/chat.js` | Recibe `frontendContext` — no necesita cambios inmediatos, se procesará cuando se implementen modos en backend |
| `conversationEngine.js` | No se modifica — el enriquecimiento es solo de contexto |
| `conversationProfile.js` | No se modifica |
| `reasoningEngine.js` | No se modifica |

### Garantía de compatibilidad

- ✅ Todos los campos nuevos son opcionales (`null` o `{}` por defecto)
- ✅ Si `pageMode` no es `MODE_ARTICLE`, el sistema se comporta exactamente igual que antes
- ✅ Los `case` nuevos no interfieren con `PRODUCT_VIEW`, `CATEGORY_INTEREST`, etc.
- ✅ Las condiciones nuevas están al final de las cadenas de prioridad

### Próximos pasos (fase futura)

- Implementar `IntersectionObserver` en los componentes de artículo para activar `ARTICLE_SCROLL_25/50/75/100`
- Implementar timer para `ARTICLE_TIME_60S`
- Trackear clicks en links internos como `ARTICLE_INTERNAL_LINK`
- Procesar `pageMode` en el backend para ajustar tono de respuestas
- Extender modos: `MODE_CART`, `MODE_CHECKOUT`, `MODE_ACCOUNT`, `MODE_PLAN`, `MODE_DIGITAL_TWIN`