-- =====================================================
-- SQL PARA CREAR TABLA DE BLOG EN SUPABASE
-- Copia y pega esto en el SQL Editor de Supabase
-- =====================================================

-- Crear tabla de artículos del blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  author VARCHAR(100) DEFAULT 'Equipo Fuxion',
  is_published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created ON blog_posts(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer artículos publicados
CREATE POLICY "Artículos publicados son públicos" ON blog_posts
  FOR SELECT
  USING (is_published = true);

-- Política: Permitir inserción anónima (para admin sin auth)
CREATE POLICY "Permitir inserción anónima" ON blog_posts
  FOR INSERT
  WITH CHECK (true);

-- Política: Permitir actualización anónima
CREATE POLICY "Permitir actualización anónima" ON blog_posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política: Permitir eliminación anónima
CREATE POLICY "Permitir eliminación anónima" ON blog_posts
  FOR DELETE
  USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- Descomenta si quieres agregar artículos de prueba
-- =====================================================

INSERT INTO blog_posts (title, slug, excerpt, content, category, image_url, is_published) VALUES
(
  '5 Hábitos que Sabotean tu Pérdida de Peso sin que lo Sepas',
  '5-habitos-que-sabotean-tu-perdida-de-peso',
  'Descubre los errores más comunes que cometen las personas que intentan bajar de peso y cómo evitarlos para lograr resultados reales.',
  '## El camino hacia un peso saludable

Muchas personas luchan por años intentando bajar de peso sin éxito. Lo frustrante es que a menudo hacen "todo bien" pero no ven resultados.

### 1. Saltarse el desayuno

Contrario a lo que muchos creen, saltarse comidas no ayuda a perder peso. Tu cuerpo entra en "modo ahorro" y almacena más grasa.

**Solución:** Come un desayuno nutritivo dentro de las primeras 2 horas de despertar.

### 2. No dormir suficiente

La falta de sueño aumenta la hormona del hambre (grelina) y disminuye la hormona de saciedad (leptina).

**Solución:** Apunta a 7-8 horas de sueño de calidad cada noche.

### 3. Beber tus calorías

Jugos, refrescos, y cafés azucarados suman cientos de calorías sin darte sensación de saciedad.

**Solución:** Opta por agua, té sin azúcar, o infusiones naturales.

### 4. Comer muy rápido

Tu cerebro necesita unos 20 minutos para registrar que estás lleno. Si comes muy rápido, comes de más.

**Solución:** Mastica bien cada bocado y disfruta tu comida sin distracciones.

### 5. El estrés crónico

El cortisol (hormona del estrés) promueve la acumulación de grasa abdominal.

**Solución:** Incorpora técnicas de relajación como respiración profunda o caminatas.

---

**Recuerda:** No se trata de dietas extremas, sino de crear hábitos sostenibles. Pequeños cambios consistentes generan grandes resultados a largo plazo.

*Este artículo es informativo y no reemplaza el consejo médico profesional.*',
  'Pérdida de Peso',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
  true
),
(
  'Cómo la Inflamación Afecta tu Peso y Energía',
  'como-la-inflamacion-afecta-tu-peso',
  'La inflamación crónica puede ser la razón oculta por la que no logras bajar de peso. Aprende a identificarla y combatirla naturalmente.',
  '## La inflamación silenciosa

Cuando pensamos en inflamación, imaginamos un tobillo hinchado o una herida. Pero existe otro tipo de inflamación que no se ve: la inflamación crónica de bajo grado.

### ¿Qué causa la inflamación crónica?

- Alimentación alta en azúcares y procesados
- Estrés constante
- Falta de sueño
- Sedentarismo
- Toxinas ambientales

### Síntomas comunes

- Fatiga constante
- Dificultad para bajar de peso
- Hinchazón abdominal
- Dolores articulares
- Problemas digestivos
- Niebla mental

### Cómo combatirla naturalmente

**1. Alimentación antiinflamatoria:**
- Verduras de hojas verdes
- Frutas ricas en antioxidantes
- Omega-3 (pescados, semillas)
- Especias como cúrcuma y jengibre

**2. Hidratación adecuada:**
Beber suficiente agua ayuda a eliminar toxinas que promueven la inflamación.

**3. Movimiento diario:**
No necesitas ejercicio intenso. Caminar 30 minutos al día hace una diferencia significativa.

**4. Descanso de calidad:**
Durante el sueño, tu cuerpo repara tejidos y reduce la inflamación.

---

**Importante:** Si sospechas que tienes inflamación crónica, consulta con un profesional de salud para una evaluación completa.

*Este contenido es educativo y no sustituye la consulta médica.*',
  'Bienestar',
  'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
  true
),
(
  'Guía para Principiantes: Empezando tu Camino hacia un Peso Saludable',
  'guia-principiantes-peso-saludable',
  'Si estás comenzando tu journey de pérdida de peso, esta guía te dará las bases para empezar con el pie derecho sin dietas extremas.',
  '## Tu primer paso hacia el cambio

Empezar puede ser abrumador. Hay tanta información contradictoria que no sabes por dónde comenzar. Esta guía te simplifica todo.

### Mentalidad primero

Antes de cambiar tu alimentación, cambia tu perspectiva:

- **No es una dieta temporal**, es un estilo de vida
- **No busques perfección**, busca progreso
- **No te compares** con otros, cada cuerpo es diferente

### Los 3 pilares básicos

**1. Alimentación consciente**
- Come cuando tengas hambre real
- Para cuando estés satisfecho (no lleno)
- Incluye proteína en cada comida
- Llena la mitad de tu plato con vegetales

**2. Movimiento placentero**
- Encuentra una actividad que disfrutes
- Empieza con 15-20 minutos diarios
- Incrementa gradualmente
- La consistencia supera la intensidad

**3. Descanso reparador**
- Establece horarios de sueño regulares
- Evita pantallas 1 hora antes de dormir
- Crea un ambiente oscuro y fresco

### Errores comunes de principiantes

❌ Eliminar grupos de alimentos completos
❌ Hacer ejercicio excesivo desde el día 1
❌ Pesarse todos los días
❌ Esperar resultados inmediatos

### Expectativas realistas

- Semana 1-2: Tu cuerpo se adapta, puede que no veas cambios
- Mes 1: Empiezas a sentir más energía
- Mes 2-3: Los cambios físicos se hacen visibles
- Mes 6+: Los hábitos se vuelven automáticos

---

**Consejo final:** Celebra cada pequeño logro. Cada día que eliges cuidarte es una victoria.

*Recuerda consultar con un profesional de salud antes de hacer cambios significativos en tu alimentación o actividad física.*',
  'Sobrepeso',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
  true
);

-- =====================================================
-- VERIFICAR QUE TODO ESTÁ CORRECTO
-- =====================================================
-- SELECT * FROM blog_posts;
