# Telegram Intelligence Phase 2 - Smart Lead CRM

**Fecha:** 2026-06-07
**Versión:** 1.0.0
**Estado:** ✅ COMPLETADO

---

## Resumen

Se implementó el **Lead Intelligence Engine** que convierte las alertas de Telegram en reportes CRM inteligentes. El sistema ahora genera perfiles de lead enriquecidos con detección de etapa del cliente, datos de contacto, prevención de spam y detección de oportunidad de negocio.

---

## Archivos Modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `lib/leadIntelligence.js` | **NUEVO** | Core del Lead Intelligence Engine (708 líneas) |
| `lib/chatEvents.js` | **MODIFICADO** | Integración del Lead Intelligence Engine en `processChatConversation` |
| `lib/__tests__/leadIntelligence.test.js` | **NUEVO** | 35 tests de validación |
| `jest.config.js` | **NUEVO** | Configuración Jest para ESM |

---

## Módulos Implementados

### 1. Lead Profile (`createLeadProfile`)
Construye un perfil CRM completo del cliente:
- **cliente**: tipo (registrado/anónimo), nombre, email
- **tiempoChat**: minutos activos en conversación
- **mensajes**: total de mensajes y preguntas realizadas
- **productoPrincipal**: primer producto mencionado por el usuario
- **productosSecundarios**: otros productos mencionados
- **etapa**: etapa del ciclo de compra detectada
- **interes**: nivel de interés 0-100%
- **contacto**: datos de contacto detectados
- **ultimaFrase**: último mensaje del usuario
- **sugerencia**: acción recomendada para el asesor

### 2. Customer Stage (`detectarCustomerStage`)
Detecta 4 etapas del ciclo de compra:

| Etapa | ID | Score Mínimo | Descripción |
|-------|----|-------------|-------------|
| 🔍 Explorando | `explorando` | 0-29 | Aprendiendo sobre producto |
| 💭 Evaluando | `evaluando` | 30-69 | Evaluando posible compra |
| 🔥 Listo para comprar | `compra` | 70+ | Listo para comprar |
| 🚀 Oportunidad negocio | `negocio` | N/A | Interesado en negocio FuXion |

**Reglas de prioridad:**
1. Negocio tiene prioridad absoluta
2. Compra requiere score >= 70 + patrones de compra
3. Evaluación requiere score >= 30 + patrones de evaluación
4. Explorando es el estado por defecto

### 3. Interest Score (`calcularInteres`)
Cálculo mejorado de interés (0-100%):
- Business intent: 85% fijo
- "quiere comprar": mínimo 80%
- Precio + despacho: mínimo 65%
- Problema específico: mínimo 50%
- Comparación: mínimo 40%

### 4. Contact Detection (`detectarContacto`)
Detecta 3 tipos de datos de contacto:
- **Teléfono**: números de 7-12 dígitos
- **WhatsApp**: menciones explícitas + número
- **Correo**: emails válidos

Elimina duplicados por tipo y genera resumen legible.

### 5. Spam Prevention (`checkCooldown` + `registerNotification`)
Sistema de cooldown de 5 minutos con reglas inteligentes:

| Condición | ¿Permite? |
|-----------|-----------|
| Primera notificación de la sesión | ✅ Sí |
| Sin sessionId | ✅ Sí |
| Mismo estado dentro de cooldown | ❌ No |
| Cambio de etapa | ✅ Sí |
| Aumento de score +20 | ✅ Sí |
| Nueva detección de negocio | ✅ Sí |
| Aumento < +20 | ❌ No |

Limpieza automática de sesiones antiguas (> 1 hora).

### 6. Business Opportunity (`detectBusinessOpportunity`)
Detección independiente de oportunidad de negocio:
- NO se mezcla con compra de producto
- Detecta señales como: vender, distribuidor, ganar dinero, emprender
- Retorna señales encontradas y requiere contacto humano

### 7. Telegram Message V2 (`buildTelegramMessageV2`)
Mensaje enriquecido con formato CRM:

```
🔍 Cliente explorando productos

👤 Cliente:
Cliente anónimo

📦 Producto principal:
prunex

🧠 Etapa:
Aprendiendo sobre producto

🎯 Interés:
20%

💬 Última frase:
'Qué es Prunex?'

📊 Actividad:
1 minutos · 1 preguntas

⚠️ Sin datos de contacto todavía

💡 Sugerencia:
Cliente en etapa informativa. No requiere contacto urgente.
```

---

## Integración en chatEvents.js

El flujo actualizado en `processChatConversation`:

```
evaluateChatEvents()
    ↓
shouldNotify? → No → return evaluation
    ↓ Sí
createLeadProfile()
    ↓
checkCooldown()
    ↓
¿Cooldown permitido?
    ├── Sí → buildTelegramMessageV2() → sendTelegramNotification() → registerNotification()
    └── No → buildTelegramMessage() (fallback) → sendTelegramNotification()
    ↓
return evaluation (con leadProfile + cooldownInfo)
```

---

## Tests

**35 tests** en 7 grupos, todos pasando:

```
✓ createLeadProfile (4 tests)
  - Cliente anónimo
  - Cliente registrado
  - Múltiples productos
  - Sin productos

✓ detectarCustomerStage (6 tests)
  - Explorando
  - Evaluando
  - Compra
  - Negocio
  - Prioridad negocio
  - Default explorando

✓ detectarContacto (5 tests)
  - Teléfono
  - Correo
  - WhatsApp
  - Sin datos
  - Múltiples tipos

✓ checkCooldown (7 tests)
  - Primera notificación
  - Sin sessionId
  - Bloquear mismo estado
  - Cambio de etapa
  - Aumento +20
  - Oportunidad negocio
  - Aumento < +20

✓ detectBusinessOpportunity (5 tests)
  - Vender
  - Distribuidor
  - Ganar dinero
  - Sin señales
  - Múltiples señales

✓ buildTelegramMessageV2 (5 tests)
  - Explorando
  - Compra
  - Negocio
  - Contacto disponible
  - Señales humanas

✓ Flujo completo (3 tests)
  - Compra completa
  - Negocio completo
  - Cooldown integración
```

**Ejecutar:** `npx --node-options="--experimental-vm-modules" jest lib/__tests__/leadIntelligence.test.js --no-coverage`

---

## Ejemplos Antes/Después

### Antes (Phase 1 - Mensaje básico)
```
💡 Posible interés FuXion

👤 Cliente:
session-123

📦 Producto:
prunex

🎯 Intención compra:
40%

⏱ Conversación:
3 min

💬 Mensajes:
2

🧠 Detectado:
Preguntó por precio · Interés comercial detectado

Último mensaje:
"Cuánto cuesta?"

Acción recomendada:
Seguimiento informativo
```

### Después (Phase 2 - CRM enriquecido)
```
💭 Cliente evaluando compra

👤 Cliente:
Cliente anónimo

📦 Producto principal:
prunex

🧠 Etapa:
Evaluando posible compra

🎯 Interés:
40%

💬 Última frase:
'Cuánto cuesta?'

📊 Actividad:
3 minutos · 2 preguntas

🤖 Detectado:
preguntó precio

⚠️ Sin datos de contacto todavía

💡 Sugerencia:
Resolver dudas y ofrecer ayuda humana.
```

---

## npm build

```bash
npm run build
```

✅ Build exitoso sin errores.

---

## Conclusión

La Fase 2 del sistema de inteligencia Telegram está completa. El Lead Intelligence Engine ahora proporciona:

1. ✅ Perfiles CRM completos con datos del cliente
2. ✅ Detección precisa de etapa del ciclo de compra
3. ✅ Cálculo de interés mejorado
4. ✅ Detección de datos de contacto
5. ✅ Prevención de spam con cooldown inteligente
6. ✅ Detección independiente de oportunidad de negocio
7. ✅ Mensajes Telegram enriquecidos con formato CRM
8. ✅ 35 tests de validación
9. ✅ Integración limpia sin modificar bot, DeepSeek, UI ni productos
