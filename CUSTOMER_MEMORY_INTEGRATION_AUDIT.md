# Customer Memory Integration Audit

**Fecha:** 2026-06-07
**Estado:** ❌ NO INTEGRADO - Código muerto detectado

---

## Resumen

Se realizó una auditoría completa para verificar si `lib/customerMemory.js` está conectado al flujo real del Falcon Assistant. **El resultado es negativo: customerMemory.js NO está importado por ningún archivo del sistema.**

---

## 1. Búsqueda de imports

```bash
grep -r "customerMemory" --include="*.js" --include="*.jsx" .
```

**Resultado: Solo 2 archivos contienen referencias a customerMemory:**

| Archivo | Rol |
|---------|-----|
| `lib/customerMemory.js` | Definición del módulo (origen) |
| `lib/__tests__/customerMemory.test.js` | Tests (importa desde `../customerMemory.js`) |

**Ningún otro archivo importa customerMemory.**

---

## 2. Búsqueda de funciones exportadas

```bash
grep -r "updateVisitorProfile\|generateProfileSummary\|calculatePurchaseProbability\|detectReturningCustomer\|analyzeIntentProgression\|analyzeProductJourney\|detectBusinessLead\|getBusinessLeadInfo\|detectHumanFollowUp" --include="*.js" --include="*.jsx" .
```

**Resultado:**

| Función | customerMemory.js | customerMemory.test.js | Otros archivos |
|---------|-------------------|----------------------|----------------|
| `updateVisitorProfile` | ✅ Definida | ✅ Usada en tests | ❌ NO |
| `generateProfileSummary` | ✅ Definida | ✅ Usada en tests | ⚠️ `conversationEngine.js` y `reasoningEngine.js` usan este nombre, pero importan desde `conversationProfile.js` (módulo diferente) |
| `calculatePurchaseProbability` | ✅ Definida | ✅ Usada en tests | ❌ NO |
| `detectReturningCustomer` | ✅ Definida | ✅ Usada en tests | ❌ NO |
| `analyzeIntentProgression` | ✅ Definida | ✅ Usada en tests | ❌ NO |
| `analyzeProductJourney` | ✅ Definida | ✅ Usada en tests | ❌ NO |
| `detectBusinessLead` | ✅ Definida | ✅ Usada en tests | ❌ NO |
| `getBusinessLeadInfo` | ✅ Definida | ✅ Usada en tests | ❌ NO |
| `detectHumanFollowUp` | ✅ Definida | ✅ Usada en tests | ❌ NO |

---

## 3. Flujo real del Falcon Assistant

El flujo actual (sin customerMemory) es:

```
Usuario escribe mensaje
    ↓
api/chat.js (handler)
    ↓
processUserMessage(sessionId, userMessage, detectedProducts)  ← conversationEngine.js
    ↓
getOrCreateProfile(sessionId)  ← conversationProfile.js (memoria EN SESIÓN, no persistente)
    ↓
generateFullContext(profile)  ← reasoningEngine.js
    ↓
Llamada a API de IA (DeepSeek/Qwen/Gemini)
    ↓
processChatConversation()  ← chatEvents.js
    ↓
createLeadProfile()  ← leadIntelligence.js (Phase 2 - CRM por sesión)
    ↓
checkCooldown()  ← leadIntelligence.js
    ↓
buildTelegramMessageV2()  ← leadIntelligence.js
    ↓
sendTelegramNotification()  ← telegramNotifier.js
```

**Punto crítico:** `customerMemory.js` debería insertarse en `processChatConversation()` en `chatEvents.js`, justo después de `createLeadProfile()` o dentro de `evaluateChatEvents()`, para que cada mensaje del usuario actualice la memoria persistente del visitante.

---

## 4. Funciones conectadas vs sin uso

### ✅ Funciones que SÍ se usan en el flujo real (Phase 2 - leadIntelligence.js):
- `createLeadProfile` → chatEvents.js (línea 543)
- `detectarCustomerStage` → chatEvents.js (importado)
- `detectarContacto` → chatEvents.js (importado)
- `checkCooldown` → chatEvents.js (línea 564)
- `registerNotification` → chatEvents.js (línea 572)
- `detectBusinessOpportunity` → chatEvents.js (importado)
- `buildTelegramMessageV2` → chatEvents.js (línea 568)

### ❌ Funciones de customerMemory.js que NO se usan en el flujo real:
- `updateVisitorProfile` → **CÓDIGO MUERTO** - Nadie la llama
- `getOrCreateVisitorProfile` → **CÓDIGO MUERTO** - Nadie la llama
- `detectReturningCustomer` → **CÓDIGO MUERTO** - Nadie la llama
- `analyzeIntentProgression` → **CÓDIGO MUERTO** - Nadie la llama
- `analyzeProductJourney` → **CÓDIGO MUERTO** - Nadie la llama
- `detectBusinessLead` → **CÓDIGO MUERTO** - Nadie la llama
- `getBusinessLeadInfo` → **CÓDIGO MUERTO** - Nadie la llama
- `detectHumanFollowUp` → **CÓDIGO MUERTO** - Nadie la llama
- `calculatePurchaseProbability` → **CÓDIGO MUERTO** - Nadie la llama
- `generateProfileSummary` → **CÓDIGO MUERTO** (la versión de customerMemory.js)
- `saveProfileToSupabase` → **CÓDIGO MUERTO** - Nadie la llama
- `loadProfileFromSupabase` → **CÓDIGO MUERTO** - Nadie la llama

---

## 5. Confusión de nombres: generateProfileSummary

Existen **dos funciones diferentes** con el mismo nombre:

| Origen | Archivo | Propósito |
|--------|---------|-----------|
| `generateProfileSummary(profile)` | `lib/conversation/conversationProfile.js` | Genera resumen de perfil de sesión para el prompt de IA |
| `generateProfileSummary(visitorId)` | `lib/customerMemory.js` | Genera resumen de memoria persistente para Telegram |

**Quienes importan:**
- `conversationEngine.js` importa desde `./conversationProfile.js` ✅ (correcto)
- `reasoningEngine.js` importa desde `../conversationProfile.js` ✅ (correcto)
- `customerMemory.test.js` importa desde `../customerMemory.js` ✅ (correcto)

**No hay conflicto de imports**, pero el nombre duplicado puede causar confusión en el futuro.

---

## 6. Telegram: ¿usa datos de customerMemory?

**NO.** Las alertas Telegram actuales usan exclusivamente `leadIntelligence.js` (Phase 2):

- `buildTelegramMessageV2(leadProfile)` usa datos de `createLeadProfile()`:
  - `leadProfile.etapa.id` → de `detectarCustomerStage()`
  - `leadProfile.interes` → de `calcularInteres()`
  - `leadProfile.productoPrincipal` → primer producto mencionado
  - `leadProfile.contacto` → de `detectarContacto()`

**No usa:**
- `visitCount` real (siempre muestra 1 visita)
- `interestedProducts` acumulados entre sesiones
- `highestIntentReached` histórico
- `businessLead` persistente
- `contactedHuman` persistente
- `detectReturningCustomer` (no detecta clientes recurrentes)

---

## 7. Storage: localStorage vs Supabase

**Estado actual:**
- `customerMemory.js` tiene la lógica de storage implementada (loadMemory, saveMemory, saveProfileToSupabase, loadProfileFromSupabase)
- **Pero como nadie importa customerMemory.js, esta lógica nunca se ejecuta**
- El almacenamiento real de sesiones usa `conversationProfile.js` con un `Map` en memoria (no persistente entre sesiones)

---

## 8. Conclusión

| Aspecto | Estado |
|---------|--------|
| customerMemory.js existe | ✅ Sí |
| Tiene tests que pasan | ✅ 50/50 |
| Build compila sin errores | ✅ Sí |
| **Alguien lo importa** | **❌ NO - CÓDIGO MUERTO** |
| **Se usa en el flujo real** | **❌ NO** |
| **Telegram usa sus datos** | **❌ NO** |
| **Storage persistente activo** | **❌ NO** |

### Acción requerida

Para conectar customerMemory.js al flujo real, se necesita:

1. **En `lib/chatEvents.js`**: Importar `updateVisitorProfile`, `detectReturningCustomer`, `generateProfileSummary` desde `../lib/customerMemory.js`
2. **En `processChatConversation()`**: Llamar a `updateVisitorProfile(sessionId, {...})` con los datos de la evaluación actual (productos, intención, negocio, contacto humano)
3. **En `buildTelegramMessageV2()` o en `processChatConversation()`**: Usar `detectReturningCustomer()` y `generateProfileSummary()` para enriquecer las alertas Telegram con datos de memoria persistente
4. **Opcional**: Integrar `saveProfileToSupabase()` para usuarios registrados

**Nota:** Esta integración NO modifica UI, SEO, productos, respuestas base IA ni formularios. Solo conecta el módulo de memoria al flujo de eventos del chat.
