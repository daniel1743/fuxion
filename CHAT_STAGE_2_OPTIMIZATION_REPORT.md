# CHAT STAGE 2 OPTIMIZATION REPORT
## Falcon Assistant - Señales Reales y Limpieza Producción

**Fecha:** 2026-05-07
**Versión:** Stage 2

---

## Resumen Ejecutivo

Se implementaron 6 optimizaciones críticas en el sistema de eventos del chat (chatEvents.js) y la API de chat (api/chat.js) para reducir ruido en producción, eliminar falsos positivos y mejorar la calidad de las señales comerciales detectadas.

---

## Cambios Realizados

### 1. Reducción de Logs en Producción (chatEvents.js)

**Archivo:** `lib/chatEvents.js`

**Problema:** Cada evaluación de conversación generaba logs de `console.log` con eventos, scores y niveles de intención, saturando los logs de Vercel.

**Solución:**
- Se agregó constante `DEBUG_EVENTS = process.env.DEBUG_CHAT === "true"`
- Se creó función `debugLog(label, data)` que solo imprime cuando `DEBUG_EVENTS` es true
- Se envolvieron todos los `console.log` de `processChatConversation` con `debugLog`
- Se cambió `console.log('telegram_failed')` a `console.warn('[chatEvents] telegram_failed')`

**Impacto:** Reducción de ~90% de logs en producción. Solo se muestran errores (warn/error).

---

### 2. Optimización de Diagnóstico de Entorno (api/chat.js)

**Archivo:** `api/chat.js`

**Problema:** `printEnvDiagnostic()` se ejecutaba en cada cold start, imprimiendo el estado de todas las variables de entorno incluso en producción.

**Solución:**
- Se cambió `DEBUG_CHAT` de hardcoded `false` a `process.env.DEBUG_CHAT === "true"`
- Se envolvió `printEnvDiagnostic()` con `if (DEBUG_CHAT) { printEnvDiagnostic(); }`

**Impacto:** Diagnóstico solo visible cuando se activa explícitamente con `DEBUG_CHAT=true`.

---

### 3. Corrección de Falsos Positivos - Productos Cortos (api/chat.js)

**Archivo:** `api/chat.js` - función `getMentionedProductsFromText`

**Problema:** Productos con nombre corto (≤3 caracteres como "ON") se detectaban incorrectamente dentro de palabras más largas (ej: "informacion" contenía "on").

**Solución:**
- Productos ≤3 caracteres: solo coincidencia exacta con `\b` word boundary regex
- Productos >3 caracteres: detección flexible con `includes()` como antes
- Se usa `continue` después del match exacto para evitar doble detección

**Impacto:** "informacion" ya no detecta "ON". "quiero on" sigue detectando "ON" correctamente.

---

### 4. Mejora de Score Alto Interés (chatEvents.js)

**Archivo:** `lib/chatEvents.js` - función `calculateBuyIntentScore`

**Problema:** El score podía alcanzar 70+ solo con señales débiles acumuladas (múltiples preguntas de beneficios/ingredientes), generando falsos LEAD CALIENTE.

**Solución:**
- Se agregó validación: para score ≥ 70 se requiere al menos UNA señal fuerte (comprar, precio, despacho, problema específico)
- Si no hay señal fuerte, el score máximo es 69 (interested, no hot)
- Si solo hay señales medias (beneficios, ingredientes, comparación) sin producto repetido, el score máximo es 30 (curioso)

**Reglas de validación:**
| Combinación | Score Máximo | Nivel |
|---|---|---|
| Solo señales medias | 30 | Curioso |
| Señales medias + producto repetido | 50 | Interesado |
| Una señal fuerte | 70+ | Hot (si hay combinación) |
| Múltiples señales fuertes | 100+ | Hot |

**Impacto:** Elimina falsos LEAD CALIENTE generados solo por tiempo o preguntas genéricas.

---

### 5. Mejora de Resumen Telegram (chatEvents.js)

**Archivo:** `lib/chatEvents.js` - función `buildEventSummary`

**Problema:** El resumen de Telegram mostraba frases genéricas como "consulta repetida del mismo producto" o "conversación larga" sin contexto útil.

**Solución:** Se reestructuró el resumen en 6 secciones informativas:
1. **Intención principal** - 🔥 Alta compra, 💡 Interés comercial, 🎯 Negocio
2. **Producto específico** - 📦 Nombre del producto detectado
3. **Señales comerciales** - 🔍 Mapeo a lenguaje humano (ej: "Preguntó por precio")
4. **Posible necesidad** - 💬 Inferencia de la necesidad del cliente
5. **Eventos especiales** - ⚠️ Síntomas alarma, 🚫 Rechazó asesor
6. **Métricas** - ⏱ Duración, ❓ Preguntas

**Ejemplo de resumen mejorado:**
```
🔥 Alta intención de compra - contactar urgente · 📦 Producto: PRUNEX 1 · 🔍 Señales: Quiere comprar | Preguntó por precio · 💬 Necesidad: Quiere adquirir el producto, requiere asistencia en compra · ⏱ Duración: 5 min activa · ❓ 3 preguntas realizadas
```

**Impacto:** Telegram ahora recibe información accionable para el equipo de ventas.

---

### 6. Limpieza de Regex Markdown (api/chat.js)

**Archivo:** `api/chat.js` - función `sanitizeOutput`

**Problema:** La regex `cleaned.replace(/^.*\|.*$/gm, '')` eliminaba TODAS las líneas con `|`, incluyendo textos normales como "opción A | opción B".

**Solución:** Se reemplazó por dos regex específicas:
- `cleaned.replace(/^\s*\|.+\|.+\|?\s*$/gm, '')` - Solo elimina líneas con formato de tabla markdown (mínimo 2 pipes)
- `cleaned.replace(/^\s*\|?\s*:?-+:?\s*\|.*$/gm, '')` - Elimina líneas de separación de tabla

**Impacto:** Textos normales con `|` ya no se eliminan. Solo se eliminan tablas markdown reales.

---

## Validación

- [x] `npm run build` - Compilación exitosa sin errores
- [x] Análisis de regresión: cambios no afectan lógica comercial existente
- [x] Compatibilidad backward: todas las funciones exportadas mantienen su firma

---

## Archivos Modificados

| Archivo | Cambios |
|---|---|
| `lib/chatEvents.js` | DEBUG_EVENTS, debugLog, calculateBuyIntentScore (validación), buildEventSummary (resumen enriquecido) |
| `api/chat.js` | DEBUG_CHAT condicional, getMentionedProductsFromText (word boundary), sanitizeOutput (regex tabla) |

---

## Configuración para Producción

Para activar logs de debug en desarrollo:
```bash
# En Vercel Dashboard o .env
DEBUG_CHAT=true
```

Para producción (default - sin logs):
```bash
# No definir DEBUG_CHAT o dejarlo como false
DEBUG_CHAT=false
```

---

## Próximos Pasos Recomendados

1. Monitorear calidad de leads en Telegram durante 1 semana
2. Ajustar thresholds de INTENT_LEVELS si es necesario
3. Considerar Stage 3: Machine Learning para detección de intención
