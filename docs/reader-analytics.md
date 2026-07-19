# Reader Analytics — Bienestar en Claro

Sistema completo de análisis de comportamiento de lectores. Captura eventos anónimos, calcula scores, analiza con IA y notifica al admin por Telegram.

## Arquitectura

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Frontend       │     │  Supabase        │     │  Backend         │
│  (React)        │────▶│  (PostgreSQL)    │────▶│  (Vercel Cron)   │
│                 │     │                  │     │                  │
│ • useReader-    │     │ • reader_events  │     │ • analyzeSession │
│   Tracking hook │     │ • reader_sessions│     │ • calculateScore │
│ • Track events  │     │ • reader_alerts  │     │ • detectAnomalies│
└─────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
                                                  ┌────────▼─────────┐
                                                  │  Telegram API     │
                                                  │  (Notificaciones) │
                                                  └──────────────────┘
```

## Capas

### 1. Captura de Eventos (`src/hooks/useReaderTracking.js`)

Hook que se integra en cualquier página. Captura:

| Evento | Cuándo se dispara |
|--------|-------------------|
| `article_open` | Al abrir un artículo |
| `article_close` | Al cerrar el artículo |
| `scroll_depth` | Cada 10% de scroll |
| `time_on_paragraph` | Al entrar/salir de un párrafo (> 2s) |
| `image_click` | Al hacer clic en imágenes |
| `text_copy` | Al copiar texto |
| `chat_open` | Al abrir chat IA |
| `search_article` | Al buscar en el buscador |
| `exit` | Al cerrar la pestaña |

Cada evento se escribe en `reader_events` con un `session_id` anónimo generado en `sessionStorage`.

### 2. Motor de Análisis (`src/services/readerAnalytics.js`)

Funciones principales:

- **`getSessionsSince(timestamp)`** — Agrupa eventos por sesión
- **`calculateReaderScore(events)`** — Calcula 0-100 basado en:
  - Tiempo leyendo (> 60s → +30)
  - Scroll profundo (> 90% → +20)
  - Regresión a párrafos (> 15s → +15)
  - Visitó otro artículo (> 1 → +20)
  - Abrió imágenes → +10
  - Copió texto → +10
  - Compartió → +30
  - Abrió chat → +40
  - Leyó completo (> 95% scroll + > 120s) → +50
  - Abandono precoz (< 40% scroll + < 30s) → -20

- **`calculateLeadScore(events)`** — Calcula interés comercial:
  - Leyó artículos de producto → +15 cada uno
  - Abrió chat → +30
  - Producto + chat → +20 (compuesto)
  - Reader Score >= 70 → +15

- **`analyzeSession(session, apiKey)`** — Envía a DeepSeek IA con el prompt contextual y recibe:
  ```json
  {
    "behavior_type": "comprometido|escaneó|información_rápida|comparó|interesado|abandonó",
    "conclusion": "Frase corta del comportamiento",
    "engagement_level": "alto|medio|bajo",
    "recommendation": "Acción sugerida"
  }
  ```

- **`getDailySummary(date)`** — Resumen diario con métricas agregadas
- **`detectAnomalies(summary)`** — Detecta tendencias virales y problemas de retención

### 3. Notificaciones (`src/services/telegramNotifier.js`)

- **`sendTelegramAlert(alert)`** — Envía alerta con formato Markdown
- **`processAndNotify(anomalies)`** — Procesa todas las alertas
- **`notifyHotLead(leadInfo)`** — Notifica lector de alto interés

### 4. Cron Jobs (`api/`)

- **`reader-analytics-cron.js`** — Se ejecuta cada 30 minutos (configurar en Vercel)
- **`daily-summary-report.js`** — Resumen diario a las 9am (configurar en Vercel)

### 5. UI (`src/components/admin/`)

- **`ReaderAnalyticsPanel.jsx`** — Panel de resumen diario
- **`ReaderProfile.jsx`** — Perfil detallado de una sesión individual

## Base de Datos

Ver `supabase/migrations/001_reader_events.sql`:

- `reader_events` — Eventos crudos (millones posibles)
- `reader_sessions` — Sesiones procesadas
- `reader_alerts` — Historial de alertas
- `reader_daily_summary` — Resúmenes diarios

## Integración

### En WellnessArticlePage.jsx (ejemplo)

```javascript
import { useReaderTracking } from '@/hooks/useReaderTracking';

const { trackArticleOpen, trackArticleClose, trackParagraphTime, trackPageView } = useReaderTracking();

// Track apertura/cierre de artículo
useEffect(() => {
  trackArticleOpen(slug, article.title);
  return () => trackArticleClose(slug);
}, [slug]);

// Track tiempo en párrafo
<p onMouseEnter={() => trackParagraphTime(`${slug}-p-${index}`)}
   onMouseLeave={() => trackParagraphTime(`${slug}-p-${index}`)}>
  {paragraph}
</p>
```

### Variables de entorno

```env
DEEPSEEK_API_KEY=sk-xxx
TELEGRAM_BOT_TOKEN=123456:ABC-xxx
TELEGRAM_CHAT_ID=-100xxx
```

## Vercel Cron Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/reader-analytics-cron",
      "schedule": "*/30 * * * *"
    },
    {
      "path": "/api/daily-summary-report",
      "schedule": "0 9 * * *"
    }
  ]
}
```

## Flujo de notificaciones

1. Usuario visita artículos → eventos capturados en `reader_events`
2. Cron cada 30 min procesa sesiones de la última hora
3. Se calcula Reader Score y Lead Score
4. Se envía a IA para análisis de comportamiento
5. Si Lead Score >= 60 → notificación de "lead caliente" a Telegram
6. Si hay anomalías → alertas a Telegram
7. A las 9am → resumen diario completo por Telegram
