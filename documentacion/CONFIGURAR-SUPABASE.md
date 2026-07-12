# 🚀 CONFIGURAR SUPABASE PARA EL FORO

## ⏱️ Tiempo estimado: 10 minutos

Este foro ahora usa **Supabase** como base de datos para que **TODOS los usuarios** puedan ver las mismas preguntas, respuestas y reseñas en **TIEMPO REAL**.

---

## 📋 PASO 1: Crear Cuenta en Supabase

1. Ve a: **https://supabase.com**
2. Click en **"Start your project"**
3. Inicia sesión con:
   - GitHub (recomendado)
   - Google
   - Email

✅ **Es 100% GRATIS** hasta 500MB de base de datos

---

## 📦 PASO 2: Crear Nuevo Proyecto

1. Click en **"New Project"**
2. Completa:
   - **Name**: `fuxion-shop-forum` (o el nombre que quieras)
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana a ti
3. Click **"Create new project"**
4. ⏳ Espera 2-3 minutos mientras se crea el proyecto

---

## 🗄️ PASO 3: Crear las Tablas de la Base de Datos

### Opción A: Usar el Editor SQL (MÁS FÁCIL)

1. En el menú izquierdo, click en **"SQL Editor"**
2. Click en **"New query"**
3. **Copia y pega este código SQL completo:**

```sql
-- ============================================
-- TABLA: Preguntas del Foro
-- ============================================
CREATE TABLE forum_questions (
  id BIGSERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  votes INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  solved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: Respuestas
-- ============================================
CREATE TABLE forum_answers (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES forum_questions(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: Reseñas de Productos
-- ============================================
CREATE TABLE product_reviews (
  id BIGSERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL CHECK (LENGTH(comment) <= 300),
  product_name TEXT,
  likes INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES para mejorar el rendimiento
-- ============================================
CREATE INDEX idx_answers_question ON forum_answers(question_id);
CREATE INDEX idx_questions_created ON forum_questions(created_at DESC);
CREATE INDEX idx_reviews_created ON product_reviews(created_at DESC);
CREATE INDEX idx_reviews_product ON product_reviews(product_name);

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- Permitir que todos puedan leer y escribir
-- ============================================

-- Habilitar Row Level Security
ALTER TABLE forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para PREGUNTAS
CREATE POLICY "Cualquiera puede ver preguntas"
  ON forum_questions FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede crear preguntas"
  ON forum_questions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede actualizar preguntas"
  ON forum_questions FOR UPDATE
  USING (true);

-- Políticas para RESPUESTAS
CREATE POLICY "Cualquiera puede ver respuestas"
  ON forum_answers FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede crear respuestas"
  ON forum_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede actualizar respuestas"
  ON forum_answers FOR UPDATE
  USING (true);

-- Políticas para RESEÑAS
CREATE POLICY "Cualquiera puede ver reseñas"
  ON product_reviews FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede crear reseñas"
  ON product_reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede actualizar reseñas"
  ON product_reviews FOR UPDATE
  USING (true);
```

4. Click en **"Run"** (botón verde abajo a la derecha)
5. ✅ Deberías ver: "Success. No rows returned"

---

## 🔑 PASO 4: Obtener tus Credenciales

1. En el menú izquierdo, click en **"Settings"** (⚙️)
2. Click en **"API"**
3. Verás dos valores importantes:

### Copia estos valores:
- **Project URL** → Algo como: `https://abcdefgh.supabase.co`
- **anon / public** (en la sección "Project API keys") → Una clave larga

---

## ⚙️ PASO 5: Configurar el Proyecto

1. En la carpeta raíz del proyecto, **crea un archivo** llamado `.env`
2. Abre el archivo `.env` y pega:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_aqui
```

3. Reemplaza los valores con los que copiaste en el PASO 4
4. **Guarda el archivo**

### ⚠️ IMPORTANTE:
- **NO compartas** este archivo `.env` (ya está en .gitignore)
- **NO subas** tus claves a GitHub

---

## 🎉 PASO 6: Probar que Funciona

1. **Detén el servidor** si está corriendo (Ctrl + C)
2. **Inicia el servidor** de nuevo:
   ```bash
   npm run dev
   ```
3. Abre: **http://localhost:3000/ayuda**
4. **Prueba:**
   - Crear una pregunta
   - Escribir una reseña
   - Dar like

5. **Abre otra ventana** en modo incógnito o en otro navegador
6. Ve a: **http://localhost:3000/ayuda**
7. ✅ **Deberías ver** la misma pregunta/reseña que creaste

---

## ✅ VERIFICACIÓN

Si todo funciona correctamente:

- ✅ Puedes crear preguntas y se ven en otros navegadores
- ✅ Puedes dar likes y se actualizan para todos
- ✅ Las reseñas con estrellas se guardan
- ✅ Los votos se sincronizan

---

## 🔄 MIGRAR DATOS EXISTENTES (Opcional)

Si ya tenías datos en localStorage y quieres migrarlos a Supabase:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Pega y ejecuta:

```javascript
// Ver datos actuales en localStorage
console.log('Preguntas:', JSON.parse(localStorage.getItem('forumQuestions')));
console.log('Respuestas:', JSON.parse(localStorage.getItem('forumAnswers')));
console.log('Reseñas:', JSON.parse(localStorage.getItem('productReviews')));
```

4. Copia los datos que quieras conservar
5. Crea manualmente en la app las preguntas/respuestas importantes

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### Error: "Invalid API key"
- ✅ Verifica que copiaste bien la clave `anon/public`
- ✅ Asegúrate de que el archivo se llama exactamente `.env`
- ✅ Reinicia el servidor

### Error: "relation does not exist"
- ✅ Verifica que ejecutaste el SQL del PASO 3
- ✅ Revisa que las 3 tablas se crearon correctamente
- ✅ Ve a "Table Editor" en Supabase y verifica

### No se guardan los datos
- ✅ Verifica las políticas RLS (PASO 3)
- ✅ Abre la consola del navegador y busca errores en rojo
- ✅ Verifica que las variables de entorno están cargadas

### Los datos no se actualizan en tiempo real
- ✅ Refresca la página (F5)
- ✅ Verifica tu conexión a internet
- ✅ Revisa la consola por errores

---

## 📊 DASHBOARD DE SUPABASE

Para ver tus datos en Supabase:

1. Ve a **"Table Editor"** en el menú izquierdo
2. Verás 3 tablas:
   - `forum_questions`
   - `forum_answers`
   - `product_reviews`
3. Click en cada una para ver los datos

---

## 🎯 PRÓXIMOS PASOS

Una vez configurado Supabase:

1. ✅ Todos los usuarios verán las mismas preguntas
2. ✅ Las reseñas serán compartidas
3. ✅ Los likes se sincronizan
4. ✅ Todo funciona en tiempo real

### Mejoras Futuras:
- [ ] Agregar autenticación de usuarios
- [ ] Moderación de contenido
- [ ] Notificaciones en tiempo real
- [ ] Sistema de roles (admin, moderador, usuario)

---

## 📞 AYUDA

Si tienes problemas:

1. Lee la [Documentación de Supabase](https://supabase.com/docs)
2. Revisa la consola del navegador (F12) por errores
3. Verifica que las 3 tablas existen en Supabase
4. Asegúrate de que las variables .env están bien configuradas

---

**¡Listo! Ahora tienes un foro con base de datos real! 🚀**
