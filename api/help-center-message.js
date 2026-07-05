/**
 * Vercel Serverless Function - Help Center Message
 *
 * Endpoint: POST /api/help-center-message
 *
 * Recibe datos del formulario del Centro de Ayuda y envía
 * una notificación a Telegram con el formato estandarizado.
 *
 * NO expone el token Telegram ni valores sensibles en la respuesta.
 */

import { sendTelegramNotification } from '../lib/telegramNotifier.js';

// ── Tipo labels ───────────────────────────────────────────────
const tipoLabels = {
  pregunta: 'Consulta general',
  producto: 'Ayuda con producto',
  pedido: 'Duda sobre pedido',
  reclamo: 'Reclamo',
  felicitacion: 'Felicitación',
  sugerencia: 'Sugerencia',
  asesor: 'Contacto con asesor',
  otro: 'Otro motivo'
};

// ── Alertas especiales ────────────────────────────────────────
const getSpecialAlert = (tipo) => {
  switch (tipo) {
    case 'reclamo':
      return '🚨 ATENCIÓN - RECLAMO CLIENTE';
    case 'felicitacion':
      return '⭐ NUEVA EXPERIENCIA POSITIVA';
    default:
      return null;
  }
};

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
  const { nombre, tipo, whatsapp, email, mensaje, origen, fecha } = req.body;

  if (!nombre || !nombre.trim()) {
    res.status(400).json({ error: 'El campo nombre es obligatorio' });
    return;
  }

  if (!tipo || !tipo.trim()) {
    res.status(400).json({ error: 'El campo tipo es obligatorio' });
    return;
  }

  if (!whatsapp?.trim() && !email?.trim()) {
    res.status(400).json({ error: 'Se requiere al menos WhatsApp o correo electrónico' });
    return;
  }

  if (!mensaje || !mensaje.trim()) {
    res.status(400).json({ error: 'El campo mensaje es obligatorio' });
    return;
  }

  // ── Construir mensaje para Telegram ──────────────────────────
  const readableTipo = tipoLabels[tipo] || tipo;
  const specialAlert = getSpecialAlert(tipo);
  const currentDate = fecha || new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const messageParts = [];

  // Alerta especial si aplica
  if (specialAlert) {
    messageParts.push(specialAlert);
    messageParts.push('');
  }

  messageParts.push('🔔 NUEVA SOLICITUD');
  messageParts.push('');
  messageParts.push('Tipo:');
  messageParts.push(readableTipo);
  messageParts.push('');
  messageParts.push('Nombre:');
  messageParts.push(nombre.trim());
  messageParts.push('');
  messageParts.push('Contacto:');
  const contactInfo = [];
  if (whatsapp?.trim()) contactInfo.push(`WhatsApp: ${whatsapp.trim()}`);
  if (email?.trim()) contactInfo.push(`Email: ${email.trim()}`);
  messageParts.push(contactInfo.join(' | ') || 'No proporcionado');
  messageParts.push('');
  messageParts.push('Mensaje:');
  messageParts.push('');
  messageParts.push(`"${mensaje.trim()}"`);
  messageParts.push('');
  messageParts.push('Origen:');
  messageParts.push(origen || 'Centro de ayuda');
  messageParts.push('');
  messageParts.push('Fecha:');
  messageParts.push(currentDate);

  const message = messageParts.join('\n');

  // ── Enviar a Telegram ────────────────────────────────────────
  const sent = await sendTelegramNotification({ text: message });

  if (!sent) {
    console.warn('help-center-message: No se pudo enviar la notificación a Telegram');
    res.status(200).json({
      success: true,
      telegram: 'failed'
    });
    return;
  }

  console.log('help-center-message: Notificación enviada a Telegram correctamente');

  res.status(200).json({
    success: true,
    telegram: 'sent'
  });
}
