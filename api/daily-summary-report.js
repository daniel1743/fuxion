/**
 * dailySummaryReport.js — Genera el resumen diario de lectores
 * y lo envía por Telegram cada día a las 9am.
 *
 * Se ejecuta vía cron (Vercel Cron / GitHub Actions / etc.)
 */

import { getDailySummary, detectAnomalies, analyzeSession } from '@/services/readerAnalytics';
import { sendTelegramAlert } from '@/services/telegramNotifier';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

async function generateDailySummary() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const summary = await getDailySummary(yesterday.toISOString());

  if (!summary) {
    console.warn('[DailyReport] No hubo datos para ayer');
    return null;
  }

  const dateStr = yesterday.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  let text = `📊 *RESUMEN DIARIO — Bienestar en Claro*\n\n`;
  text += `📅 *${dateStr}*\n\n`;
  text += `👥 *Lectores únicos:* ${summary.totalReaders}\n`;
  text += `📖 *Artículos leídos:* ${summary.totalArticlesRead}\n`;
  text += `💬 *Chats abiertos:* ${summary.chatsOpened}\n`;
  text += `🔥 *Alto interés:* ${summary.highInterest}\n`;
  text += `🎯 *Reader Score promedio:* ${summary.avgReaderScore}/100\n\n`;

  if (summary.bestArticle) {
    text += `⭐ *Más leído:* ${summary.bestArticle.slug} (${summary.bestArticle.count} lecturas)\n\n`;
  }

  if (summary.worstRetention) {
    text += `⚠️ *Mayor abandono:* ${summary.worstRetention.slug} (${summary.worstRetention.retention}% retención)\n\n`;
  }

  // Análisis IA de tendencias
  if (summary.totalReaders >= 5) {
    const trendPrompt = `¿Qué tendencia principal observaste en ${summary.totalReaders} lectores que leyeron ${summary.totalArticlesRead} artículos en un día? Respuesta de 2 líneas.`;

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'Eres un analista de tendencias de contenido. Responde en español, máximo 2 líneas.' },
            { role: 'user', content: trendPrompt },
          ],
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      const insight = data.choices?.[0]?.message?.content?.trim();
      if (insight) {
        text += `💡 *Insight IA:* ${insight}\n\n`;
      }
    } catch (err) {
      console.warn('[DailyReport] Error en análisis IA:', err);
    }
  }

  text += `\n📈 *Reader Analytics — Bienestar en Claro*`;

  // Enviar por Telegram
  try {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    });
    console.log('[DailyReport] Enviado correctamente');
  } catch (err) {
    console.error('[DailyReport] Error al enviar:', err);
  }

  return summary;
}

generateDailySummary();
