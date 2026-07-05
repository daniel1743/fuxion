/**
 * Vercel Serverless Function - Contact Lead from Opportunity Form
 *
 * Endpoint: POST /api/contact-lead
 *
 * Recibe datos del formulario de oportunidad FuXion y envía
 * una notificación a Telegram usando lib/telegramNotifier.js
 *
 * NO expone el token Telegram ni valores sensibles en la respuesta.
 */

import { sendTelegramNotification } from '../lib/telegramNotifier.js';

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

  // ── Validar campos obligatorios ──────────────────────────────
  const { nombre, pais, whatsapp, interes, fecha, origen } = req.body;

  if (!nombre || !nombre.trim()) {
    res.status(400).json({ error: 'El campo nombre es obligatorio' });
    return;
  }

  if (!whatsapp || !whatsapp.trim()) {
    res.status(400).json({ error: 'El campo whatsapp es obligatorio' });
    return;
  }

  if (!interes || !interes.trim()) {
    res.status(400).json({ error: 'El campo interes es obligatorio' });
    return;
  }

  // ── Mapeo de interés técnico a texto legible ─────────────────
  const interestLabels = {
    products: 'Quiere consumir productos 🛒',
    business: 'Quiere conocer el negocio FuXion 🚀',
    both: 'Productos y oportunidad FuXion 🛒🚀'
  };

  const readableInterest = interestLabels[interes] || interes;

  // ── Construir mensaje para Telegram ──────────────────────────
  const currentDate = fecha || new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const message = [
    '🟢 NUEVO INTERESADO FUXION',
    '',
    '👤 Nombre:',
    nombre.trim(),
    '',
    '🌎 País:',
    pais || 'No especificado',
    '',
    '📱 WhatsApp:',
    whatsapp.trim(),
    '',
    '🎯 Interés:',
    readableInterest,
    '',
    '📍 Origen:',
    'Formulario oportunidad FuXion',
    '',
    '⏰ Fecha:',
    currentDate,
    '',
    'Acción sugerida: Contactar asesor 🚀'
  ].join('\n');

  // ── Enviar a Telegram ────────────────────────────────────────
  const sent = await sendTelegramNotification({ text: message });

  if (!sent) {
    console.warn('contact-lead: No se pudo enviar la notificación a Telegram');
    res.status(200).json({
      success: true,
      telegram: 'failed'
    });
    return;
  }

  console.log('contact-lead: Notificación enviada a Telegram correctamente');

  res.status(200).json({
    success: true,
    telegram: 'sent'
  });
}
