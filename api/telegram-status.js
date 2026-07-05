/**
 * Vercel Serverless Function - Test Telegram Notification
 *
 * Endpoint: POST /api/test-telegram
 *
 * Envía un mensaje de prueba a Telegram para verificar que
 * el bot token y chat ID están correctamente configurados.
 *
 * NO expone el token ni valores sensibles en la respuesta.
 */

const TELEGRAM_API_BASE_URL = 'https://api.telegram.org';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Validar que las variables de entorno existan
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('test-telegram: TELEGRAM_BOT_TOKEN no está configurado');
    res.status(200).json({
      status: 'failed',
      reason: 'TELEGRAM_BOT_TOKEN no está configurado en las variables de entorno'
    });
    return;
  }

  if (!TELEGRAM_CHAT_ID) {
    console.warn('test-telegram: TELEGRAM_CHAT_ID no está configurado');
    res.status(200).json({
      status: 'failed',
      reason: 'TELEGRAM_CHAT_ID no está configurado en las variables de entorno'
    });
    return;
  }

  // Construir mensaje de prueba
  const currentDate = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const testMessage = [
    '🟢 Naturalmente FuXion conectado',
    '',
    '✅ Telegram funcionando correctamente',
    '',
    '🤖 Falcon Assistant:',
    'Sistema de alertas activo',
    '',
    '📅 Fecha: ' + currentDate,
    '',
    'Este es un mensaje automático de prueba.'
  ].join('\n');

  const url = `${TELEGRAM_API_BASE_URL}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const body = {
    chat_id: TELEGRAM_CHAT_ID,
    text: testMessage,
    disable_web_page_preview: true,
    disable_notification: false
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorCode = responseData?.error_code || response.status;
      const description = responseData?.description || 'Error desconocido';

      console.warn(
        'test-telegram: Telegram API error',
        errorCode,
        description
      );

      res.status(200).json({
        status: 'failed',
        telegram_error_code: errorCode,
        reason: description
      });
      return;
    }

    console.log('test-telegram: Mensaje de prueba enviado correctamente');

    res.status(200).json({
      status: 'connected',
      message: 'Telegram conectado correctamente'
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('test-telegram: Timeout al enviar mensaje de prueba');
      res.status(200).json({
        status: 'failed',
        telegram_error_code: 408,
        reason: 'Timeout: Telegram no respondió en 5 segundos'
      });
    } else {
      console.warn('test-telegram: Error al enviar mensaje de prueba', error.message);
      res.status(200).json({
        status: 'failed',
        telegram_error_code: 0,
        reason: error.message
      });
    }
  } finally {
    clearTimeout(timeout);
  }
}
