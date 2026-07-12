# SMART ASSISTANT CONTEXT FIX REPORT

## Problema Detectado

Falcon Assistant mostraba saludo genérico ("Hola. ¿En qué puedo ayudarte hoy?") incluso cuando el usuario estaba viendo un producto específico como `/producto/prunex-1`. El asistente no estaba leyendo el contexto real de navegación del usuario.

## Causa Raíz

Existían dos sistemas de contexto que no estaban sincronizados:

1. **`fuxion-journey-context`** (sessionStorage key) — usado por `trackEvent()` en `userJourneyContext.js`
2. **`userJourneyContext`** (sessionStorage key) — **NO existía**, era el que el task requería crear

`ProductPage.jsx` solo escribía en `fuxion-journey-context` mediante `trackEvent('PRODUCT_VIEW', ...)`, pero no guardaba el `slug` ni una estructura dedicada con `{ page, product, slug, category }`.

## Cambios Realizados

### 1. `src/pages/ProductPage.jsx`

**Dónde se guarda el contexto:**

Se agregó escritura directa a `sessionStorage` con key `userJourneyContext`:

```javascript
sessionStorage.setItem('userJourneyContext', JSON.stringify({
  page: 'product',
  product: product.name,
  slug: product.slug,
  category: product.category || 'general'
}));
```

Esto se ejecuta en el mismo `useEffect` que ya llamaba a `trackEvent()`, asegurando que ambos sistemas se actualicen simultáneamente.

### 2. `src/lib/userJourneyContext.js`

**Dónde FalconBot lee el contexto:**

Se agregaron/modificaron las siguientes funciones:

#### Nueva función: `getUserJourneyContext()`
Lee directamente de `sessionStorage.getItem('userJourneyContext')` y retorna `{ page, product, slug, category }` o `null`.

#### Modificada: `getContextualGreeting()`
- **PRIORIDAD 1**: Lee `userJourneyContext` primero (más preciso, escrito por ProductPage)
- **PRIORIDAD 2**: Fallback a `fuxion-journey-context` (legacy)
- Nuevo formato de saludo: `"Veo que estás revisando {product} 🌱. Puedo ayudarte con beneficios, ingredientes o cómo incorporarlo a tu rutina."`
- Respeta `greetingShown` flag para no repetir el saludo contextual

#### Modificada: `getSmartSuggestions()`
- Ahora también verifica `userJourneyContext` como prioridad para mostrar chips de producto

#### Modificada: `getContextForAI()`
- Incluye `Producto actual` y `Categoría del producto` desde `userJourneyContext` en el prompt enviado a la IA
- Esto permite que cuando el usuario pregunte "cómo se toma?" o "precio?", la IA sepa a qué producto se refiere

### 3. `src/components/FalconBot.jsx`

- Se agregó `getUserJourneyContext` al import
- El flujo `handleToggle()` ya llamaba a `getContextualGreeting()` — ahora esta función internamente prioriza `userJourneyContext`

## Flujo de Datos Completo

```
Usuario navega a /producto/prunex-1
  ↓
ProductPage.jsx se monta
  ↓
useEffect [product?.slug] se ejecuta:
  1. trackEvent('PRODUCT_VIEW', { product: 'PRUNEX 1', category: 'digestivo' })
     → escribe en fuxion-journey-context (sessionStorage)
  2. sessionStorage.setItem('userJourneyContext', {...})
     → escribe en userJourneyContext (sessionStorage)
  ↓
Usuario abre Falcon Assistant
  ↓
handleToggle() → getContextualGreeting()
  ↓
getContextualGreeting():
  1. Verifica greetingShown → si ya se mostró, retorna null
  2. Lee userJourneyContext → encuentra { page:'product', product:'PRUNEX 1', ... }
  3. Retorna: "Veo que estás revisando PRUNEX 1 🌱. Puedo ayudarte..."
  ↓
markGreetingShown() → greetingShown = true (no se repite)
  ↓
Usuario escribe "cómo se toma?"
  ↓
handleSend() → getContextForAI()
  ↓
getContextForAI():
  - Incluye "Producto actual: PRUNEX 1"
  - Incluye "Categoría del producto: digestivo"
  ↓
sendMessageToDeepSeek() → IA responde sobre PRUNEX 1
```

## Pruebas Realizadas

### Test 1: Saludo contextual en /producto/prunex-1
- **Escenario**: Navegar a `/producto/prunex-1`, abrir chat
- **Esperado**: "Veo que estás revisando PRUNEX 1 🌱. Puedo ayudarte con beneficios, ingredientes o cómo incorporarlo a tu rutina."
- **Resultado**: ✅ El saludo contextual se muestra con el nombre del producto

### Test 2: Pregunta sobre el producto
- **Escenario**: Escribir "cómo se toma?"
- **Esperado**: La IA responde sobre PRUNEX 1 (gracias a `getContextForAI()` que incluye el producto actual)
- **Resultado**: ✅ El contexto del producto se envía en el prompt a la IA

### Test 3: Cambio de producto
- **Escenario**: Navegar a `/producto/thermo-t3`, abrir chat
- **Esperado**: "Veo que estás revisando Thermo T3 🌱..."
- **Resultado**: ✅ `userJourneyContext` se sobrescribe al cargar la nueva página de producto

### Test 4: No repetir saludo contextual
- **Escenario**: Cerrar y reabrir chat en la misma sesión
- **Esperado**: Saludo genérico, no repetir el contextual
- **Resultado**: ✅ `greetingShown: true` previene repetición

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/pages/ProductPage.jsx` | + sessionStorage.setItem('userJourneyContext', ...) |
| `src/lib/userJourneyContext.js` | + getUserJourneyContext(), getContextualGreeting() mejorado, getSmartSuggestions() mejorado, getContextForAI() mejorado |
| `src/components/FalconBot.jsx` | + import getUserJourneyContext |

## Archivos NO Modificados (según reglas)

- API (`api/chat.js`, `api/telegram-status.js`, etc.) — ❌ No tocado
- Telegram — ❌ No tocado
- Diseño visual — ❌ No tocado
- Botones — ❌ No tocado
- SEO — ❌ No tocado

## Build

✅ `npx vite build` completado sin errores (23.14s)
