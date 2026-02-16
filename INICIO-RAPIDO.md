# ⚡ Inicio Rápido - Solución APIs de IA

## 🎯 Qué se Solucionó

✅ **Error CORS en DeepSeek** - Ahora usa backend serverless
✅ **API Keys expuestas** - Ahora están seguras en variables de entorno
✅ **Sistema de fallback** - DeepSeek → Qwen → Gemini automático
✅ **Arquitectura correcta** - Frontend → Backend → APIs de IA

---

## 🚀 Pasos para Desplegar (5 minutos)

### 1️⃣ Obtén UNA API Key (elige una)

**Opción A: DeepSeek** (Recomendada ⭐)
- Ve a: https://platform.deepseek.com/
- Regístrate → API Keys → Create
- Copia la key: `sk-xxxxxxxxxx`

**Opción B: Google Gemini**
- Ve a: https://aistudio.google.com/apikey
- Create API Key
- Copia la key: `AIzaxxxxxxxxxx`

**Opción C: Qwen**
- Ve a: https://dashscope.console.aliyun.com/
- API-KEY Management → Create
- Copia la key

---

### 2️⃣ Configura en Vercel

1. Ve a: https://vercel.com/dashboard
2. Abre tu proyecto
3. **Settings** → **Environment Variables**
4. Agrega (elige la que obtuviste):

```
Name: DEEPSEEK_API_KEY
Value: tu_api_key_real
Environment: Production, Preview, Development
→ Add
```

O

```
Name: GEMINI_API_KEY
Value: tu_api_key_real
Environment: Production, Preview, Development
→ Add
```

5. Click **Save**

---

### 3️⃣ Despliega

#### Opción A: Automático (si usas GitHub)

```bash
cd "C:\Users\Lenovo\Desktop\proyectos desplegados importante\de daniel falcon"

git add .
git commit -m "Fix: Backend serverless para APIs de IA"
git push
```

Vercel desplegará automáticamente en 1-2 minutos.

#### Opción B: Manual

```bash
npm run build
vercel --prod
```

---

### 4️⃣ Verifica

1. Abre tu sitio
2. Abre el chatbot FalconBot
3. Envía un mensaje de prueba
4. ✅ Debería responder sin errores

---

## 📄 Documentación Completa

- **Detalles técnicos**: `SOLUCION-APIS-IA.md`
- **Troubleshooting**: Ver sección en `SOLUCION-APIS-IA.md`

---

## ⚠️ Importante

- ✅ Solo necesitas **UNA** API key para que funcione
- ✅ Las API keys **SOLO** van en Vercel (Environment Variables)
- ❌ **NUNCA** pongas API keys en archivos `.env` que subes a Git
- ✅ El sistema automáticamente hará fallback si una API falla

---

¿Problemas? Lee `SOLUCION-APIS-IA.md` para soluciones detalladas.
