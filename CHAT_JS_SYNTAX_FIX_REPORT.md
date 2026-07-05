# Reporte de Revisión de Sintaxis - api/chat.js

## Resumen Ejecutivo

Se revisó el archivo `api/chat.js` (1591 líneas) y todos sus módulos importados en busca de errores de sintaxis, problemas lógicos y posibles fallos en producción. A continuación se detallan los hallazgos clasificados por severidad.

---

## 🔴 ERROR CRÍTICO: `hasProductContext` busca string incorrecto (Línea 1496)

### Problema
En la línea 1495-1497:

```javascript
const hasProductContext = optimizedMessages.some(m => 
  m.role === 'system' && m.content && m.content.includes('CONTEXTO DEL PRODUCTO')
);
```

### Explicación
Se busca el string `'CONTEXTO DEL PRODUCTO'` en los mensajes del sistema para decidir si guardar en caché, pero revisando `buildProductContext()` y `buildDynamicPrompt()`, **ningún mensaje de sistema contiene ese texto exacto**. Los contextos de producto se insertan con estos prefijos:
- `'INFORMACION DE PRODUCTOS:'` (línea 778)
- `'FICHA TECNICA del producto recomendado:'` (línea 767)
- `'--- INICIO FICHA TECNICA:'` (línea 547)

### Impacto
`hasProductContext` **siempre será `false`**, por lo que la condición en línea 1498:

```javascript
if (hasProductContext || !result.text.toLowerCase().includes('no tiene')) {
```

Siempre dependerá **exclusivamente** de la segunda condición (`!result.text.toLowerCase().includes('no tiene')`). Esto significa que respuestas perfectamente válidas que contengan la palabra "no tiene" (como "no tiene efectos secundarios", "no tiene contraindicaciones", "no tiene cafeína") **no se guardarán en caché**, perdiendo la oportunidad de reutilizar respuestas correctas.

### Gravedad: **ALTA** - El sistema de caché de Supabase no funciona óptimamente.

---

## 🟡 ERROR LÓGICO: `preResult.productosSecundarios` sin validación (Línea 763)

### Problema
En la línea 763:

```javascript
const productContext = buildProductContext([preResult.productoPrincipal, ...preResult.productosSecundarios]);
```

Si `preResult.productosSecundarios` es `undefined` o `null`, el spread operator `...` lanzará un **TypeError** en tiempo de ejecución.

### Impacto
Si `processRecommendation` devuelve un objeto donde `productosSecundarios` no está definido (por ejemplo, si cambia la estructura del PRE), esta línea fallará con:
```
TypeError: Cannot spread undefined
```

### Gravedad: **MEDIA** - Puede causar crash si cambia la estructura del PRE.

---

## 🟡 ERROR LÓGICO: `preResult.productosComplementarios` no se pasa a la IA (Línea 1325)

### Problema
En la línea 1325 se hace debug de `productosComplementarios`:

```javascript
debugLog('PRE', `Productos complementarios: ${preResult.productosComplementarios.join(', ')}`);
```

Pero `productosComplementarios` **nunca se pasa a `buildProductContext`**. Solo se pasan `productoPrincipal` y `productosSecundarios` (línea 763).

### Impacto
Los productos complementarios detectados por el PRE no se incluyen en el contexto que recibe la IA, por lo que la IA no tiene información sobre ellos para recomendarlos adecuadamente.

### Gravedad: **MEDIA** - Funcionalidad de recomendación de complementarios incompleta.

---

## 🟡 ERROR LÓGICO: Duplicación de lógica de derivación a WhatsApp (Líneas 1469-1486 y 1566-1587)

### Problema
La lógica para determinar `showWhatsApp` y `advisorRecommendation` está **duplicada exactamente** en dos lugares:

1. **Bloque de fallback** (líneas 1469-1486) - cuando todas las APIs fallan
2. **Bloque post-respuesta exitosa** (líneas 1566-1587) - cuando hay respuesta de IA

### Código duplicado:
```javascript
// Bloque 1 (líneas 1469-1486) - dentro del if(!result) del fallback
if (riskAssessment.level >= 3) { ... }
else if (/\b(asesor|humano|whatsapp...)/i.test(userMessage)) { ... }
else if (/\b(comprar|quiero comprar...)/i.test(userMessage)) { ... }
else if (/\b(precio|cuanto cuesta...)/i.test(userMessage)) { ... }

// Bloque 2 (líneas 1566-1587) - después del bloque principal
if (riskAssessment.level >= 3) { ... }
else if (/\b(asesor|humano|whatsapp...)/i.test(userMessage)) { ... }
else if (/\b(comprar|quiero comprar...)/i.test(userMessage)) { ... }
else if (/\b(precio|cuanto cuesta...)/i.test(userMessage)) { ... }
```

### Impacto
- **Mantenimiento duplicado**: cualquier cambio en las reglas de derivación debe hacerse en ambos lugares.
- **Riesgo de inconsistencia**: si se modifica un bloque y no el otro, el comportamiento será diferente entre respuestas exitosas y fallback.
- **No es un bug funcional** porque están en ramas mutuamente excluyentes (fallback vs respuesta exitosa), pero es mala práctica.

### Gravedad: **MEDIA** - Riesgo de mantenimiento, no bug funcional.

---

## 🟡 PROBLEMA: Regex de `isGreeting` incluye "gracias" (Línea 725)

### Problema
En la línea 725:

```javascript
const isGreeting = /\b(hola|buenas|buen dí[aá]|buenos d[ií]as|buenas tardes|buenas noches|gracias|muchas gracias|buenas)\b/i.test(String(userMessage || ''));
```

### Explicación
La palabra **"gracias"** está incluida en el patrón de saludo. Esto significa que cuando un usuario dice "gracias", el sistema trata el mensaje como un saludo y **no incluye contexto de productos** en la respuesta (línea 726: `const includeProducts = currentProducts.length > 0 && !isGreeting;`).

### Impacto
Si un usuario dice "gracias" después de recibir una recomendación, el sistema no incluirá el contexto de productos en la siguiente respuesta, lo que puede hacer que la IA pierda el contexto de la conversación y responda de forma genérica.

### Gravedad: **MEDIA** - Comportamiento inesperado en conversaciones.

---

## 🟡 PROBLEMA: Variable `startedAt` sin valor por defecto (Línea 1284)

### Problema
En la línea 1284:

```javascript
const { messages, preferredProvider = 'deepseek', sessionId, startedAt } = req.body;
```

`startedAt` se extrae del body sin valor por defecto. Si el cliente no lo envía, será `undefined`.

### Impacto
`startedAt` se pasa a `processChatConversation` → `evaluateChatEvents` y se almacena en el objeto de retorno (línea 333 de chatEvents.js). Luego en `saveChatEvents` (línea 938 de api/chat.js) se usa en el metadata:

```javascript
metadata: {
  ...
  startedAt: evaluation.startedAt,
  ...
}
```

Si es `undefined`, el metadata quedará incompleto, pero **no causa errores críticos** porque `durationMinutes` se calcula independientemente de `startedAt` mediante `calculateActiveDuration`.

### Gravedad: **BAJA** - Metadata incompleta en eventos guardados.

---

## 🟡 PROBLEMA: Variable `lastError` declarada pero no usada (Líneas 1351 y 1393)

### Problema
En ambos bucles de proveedores (reformulación de caché y llamada directa), se declara `let lastError = null;` pero **nunca se usa** después del bucle.

```javascript
// Línea 1351 (reformulación de caché)
let lastError = null;
for (const provider of providerOrder) { ... }

// Línea 1393 (llamada directa)
let lastError = null;
for (const provider of providerOrder) { ... }
```

### Impacto
- Variable declarada pero no utilizada.
- En el bloque de fallback (línea 1427), cuando todas las APIs fallan, se podría usar `lastError` para dar más contexto en el diagnóstico, pero no se hace.

### Gravedad: **BAJA** - No causa errores, pero es código muerto.

---

## 🟢 OBSERVACIÓN: `getProductDetails` tiene flujo redundante (Líneas 340-407)

### Problema
En la función `getProductDetails`, cuando la búsqueda exacta por clave falla (paso 1) y la búsqueda por nombre normalizado exacto también falla (paso 2), entra al fuzzy match (paso 3). 

Si el fuzzy match encuentra un producto, **retorna inmediatamente** (línea 390-395). Pero si el fuzzy match **no encuentra nada**, el código **continúa** a la línea 398 donde intenta buscar en `verified.productos_verificados` usando `normalizedTarget`, pero **`product` sigue siendo `undefined`** de la línea 358.

En la línea 403:
```javascript
name: product?.nombre || verifiedEntry?.[0] || productName,
```

Si `product` es `undefined` y `verifiedEntry` también es `undefined`, devuelve `productName` como nombre, lo cual es correcto como fallback. Pero el problema es que **nunca busca en `verified.productos_verificados` por fuzzy match**, solo por nombre normalizado exacto.

### Impacto
Si un producto existe solo en `verified.productos_verificados` pero no en `db.productos`, y el usuario escribe el nombre con un pequeño error tipográfico, no se encontrará.

### Gravedad: **BAJA** - Caso borde poco probable.

---

## 🟢 OBSERVACIÓN: `getMentionedProductsFromText` puede tener falsos positivos (Línea 227)

### Problema
En la línea 227:

```javascript
if (normalizedText.includes(entry.normalized) || entry.normalized.includes(normalizedText)) {
  matchedProducts.add(entry.original);
}
```

### Explicación
La condición `entry.normalized.includes(normalizedText)` significa que si el usuario escribe una palabra corta como "on" (que es un producto real), y esa palabra está contenida dentro del nombre normalizado de otro producto (ej: "concentracion" contiene "on"), se agregará "ON" como producto coincidente aunque el usuario no lo haya mencionado.

### Impacto
Falsos positivos en la detección de productos para palabras cortas como "on", "no stress", etc.

### Gravedad: **BAJA** - La línea 222-225 ya filtra por palabra completa para términos <= 3 caracteres, pero solo en el primer bloque. En el segundo bloque (línea 227) no hay ese filtro.

---

## 🟢 OBSERVACIÓN: `sanitizeOutput` puede eliminar contenido válido (Línea 1217)

### Problema
En la línea 1217:

```javascript
cleaned = cleaned.replace(/^.*\|.*$/gm, '');
```

### Explicación
Esta regex elimina **cualquier línea que contenga el carácter `|`**, no solo tablas Markdown. Si la respuesta de la IA contiene una línea con `|` por cualquier otro motivo (ej: "Producto A | Producto B"), esa línea se eliminará por completo.

### Impacto
Pérdida de contenido en respuestas que usen el carácter `|` de forma legítima.

### Gravedad: **BAJA** - Caso borde.

---

## 🟢 OBSERVACIÓN: `getProviderOrder` no valida disponibilidad del proveedor (Línea 1147-1152)

### Problema
La función `getProviderOrder` simplemente reordena los proveedores según la preferencia, pero **no verifica si el proveedor preferido tiene API key configurada**. Si el usuario solicita `preferredProvider: 'gemini'` pero Gemini no tiene API key, se intentará igual y fallará en el bucle.

### Impacto
Una llamada de red innecesaria que fallará. El sistema de fallback lo maneja correctamente (el bucle verifica `api.hasKey()`), pero es ineficiente.

### Gravedad: **INFORMATIVA** - No causa errores, solo ineficiencia menor.

---

## 🟢 OBSERVACIÓN: `printEnvDiagnostic` se ejecuta en cada cold start (Línea 880)

### Problema
En la línea 880:

```javascript
printEnvDiagnostic();
```

Esta función se ejecuta **cada vez que el módulo se carga** (cada cold start de Vercel). Imprime 10+ líneas de log con el diagnóstico de todas las variables de entorno.

### Impacto
- Logs excesivos en producción.
- En Vercel, los logs cuestan dinero y tienen límites de visibilidad.
- Las variables de entorno se verifican de todas formas en `getApiKey()` cuando se necesitan.

### Gravedad: **INFORMATIVA** - Consumo innecesario de logs.

---

## 📋 MAPA COMPLETO DE SALIDAS EN CONSOLA/TERMINAL

A continuación se listan **TODAS** las líneas que generan output en consola/terminal, organizadas por archivo, con su origen y propósito.

### api/chat.js (30 salidas)

| # | Línea | Tipo | Mensaje | Propósito | ¿Problema? |
|---|-------|------|---------|-----------|------------|
| 1 | 48 | `console.log` | `[DEBUG][timestamp] label: data` | Debug condicional (solo si DEBUG_CHAT=true) | ✅ Controlado |
| 2 | 50 | `console.log` | `[DEBUG][timestamp] label: JSON` | Debug condicional | ✅ Controlado |
| 3 | 80 | `console.log` | `📦 Base de datos cargada en memoria (modo ahorrador)` | Informativo de carga | ✅ Una vez |
| 4 | 84 | `console.error` | `Error cargando base de datos: mensaje` | Error al cargar JSON | ⚠️ Necesario |
| 5 | 165 | `console.log` | `🔍 Índice de búsqueda construido: N variantes` | Informativo de construcción | ✅ Una vez |
| 6-15 | 855-877 | `console.log` | Diagnóstico de variables de entorno (10+ líneas) | **printEnvDiagnostic()** | 🔴 Se ejecuta en CADA cold start |
| 16 | 889 | `console.warn` | `⚠️ API key no configurada: NAME` | Advertencia de key faltante | ✅ Necesario |
| 17 | 933 | `console.warn` | `Error consultando inicio de sesión en chat_events:` | Error Supabase | ✅ Necesario |
| 18 | 979 | `console.warn` | `Error guardando chat_events:` | Error Supabase | ✅ Necesario |
| 19 | 982 | `console.warn` | `Error guardando chat_events:` | Error Supabase (catch) | ✅ Necesario |
| 20 | 1077 | `console.warn` | `Error guardando cache de Supabase:` | Error Supabase | ✅ Necesario |
| 21 | 1167 | `console.log` | `[API-DIAG] JSON` | Log estructurado de proveedores | ✅ Necesario |
| 22 | 1361 | `console.warn` | `⏭️ Nombre: API key no configurada (reformulación)` | Provider saltado en reformulación | ✅ Necesario |
| 23 | 1366 | `console.log` | `🔄 Reformulando respuesta cacheada con Nombre...` | Informativo de proceso | ✅ Necesario |
| 24 | 1372 | `console.log` | `✅ Respuesta reformulada con Nombre (Nms)` | Éxito de reformulación | ✅ Necesario |
| 25 | 1380 | `console.warn` | `⚠️ Nombre falló al reformular (Nms): [CAUSA] error` | Error de proveedor en reformulación | ✅ Necesario |
| 26 | 1386 | `console.log` | `📦 Usando respuesta cacheada directamente` | Fallback a caché directa | ✅ Necesario |
| 27 | 1404 | `console.warn` | `⏭️ Nombre: API key no configurada` | Provider saltado | ✅ Necesario |
| 28 | 1409 | `console.log` | `🔄 Intentando con Nombre...` | Informativo de proceso | ✅ Necesario |
| 29 | 1415 | `console.log` | `✅ Respuesta obtenida de Nombre (Nms)` | Éxito de API | ✅ Necesario |
| 30 | 1423 | `console.warn` | `⚠️ Nombre falló (Nms): [CAUSA] error` | Error de proveedor | ✅ Necesario |
| 31 | 1428 | `console.error` | `❌ Todas las APIs fallaron` | Error crítico | ✅ Necesario |
| 32 | 1442 | `console.error` | `[API-DIAG] Resumen: JSON` | Diagnóstico de fallo total | ✅ Necesario |
| 33 | 1526 | `console.warn` | `Error procesando eventos de chat:` | Error en post-procesamiento | ✅ Necesario |

### lib/chatEvents.js (6 salidas)

| # | Línea | Tipo | Mensaje | Propósito | ¿Problema? |
|---|-------|------|---------|-----------|------------|
| 1 | 344 | `console.log` | `event_created [events]` | Eventos detectados en la conversación | ⚠️ **Siempre se ejecuta** en cada request |
| 2 | 345 | `console.log` | `score_generated N` | Score de intención de compra | ⚠️ **Siempre se ejecuta** en cada request |
| 3 | 346 | `console.log` | `intent_level N` | Nivel de intención | ⚠️ **Siempre se ejecuta** en cada request |
| 4 | 347 | `console.log` | `is_business_intent true/false` | Si es intención de negocio | ⚠️ **Siempre se ejecuta** en cada request |
| 5 | 372 | `console.log` | `telegram_sent true/false` | Resultado de envío Telegram | ⚠️ **Siempre se ejecuta** en cada request |
| 6 | 374 | `console.log` | `telegram_failed` | Falla de Telegram | ⚠️ **Siempre se ejecuta** en cada request |

### lib/recommendation/recommendationEngine.js (5 salidas)

| # | Línea | Tipo | Mensaje | Propósito | ¿Problema? |
|---|-------|------|---------|-----------|------------|
| 1 | ~50 | `console.warn` | `⚠️ [PRE] Recomendación inválida, recalculando...` | Validación falló | ✅ Necesario |
| 2 | ~51 | `console.warn` | Reporte de validación | Detalles de validación | ✅ Necesario |
| 3 | ~60 | `console.log` | `✅ [PRE] Recomendación alternativa encontrada: X` | Éxito de alternativa | ✅ Necesario |
| 4 | ~70 | `console.warn` | `⚠️ [PRE] No se encontró alternativa válida.` | Sin alternativa | ✅ Necesario |
| 5 | ~80 | `console.log` | `[PRE] No se encontró recomendación para este mensaje` | Sin match | ✅ Necesario |
| 6 | ~90 | `console.log` | `✅ [PRE] Recomendación: X (Nms)` | Éxito de recomendación | ✅ Necesario |

### lib/recommendation/recommendationRules.js (1 salida)

| # | Línea | Tipo | Mensaje | Propósito | ¿Problema? |
|---|-------|------|---------|-----------|------------|
| 1 | ~variable | `console.warn` | `Error evaluando regla ID: mensaje` | Error en regla de negocio | ✅ Necesario |

---

## 🔍 ANÁLISIS DE IMPACTO DE SALIDAS EN CONSOLA

### 🟡 chatEvents.js: 6 logs SIEMPRE activos por cada request

Las líneas 344, 345, 346, 347, 372, 374 de `lib/chatEvents.js` usan `console.log` **sin ninguna condición**. Se ejecutan en **CADA request** que pasa por `processChatConversation()`.

**¿Dónde se llama?** → En `api/chat.js` línea 1511:
```javascript
const evaluation = await processChatConversation({...});
```

**Impacto:**
- 6 líneas de log por cada mensaje de chat
- En producción con muchos usuarios, esto genera volumen significativo de logs
- En Vercel, los logs tienen costo y límites de retención
- No hay forma de desactivarlos (no dependen de `DEBUG_CHAT`)

**Sugerencia:** Envolver estos logs en una condición similar a `DEBUG_CHAT` o al menos usar `console.debug` en lugar de `console.log`.

### 🟡 printEnvDiagnostic(): 10+ líneas en cada cold start

La función `printEnvDiagnostic()` (líneas 854-877) se ejecuta automáticamente al cargar el módulo (línea 880). En Vercel, cada cold start (aprox. cada 5-15 minutos sin actividad) genera 10+ líneas de log.

**Impacto:**
- En Vercel Hobby (gratuito), los logs se limitan a 400KB/día
- 10 líneas por cold start × ~100 cold starts/día = ~1000 líneas/día solo de diagnóstico
- La información ya se verifica en `getApiKey()` cuando se necesita

**Sugerencia:** Mover a debug condicional o eliminar en producción.

### ✅ recommendationEngine.js y recommendationRules.js: Logs controlados

Los logs del PRE son informativos y necesarios para debugging. Se ejecutan solo cuando hay actividad de recomendación.

---

## Resumen de Correcciones Recomendadas

| # | Severidad | Archivo | Línea(s) | Problema | Corrección |
|---|-----------|---------|----------|----------|------------|
| 1 | 🔴 ALTA | api/chat.js | 1495-1497 | `hasProductContext` busca string inexistente `'CONTEXTO DEL PRODUCTO'` | Cambiar a buscar `'INFORMACION DE PRODUCTOS:'` o `'FICHA TECNICA'` |
| 2 | 🟡 MEDIA | api/chat.js | 763 | `preResult.productosSecundarios` sin validación | Agregar `\|\| []` al spread |
| 3 | 🟡 MEDIA | api/chat.js | 763 | `productosComplementarios` no se pasa a `buildProductContext` | Incluir en el array |
| 4 | 🟡 MEDIA | api/chat.js | 1469-1486 / 1566-1587 | Lógica de derivación a WhatsApp duplicada | Extraer a función reutilizable |
| 5 | 🟡 MEDIA | api/chat.js | 725 | "gracias" tratado como saludo | Mover "gracias" a patrón separado |
| 6 | 🟡 MEDIA | lib/chatEvents.js | 344-374 | 6 logs siempre activos por cada request | Envolver en condición DEBUG o usar console.debug |
| 7 | 🟢 BAJA | api/chat.js | 880 | `printEnvDiagnostic` en cada cold start | Mover a debug condicional |
| 8 | 🟢 BAJA | api/chat.js | 1284 | `startedAt` sin valor por defecto | Agregar `startedAt = null` |
| 9 | 🟢 BAJA | api/chat.js | 1351, 1393 | Variable `lastError` no utilizada | Eliminar o usar en diagnóstico |
| 10 | 🟢 BAJA | api/chat.js | 1217 | Regex elimina líneas con `\|` | Mejorar regex |
| 11 | 🟢 BAJA | api/chat.js | 227 | Posible falso positivo en detección | Agregar filtro de palabra completa |

---

## Conclusión

El archivo `api/chat.js` está **funcionalmente operativo** y **no tiene errores de sintaxis** que impidan su ejecución. Sin embargo, se identificaron los siguientes problemas que afectan el comportamiento en producción:

### Lo que más afecta (prioridad de corrección):

1. **🔴 El caché de Supabase no funciona óptimamente** (api/chat.js:1496): Busca el string `'CONTEXTO DEL PRODUCTO'` que nunca se inserta. Respuestas válidas como "no tiene efectos secundarios" no se guardan en caché.

2. **🟡 6 logs siempre activos en chatEvents.js** (líneas 344-374): Cada mensaje de chat genera 6 líneas de log sin posibilidad de desactivarlos, consumiendo cuota de logs en Vercel.

3. **🟡 "gracias" tratado como saludo** (api/chat.js:725): Cuando un usuario agradece, se pierde el contexto de productos.

4. **🟡 Productos complementarios ignorados** (api/chat.js:763): El PRE detecta complementarios pero nunca se pasan a la IA.

5. **🟡 Riesgo de crash** (api/chat.js:763): Si `preResult.productosSecundarios` es `undefined`, TypeError.
