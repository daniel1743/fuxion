# SMART PRODUCT JOURNEY REPORT
## Smart Product Interest Memory — Falcon Assistant

**Fecha:** 7 de junio, 2026
**Versión:** 1.0.0
**Estado:** ✅ COMPLETADO

---

## Resumen

Se implementó el sistema **Smart Product Interest Memory** que permite a Falcon Assistant recordar el recorrido del usuario por productos FuXion durante su sesión de navegación. El sistema rastrea qué productos ha visto el usuario, infiere su posible interés principal, y utiliza esta información para:

1. **Saludos contextuales** al abrir el chat
2. **Inyección de contexto en prompts de IA** (tanto frontend como backend)
3. **Recomendaciones más precisas** basadas en el interés inferido

---

## Arquitectura

### Flujo de datos

```
ProductPage.jsx → productJourney.js (sessionStorage) → deepseekService.js → api/chat.js → AI Prompt
                                                          ↕
                                              FalconBot.jsx (lectura directa)
```

### Componentes modificados/creados

| Archivo | Acción | Propósito |
|---------|--------|-----------|
| `src/lib/productJourney.js` | ✅ CREADO | Módulo core del Smart Product Interest Memory |
| `src/pages/ProductPage.jsx` | ✅ MODIFICADO | Tracking de vistas de producto |
| `src/components/FalconBot.jsx` | ✅ MODIFICADO | Saludos contextuales + inyección en prompts |
| `src/services/deepseekService.js` | ✅ MODIFICADO | Envío de journey al backend |
| `api/chat.js` | ✅ MODIFICADO | Inyección de contexto en prompt de IA |

---

## Detalle de Implementación

### 1. `src/lib/productJourney.js` — Módulo Core

**Almacenamiento:** `sessionStorage` (clave: `productJourney`)

**Estructura de datos:**
```json
{
  "viewedProducts": [
    { "slug": "prunex-1", "name": "PRUNEX 1", "category": "Limpieza del Colon", "timestamp": 1234567890 },
    { "slug": "flora-liv", "name": "FLORA LIV", "category": "Regeneración Flora Intestinal", "timestamp": 1234567891 }
  ],
  "mainInterest": "digestivo"
}
```

**Reglas:**
- Máximo **5 productos** guardados (los más recientes)
- **Sin duplicados** (si ya existe, se mueve al inicio)
- `mainInterest` se infiere de la categoría más frecuente

**Funciones exportadas:**
- `getProductJourney()` — Obtiene el journey completo
- `trackProductView({slug, name, category})` — Registra vista de producto
- `getJourneyGreeting()` — Genera saludo contextual para Falcon Assistant
- `getJourneyContextForAI()` — Genera contexto formateado para prompts de IA
- `getViewedProductNames()` — Lista de nombres de productos vistos
- `getMainInterest()` — Interés principal inferido
- `clearProductJourney()` — Limpia el journey (testing/reset)

**Mapa de Categorías → Intereses:**
| Categoría | Interés |
|-----------|---------|
| Limpieza del Colon | digestivo |
| Limpieza del Sistema Digestivo | digestivo |
| Regeneración Flora Intestinal | digestivo |
| Salud del Tracto Urinario | urinario |
| Limpieza de Sangre | desintoxicacion |
| Limpieza Hígado y Sistema Hepatobiliar | desintoxicacion |
| Energizante Natural | energia |
| Multivitamínico Energizante | energia |
| Hidratación Nutricional para la Familia | hidratacion |
| Inmunológica - Defensas | defensas |
| Control de Peso | control_peso |
| Anti-Edad | anti_edad |
| Vigor Mental | mental |
| Sport | sport |
| Proteína 100% Vegetal | nutricion |

### 2. `src/pages/ProductPage.jsx` — Tracking de Vistas

Se agregó el siguiente código dentro del `useEffect` que ya existía para cargar datos del producto:

```javascript
import { trackProductView } from '@/lib/productJourney';

// Dentro del useEffect de carga de producto:
trackProductView({
  slug: product.slug,
  name: product.name,
  category: product.category || 'general'
});
```

### 3. `src/components/FalconBot.jsx` — Saludos e Inyección

**Saludos contextuales** (en `handleToggle`):
1. **Prioridad 1:** Saludo contextual legacy (`userJourneyContext`)
2. **Prioridad 2:** Smart Product Interest Memory greeting (`getJourneyGreeting()`)
3. **Prioridad 3:** Saludo por defecto

**Tipos de saludo contextual:**
- **1 producto:** `"Veo que estás revisando PRUNEX 1 🌱"`
- **Múltiples relacionados:** `"Veo que has estado mirando opciones enfocadas en bienestar digestivo 🌱"`
- **Múltiples diferentes:** `"Veo que estás comparando algunos productos FuXion. Puedo ayudarte a elegir según tu objetivo."`

**Inyección en prompts** (en `executeSend` y `handleSend`):
```javascript
const productJourneyContext = getJourneyContextForAI();
const productJourneySection = productJourneyContext
  ? `\n\nCONTEXTO DE PRODUCTOS VISTOS:\n${productJourneyContext}`
  : '';
```

### 4. `src/services/deepseekService.js` — Envío al Backend

Se agregó lectura del journey desde `sessionStorage` y envío como campo `productJourney` en el body de la request:

```javascript
const productJourneyData = getProductJourney();
// Enviado en el body de la request:
body: JSON.stringify({
  message: userMessage,
  context: fullContext,
  productJourney: productJourneyData,  // ← NUEVO
  conversationHistory,
  mode: 'unificado'
})
```

### 5. `api/chat.js` — Inyección en Prompt de IA

Se actualizó el handler para:
1. **Destructurar** `productJourney` del `req.body`
2. **Pasar** a `buildDynamicPrompt()` como 7mo parámetro
3. **Inyectar** en el prompt del sistema:

```
CONTEXTO DE PRODUCTOS VISTOS POR EL USUARIO:
Productos vistos:
- PRUNEX 1
- FLORA LIV

Posible interés:
digestivo
```

---

## Validación

### Escenario de prueba

1. **Entrar a producto PRUNEX** → Se guarda en `sessionStorage`
2. **Entrar a producto FLORA LIV** → Se agrega al journey
3. **Abrir Falcon Assistant** → Saludo: "Veo que has estado mirando opciones enfocadas en bienestar digestivo 🌱"
4. **Preguntar: "cuál me sirve más?"** → La IA recibe contexto de productos vistos e interés inferido

### Formato del contexto inyectado en la IA

```
Productos vistos:
- PRUNEX 1
- FLORA LIV

Posible interés:
digestivo
```

---

## Consideraciones de Privacidad

- ✅ **No se almacenan datos personales** — Solo slugs, nombres de productos y categorías
- ✅ **No persiste entre sesiones** — Usa `sessionStorage`, se borra al cerrar el navegador
- ✅ **No se muestra al usuario** — El historial es invisible para el usuario
- ✅ **No es invasivo** — Los saludos son naturales y no mencionan "seguimiento"
- ✅ **Máximo 5 productos** — Límite para evitar acumulación excesiva

---

## Archivos Relacionados

- `src/lib/productJourney.js` — Módulo core
- `src/pages/ProductPage.jsx` — Tracking de vistas
- `src/components/FalconBot.jsx` — Saludos e inyección frontend
- `src/services/deepseekService.js` — Envío al backend
- `api/chat.js` — Inyección backend en prompt de IA

---

## Próximos Pasos (Opcionales)

- [ ] Agregar tracking desde `ProductosFuxionPage.jsx` (vista de listado)
- [ ] Agregar tracking desde búsqueda interna
- [ ] Persistencia opcional en localStorage para sesiones cruzadas
- [ ] Dashboard de analytics para ver patrones de navegación de productos
