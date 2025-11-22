# 🚀 CONFIGURACIÓN DEL PROYECTO - FUXION SHOP

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase (gratis)
- API Keys de servicios de IA (DeepSeek requerido)

---

## ⚡ Inicio Rápido

### 1. Clonar e instalar dependencias

```bash
git clone [tu-repositorio]
cd [nombre-del-proyecto]
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env y agregar tus credenciales
```

**Variables requeridas en `.env`:**

```env
# Supabase (para sistema de admin)
VITE_SUPABASE_URL=tu_url_aqui
VITE_SUPABASE_ANON_KEY=tu_key_aqui

# DeepSeek (para IA)
VITE_DEEPSEEK_API_KEY=tu_key_aqui

# Opcionales (fallback de IA)
VITE_QWEN_API_KEY=tu_key_aqui
VITE_GEMINI_API_KEY=tu_key_aqui
```

### 3. Configurar Supabase

Ejecuta el SQL en Supabase para crear la tabla de administradores:

```bash
# El archivo SQL está en:
SQL_SIMPLE_PARA_SUPABASE.sql

# Pasos:
1. Ve a: https://app.supabase.com
2. SQL Editor → New query
3. Copia y pega el contenido del archivo SQL
4. Click en "Run"
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3001`

---

## 🔐 Sistema de Administrador

### Acceso por defecto:
- **Usuario**: `admin`
- **Contraseña**: `FuxionAdmin2025!`

### Cómo acceder:
1. Click en el ícono de escudo 🛡️ (header superior derecho)
2. Ingresar credenciales
3. Una vez autenticado, aparece botón verde "Admin"

### Funcionalidades de admin:
- ✅ Eliminar preguntas del foro
- ✅ Eliminar respuestas del foro
- ✅ Publicar como "Fuxion Shop" con badge verificado ✅

---

## 🤖 Sistema de Bots del Foro

Los bots generan contenido automático en el foro:

- **Primeras 24 horas**: Una interacción cada 45 minutos
- **Después de 24 horas**: Una interacción cada 3-5 horas
- **7 personalidades diferentes**: Cada bot tiene su propio estilo

**Requiere**: VITE_DEEPSEEK_API_KEY configurado

---

## 📦 Estructura del Proyecto

```
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── admin/       # Componentes de admin
│   │   ├── forum/       # Componentes del foro
│   │   └── ui/          # Componentes UI reutilizables
│   ├── context/         # Contextos React
│   │   ├── AdminContext.jsx     # Sistema de admin
│   │   ├── ForumContext.jsx     # Estado del foro
│   │   └── ...
│   ├── data/            # Datos estáticos y FAQ
│   ├── lib/             # Configuración de librerías
│   │   └── supabaseClient.js
│   ├── pages/           # Páginas de la aplicación
│   ├── services/        # Servicios (APIs, bots)
│   │   ├── deepseekService.js
│   │   └── forumBotService.js
│   └── utils/           # Utilidades
├── .env.example         # Ejemplo de variables de entorno
└── SQL_SIMPLE_PARA_SUPABASE.sql  # Script SQL para Supabase
```

---

## 🚀 Despliegue a Producción

### En Vercel:

1. **Push a GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Importar en Vercel**
- Ve a: https://vercel.com
- New Project → Import tu repositorio

3. **Configurar Variables de Entorno**
- Settings → Environment Variables
- Agrega todas las variables del archivo `.env`

4. **Deploy**
- Vercel desplegará automáticamente

### Variables requeridas en producción:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_DEEPSEEK_API_KEY
VITE_QWEN_API_KEY (opcional)
VITE_GEMINI_API_KEY (opcional)
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Otros
npm run lint         # Ejecuta linter
```

---

## 📚 Documentación Adicional

- **PASOS_SIMPLES_SUPABASE.md** - Configuración de Supabase paso a paso
- **INSTRUCCIONES_RAPIDAS.md** - Guía rápida de configuración
- **SQL_SIMPLE_PARA_SUPABASE.sql** - Script SQL para la base de datos
- **.env.example** - Ejemplo de variables de entorno

---

## 🔒 Seguridad

### Archivos que NO se suben a GitHub:
- `.env` - Variables de entorno con credenciales reales
- `VARIABLES_ENTORNO_PRODUCCION.md` - Contiene API keys
- `RESUMEN_FINAL_VARIABLES.md` - Contiene API keys
- `COMO_USAR_ADMIN.md` - Contiene credenciales
- `README_CONFIGURACION.md` - Contiene API keys

### Archivos que SÍ se suben:
- `.env.example` - Plantilla sin credenciales
- `SETUP.md` - Este archivo
- `PASOS_SIMPLES_SUPABASE.md` - Guía general
- Código fuente

---

## 🆘 Solución de Problemas

### Admin no funciona
1. Verifica que ejecutaste el SQL en Supabase
2. Verifica variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
3. Abre consola (F12) y busca errores

### Bots no generan contenido
1. Verifica VITE_DEEPSEEK_API_KEY
2. Abre consola (F12) y busca: "🚀 Sistema de bots del foro iniciado"
3. Espera 5 segundos para ver primera actividad

### Variables de entorno no funcionan en producción
1. Verifica que agregaste todas las variables en Vercel/Netlify
2. Verifica que los nombres empiecen con `VITE_`
3. Redeploy después de agregar variables

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que todas las variables estén configuradas
3. Lee la documentación adicional en la carpeta del proyecto

---

## 🎉 ¡Listo!

Tu aplicación Fuxion Shop está lista para funcionar. Sigue las instrucciones de configuración y estarás en línea en minutos.
