# FalconBot - Documentación Completa

## 1. Visión General

FalconBot es el asistente virtual de IA de la tienda FuXion. Está implementado en `src/components/FalconBot.jsx` y se integra con múltiples servicios para proporcionar respuestas contextuales, recomendaciones de productos y derivación a asesores humanos.

---

## 2. Arquitectura

### 2.1 Componentes principales

```
FalconBot.jsx (componente principal)
├── Botón flotante (Falcon IA)
├── Botón flotante WhatsApp
├── Ventana de chat
│   ├── Header (nombre, estado, botones)
│   ├── Área de mensajes
│   │   ├── Mensajes del usuario
│   │   ├── Mensajes del bot
│   │   ├── Acciones rápidas (chips)
│   │   └── Skeleton de carga
│   └── Input + botón enviar
```

### 2.2 Servicios externos

| Servicio | Archivo | Propósito |
|----------|---------|-----------|
| DeepSeek API | `src/services/deepseekService.js` | Envío de mensajes a IA |
| WhatsApp | `src/lib/whatsapp.js` | Apertura de WhatsApp con asesor |
| Advisor Events | `src/services/advisorService.js` | Registro de eventos de asesor |
| User Journey | `src/lib/userJourneyContext.js` | Contexto de navegación del usuario |
| Product Journey | `src/lib/productJourney.js` | Contexto de productos vistos |

---

## 3. Estados del componente

### 3.1 Estados principales

| Estado | Tipo | Valor inicial | Propósito |
|--------|------|---------------|-----------|
| `isOpen` | boolean | `false` | Controla visibilidad del chat |
| `messages` | array | `[]` | Historial de mensajes visibles |
| `input` | string | `''` | Valor actual del input |
| `isLoading` | boolean | `false` | Indica si está esperando respuesta de IA |
| `activeProduct` | object/null | `null` | Producto actual en consulta |
| `showQuickWhatsapp` | boolean | `false` | Muestra botón flotante WhatsApp |
| `showQuickActions` | boolean | `true` | Muestra chips de acciones rápidas |
| `isFloatingHovered` | boolean | `false` | Estado hover del botón flotante |
| `isMobileMenuOpen` | boolean | `false` | Estado del menú móvil |

### 3.2 Estados derivados

| Variable | Cálculo | Propósito |
|----------|---------|-----------|
| `customerName` | `user?.name \|\| adminData?.nombre_completo \|\| ''` | Nombre del cliente |
| `firstName` | `customerName.trim().split(/\s+/)[0] \|\| ''` | Primer nombre |
| `quickActions` | `getSmartSuggestions()` | Sugerencias contextuales |

---

## 4. Flujo de conversación

### 4.1 Apertura del chat

```
Usuario hace clic en botón flotante
  → handleToggle()
    → Verificar contexto de producto (getUserJourneyContext)
    → Obtener saludo contextual (getContextualGreeting)
    → Si hay saludo contextual:
        → addOrUpdateContextMessage(greetingObj, greetingContext)
    → Si no hay mensajes previos:
        → Mostrar saludo de journey (getJourneyGreeting) o saludo por defecto
```

### 4.2 Envío de mensaje

```
Usuario escribe mensaje y presiona Enter
  → handleSend(e)
    → Agregar mensaje del usuario al estado
    → Construir contexto:
        → buildCustomerContext() (cliente)
        → getContextForAI() (navegación)
        → getJourneyContextForAI() (productos vistos)
        → getCurrentProductContext() (producto actual)
        → buildProductContextForAI() (formatear producto)
    → Enviar a sendMessageToDeepSeek()
    → Recibir respuesta
    → makeConversationNatural() (limpiar respuesta)
    → Agregar respuesta al estado
    → Si hay señales de compra: agregar advisorUrl
```

### 4.3 Acción rápida

```
Usuario hace clic en chip de acción rápida
  → handleQuickAction(actionText)
    → Ocultar acciones rápidas
    → Establecer input con el texto
    → Ejecutar executeSend() (similar a handleSend)
```

### 4.4 Nueva conversación

```
Usuario hace clic en botón "Nueva conversación"
  → handleNewConversation()
    → setMessages([{ sender: 'bot', text: bot.greeting, botType: 'assistant' }])
    → setShowQuickActions(true)
    → setActiveProduct(null)
    → NO toca memoria interna, customerMemory, Supabase
```

---

## 5. Construcción del prompt

### 5.1 Estructura del prompt

```
${buildCustomerContext()}${journeySection}${productJourneySection}${productSection}

Pregunta del usuario: ${userMessage}
```

### 5.2 Componentes del prompt

| Componente | Función | Contenido |
|------------|---------|-----------|
| Cliente | `buildCustomerContext()` | Nombre, progreso de regalo, historial de pedidos |
| Navegación | `getContextForAI()` | Página actual, productos vistos, categorías, búsquedas |
| Productos vistos | `getJourneyContextForAI()` | Lista de productos vistos, interés inferido |
| Producto actual | `buildProductContextForAI()` | Nombre, slug, categoría, precio, presentación, uso, horario, beneficios, ingredientes |

### 5.3 Contexto del cliente

```jsx
const buildCustomerContext = () => {
    if (!isEligible) return 'El visitante no ha iniciado sesión.';
    const history = (orders || [])
        .slice(0, 3)
        .flatMap((order) => (order.products || []).map((product) => (
            `${product.name} x${product.quantity}, pedido el ${new Date(order.created_at).toLocaleDateString('es-CL')}`
        )))
        .slice(0, 6)
        .join('; ');
    return `CONTEXTO DEL CLIENTE:
- Nombre: ${customerName || 'Cliente'}
- Progreso de regalo: ${account.progress_products} de 4
- Regalos disponibles: ${account.available_rewards}
- Historial reciente: ${history || 'Sin historial detallado'}
- Si sugieres reposición de cajas de 28 sobres, aclara "si usaste un sobre al día". No presentes la estimación como certeza.`;
};
```

---

## 6. Detección de intenciones

### 6.1 Video de oportunidad

```jsx
const videoOpportunityPatterns = [
    /\b(quiero ver el video|ver video|video explicativo|pásame el video|pásame el vídeo)\b/i,
    /\b(quiero conocer el negocio|cómo funciona fuxion|cómo funciona fuXion|como funciona fuxion)\b/i,
    /\b(oportunidad fuxion|oportunidad fuXion|modelo de negocio|plan de compensación|plan de compensacion)\b/i,
    /\b(quiero saber más sobre la oportunidad|cuéntame sobre la oportunidad|cuentame sobre la oportunidad)\b/i,
    /\b(ver oportunidad|video de oportunidad|video oportunidad)\b/i
];
```

Si coincide, responde con mensaje personalizado (sin botón de navegación).

---

## 7. Manejo de errores

### 7.1 Tipos de error

| Error | Mensaje |
|-------|---------|
| Insufficient Balance / 402 | "El servicio de IA no está disponible temporalmente." |
| API Key inválida | "La configuración del servicio no está completa." |
| 429 (rate limit) | "Hay muchas consultas en este momento." |
| Otros | "Intenta nuevamente en unos segundos." |

### 7.2 Comportamiento en error

- Se muestra mensaje de error en el chat
- Se agrega `advisorUrl` para derivar a asesor humano
- Se muestra toast de error

---

## 8. Mensajes del bot

### 8.1 Estructura de cada mensaje

```jsx
{
    sender: 'bot' | 'user',
    text: string,
    botType: 'assistant' | 'error' | 'system',
    apiUsed: string | null,
    advisorUrl: string | null,
    isBusinessOpportunity: boolean,
    showOpportunityVideo: boolean,
    showOpportunityAdvisor: boolean,
    contextMessage: boolean,
    contextSlug: string | null
}
```

### 8.2 Tipos de mensajes

| botType | Propósito |
|---------|-----------|
| `assistant` | Respuesta normal de la IA |
| `error` | Mensaje de error |
| `system` | Mensaje del sistema (no se muestra al usuario) |

---

## 9. Acciones rápidas (quickActions)

### 9.1 Obtención

```jsx
const quickActions = getSmartSuggestions();
```

### 9.2 Filtro

```jsx
quickActions
    .filter(action => action.label !== 'Ver video' && action.text !== 'Ver video')
    .map((action, idx) => (...))
```

### 9.3 Estructura de cada acción

```jsx
{
    emoji: string,   // Ej: '🔥'
    label: string,   // Ej: 'Controlar peso'
    text: string     // Ej: 'Quiero productos para controlar mi peso'
}
```

---

## 10. Botón flotante WhatsApp

### 10.1 Comportamiento

- Se muestra al hacer hover sobre el botón Falcon
- Desaparece después de 5 segundos
- Al hacer clic, abre WhatsApp con mensaje predefinido

### 10.2 Diseño

```jsx
className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#00b894] text-white shadow-lg shadow-[#25D366]/30 transition-all hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-105 active:scale-95"
```

---

## 11. Botón flotante Falcon

### 11.1 Comportamiento

- Siempre visible cuando chat está cerrado
- Se oculta cuando menú móvil está abierto
- Tiene scroll awareness (reduce opacidad/scale al hacer scroll)
- Al hacer clic, abre el chat

### 11.2 Diseño

```jsx
className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-92"
```

---

## 12. Efectos (useEffect)

| Efecto | Disparador | Propósito |
|--------|------------|-----------|
| Mobile menu | `isMobileMenuOpen` | Escucha evento de menú móvil desde Header |
| Scroll awareness | `useScrollAware` | Reduce opacidad/scale al hacer scroll |
| Smart suggestions | `getSmartSuggestions()` | Obtiene sugerencias contextuales |
| Cargar historial | Montaje | Carga mensajes guardados de localStorage |
| Guardar historial | `messages` | Guarda mensajes en localStorage |
| Scroll to bottom | `messages` | Auto-scroll al último mensaje |
| Actualizar saludo | `isOpen`, `activeProduct`, `firstName`, `isEligible` | Actualiza saludo cuando cambian condiciones |
| Scroll lock | `isOpen` | Bloquea scroll de página cuando chat está abierto |
| Click outside + Escape | `isOpen` | Cierra chat al hacer clic fuera o presionar Escape |
| Product consultation | Evento `fuxion:open-product-ai` | Abre chat con introducción de producto |
| Cleanup timer | Desmontaje | Limpia timeout de WhatsApp flotante |

---

## 13. Eventos personalizados

| Evento | Propósito |
|--------|-----------|
| `fuxion:mobile-menu` | Comunica estado del menú móvil desde Header |
| `fuxion:open-product-ai` | Abre chat con introducción de producto |

---

## 14. Dependencias externas

| Librería | Uso |
|----------|-----|
| `framer-motion` | Animaciones de entrada/salida |
| `lucide-react` | Iconos (Minus, X, Send, etc.) |
| `@/services/deepseekService` | Llamada a API de IA |
| `@/lib/whatsapp` | Funciones de WhatsApp |
| `@/services/advisorService` | Registro de eventos de asesor |
| `@/components/icons/BrandIcons` | Iconos personalizados (AiRobotIcon, WhatsAppIcon) |
| `@/lib/userJourneyContext` | Contexto de navegación del usuario |
| `@/lib/productJourney` | Contexto de productos vistos |
| `@/context/AuthContext` | Autenticación |
| `@/context/AdminContext` | Administración |
| `@/context/LoyaltyContext` | Programa de lealtad |

---

## 15. Archivos relacionados

| Archivo | Propósito |
|---------|-----------|
| `src/services/deepseekService.js` | Servicio de IA |
| `src/lib/userJourneyContext.js` | Contexto de navegación |
| `src/lib/productJourney.js` | Contexto de productos |
| `src/lib/whatsapp.js` | Funciones de WhatsApp |
| `src/services/advisorService.js` | Eventos de asesor |
| `src/components/icons/BrandIcons.jsx` | Iconos personalizados |
| `src/components/ProductLinkedText.jsx` | Renderizado de enlaces de productos |
| `src/components/skeleton/ChatMessageSkeleton.jsx` | Skeleton de carga |
| `src/components/ScrollAwareFloating.jsx` | Scroll awareness |

---

## 16. Reglas de negocio

### 16.1 NO modificar

- Lógica IA
- Memoria interna
- CustomerMemory
- Supabase
- Chat events
- Historial usado por IA
- Recomendaciones
- Prompts del asistente

### 16.2 Permitido modificar

- Iconos visuales
- Textos de UI
- Animaciones
- Diseño del chat
- Botones (sin cambiar lógica)

---

## 17. Resumen de flujo completo

1. Usuario abre chat (click en botón flotante)
2. Se muestra saludo personalizado + acciones rápidas
3. Usuario escribe mensaje o hace clic en acción rápida
4. Se construye contexto (cliente + navegación + productos + producto actual)
5. Se envía prompt a DeepSeek
6. Se recibe respuesta y se muestra en el chat
7. Si hay señales de compra, se ofrece derivar a asesor
8. Mensajes se guardan en localStorage
9. Al cerrar chat, se restaura scroll de página
