import { TELEGRAM_CONFIG } from '../config/chatAlertRules.js';

const TELEGRAM_API_BASE_URL =
  process.env.TELEGRAM_API_BASE_URL || TELEGRAM_CONFIG.apiBaseUrl;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const TELEGRAM_CHAT_ID =
  process.env.TELEGRAM_CHAT_ID || TELEGRAM_CONFIG.defaultChatId;

// Debug: log whether token and chat_id exist at module load time
console.log(
  'telegramNotifier: debug token_exists=' +
    Boolean(TELEGRAM_BOT_TOKEN) +
    ' chat_id_exists=' +
    Boolean(TELEGRAM_CHAT_ID)
);

const buildTelegramUrl = () => {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('telegramNotifier: TELEGRAM_BOT_TOKEN no está configurado');
    return null;
  }

  return `${TELEGRAM_API_BASE_URL}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
};

export const sendTelegramNotification = async ({
  text,
  parseMode
}) => {
  const url = buildTelegramUrl();

  if (!url) return false;

  // Se usa texto plano (sin MarkdownV2) para evitar errores de escape
  // con caracteres reservados como '.' en los mensajes.
  const body = {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    disable_web_page_preview: true,
    disable_notification: false
  };

  // Solo enviar parse_mode si está explícitamente definido
  if (parseMode) {
    body.parse_mode = parseMode;
  }

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

    // Debug: log Telegram API response status
    console.log(
      'telegramNotifier: debug telegram_response_status=' + response.status
    );

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