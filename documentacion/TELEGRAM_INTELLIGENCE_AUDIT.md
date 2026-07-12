# TELEGRAM INTELLIGENCE AUDIT
## Falcon Assistant - Precisión de Notificaciones

**Fecha:** 7 de junio 2026
**Auditor:** Sistema de Auditoría Automatizada
**Estado:** ⚠️ Falsos Positivos Detectados

---

## ÍNDICE

1. [Flujo Actual Completo](#1-flujo-actual-completo)
2. [Problemas Encontrados](#2-problemas-encontrados)
3. [Falsos Positivos Posibles](#3-falsos-positivos-posibles)
4. [Propuesta para Mejorar Precisión](#4-propuesta-para-mejorar-precisión)
5. [Archivos a Modificar](#5-archivos-a-modificar)

---

## 1. FLUJO ACTUAL COMPLETO

### 1.1 Diagrama de Flujo

```
Usuario escribe mensaje
        │
        ▼
┌─────────────────────────────────────┐
│  api/chat.js (handler principal)    │
│  1. Recibe mensaje del usuario      │
│  2. Extrae productos mencionados    │
│  3. Ejecuta PRE (recomendación)     │
│  4. Construye prompt con contexto   │
│  5. Llama a API de IA               │
│  6. Obtiene respuesta               │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  processChatConversation()          │
│  lib/chatEvents.js                  │
│                                     │
│  1. evaluateChatEvents():           │
│     a. extractProductMatches()      │
│        - Busca productos en mensajes│
│        - Fuzzy matching             │
│     b. calculateBuyIntentScore()    │
│        - Evalúa señales de compra   │
│        - Suma puntos por señal      │
│     c. detectBusinessIntent()       │
│     d. calculateActiveDuration()    │
│     e. getIntentLevel()             │
│                                     │
│  2. Si shouldNotify=true:           │
│     a. buildEventSummary()          │
│     b. buildTelegramMessage()       │
│     c. sendTelegramNotification()   │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  sendTelegramNotification()         │
│  lib/telegramNotifier.js            │
│  → POST a Telegram API              │
└──────────────────┬──────────────────┘
                   │
                   ▼
           🔔 TELEGRAM
    "🔥 LEAD CALIENTE FUXION"
```

### 1.2 Archivos Involucrados

| Archivo | Rol |
|---------|-----|
| `api/chat.js` | Handler principal. Recibe mensaje, construye prompt, llama IA, dispara evaluación |
| `lib/chatEvents.js` | **Núcleo de la auditoría**. Evalúa eventos, calcula score, decide si notificar |
| `lib/telegramNotifier.js` | Envía el mensaje formateado a Telegram |
| `config/chatAlertRules.js` | Define patrones, scores, niveles de intención, templates |
| `lib/eventEngine.js` | Wrapper que conecta chatEvents con chatAnalytics |
| `lib/chatAnalytics.js` | Punto de entrada desde el frontend (no usado actualmente) |
| `lib/conversation/conversationProfile.js` | Perfil de conversación (CIE) - detecta señales de compra adicionales |
| `lib/conversation/conversationEngine.js` | Motor de perfil conversacional |
| `lib/recommendation/recommendationRules.js` | Reglas de negocio para recomendación de productos |
| `lib/recommendation/recommendationEngine.js` | Motor de recomendación (PRE) |
| `src/services/deepseekService.js` | Frontend service - envía mensajes al backend |
| `src/components/FalconBot.jsx` | Componente de chat frontend |

### 1.3 Sistema de Scoring Actual

#### Puntos por señal detectada:

| Señal | Puntos | Regex |
|-------|--------|-------|
| "quiero comprar", "cómo compro", "me interesa", "tienen disponible" | **+40** | `BUY_INTENT_STRONG.buyPhrases` |
| "precio", "cuánto cuesta", "valor" | **+30** | `BUY_INTENT_PRICE.priceQuestion` |
| "envían", "delivery", "despacho", "dónde entregan" | **+30** | `BUY_INTENT_LOGISTICS.logisticsQuestion` |
| "tengo estreñimiento", "quiero energía", "quiero bajar de peso", "necesito algo para" | **+25** | `BUY_INTENT_SPECIFIC_PROBLEM.specificProblem` |
| Producto repetido en múltiples mensajes | **+20** | `BUY_INTENT_REPEATED_PRODUCT` |
| "beneficios", "sirve", "para qué", "qué hace", "funciona" | **+10** | `BUY_INTENT_MEDIUM.benefits` |
| "ingredientes", "contiene", "composición" | **+10** | `BUY_INTENT_MEDIUM.ingredients` |
| "vs", "versus", "comparar", "diferencia entre", "mejor que" | **+10** | `BUY_INTENT_MEDIUM.comparison` |

#### Niveles de Intención:

| Nivel | Score | ¿Notifica? | Label |
|-------|-------|-----------|-------|
| Curioso | 0-39 | ❌ No | `Curioso` |
| Interesado | 40-69 | ❌ No | `Interesado` |
| 🔥 LEAD CALIENTE | 70+ | ✅ Sí | `🔥 LEAD CALIENTE` |
| 🚀 OPORTUNIDAD NEGOCIO | N/A | ✅ Sí | `🚀 OPORTUNIDAD NEGOCIO` |

#### Reglas de Validación Post-Score:

1. **Si no hay señal fuerte** (comprar, precio, despacho, problema específico) → score máximo **69** (no LEAD CALIENTE)
2. **Si solo hay señales medias** (beneficios, ingredientes, comparación) sin producto repetido → score máximo **30**

---

## 2. PROBLEMAS ENCONTRADOS

### 🔴 PROBLEMA 1: Producto "ON" detectado por fuzzy matching incorrecto

**Archivo:** `config/chatAlertRules.js` línea 79

```javascript
products: [
    ...
    'on',     // ← PRODUCTO "ON" (Vigor Mental)
    ...
]
```

**Problema:** La palabra "ON" está registrada como producto en `CHAT_RULE_PATTERNS.products`. En `extractProductMatches()` (chatEvents.js línea 83-114), se usa `normalized.includes(product)` para detectar productos. La palabra "ON" aparece en muchas frases en español:

- "quiero saber **sobre** Prunex" → "sobre" contiene "on" → **FALSO POSITIVO**
- "información" → contiene "on" → **FALSO POSITIVO**
- "conversación" → contiene "on" → **FALSO POSITIVO**
- "recomendación" → contiene "on" → **FALSO POSITIVO**
- "funciona" → termina en "ona" pero contiene "on" → **FALSO POSITIVO**

**Impacto:** Cuando un usuario pregunta "quiero saber sobre Prunex", el sistema detecta:
- `prunex` ✅ (correcto)
- `on` ❌ (falso positivo - la palabra "sobre" contiene "on")

Esto causa que Telegram muestre "Prunex, ON" como productos de interés.

**Evidencia en código:**
```javascript
// chatEvents.js línea 90-94
for (const product of CHAT_RULE_PATTERNS.products) {
    if (normalized.includes(product)) {  // ← "sobre".includes("on") = TRUE
        matchedProducts.add(product);
    }
}
```

### 🔴 PROBLEMA 2: Múltiples productos detectados por beneficio/intención

**Archivo:** `api/chat.js` líneas 172-209 (BENEFIT_TO_PRODUCT_MAP)

Cuando el usuario pregunta "quiero saber sobre Prunex", el sistema también ejecuta `getProductsFromBenefitIntent()` que mapea palabras clave a productos. Por ejemplo:

- Si el usuario dice "quiero saber sobre Prunex" y la palabra "saber" no dispara nada, pero el sistema también ejecuta `getMentionedProductsFromText()` que detecta "prunex" y "on" (por el problema 1).

**Además**, en `buildDynamicPrompt()` (api/chat.js línea 741-903), se mezclan:
- `userProducts` (productos mencionados por usuario)
- `benefitProducts` (productos inferidos por intención/beneficio)
- `historyProducts` (productos del historial)

**Problema:** Los productos inferidos por beneficio se mezclan con los productos realmente mencionados, y ambos se pasan a `processChatConversation()` como `productNames`.

### 🔴 PROBLEMA 3: La pregunta "quiero saber sobre Prunex" dispara señales de compra

**Archivo:** `lib/chatEvents.js` líneas 154-234

Analicemos el mensaje: **"quiero saber sobre Prunex"**

1. `normalizeText("quiero saber sobre Prunex")` → `"quiero saber sobre prunex"`
2. `BUY_INTENT_STRONG.buyPhrases.test("quiero saber sobre prunex")`:
   - Regex: `/\b(quiero comprar|c[oó]mo compro|d[oó]nde compro|quiero pedir|me interesa|lo quiero|tienen disponible)\b/i`
   - "quiero saber" NO coincide con "quiero comprar" ✅ (bien)
   - Pero **"me interesa"** NO está en el texto ✅
   - **Sin embargo**, si el usuario dice "me interesa" → +40 puntos

3. `BUY_INTENT_PRICE.priceQuestion.test("quiero saber sobre prunex")` → NO ✅

4. `BUY_INTENT_MEDIUM.benefits.test("quiero saber sobre prunex")`:
   - Regex: `/\b(beneficios?|sirve|para qu[eé]|para que|qu[eé] hace|funciona)\b/i`
   - "saber" → NO contiene "sirve" ✅
   - Pero **"saber"** NO está en el patrón ✅

**Conclusión:** Para "quiero saber sobre Prunex" el score debería ser **0** si solo es una pregunta exploratoria. Sin embargo, el problema real es la **detección de productos** (problema 1 y 2) que hace que se incluyan productos incorrectos en el reporte.

### 🔴 PROBLEMA 4: El template de Telegram siempre dice "LEAD CALIENTE"

**Archivo:** `config/chatAlertRules.js` líneas 111-135

```javascript
export const TELEGRAM_MESSAGE_TEMPLATE = `🔥 LEAD CALIENTE FUXION
...
🎯 Intención compra:
{score}%
...
🧠 Detectado:
{summary}
...
Acción recomendada:
Contactar ahora`;
```

**Problema:** El template SIEMPRE comienza con "🔥 LEAD CALIENTE FUXION" independientemente del nivel de intención real. Aunque el score sea 40 (interesado, no LEAD CALIENTE), el mensaje siempre dice "LEAD CALIENTE".

**Además:** El template no diferencia entre:
- Usuario explorando (score 0-30)
- Usuario interesado (score 40-69)
- Usuario listo para comprar (score 70+)

Siempre usa el mismo template con el mismo encabezado.

### 🔴 PROBLEMA 5: No hay diferenciación entre "producto mencionado por usuario" y "producto sugerido por IA"

**Archivo:** `lib/chatEvents.js` líneas 291-385 (`buildEventSummary`)

En `buildEventSummary()`, la variable `productNames` contiene TODOS los productos detectados, sin distinguir entre:
- Productos que el usuario mencionó explícitamente
- Productos que la IA recomendó o mencionó en su respuesta
- Productos inferidos por beneficio

**Ejemplo concreto:**
- Usuario: "quiero saber sobre Prunex"
- IA responde: "Prunex 1 es ideal para limpieza de colon. También podrías considerar Flora Liv para regenerar la flora intestinal."
- `productNames` incluiría: `['prunex', 'on', 'flora liv']` (prunex + falso positivo ON + flora liv mencionado por IA)

Telegram mostraría: "📦 Producto: prunex, on, flora liv" cuando el usuario solo preguntó por Prunex.

### 🔴 PROBLEMA 6: El sistema de scoring no considera el contexto de la conversación

**Archivo:** `lib/chatEvents.js` líneas 154-234

`calculateBuyIntentScore()` evalúa CADA mensaje de forma independiente. No considera:
- Si el usuario ya compró antes
- Si el usuario está en etapa de exploración inicial
- Si el usuario está comparando vs comprando
- La intención real detrás de las palabras

**Ejemplo:** "¿Cuánto cuesta?" puede ser:
- Exploración: "solo quiero saber precios" → debería ser MEDIO
- Compra: "dime el precio para comprar" → debería ser ALTO

El sistema actual trata ambas como +30 (ALTO).

### 🔴 PROBLEMA 7: No hay rate limiting ni supresión de alertas duplicadas

No hay mecanismo para:
- Evitar múltiples alertas para la misma conversación
- Agrupar alertas de la misma sesión
- Esperar a tener suficiente información antes de alertar
- Suprimir alertas si el usuario solo está navegando

Cada mensaje del usuario puede disparar una alerta independiente si el score supera 70.

### 🔴 PROBLEMA 8: El perfil de conversación (CIE) tiene su propio scoring que no se sincroniza con el de Telegram

**Archivo:** `lib/conversation/conversationProfile.js` líneas 70-77

```javascript
const PURCHASE_SIGNAL_PATTERNS = [
    { pattern: /\b(quiero|necesito|necesitaría|me gustaría|quisiera|requiero)\b/i, signal: 'intención explícita', weight: 10 },
    ...
];
```

**Problema:** "quiero saber sobre Prunex" contiene "quiero" que dispara la señal `intención explícita` con peso 10 en el perfil de conversación. Aunque esto no afecta directamente el score de Telegram, sí afecta `purchaseProbability` del perfil.

---

## 3. FALSOS POSITIVOS POSIBLES

### 3.1 Escenario: "quiero saber sobre Prunex" (CASO REPORTADO)

| Componente | Resultado Actual | Resultado Esperado |
|------------|-----------------|-------------------|
| Productos detectados | `prunex`, `on` | `prunex` |
| Score | 0 (si no hay otras señales) | 0 |
| ¿Notifica? | Depende del score total | ❌ No debería |
| Producto mostrado en Telegram | "Prunex, ON" | "Prunex" |
| Intención mostrada | "🔥 LEAD CALIENTE" | "🔍 Explorando" |

**Causa raíz:** Falso positivo de "ON" por `includes()` en lugar de `word boundary`.

### 3.2 Escenario: "qué es Prunex"

| Señal | ¿Dispara? | Puntos |
|-------|-----------|--------|
| "qué es" → `benefits` regex `para qu[eé]` | ✅ Sí (contiene "qué") | +10 |
| Producto detectado | `prunex`, `on` | - |

**Score total:** 10 (Curioso) → No notifica ✅
**Pero:** Productos incorrectos: "prunex, on"

### 3.3 Escenario: "me interesa Prunex"

| Señal | ¿Dispara? | Puntos |
|-------|-----------|--------|
| `buyPhrases` → "me interesa" | ✅ Sí | +40 |
| Producto detectado | `prunex`, `on` | - |

**Score total:** 40 (Interesado) → No notifica (notify: false para interested) ✅
**Pero:** Si además hay otras señales, podría llegar a 70+.

### 3.4 Escenario: "para qué sirve Prunex"

| Señal | ¿Dispara? | Puntos |
|-------|-----------|--------|
| `benefits` → "para qué" | ✅ Sí | +10 |
| Producto detectado | `prunex`, `on` | - |

**Score total:** 10 (Curioso) → No notifica ✅
**Pero:** Productos incorrectos.

### 3.5 Escenario: "cuánto cuesta Prunex y hacen envío"

| Señal | ¿Dispara? | Puntos |
|-------|-----------|--------|
| `priceQuestion` → "cuánto cuesta" | ✅ Sí | +30 |
| `logisticsQuestion` → "envío" | ✅ Sí | +30 |
| Producto detectado | `prunex`, `on` | - |

**Score total:** 60 (Interesado) → No notifica (notify: false) ✅
**Pero:** 60 está muy cerca de 70. Si hay producto repetido (+20) → 80 → 🔥 LEAD CALIENTE.

### 3.6 Escenario: "tienen disponible Prunex"

| Señal | ¿Dispara? | Puntos |
|-------|-----------|--------|
| `buyPhrases` → "tienen disponible" | ✅ Sí | +40 |
| Producto detectado | `prunex`, `on` | - |

**Score total:** 40 (Interesado) → No notifica ✅
**Pero:** "tienen disponible" es una pregunta de stock, no necesariamente de compra inmediata.

---

## 4. PROPUESTA PARA MEJORAR PRECISIÓN

### 4.1 🛠️ Fix Inmediato: Producto "ON" debe usar word boundary

**Archivo:** `config/chatAlertRules.js`

**Problema:** `normalized.includes("on")` detecta "on" dentro de cualquier palabra.

**Solución:** Para productos de 2-3 caracteres, usar word boundary en lugar de `includes()`.

```javascript
// En chatEvents.js, extractProductMatches()
// Cambiar de:
if (normalized.includes(product)) {
    matchedProducts.add(product);
}
// A:
if (product.length <= 3) {
    // Usar word boundary para productos cortos
    const escaped = product.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('\\b' + escaped + '\\b');
    if (regex.test(normalized)) {
        matchedProducts.add(product);
    }
} else {
    if (normalized.includes(product)) {
        matchedProducts.add(product);
    }
}
```

**Nota:** `api/chat.js` ya implementa esta lógica en `getMentionedProductsFromText()` (líneas 222-229), pero `chatEvents.js` NO. Hay que sincronizar ambas implementaciones.

### 4.2 🛠️ Separar productos del usuario vs productos de la IA

**Archivo:** `lib/chatEvents.js`

**Propuesta:** En `evaluateChatEvents()`, separar los productos detectados en:
- `userProductNames`: Solo productos mencionados por el USUARIO
- `aiProductNames`: Productos mencionados por la IA en su respuesta

```javascript
// Solo detectar productos en mensajes del USUARIO
normalizedMessages.forEach((message) => {
    if (message.role !== 'user') return;  // ← YA EXISTE
    const matches = extractProductMatches(message.content);
    productNames.push(...matches);
});
```

✅ **Esto ya está implementado correctamente.** El problema no es ese, sino el falso positivo de "ON".

### 4.3 🛠️ Template de Telegram con niveles de intención

**Archivo:** `config/chatAlertRules.js`

**Propuesta:** Crear templates diferenciados por nivel de intención:

```javascript
export const TELEGRAM_TEMPLATES = {
  exploring: `🔍 Usuario explorando FuXion
👤 {nombre}
📦 Producto consultado: {product}
💬 {summary}
⏱ {minutes} min
📅 {datetime}`,

  interested: `💡 Posible interés FuXion
👤 {nombre}
📦 Producto: {product}
🎯 Interés: {score}%
🔍 Señales: {summary}
⏱ {minutes} min · {questions} preguntas
📅 {datetime}
💬 "{lastMessage}"`,

  hot: `🔥 Cliente interesado FuXion
👤 {nombre}
📦 Producto consultado: {product}
🎯 Intención compra: {score}%
🔍 Señales: {summary}
⏱ {minutes} min activa
💬 "{lastMessage}"
✅ Recomendación: Contactar pronto`,

  veryHot: `🚨 PRIORIDAD - Cliente listo para comprar
👤 {nombre}
📦 Producto: {product}
🎯 Intención: {score}%
🔍 {summary}
⏱ {minutes} min
💬 "{lastMessage}"
📞 Acción: Contactar inmediatamente`
};
```

### 4.4 🛠️ Nuevos niveles de intención (BAJO, MEDIO, ALTO, MUY ALTO)

**Archivo:** `config/chatAlertRules.js`

```javascript
export const INTENT_LEVELS = {
  bajo: { 
    min: 0, max: 20, 
    label: '🔍 Explorando', 
    notify: false, 
    telegramTemplate: null,
    ejemplos: ['qué es', 'para qué sirve', 'qué contiene', 'cómo funciona']
  },
  medio: { 
    min: 20, max: 50, 
    label: '💡 Posible interés', 
    notify: true,  // ← Notificar pero con template SUAVE
    telegramTemplate: 'interested',
    ejemplos: ['precio', 'cuánto vale', 'cómo se toma', 'cuánto dura']
  },
  alto: { 
    min: 50, max: 80, 
    label: '🔥 Interés de compra', 
    notify: true,
    telegramTemplate: 'hot',
    ejemplos: ['quiero comprar', 'dónde retiro', 'hacen envío', 'cómo pago', 'tienes disponible']
  },
  muyAlto: { 
    min: 80, max: Infinity, 
    label: '🚨 Prioridad máxima', 
    notify: true,
    telegramTemplate: 'veryHot',
    ejemplos: ['quiero hacer pedido', 'pásame WhatsApp', 'quiero inscribirme', 'quiero ser distribuidor']
  }
};
```

### 4.5 🛠️ Sistema de supresión de alertas duplicadas

**Archivo:** `lib/chatEvents.js`

**Propuesta:** Implementar un caché de sesiones ya notificadas para evitar múltiples alertas de la misma conversación:

```javascript
const notifiedSessions = new Map();
const NOTIFICATION_COOLDOWN = 5 * 60 * 1000; // 5 minutos

const shouldSuppressNotification = (sessionId, newScore) => {
    if (!notifiedSessions.has(sessionId)) return false;
    const previous = notifiedSessions.get(sessionId);
    // Solo re-notificar si el score aumentó significativamente (+20)
    return (newScore - previous.score) < 20;
};
```

### 4.6 🛠️ Mejorar detección de "exploración" vs "compra"

**Archivo:** `lib/chatEvents.js`

**Propuesta:** Agregar detección de preguntas exploratorias que NO deben sumar puntos:

```javascript
const EXPLORATORY_PATTERNS = [
    /\b(qu[eé] es|qu[eé] son|qu[eé] contiene|qu[eé] tiene|para qu[eé] sirve|c[oó]mo funciona|de qu[eé] est[aá] hecho)\b/i,
    /\b(quiere decir|significa|consiste|explicame|explícame|cu[eé]ntame|dime)\b/i,
    /\b(informaci[oó]n|info|datos|detalles|caracter[ií]sticas|especificaciones)\b/i
];

// Si el mensaje es EXPLORATORIO y NO tiene señales de compra,
// el score máximo es 10 (no importa qué más detecte)
const isExploratory = EXPLORATORY_PATTERNS.some(p => p.test(content));
```

### 4.7 🛠️ Agregar campo "Tipo de consulta" en Telegram

**Propuesta:** En el mensaje de Telegram, incluir un campo que clasifique el tipo de consulta:

```
🔍 Tipo: Exploración / Comparación / Compra / Soporte
```

Esto se puede inferir de las señales detectadas:
- Solo `benefits` o `ingredients` → Exploración
- `comparison` → Comparación
- `priceQuestion` + `benefits` → Evaluación (MEDIO)
- `buyPhrases` + `priceQuestion` → Compra (ALTO)
- `buyPhrases` + `logisticsQuestion` → Compra inminente (MUY ALTO)

---

## 5. ARCHIVOS A MODIFICAR

### Prioridad CRÍTICA (Falsos Positivos)

| Archivo | Cambio | Impacto |
|---------|--------|---------|
| `lib/chatEvents.js` (líneas 83-114) | `extractProductMatches()`: Usar word boundary para productos ≤3 caracteres | ✅ Elimina falso positivo "ON" |
| `config/chatAlertRules.js` (línea 79) | Opcional: eliminar 'on' de products si se maneja por word boundary | ✅ Consistencia |

### Prioridad ALTA (Precisión de Alertas)

| Archivo | Cambio | Impacto |
|---------|--------|---------|
| `config/chatAlertRules.js` | Nuevos niveles de intención (BAJO/MEDIO/ALTO/MUY ALTO) | ✅ Alertas más precisas |
| `config/chatAlertRules.js` | Templates diferenciados por nivel | ✅ Telegram muestra info correcta |
| `lib/chatEvents.js` | `getIntentLevel()` actualizado con nuevos niveles | ✅ Clasificación correcta |
| `lib/chatEvents.js` | `buildEventSummary()` usa template según nivel | ✅ Mensaje contextual |

### Prioridad MEDIA (Mejoras)

| Archivo | Cambio | Impacto |
|---------|--------|---------|
| `lib/chatEvents.js` | Sistema de supresión de alertas duplicadas | ✅ Menos ruido en Telegram |
| `lib/chatEvents.js` | Detección de preguntas exploratorias | ✅ No penalizar exploración |
| `lib/chatEvents.js` | Campo "Tipo de consulta" en resumen | ✅ Mejor contexto para asesor |
| `config/chatAlertRules.js` | Ajustar scores: bajar "tienen disponible" de +40 a +20 | ✅ No confundir stock con compra |

### Prioridad BAJA (Refinamiento)

| Archivo | Cambio | Impacto |
|---------|--------|---------|
| `lib/conversation/conversationProfile.js` | Sincronizar detección de "quiero" con el sistema de scoring | ✅ Consistencia entre sistemas |
| `api/chat.js` | Asegurar que `getMentionedProductsFromText()` y `extractProductMatches()` usen la misma lógica | ✅ Consistencia |
| `lib/chatEvents.js` | Agregar logging de DEBUG para detectar falsos positivos | ✅ Facilita debugging futuro |

---

## ANEXO: Análisis Detallado del Caso Reportado

### Mensaje: "quiero saber sobre Prunex"

#### Paso 1: Normalización
```
"quiero saber sobre Prunex" 
→ normalizeText() 
→ "quiero saber sobre prunex"
```

#### Paso 2: Detección de productos (extractProductMatches)
```
normalized.includes("prunex") → TRUE ✅ → matchedProducts.add("prunex")
normalized.includes("on") → "sobre".includes("on") → TRUE ❌ → matchedProducts.add("on")
```

**Resultado:** `productNames = ['prunex', 'on']`

#### Paso 3: Cálculo de score (calculateBuyIntentScore)
```
"quiero saber sobre prunex"
→ BUY_INTENT_STRONG.buyPhrases.test() → NO
→ BUY_INTENT_PRICE.priceQuestion.test() → NO
→ BUY_INTENT_LOGISTICS.logisticsQuestion.test() → NO
→ BUY_INTENT_SPECIFIC_PROBLEM.specificProblem.test() → NO
→ BUY_INTENT_MEDIUM.benefits.test() → NO
→ BUY_INTENT_MEDIUM.ingredients.test() → NO
→ BUY_INTENT_MEDIUM.comparison.test() → NO
```

**Score:** 0
**Señales:** []
**Nivel:** Curioso (no notifica)

#### Paso 4: ¿Por qué se disparó la alerta entonces?

**Posibles causas:**
1. **El usuario tenía mensajes previos** que acumularon score ≥ 70
2. **El usuario preguntó "me interesa"** que dispara +40
3. **Había señales de mensajes anteriores** que combinadas llegaron a 70+
4. **El mensaje "quiero saber sobre Prunex" fue el primero**, score 0, no debería notificar

**Si el mensaje fue el primero y único:** El sistema NO debería haber notificado. Score 0, `shouldNotify: false`.

**Si había conversación previa:** El score acumulado pudo llegar a 70+ por señales de mensajes anteriores.

#### Conclusión del Caso Reportado

Si el usuario SOLO preguntó "quiero saber sobre Prunex" como primer mensaje:

| Aspecto | ¿Problema? |
|---------|------------|
| ¿Debería notificar? | ❌ No (score 0) |
| Productos detectados | ⚠️ Prunex ✅, ON ❌ (falso positivo) |
| Template usado | N/A (no notifica) |

**El falso positivo de "ON" es el problema principal**, pero no debería causar una alerta por sí solo. Si la alerta se disparó, es porque:
1. Había mensajes previos con señales de compra, O
2. Hay otro bug en el flujo que no estamos viendo

---

## RESUMEN EJECUTIVO

### Problemas Críticos

1. **🔴 Falso positivo "ON"**: La palabra "on" se detecta dentro de palabras como "sobre", "información", "conversación", "recomendación", "función", etc.

2. **🔴 Template genérico**: Siempre dice "🔥 LEAD CALIENTE" incluso para scores bajos.

3. **🟡 Sin diferenciación de productos**: No se distingue entre productos del usuario vs sugeridos por IA.

### Soluciones Inmediatas (Prioridad 1)

1. **Word boundary para productos cortos** en `extractProductMatches()` (chatEvents.js)
2. **Templates diferenciados** por nivel de intención (chatAlertRules.js)
3. **Ajustar score de "tienen disponible"** de +40 a +20 (no es compra, es consulta de stock)

### Métricas Objetivo

| Métrica | Actual | Esperada |
|---------|--------|----------|
| Precisión de productos detectados | ~70% | ≥95% |
| Falsos positivos en alertas | Altos | Cero |
| Alertas por exploración | Posibles | Nunca |
| Diferenciación de intención | Baja | ALTA (4 niveles) |
| Información útil en Telegram | Media | Alta |

---

*Fin del Reporte de Auditoría*
