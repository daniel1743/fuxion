import { TELEGRAM_CONFIG } from '../config/chatAlertRules.js';

const TELEGRAM_API_BASE_URL =
  process.env.TELEGRAM_API_BASE_URL || TELEGRAM_CONFIG.apiBaseUrl;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const TELEGRAM_CHAT_ID =
  process.env.TELEGRAM_CHAT_ID || TELEGRAM_CONFIG.defaultChatId;

const buildTelegramUrl = () => {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('telegramNotifier: TELEGRAM_BOT_TOKEN no está configurado');
    return null;
  }

  return `${TELEGRAM_API_BASE_URL}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
};

/**
 * Escapa caracteres especiales para Telegram MarkdownV2.
 * Se aplica SOLO a valores dinámicos, no a la estructura del template.
 */
const escapeMarkdownV2 = (text = '') =>
  String(text).replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');

export const sendTelegramNotification = async ({
  text,
  parseMode = 'MarkdownV2'
}) => {
  const url = buildTelegramUrl();

  if (!url) return false;

  // Si el modo es MarkdownV2, NO escapamos el texto completo porque
  // el template ya contiene emojis y estructura que no deben escaparse.
  // El escape se aplica a los valores dinámicos en chatEvents.js antes de
  // insertarlos en el template.
  const body = {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: parseMode,
    disable_web_page_preview: true,
    disable_notification: false
  };

  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      console.warn(
        'telegramNotifier: telegram request failed',
        response.status,
        errorData
      );

      return false;
    }

    console.log('telegramNotifier: Telegram enviado correctamente');

    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(
        'telegramNotifier: timeout de 5 segundos al enviar Telegram'
      );
    } else {
      console.warn(
        'telegramNotifier: error silencioso al enviar Telegram',
        error.message
      );
    }

    return false;
  } finally {
    clearTimeout(timeout);
  }
};