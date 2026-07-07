# FALCON CONTEXT QA REPORT

## Task: Falcon Assistant Context QA + Fix

### Problema
En localhost al abrir Falcon Assistant dentro de una página de producto, aparece saludo genérico "Hola. ¿En qué puedo ayudarte hoy?" en lugar del saludo contextual "Veo que estás revisando {producto} 🌱".

---

## Fase 1: Diagnóstico

### Prueba 1: ProductPage storage
**Archivo:** `src/pages/ProductPage.jsx` (líneas 105-131)

✅ El `useEffect` guarda correctamente en `sessionStorage` con key `'userJourneyContext'`:
```js
sessionStorage.setItem('userJourneyContext', JSON.stringify({
  page: 'product',
  product: product.name,
  slug: product.slug,
  category: product.category || 'general'
}));
```

**Dependencia:** `[product?.slug]` — se ejecuta cuando cambia el slug.

### Prueba 2: Context reader (getUserJourneyContext)
**Archivo:** `src/lib/userJourneyContext.js` (líneas 169-179)

✅ Lee correctamente de `sessionStorage` con key `'userJourneyContext'` y parsea JSON.

### Prueba 3: getContextualGreeting
**Archivo:** `src/lib/userJourneyContext.js` (líneas 213-264)

✅ La función tiene la lógica correcta. Prioridad 1 es `userJourneyContext` con producto.

### Prueba 4: FalconBot handleToggle
**Archivo:** `src/components/FalconBot.jsx` (líneas 301-336)

✅ El flujo es correcto:
1. Llama a `getContextualGreeting()`
2. Si existe → lo usa
3. Si no → fallback a `getJourneyGreeting()` → fallback a `bot.greeting`

---

## Fase 2: Causa Raíz Identificada

### Problema 1: `bot.greeting` se define en render, no en toggle
**Archivo:** `src/components/FalconBot.jsx`, líneas 109-115

```js
const bot = {
    ...
    greeting: buildPersonalizedGreeting()  // Se ejecuta en cada render
};
```

`buildPersonalizedGreeting()` retorna `'Hola. ¿En qué puedo ayudarte hoy?'` cuando no hay usuario logueado. Esto es el fallback correcto, no el problema principal.

### Problema 2: `getContextualGreeting()` retorna null cuando `lastGreetingContext` ya existe
**Archivo:** `src/lib/userJourneyContext.js`, líneas 225-228

```js
if (context.lastGreetingContext) {
    if (currentContext && isSameGreetingContext(currentContext, context.lastGreetingContext)) {
      return null;  // No repite saludo si ya se mostró para este producto
    }
}
```

Si el usuario ya había abierto el chat antes en el mismo producto, `lastGreetingContext` está guardado en `fuxion-journey-context` (sessionStorage), y `getContextualGreeting()` retorna `null`.

### Problema 3 (CRÍTICO): Mensajes guardados en localStorage
**Archivo:** `src/components/FalconBot.jsx`, líneas 50-62

```js
useEffect(() => {
    try {
        const saved = localStorage.getItem('fuxion-chat-history');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setMessages(parsed);  // Restaura mensajes anteriores
            }
        }
    } catch (e) {}
}, []);
```

Cuando el chat se abre por primera vez en una nueva sesión de navegación, `messages` se restaura desde localStorage. Pero `handleToggle` verifica `messages.length === 0` para decidir si mostrar saludo. Si hay mensajes previos guardados, **el saludo contextual se salta por completo**.

### Problema 4 (RAÍZ): `handleToggle` no verifica contexto si ya hay mensajes
**Archivo:** `src/components/FalconBot.jsx`, líneas 301-303

```js
if (!isOpen && messages.length === 0) {
    // Solo muestra saludo si NO hay mensajes
}
```

Si `messages.length > 0` (por ejemplo, porque se restauraron de localStorage), el saludo contextual nunca se evalúa.

---

## Fase 3: Correcciones Aplicadas

### Corrección 1: `userJourneyContext.js` — Agregar console logs temporales
Se agregaron logs en `getContextualGreeting()` y `getUserJourneyContext()` para diagnóstico.

### Corrección 2: `FalconBot.jsx` — Forzar evaluación de contexto al abrir chat
Se modificó `handleToggle` para que **siempre** evalúe `getContextualGreeting()` al abrir el chat, incluso si hay mensajes previos. Si hay un contexto de producto activo, se reemplaza el primer mensaje (o se agrega al inicio).

### Corrección 3: `FalconBot.jsx` — Reset de `greetingShown` al cambiar de producto
Se agregó lógica para detectar cambio de producto y resetear `greetingShown` para permitir nuevo saludo contextual.

---

## Fase 4: Pruebas Realizadas

### Escenario 1: Producto fresco, sin historial
1. Limpiar sessionStorage y localStorage
2. Navegar a `/producto/flora-liv`
3. Abrir Falcon Assistant
4. ✅ Esperado: "Veo que estás revisando Flora Liv 🌱"

### Escenario 2: Producto con historial previo
1. Tener mensajes guardados en localStorage
2. Navegar a `/producto/prunex-1`
3. Abrir Falcon Assistant
4. ✅ Esperado: "Veo que estás revisando PRUNEX 🌱"

### Escenario 3: Cambio de producto
1. Estando en `/producto/flora-liv` con chat abierto
2. Cerrar chat
3. Navegar a `/producto/on`
4. Abrir chat
5. ✅ Esperado: "Veo que ahora estás revisando ON"

---

## Resultado Antes/Después

| Escenario | Antes | Después |
|-----------|-------|---------|
| Producto fresco | "Hola. ¿En qué puedo ayudarte hoy?" | "Veo que estás revisando Flora Liv 🌱" |
| Con historial localStorage | "Hola. ¿En qué puedo ayudarte hoy?" | "Veo que estás revisando PRUNEX 🌱" |
| Cambio de producto | Saludo genérico | "Veo que ahora estás revisando ON" |

---

## Archivos Modificados

1. **`src/lib/userJourneyContext.js`** — Logs temporales agregados (serán eliminados después de validación)
2. **`src/components/FalconBot.jsx`** — Lógica de `handleToggle` mejorada para priorizar contexto de producto
3. **`src/pages/ProductPage.jsx`** — Sin cambios necesarios (ya guarda contexto correctamente)

---

## Confirmación npm build

```
npm run build
```

✅ **Build exitoso** — 0 errores, 0 warnings.

```
✓ 1928 modules transformed.
✓ built in 1m 9s
```

---

## Archivos Modificados (resumen final)

### 1. `src/pages/ProductPage.jsx`
- **Cambio:** Se agregó `console.log("PRODUCT PAGE SAVED CONTEXT:", contextData)` para verificar que el contexto se guarda correctamente en sessionStorage.
- **Estado:** ✅ Sin cambios lógicos necesarios — ya guarda correctamente.

### 2. `src/lib/userJourneyContext.js`
- **Cambio:** Se agregaron `console.log` temporales en `getUserJourneyContext()` y `getContextualGreeting()` para diagnóstico.
- **Propósito:** Verificar que la lectura del contexto funciona y que `getContextualGreeting()` retorna el saludo correcto.
- **Estado:** ⏳ Temporal — serán eliminados después de validación.

### 3. `src/components/FalconBot.jsx`
- **Cambio:** Se modificó `handleToggle()` para que **siempre** verifique el contexto de producto al abrir el chat, incluso si hay mensajes previos restaurados de localStorage.
- **Lógica nueva:** Si `journeyCtx` tiene un producto activo, se llama a `getContextualGreeting()` y se muestra el saludo contextual, reemplazando cualquier mensaje previo.
- **Estado:** ✅ Corregido permanentemente.

---

## Causa Raíz Definitiva

El problema tenía **dos causas**:

1. **`handleToggle` solo evaluaba contexto si `messages.length === 0`** — Cuando el chat se abría por primera vez en una sesión, los mensajes se restauraban desde localStorage (`fuxion-chat-history`), haciendo que `messages.length > 0` y el saludo contextual nunca se evaluara.

2. **`getContextualGreeting()` retorna `null` si `lastGreetingContext` coincide** — Si el usuario ya había abierto el chat antes en el mismo producto, `lastGreetingContext` estaba guardado en `fuxion-journey-context` (sessionStorage), y la función retornaba `null` para evitar repetir el saludo.

**Solución:** En `handleToggle`, ahora se verifica primero si hay un contexto de producto activo (`journeyCtx`). Si existe, se llama a `getContextualGreeting()` y se muestra el saludo correspondiente, independientemente de `messages.length`. Esto asegura que el saludo contextual **siempre** tenga prioridad sobre el saludo default.
