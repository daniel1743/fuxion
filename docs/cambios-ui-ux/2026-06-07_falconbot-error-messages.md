# Cambio: FalconBot Error Messages Humanizados

**Fecha:** 2026-06-07 17:30 CLT  
**Archivo:** `src/components/FalconBot.jsx`

---

## Descripción

Humanización de mensajes de error en el asistente Falcon. Se actualizaron tanto el bloque `executeSend` como `handleSend` para usar lenguaje cálido y humano en lugar de mensajes técnicos.

## Cambios

### executeSend (líneas ~412-438)

**Antes:**
```
let errorMessage = '❌ Lo siento, tuve un problema al procesar tu mensaje. ';
if (error.message.includes('Insufficient Balance') || error.message.includes('402')) {
    errorMessage += 'DeepSeek no tiene saldo disponible...';
} else if (error.message.includes('API Key') || error.message.includes('API key')) {
    errorMessage += 'La configuración de la API no está completa.';
} else if (error.message.includes('429')) {
    errorMessage += 'Se excedió el límite de solicitudes...';
} else {
    errorMessage += 'Por favor, intenta de nuevo o contacta por WhatsApp.';
}
// toast: "No pude conectar con el servicio de IA."
```

**Después:**
```
let errorMessage = 'Estoy teniendo dificultad para responder en este momento. ';
if (error.message.includes('Insufficient Balance') || error.message.includes('402')) {
    errorMessage += 'El servicio de IA no está disponible temporalmente. Intenta nuevamente en unos segundos 💚';
} else if (error.message.includes('API Key') || error.message.includes('API key')) {
    errorMessage += 'La configuración del servicio no está completa. Intenta nuevamente más tarde 💚';
} else if (error.message.includes('429')) {
    errorMessage += 'Hay muchas consultas en este momento. Espera unos segundos y vuelve a intentar 💚';
} else {
    errorMessage += 'Intenta nuevamente en unos segundos 💚';
}
// toast: "Estoy teniendo dificultad para responder. Intenta nuevamente 💚"
```

### handleSend (líneas ~507-533)

Mismos cambios aplicados al segundo bloque de error.

### Typing Indicator

- **Antes:** "🌱 Analizando tu consulta" / "🌱 Preparando recomendación..."
- **Después:** "Falcon Assistant está escribiendo..."

## Principios

- Lenguaje cálido y humano (primera persona: "Estoy teniendo dificultad...")
- Emoji 💚 en lugar de ❌
- Mensajes específicos por tipo de error pero sin jerga técnica
- Invitación a reintentar en lugar de instrucciones técnicas
