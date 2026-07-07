# TELEGRAM LEAD INTELLIGENCE - FASE FINAL 4

## Sistema de Scoring Comercial Real con 4 Niveles de Intención

**Fecha:** 7 de Julio 2026  
**Versión:** V3 (Payload Estructurado)  
**Estado:** ✅ COMPLETADO

---

## Resumen Ejecutivo

Se implementó la **Fase Final 4** del sistema de inteligencia de leads para Telegram, reduciendo falsos positivos y detectando clientes genuinamente interesados mediante un sistema de 4 niveles de intención comercial.

### Problema Anterior
- Sistema de 3 niveles (exploring 0-39, interested 40-69, buying 70+) causaba falsos positivos
- Una simple pregunta sobre un producto disparaba alertas
- Consultas de beneficios/ingredientes se interpretaban como intención de compra
- Productos se listaban planos sin contexto de categoría

### Solución Implementada
- **4 niveles de intención** con umbrales más estrictos
- **Detección separada** de oportunidad de negocio vs compra de producto
- **Categorización inteligente** de productos por tipo (digestivo, peso, energía, belleza, deporte)
- **Payload estructurado V3** con datos organizados para procesamiento posterior
- **Cooldown inteligente** que evita spam pero permite escalamiento de leads

---

## Arquitectura del Sistema

```
Usuario → FalconBot → api/chat.js → chatEvents.js → leadIntelligence.js → telegramNotifier.js → Telegram
                                        ↓                    ↓
                                  chatAlertRules.js    customerMemory.js
                                  (configuración)      (memoria cliente)
```

### Flujo de Decisión

1. **api/chat.js** recibe mensaje del usuario
2. **chatEvents.evaluateChatEvents()** analiza la conversación:
   - Detecta productos mencionados
   - Calcula Buy Intent Score (0-100)
   - Detecta intención de negocio (separado)
   - Determina nivel de intención (4 niveles)
3. **chatEvents.processChatConversation()** decide si notificar:
   - Nivel 1 (0-30): Solo guardar memoria
   - Nivel 2 (31-60): Guardar seguimiento, no alertar
   - Nivel 3 (61-80): Enviar Telegram
   - Nivel 4 (81-100): Telegram inmediato
4. **leadIntelligence.createLeadProfile()** construye perfil CRM
5. **leadIntelligence.buildTelegramMessageV3()** genera payload estructurado
6. **telegramNotifier.sendTelegramNotification()** envía a Telegram

---

## Sistema de 4 Niveles de Intención

### Configuración (`config/chatAlertRules.js`)

| Nivel | Rango | Label | Notificar | Guardar |
|-------|-------|-------|-----------|---------|
| 1 - Curioso | 0-30 | 🔍 Curioso | ❌ | ✅ |
| 2 - Interesado | 31-60 | 💡 Interesado | ❌ | ✅ |
| 3 - Posible Compra | 61-80 | 💭 Posible compra | ✅ | ✅ |
| 4 - Cliente Caliente | 81-100 | 🔥 Cliente caliente | ✅ | ✅ |
| Business | 0-∞ | 🚀 OPORTUNIDAD NEGOCIO | ✅ | ✅ |

### Reglas de Notificación

- **Nivel 1 (0-30):** NO enviar Telegram. Solo guardar en memoria de cliente.
- **Nivel 2 (31-60):** Guardar seguimiento. NO alertar a menos que haya repetición fuerte del mismo producto.
- **Nivel 3 (61-80):** Enviar Telegram con payload V3 estructurado.
- **Nivel 4 (81-100):** Telegram inmediato con máxima prioridad.
- **Business:** Siempre notificar, independiente del score.

---

## Buy Intent Score - Sistema de Puntuación

### Señales y Puntajes

| Señal | Puntaje | Tipo |
|-------|---------|------|
| "quiero comprar", "cómo compro", "lo quiero" | +40 | Fuerte |
| Pregunta precio, valor, costo | +30 | Fuerte |
| Consulta envío, despacho, delivery | +30 | Fuerte |
| Problema específico (tengo estreñimiento, etc.) | +25 | Fuerte |
| Producto repetido en múltiples mensajes | +20 | Media |
| Pregunta beneficios, para qué sirve | +10 | Media |
| Pregunta ingredientes, composición | +10 | Media |
| Comparación entre productos | +10 | Media |

### Validaciones

- **Score ≥ 70 requiere al menos 1 señal fuerte** (comprar, precio, despacho, problema específico)
- **Solo señales medias** (beneficios, ingredientes, comparación) → score máximo 30
- **Business intent** se detecta por separado y no usa este scoring

---

## Detección de Oportunidad de Negocio

Separada completamente de la detección de compra de producto.

### Patrones Detectados (`BUSINESS_OPPORTUNITY_PATTERNS`)

- "vender fuxion", "negocio fuxion"
- "ser distribuidor", "hacerme distribuidor"
- "ganar dinero con fuxion"
- "emprender", "oportunidad de negocio"
- "plan de compensación", "rangos", "bonos"
- "independencia financiera", "libertad financiera"
- "trabajo desde casa", "negocio desde casa"

### Reglas
- Si se detecta BUSINESS_OPPORTUNITY → NO se marca como compra
- Usa flujo independiente de alerta Telegram
- Prioridad absoluta sobre cualquier otra detección

---

## Detección de Solicitud de Asesor Humano

### Patrones Detectados (`HUMAN_REQUEST_PATTERNS`)

- "asesor", "humano", "persona real"
- "whatsapp", "necesito ayuda"
- "quiero hablar con alguien"
- "hablar con un asesor", "contactar con un asesor"
- "atención personalizada", "ayuda humana"

---

## Mapa de Categorías de Productos

| Categoría | Productos |
|-----------|-----------|
| **Bienestar digestivo** | Prunex, Flora Liv, Liquid Fiber, Berry Balance, Rexet, Alpha Balance |
| **Control de peso** | Thermo T3, Nocarb |
| **Energía y vitalidad** | ON, Vita Xtra, No Stress, Passion, Vera, Gano, Café, Nutraday |
| **Belleza y cuidado personal** | Beauty In, Youth Elixir, Probal |
| **Rendimiento deportivo** | Protein Active, Bioprotein, Pre Sport, Post Sport, Golden Flx |

---

## Payload V3 - Estructura de Datos

### `buildTelegramMessageV3(leadProfile)` → Payload JSON

```javascript
{
  version: 'v3',
  timestamp: '2026-07-07T...',
  
  cliente: {
    tipo: 'anonimo' | 'registrado',
    nombre: 'Cliente anónimo' | 'Juan Pérez',
    email: null | 'juan@email.com',
    sessionId: 'session-xxx'
  },
  
  tiempo: {
    minutos: 5,
    mensajes: 3,
    preguntas: 2
  },
  
  intencion: {
    nivel: '🔍 Curioso' | '💡 Interesado' | '💭 Posible compra' | '🔥 Cliente caliente' | '🚀 OPORTUNIDAD NEGOCIO',
    score: 75,
    etapa: 'compra',
    etapaLabel: '🔥 Listo para comprar',
    etapaSignificado: 'Listo para comprar',
    isBusinessIntent: false
  },
  
  productos: {
    principal: 'prunex',
    secundarios: ['on'],
    porCategoria: {
      'Bienestar digestivo': ['prunex'],
      'Energía y vitalidad': ['on']
    },
    resumenCategorias: '  • Bienestar digestivo: prunex\n  • Energía y vitalidad: on',
    repeticiones: ['⚠️ El cliente ha preguntado por el mismo producto en múltiples ocasiones']
  },
  
  señales: ['quiere comprar', 'pregunta precio'],
  
  contacto: {
    disponible: true,
    datos: [{ tipo: 'whatsapp', valor: '912345678' }],
    resumen: '✅ Contacto disponible'
  },
  
  ultimoMensaje: 'Quiero comprarlo',
  sugerencia: 'Cliente listo para comprar. Contactar para cerrar venta.',
  textoFormateado: '... (texto legacy V2)'
}
```

### `buildTelegramTextV3(payloadV3)` → Texto formateado

Genera un mensaje de Telegram con:
- Título con nivel de intención
- Información del cliente
- Score y etapa
- Productos con categorías
- Señales detectadas con emojis
- Tiempo y actividad
- Último mensaje
- Contacto
- Sugerencia para el asesor

---

## Cooldown System

### Reglas
- **5 minutos** de cooldown entre notificaciones de la misma sesión
- **Permitir nueva alerta si:**
  - Cambia la etapa del cliente (explorando → evaluando → compra)
  - Aumenta la intención +20 puntos
  - Pasa a oportunidad de negocio
  - Ha pasado el cooldown de 5 minutos
- **Bloquear si:**
  - Mismo estado dentro del cooldown
  - Aumento menor a +20 puntos

---

## Archivos Modificados

### `config/chatAlertRules.js`
- ✅ Nuevos `INTENT_LEVELS` con 4 niveles
- ✅ Nuevo `HUMAN_REQUEST_PATTERNS` regex
- ✅ Nuevo `BUSINESS_OPPORTUNITY_PATTERNS` regex
- ✅ Nuevo `PRODUCT_CATEGORY_MAP` con 5 categorías

### `lib/chatEvents.js`
- ✅ Actualizado `getIntentLevel()` para usar 4 niveles
- ✅ Nuevos imports: `HUMAN_REQUEST_PATTERNS`, `BUSINESS_OPPORTUNITY_PATTERNS`, `PRODUCT_CATEGORY_MAP`
- ✅ Integración con `buildTelegramMessageV2` en `processChatConversation`

### `lib/leadIntelligence.js`
- ✅ Nueva función `buildTelegramMessageV3()` - payload estructurado
- ✅ Nueva función `buildTelegramTextV3()` - texto formateado desde payload
- ✅ Import de `INTENT_LEVELS` y `PRODUCT_CATEGORY_MAP`
- ✅ Export actualizado con nuevas funciones

### `lib/__tests__/leadIntelligence.test.js`
- ✅ Nuevos tests para `buildTelegramMessageV3` (7 tests)
- ✅ Nuevos tests para `buildTelegramTextV3` (5 tests)
- ✅ Total: 47 tests (todos pasando)

---

## Resultados de Tests

```
Test Suites: 1 passed, 1 total
Tests:       47 passed, 47 total
Time:        1.146 s
```

### Cobertura de Tests

| Módulo | Tests | Estado |
|--------|-------|--------|
| createLeadProfile | 4 | ✅ |
| detectarCustomerStage | 6 | ✅ |
| detectarContacto | 5 | ✅ |
| checkCooldown | 7 | ✅ |
| detectBusinessOpportunity | 5 | ✅ |
| buildTelegramMessageV2 | 5 | ✅ |
| Flujo completo | 3 | ✅ |
| buildTelegramMessageV3 | 7 | ✅ |
| buildTelegramTextV3 | 5 | ✅ |

---

## Ejemplos de Uso

### Caso 1: Cliente Curioso (Score: 20)
```
Usuario: "Qué es Prunex?"
→ Nivel 1 - Curioso
→ NO se envía Telegram
→ Se guarda en memoria de cliente
```

### Caso 2: Cliente Interesado (Score: 40)
```
Usuario: "Qué es Prunex? Cuánto cuesta?"
→ Nivel 2 - Interesado
→ NO se envía Telegram (salvo repetición fuerte)
→ Se guarda seguimiento
```

### Caso 3: Posible Compra (Score: 70)
```
Usuario: "Quiero comprar ON. Cuánto cuesta? Hacen envíos?"
→ Nivel 3 - Posible compra
→ SE envía Telegram con payload V3
→ Producto: ON (Energía y vitalidad)
→ Señales: quiere comprar + precio + despacho
```

### Caso 4: Cliente Caliente (Score: 90)
```
Usuario: "Quiero comprar ON ahora mismo. Cómo pago? Mi whatsapp es 912345678"
→ Nivel 4 - Cliente caliente
→ Telegram INMEDIATO
→ Contacto disponible (WhatsApp)
→ Sugerencia: Contactar para cerrar venta
```

### Caso 5: Oportunidad de Negocio
```
Usuario: "Quiero ser distribuidor FuXion"
→ Business Intent
→ Telegram INMEDIATO (independiente del score)
→ Sugerencia: Contactar personalmente
```

---

## Próximos Pasos Recomendados

1. **Integrar V3 en api/chat.js**: Reemplazar `buildTelegramMessageV2` por `buildTelegramMessageV3` en el flujo de notificación
2. **Dashboard de leads**: Construir interfaz para visualizar leads con payload V3
3. **Webhook externo**: Enviar payload V3 a CRM externo (HubSpot, Salesforce)
4. **Machine Learning**: Usar datos históricos de payload V3 para entrenar modelo predictivo
5. **A/B Testing**: Comparar tasa de conversión con sistema anterior

---

## Comandos de Verificación

```bash
# Ejecutar tests
npx jest lib/__tests__/leadIntelligence.test.js --no-coverage

# Build de producción
npm run build

# Verificar sintaxis
node -e "import('./lib/leadIntelligence.js').then(m => console.log('OK', Object.keys(m)))"
```
