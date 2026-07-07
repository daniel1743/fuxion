# TELEGRAM FIX PHASE 1 REPORT

**Fecha:** 2026-06-07
**Objetivo:** Corregir falsos positivos y mejorar precisión de alertas Telegram

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `config/chatAlertRules.js` | Reglas de detección de compra, niveles de intención, templates Telegram |
| `lib/chatEvents.js` | Detección de productos (exact match para cortos), selección de template por score |
| `lib/conversation/conversationProfile.js` | Señales de compra (excluye curiosidad) |

---

## Fix 1: Detección de Productos (falsos positivos ON)

### Antes
```javascript
// chatEvents.js - extractProductMatches
for (const product of CHAT_RULE_PATTERNS.products) {
  if (normalized.includes(product)) {  // includes() detectaba "on" dentro de "informacion"
    matchedProducts.add(product);
  }
}
```

### Después
```javascript
// chatEvents.js - extractProductMatches
for (const product of CHAT_RULE_PATTERNS.products) {
  const productWords = getWords(product);
  const isShortProduct = productWords.some(w => w.length <= 3);

  if (isShortProduct) {
    // Productos cortos (≤3 letras): coincidencia EXACTA de palabra
    for (const productWord of productWords) {
      if (userWords.includes(productWord)) {
        matchedProducts.add(product);
        break;
      }
    }
  } else {
    // Productos largos: includes() normal
    if (normalized.includes(product)) {
      matchedProducts.add(product);
    }
  }
}
```

### Resultado
- ✅ "quiero ON" → detecta producto ON
- ✅ "producto ON" → detecta producto ON
- ✅ "informacion" → NO detecta ON
- ✅ "conversacion" → NO detecta ON
- ✅ "recomendacion" → NO detecta ON

---

## Fix 2: Lenguaje de Compra (curiosidad ≠ intención)

### chatAlertRules.js - BUY_INTENT_STRONG

**Antes:**
```javascript
buyPhrases: /\b(quiero comprar|c[oó]mo compro|d[oó]nde compro|quiero pedir|me interesa|lo quiero|tienen disponible)\b/i,
```

**Después:**
```javascript
buyPhrases: /\b(quiero comprar|c[oó]mo compro|d[oó]nde compro|quiero pedir|quiero hacer pedido|quiero pagarlo|lo quiero|tienen disponible)\b/i,
```

Cambios:
- ❌ Eliminado: `me interesa` (es curiosidad, no compra)
- ✅ Agregado: `quiero hacer pedido`
- ✅ Agregado: `quiero pagarlo`

### conversationProfile.js - PURCHASE_SIGNAL_PATTERNS

**Antes:**
```javascript
{ pattern: /\b(quiero|necesito|necesitaría|me gustaría|quisiera|requiero)\b/i, signal: 'intención explícita', weight: 10 },
```

**Después:**
```javascript
{ pattern: /\b(quiero comprar|quiero pedir|quiero hacer pedido|quiero pagarlo|necesito comprar|necesito pedir)\b/i, signal: 'intención de compra', weight: 10 },
```

Cambios:
- ❌ Eliminado: `quiero` suelto (causaba falso positivo con "quiero saber")
- ❌ Eliminado: `quisiera`, `requiero`, `me gustaría` (curiosidad, no compra)
- ✅ Solo frases compuestas con verbo de compra explícito

---

## Fix 3: Títulos Telegram por Nivel

### Nuevos niveles de intención

| Nivel | Score | ¿Notifica? | Título Telegram |
|-------|-------|------------|-----------------|
| Explorando | 0-39 | ❌ No | — |
| Interesado | 40-69 | ✅ Sí | 💡 Posible interés FuXion |
| Compra | 70+ | ✅ Sí | 🔥 Cliente con intención de compra |
| Negocio | — | ✅ Sí | 🚀 OPORTUNIDAD NEGOCIO |

### chatAlertRules.js - INTENT_LEVELS

**Antes:**
```javascript
export const INTENT_LEVELS = {
  curious: { min: 0, max: 40, label: 'Curioso', notify: false, save: false },
  interested: { min: 40, max: 70, label: 'Interesado', notify: false, save: true },
  hot: { min: 70, max: Infinity, label: '🔥 LEAD CALIENTE', notify: true, save: true },
  business: { min: 0, max: Infinity, label: '🚀 OPORTUNIDAD NEGOCIO', notify: true, save: true }
};
```

**Después:**
```javascript
export const INTENT_LEVELS = {
  exploring: { min: 0, max: 40, label: 'Explorando', notify: false, save: false },
  interested: { min: 40, max: 70, label: 'Interesado', notify: true, save: true },
  buying: { min: 70, max: Infinity, label: '🔥 Cliente con intención de compra', notify: true, save: true },
  business: { min: 0, max: Infinity, label: '🚀 OPORTUNIDAD NEGOCIO', notify: true, save: true }
};
```

Cambios clave:
- `curious` → `exploring`: ahora no notifica (antes notificaba en hot)
- `interested`: ahora SÍ notifica (antes no notificaba)
- `hot` → `buying`: título más descriptivo
- `interested` ahora notifica con título "💡 Posible interés FuXion"

### chatEvents.js - buildTelegramMessage

**Antes:** Usaba siempre `TELEGRAM_MESSAGE_TEMPLATE` con título fijo "🔥 LEAD CALIENTE FUXION"

**Después:** Selecciona template según score:
```javascript
export const buildTelegramMessage = (payload) => {
  let template;
  if (payload.isBusinessIntent) {
    template = TELEGRAM_BUSINESS_TEMPLATE;
  } else if (payload.score >= 70) {
    template = TELEGRAM_BUYING_TEMPLATE;
  } else {
    template = TELEGRAM_INTERESTED_TEMPLATE;
  }
  // ...
};
```

---

## Pruebas Realizadas

### Caso 1: "quiero saber sobre Prunex"
- Productos detectados: ✅ Prunex (solamente)
- Score: 0 (solo curiosidad, sin señal de compra)
- Nivel: Explorando
- Telegram: ❌ No envía (correcto)

### Caso 2: "cuanto cuesta Prunex y hacen envio"
- Productos detectados: ✅ Prunex
- Score: 60 (precio +30, logística +30)
- Nivel: Interesado
- Telegram: ✅ Envía con título "💡 Posible interés FuXion"

### Caso 3: "quiero comprar Prunex como hago"
- Productos detectados: ✅ Prunex
- Score: 70+ (compra +40, pregunta +30)
- Nivel: Compra
- Telegram: ✅ Envía con título "🔥 Cliente con intención de compra"

### Caso 4: "informacion sobre ON"
- Productos detectados: ❌ No detecta ON (correcto, "informacion" no contiene "on" como palabra)
- Score: 0
- Nivel: Explorando
- Telegram: ❌ No envía

### Caso 5: "quiero ON"
- Productos detectados: ✅ ON (exact word match)
- Score: 0 (solo curiosidad)
- Nivel: Explorando
- Telegram: ❌ No envía (correcto, no hay intención de compra)

---

## Build

```
npm run build → ✅ Success (0 errors)
```

---

## Resumen

| Métrica | Antes | Después |
|---------|-------|---------|
| Falsos positivos ON | ❌ "informacion" detectaba ON | ✅ Solo palabra exacta |
| "quiero saber" = compra | ❌ Sí | ✅ No |
| "quiero información" = compra | ❌ Sí | ✅ No |
| Título Telegram genérico | ❌ "LEAD CALIENTE" siempre | ✅ 3 niveles según score |
| Interesados (40-69) notifican | ❌ No | ✅ Sí, con título suave |
| Explorando (0-39) notifican | ❌ No (se mantiene) | ✅ No (se mantiene) |

## Archivos NO modificados (preservados)

- ✅ Respuestas del bot (DeepSeek API)
- ✅ Diseño UI/UX
- ✅ Productos y catálogo
- ✅ SEO
- ✅ Formularios
- ✅ Base de datos
- ✅ Sistema de recomendación
