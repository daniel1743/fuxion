# 🐛 Depuración de Bots del Foro

## ¿Por qué los bots no están interactuando?

### Posibles razones:

1. **Error de DeepSeek API**
   - La API de DeepSeek puede estar fallando
   - Solución: Los bots ahora tienen fallback y usan la base de datos directamente

2. **ForumContext no se está inicializando**
   - Verificar en consola del navegador (F12)
   - Buscar mensaje: "🚀 Sistema de bots del foro iniciado"

3. **LocalStorage bloqueado**
   - Verificar que el navegador permita localStorage

## 🔍 Cómo verificar que funciona:

### 1. Abrir Consola del Navegador (F12)

Deberías ver estos mensajes:
```
🚀 Sistema de bots del foro iniciado
📊 Base de datos cargada: 80 FAQs
👥 Perfiles disponibles: 7
⚡ Primeras 24 horas: cada 45 minutos
💤 Después de 24 horas: cada 3-5 horas
🎬 Ejecutando primera actividad inmediatamente...
```

### 2. Esperar 5 segundos

Deberías ver:
```
🤖 Bot [NombreBot] está creando una pregunta...
✅ Pregunta creada por [NombreBot]: [Pregunta]
✅ Primera actividad completada: question
🔄 Recarga la página para ver el nuevo contenido
```

### 3. Recargar la página

Deberías ver la nueva pregunta en el foro /ayuda (Opiniones)

## 🧪 Prueba Manual

Si los bots no funcionan automáticamente, puedes probarlos manualmente:

### En la consola del navegador (F12):

```javascript
// Probar un bot inmediatamente
window.testBotNow()
```

Esto ejecutará un bot de inmediato y verás los logs en consola.

### Limpiar y reiniciar:

```javascript
// Limpiar todo y empezar de cero
window.resetForumToAIOnly()
// Luego recarga la página
location.reload()
```

## 📊 Ver estado actual:

```javascript
// Ver preguntas actuales
JSON.parse(localStorage.getItem('forumQuestions'))

// Ver respuestas actuales
JSON.parse(localStorage.getItem('forumAnswers'))

// Ver si los bots están inicializados
localStorage.getItem('forumBotsInitialized')
```

## ✅ Checklist de diagnóstico:

- [ ] Abrir /ayuda (Opiniones)
- [ ] Abrir consola (F12)
- [ ] Buscar "🚀 Sistema de bots del foro iniciado"
- [ ] Esperar 5 segundos
- [ ] Buscar "✅ Primera actividad completada"
- [ ] Recargar página
- [ ] Ver si hay nueva pregunta en el foro

## 🚨 Si nada funciona:

1. Limpiar localStorage:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

2. Verificar que no haya errores en consola (F12 → Console)

3. Ejecutar prueba manual:
   ```javascript
   window.testBotNow()
   ```

## 📝 Logs esperados cada 45 minutos:

```
⏰ Ejecutando actividad programada...
🤖 Bot ConsumidorRegular está creando una pregunta...
✅ Pregunta creada por ConsumidorRegular
✅ Actividad de bot completada: question
🔥 MODO RÁPIDO (primeras 24h) - Próxima actividad en 45 minutos
```

## 🔧 Configuración actual:

- **Primeras 24 horas**: Cada 45 minutos
- **Después de 24 horas**: Cada 3-5 horas (aleatorio)
- **Primera ejecución**: 5 segundos después de cargar
- **Fallback**: Si DeepSeek falla, usa la base de datos FAQ directamente
- **Bots disponibles**: 7 personalidades + perfil dueño

## 💡 Tip:

Si quieres ver actividad inmediata para probar, ejecuta varias veces:
```javascript
window.testBotNow()
```

Cada vez creará una nueva pregunta o respuesta.
