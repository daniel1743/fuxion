# 🎛️ Guía del Panel de Administración

## ✅ Funcionalidades Implementadas

El panel de administración del foro ya está listo y funcionando. Aquí está todo lo que puedes hacer:

---

## 🔐 Acceso al Panel

### 1. Iniciar Sesión como Administrador

**Credenciales:**
- **Usuario:** `admin`
- **Contraseña:** `FuxionAdmin2025!`

**Pasos:**
1. Ir a cualquier página de la aplicación
2. Hacer clic en el menú de usuario (icono de usuario en la parte superior)
3. Seleccionar "Acceso Admin"
4. Ingresar las credenciales
5. Hacer clic en "Iniciar Sesión"

### 2. Acceder al Panel del Foro

Una vez que hayas iniciado sesión como administrador:

1. Ve a la página del **Foro de Soporte** (`/ayuda`)
2. Verás un botón nuevo llamado **"Panel Admin"** (color púrpura) junto al botón "Nueva Pregunta"
3. Haz clic en **"Panel Admin"**

---

## 🎯 Funciones del Panel

### 📊 Estado Actual del Foro

Al abrir el panel, verás las estadísticas actuales:
- **Preguntas:** Número total de preguntas en el foro
- **Respuestas:** Número total de respuestas

### ⬆️ Cargar Datos Iniciales (Botón Verde)

**¿Qué hace?**
- Carga 15 preguntas y 33 respuestas generadas de la base de datos FAQ de Fuxion
- Las preguntas están distribuidas en las últimas 3 semanas
- Cada pregunta tiene entre 0-4 respuestas
- Todo el contenido es coherente y basado en preguntas reales

**Cuándo usarlo:**
- Cuando el foro está vacío y quieres poblarlo con contenido inicial
- Para reiniciar el foro con datos de ejemplo

**Cómo usarlo:**
1. Haz clic en el botón **"Cargar Datos del Foro"**
2. Espera a que se carguen los datos (tarda unos segundos)
3. La página se recargará automáticamente
4. Verás las 15 preguntas nuevas en el foro

⚠️ **Advertencia:** Esto sobrescribirá todos los datos actuales del foro.

### 🗑️ Limpiar Todo el Foro (Botón Rojo)

**¿Qué hace?**
- Elimina TODAS las preguntas y respuestas del foro
- Limpia completamente la base de datos local (localStorage)

**Cuándo usarlo:**
- Para empezar de cero
- Para limpiar datos de prueba
- Antes de cargar nuevos datos iniciales

**Cómo usarlo:**
1. Haz clic en el botón **"Limpiar Foro"**
2. Confirma la acción en el diálogo de confirmación
3. La página se recargará automáticamente
4. El foro estará completamente vacío

⚠️ **Advertencia:** Esta acción NO se puede deshacer.

---

## 🔄 Flujo de Trabajo Recomendado

### Opción 1: Primera vez / Inicio de proyecto
```
1. Iniciar sesión como admin
2. Ir al foro (/ayuda)
3. Abrir Panel Admin
4. Click en "Cargar Datos del Foro"
5. ¡Listo! Tienes 15 preguntas con respuestas
```

### Opción 2: Reiniciar el foro
```
1. Iniciar sesión como admin
2. Ir al foro (/ayuda)
3. Abrir Panel Admin
4. Click en "Limpiar Foro" (confirmar)
5. Click en "Cargar Datos del Foro"
6. ¡Listo! Foro renovado
```

### Opción 3: Solo limpiar
```
1. Iniciar sesión como admin
2. Ir al foro (/ayuda)
3. Abrir Panel Admin
4. Click en "Limpiar Foro" (confirmar)
5. ¡Listo! Foro vacío
```

---

## 📝 Contenido Generado

### Ejemplos de preguntas incluidas:

1. **"¿PROBAL para hombres o mujeres?"**
   - Categoría: Línea Anti-Edad
   - 4 respuestas
   - Marcada como resuelta

2. **"¿Puedo mezclar THERMO T3 + NOCARB-T?"**
   - Categoría: Control de Peso
   - 2 respuestas

3. **"REXET tiene aditivos malos?"**
   - Categoría: Sistema DETOX
   - 1 respuesta

4. **"¿BIOPROTEIN ACTIVE tiene gluten?"**
   - Categoría: Control de Peso
   - 4 respuestas
   - Marcada como resuelta

... y 11 preguntas más con sus respectivas respuestas.

### Características del contenido:

✅ **Fechas realistas** - Distribuidas en las últimas 3 semanas
✅ **Autores variados** - Diferentes perfiles de usuarios (NutricionistaExp, ConsumidorRegular, etc.)
✅ **Respuestas coherentes** - Basadas en la base de datos FAQ oficial de Fuxion
✅ **Votos y vistas** - Números realistas y aleatorios
✅ **Categorías correctas** - Línea Anti-Edad, Sistema DETOX, Control de Peso, etc.
✅ **Tags relevantes** - Etiquetas relacionadas con cada pregunta

---

## 🛠️ Otras Funciones de Administrador

Además del panel, como administrador también puedes:

### En las tarjetas de preguntas:
- **Eliminar preguntas** - Botón de basura (🗑️) en cada tarjeta de pregunta
- Solo visible para administradores

### En los detalles de una pregunta:
- **Eliminar respuestas** - Botón de basura (🗑️) en cada respuesta
- Solo visible para administradores

### Al responder preguntas:
- **Badge verificado automático** - Tus respuestas aparecen como "Fuxion Shop ✅"
- Tu nombre se auto-asigna como "Fuxion Shop"
- Avatar de verificación (✅)

---

## 📊 Estadísticas

Las estadísticas del foro se actualizan automáticamente:
- **Total de preguntas** - Se actualiza en tiempo real
- **Preguntas resueltas** - Cuenta las que tienen respuestas aceptadas
- **Total de respuestas** - Suma de todas las respuestas

---

## 🎨 Interfaz

El panel tiene:
- **Diseño responsive** - Funciona en móviles y desktop
- **Animaciones suaves** - Con Framer Motion
- **Feedback visual** - Toasts de confirmación
- **Estados de carga** - Indicadores mientras se procesan acciones
- **Tema oscuro/claro** - Se adapta al tema de la aplicación

---

## 🔒 Seguridad

- **Solo admins pueden ver el panel** - El botón y el panel solo aparecen si estás autenticado como admin
- **Confirmaciones antes de acciones destructivas** - Al limpiar el foro se pide confirmación
- **Sesión de 24 horas** - La sesión de admin expira después de 24 horas

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo agregar más datos después de cargar los iniciales?**
R: Sí, los usuarios (o el admin) pueden seguir agregando preguntas normalmente. Los datos iniciales son solo un punto de partida.

**P: ¿Se pueden editar las preguntas cargadas?**
R: No directamente desde la interfaz, pero se pueden eliminar y crear nuevas.

**P: ¿Los datos se guardan en una base de datos?**
R: Actualmente se guardan en localStorage del navegador. Para producción, considera migrar a Supabase.

**P: ¿Puedo generar más datos?**
R: Sí, ejecuta el script `generate-forum-data.js` para generar nuevos datos y actualiza el archivo JSON.

**P: ¿Qué pasa si cargo los datos múltiples veces?**
R: Los datos anteriores se sobrescriben completamente. Es seguro hacerlo.

---

## 🚀 Siguiente Paso Recomendado

1. **Inicia sesión como admin** con las credenciales
2. **Ve al foro** (/ayuda)
3. **Abre el Panel Admin**
4. **Carga los datos iniciales** para poblar el foro
5. **Explora el foro** y ve cómo se ve con contenido

¡Ya está todo listo para usar! 🎉
