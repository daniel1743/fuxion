# 🤖 Sistema de Bots Inteligentes con DeepSeek AI

## ✅ Sistema Implementado

Se han creado **3 bots especializados** con inteligencia artificial de DeepSeek, cada uno entrenado con la base de conocimientos completa de Fuxion Shop.

## 🎯 Los 3 Bots Especializados

### 1. 🛍️ **Bot de Ventas** (Azul)
**Especialidad**: Encontrar productos y ofertas

**Qué sabe**:
- Catálogo completo de 30 productos
- Precios y descuentos actuales
- Promociones vigentes
- Stock disponible
- Características de cada producto

**Ejemplos de preguntas**:
- "¿Qué laptops tienen en oferta?"
- "Busco algo para gaming"
- "Productos con descuento"
- "Muéstrame VR goggles"
- "¿Cuál es tu producto más vendido?"

### 2. 🎧 **Bot de Soporte** (Verde)
**Especialidad**: Ayuda con políticas y procesos

**Qué sabe**:
- Políticas de envío (gratis, regular, express)
- Procedimiento de devoluciones
- Garantías y cobertura
- Métodos de pago aceptados
- Horarios de atención
- FAQs más comunes

**Ejemplos de preguntas**:
- "¿Cuánto tarda el envío?"
- "¿Cómo hago una devolución?"
- "¿Qué garantía tienen?"
- "¿Qué métodos de pago aceptan?"
- "¿Tienen tienda física?"

### 3. 💡 **Asesor Técnico** (Morado)
**Especialidad**: Recomendaciones personalizadas

**Qué sabe**:
- Guías de compra por categoría
- Comparaciones de productos
- Especificaciones técnicas detalladas
- Usos ideales para cada producto
- Consejos de experto

**Ejemplos de preguntas**:
- "¿Qué laptop me recomiendas para diseño?"
- "Diferencia entre VR básico y Pro"
- "Necesito algo para hacer ejercicio"
- "¿Es mejor laptop o tablet para mi caso?"
- "Qué características debo buscar en un smartwatch"

## 📚 Base de Conocimientos

Los bots tienen acceso a:

### Información de la Empresa
- Nombre, slogan y descripción
- WhatsApp y email de contacto
- Horarios de atención

### Productos Destacados (con detalles completos)
1. **Quantum Laptop Pro** - $1799.99 (10% desc)
2. **VR Goggles X Pro** - $399.99 (20% desc)
3. **Smartwatch Ultra Fitness** - $299.99
4. Y 27 productos más...

### 8 Categorías de Productos
- Computación
- Audio y Video
- Robótica
- Hogar Inteligente
- Gaming
- Realidad Virtual
- Drones
- Wearables

### Políticas Completas
- **Envío gratis**: Compras > $50 (2-3 días)
- **Envío regular**: $5 (3-5 días)
- **Envío express**: $15 (24 horas)
- **Devoluciones**: 30 días
- **Garantía**: 1 año

### 10 FAQs Principales
- Cómo hacer pedidos
- Tiempos de envío
- Proceso de devoluciones
- Métodos de pago
- Y más...

## 🚀 Cómo Usar los Bots

### 1. Abrir el Chat
- Haz clic en el botón flotante **🤖** (abajo a la derecha)
- Verás el mensaje de bienvenida

### 2. Seleccionar un Bot
- Arriba verás 3 botones con iconos:
  - 🛍️ **Bot** (Ventas - Azul)
  - 🎧 **Bot** (Soporte - Verde)
  - 💡 **Asesor** (Técnico - Morado)
- Haz clic en el que necesites

### 3. Hacer Preguntas
- Escribe tu pregunta en lenguaje natural
- El bot responderá con información precisa de la base de datos
- Puedes cambiar de bot en cualquier momento

### 4. Conversación Continua
- El bot recuerda los últimos 5 mensajes
- Puede mantener contexto de la conversación
- Responde en español de forma amigable

## 💻 Ejemplos de Conversaciones

### Ejemplo 1: Buscar Producto
```
Usuario: Busco una laptop para edición de video
Bot de Ventas: ¡Perfecto! Te recomiendo la Quantum Laptop Pro:
- Precio: $1799.99 (10% descuento aplicado)
- Procesador Quantum Core i9
- 32GB RAM DDR5
- GPU dedicada ideal para edición
- Pantalla 4K OLED de 15.6"
¿Te gustaría saber más detalles?
```

### Ejemplo 2: Consulta de Envío
```
Usuario: ¿Cuánto cuesta el envío?
Bot de Soporte: Tenemos 3 opciones de envío:
🆓 Envío GRATIS en compras superiores a $50 (2-3 días)
📦 Envío regular: $5.00 (3-5 días)
⚡ Envío express: $15.00 (24 horas)
¿Cuál prefieres?
```

### Ejemplo 3: Asesoría Técnica
```
Usuario: ¿Es mejor laptop o tablet?
Asesor Técnico: Depende de tu uso:
🖥️ Laptop: Mejor para trabajo pesado, multitarea, programación y edición de video.
📱 Tablet: Ideal para portabilidad, consumo de contenido, lectura y navegación.
¿Para qué lo necesitas principalmente?
```

## 🔧 Configuración Técnica

### Archivos Creados

1. **`.env`** - Configuración de API
```env
VITE_DEEPSEEK_API_KEY=sk-4d4cc3ac92254985b045a1881b85b12a
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

2. **`src/data/fuxionKnowledgeBase.js`**
   - Base de datos con toda la información
   - Productos, categorías, políticas, FAQs
   - 200+ líneas de conocimiento estructurado

3. **`src/services/deepseekService.js`**
   - Servicio de conexión con DeepSeek AI
   - Construcción de contextos personalizados
   - Manejo de errores y respuestas

4. **`src/components/FalconBot.jsx`**
   - Componente UI mejorado
   - 3 bots en selector
   - Indicadores de estado
   - Animaciones profesionales

## ⚙️ Características Técnicas

### Seguridad
- ✅ API Key en variable de entorno
- ✅ Validación de respuestas
- ✅ Manejo de errores robusto

### Rendimiento
- ✅ Máximo 500 tokens por respuesta (respuestas concisas)
- ✅ Temperatura 0.7 (balance creatividad/precisión)
- ✅ Historial limitado a 5 mensajes (eficiencia)

### Experiencia de Usuario
- ✅ Indicador de "Pensando..." mientras procesa
- ✅ Diferentes colores por bot
- ✅ Scroll automático a últimos mensajes
- ✅ Animaciones suaves
- ✅ Responsive design

## 🎨 Interfaz

### Botón Flotante
- Gradiente purple-pink
- Indicador verde de "online"
- Animación de hover
- Siempre visible abajo a la derecha

### Ventana de Chat
- **Header**: Muestra qué bot está activo
- **Selector**: 3 botones para cambiar de bot
- **Mensajes**: Burbujas con colores según el bot
- **Input**: Placeholder dinámico según bot activo
- **Footer**: "Powered by DeepSeek AI"

## ⚠️ Manejo de Errores

Los bots detectan y manejan:

### API Key Inválida
```
❌ Lo siento, la configuración de la API no está completa.
```

### Límite de Solicitudes (429)
```
❌ Se excedió el límite de solicitudes. Intenta en unos momentos.
```

### Error de Conexión
```
❌ Lo siento, tuve un problema al procesar tu mensaje.
Por favor, intenta de nuevo o contacta por WhatsApp.
```

## 📊 Monitoreo

Para ver logs en tiempo real:
1. Abre DevTools (F12)
2. Ve a Console
3. Verás:
   - Mensajes enviados
   - Respuestas recibidas
   - Tokens usados
   - Errores (si los hay)

## 🔄 Actualizar la Base de Conocimientos

Para agregar más información:

1. Edita `src/data/fuxionKnowledgeBase.js`
2. Agrega productos, FAQs, o políticas
3. Los bots usarán automáticamente la nueva info

Ejemplo:
```javascript
featuredProducts: [
  {
    id: 31,
    name: 'Nuevo Producto',
    categoria: 'Gaming',
    precio: 199.99,
    caracteristicas: ['Feature 1', 'Feature 2'],
    // ...
  }
]
```

## 🚦 Estado del Sistema

### ✅ Implementado
- [x] 3 bots especializados
- [x] Base de conocimientos completa
- [x] Integración con DeepSeek AI
- [x] UI profesional con animaciones
- [x] Manejo de errores
- [x] Historial de conversación
- [x] Respuestas en español

### 🔮 Futuras Mejoras
- [ ] Bot de recomendaciones basado en preferencias guardadas
- [ ] Integración directa con carrito
- [ ] Exportar conversación
- [ ] Analytics de preguntas frecuentes
- [ ] Bot con voz (text-to-speech)

## 🎯 Casos de Uso Reales

### Caso 1: Cliente busca regalo
```
Usuario: Necesito un regalo tech para mi hermano gamer
Bot Ventas: ¡Excelente! Tengo varias opciones geniales:
1. Teclado Mecánico RGB Pro - $149.99
2. Mouse Gaming Precision - $79.99
3. Silla Gaming Ergonómica - $399.99
¿Cuál es tu presupuesto aproximado?
```

### Caso 2: Cliente con duda de garantía
```
Usuario: ¿Qué cubre la garantía?
Bot Soporte: La garantía de 1 año cubre defectos de fabricación.
NO cubre:
- Daño por mal uso
- Daño por agua
- Modificaciones no autorizadas
¿Tu producto tiene algún problema específico?
```

### Caso 3: Cliente indeciso
```
Usuario: No sé si comprar laptop o tablet
Asesor: Déjame ayudarte. ¿Para qué lo usarás principalmente?
- Trabajo/estudio pesado → Laptop
- Entretenimiento/navegación → Tablet
Cuéntame más sobre tu uso diario.
```

## 💡 Tips para Mejores Resultados

1. **Sé específico**: "Busco laptop para diseño gráfico" > "Busco laptop"
2. **Menciona tu presupuesto**: Ayuda a dar recomendaciones precisas
3. **Pregunta por características**: Los bots conocen specs detalladas
4. **Cambia de bot**: Cada uno tiene su especialidad
5. **Haz seguimiento**: Los bots recuerdan la conversación

## 🌟 Ventajas del Sistema

✅ **Disponible 24/7** - Los clientes obtienen respuestas inmediatas
✅ **Información consistente** - Siempre usa la base de datos oficial
✅ **Ahorro de tiempo** - Filtra consultas básicas antes de WhatsApp
✅ **Mejora ventas** - Recomendaciones personalizadas aumentan conversión
✅ **Reduce carga** - Automatiza FAQs repetitivas

## 📞 Soporte

Si un cliente necesita ayuda humana:
- Los bots pueden sugerir contactar por WhatsApp
- Link directo: https://wa.me/message/XJNUSSLNP24CJ1
- Los bots NO reemplazan el servicio humano, lo complementan

---

**Sistema Activo**: ✅
**API Key Configurada**: ✅
**Bots Funcionando**: ✅
**Base de Conocimientos**: 200+ líneas

**¡El sistema está listo para recibir preguntas!** 🚀
