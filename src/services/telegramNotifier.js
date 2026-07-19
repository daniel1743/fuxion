/**
 * telegramNotifier.js — Notificaciones a Daniel
 *
 * Envía alertas al admin por Telegram cuando detecta:
 * - Tendencias virales
 * - Problemas de retención
 * - Lectores de alto interés (leads calientes)
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// ── Envío de notificación a Telegram ─────────────────────────
export async function sendTelegramAlert(alert) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const emoji = alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '🟢';
  const title = alert.severity === 'high' ? 'ALERTA' : alert.severity === 'medium' ? 'INFO' : 'OK';

  const text = `*${emoji} ${title}*

${alert.title}

${alert.message}

📊 *Reader Analytics — Bienestar en Claro*
${new Date().toLocaleString('es-CL')}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('[TelegramNotifier] Error al enviar:', err);
  }
}

// ── Procesar alertas y enviar ────────────────────────────────
export async function processAndNotify(anomalies) {
  for (const anomaly of anomalies) {
    await sendTelegramAlert(anomaly);
  }
}

// ── Alerta de lead calienta (lector de alto interés) ─────────
export async function notifyHotLead(leadInfo) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const text = `🔥 *LEADER CALIENTE DETECTADO*

👤 *Reader Score:* ${leadInfo.readerScore}/100
💰 *Lead Score:* ${leadInfo.leadScore}/100
📄 *Artículos vistos:* ${leadInfo.articles.join(', ')}
💬 *Chat abierto:* ${leadInfo.chatOpened ? 'Sí' : 'No'}
🧠 *IA Analysis:* ${leadInfo.aiAnalysis?.conclusion || 'Sin análisis'}

⏰ ${new Date().toLocaleString('es-CL')}

📊 *Reader Analytics — Bienestar en Claro*`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('[TelegramNotifier] Error al notificar lead:', err);
  }
}
