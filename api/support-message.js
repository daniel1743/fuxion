/**
 * Vercel Serverless Function - Support Message from Contact Form
 *
 * Endpoint: POST /api/support-message
 *
 * Recibe datos del formulario de contacto y envía
 * una notificación a Telegram usando lib/telegramNotifier.js
 *
 * Incluye alertas especiales según el tipo de solicitud:
 * - reclamo    → 🚨 ATENCIÓN - RECLAMO CLIENTE
 * - oportunidad → 🚀 POSIBLE SOCIO FUXION
 * - felicitacion → ⭐ NUEVA EXPERIENCIA POSITIVA
 *
 * NO expone el token Telegram ni valores sensibles en la respuesta.
 */

import { sendTelegramNotification } from '../lib/telegramNotifier.js';

// ── Tipo labels ───────────────────────────────────────────────
const tipoLabels = {
  pregunta: 'Tengo una pregunta',
  producto: 'Consulta sobre productos',
  pedido: 'Consulta sobre mi pedido',
  reclamo: 'Reclamo o inconveniente',
  felicitacion: 'Felicitación o experiencia',
  oportunidad: 'Quiero conocer la oportunidad FuXion',
  otro: 'Otro motivo'
};

// ── Alertas especiales ────────────────────────────────────────
const getSpecialAlert = (tipo) => {
  switch (tipo) {
    case 'reclamo':
      return '🚨 ATENCIÓN - RECLAMO CLIENTE';
    case 'oportunidad':
      return '🚀 POSIBLE SOCIO FUXION';
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
  const { nombre, tipo, pais, whatsapp, email, mensaje, fecha } = req.body;

  if (!nombre || !nombre.trim()) {
    res.status(400).json({ error: 'El campo nombre es obligatorio' });
    return;
  }

  if (!tipo || !tipo.trim()) {
    res.status(400).json({ error: 'El campo tipo es obligatorio' });
    return;
  }

  if (!pais || !pais.trim()) {
    res.status(400).json({ error: 'El campo país es obligatorio' });
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

  messageParts.push('📩 NUEVO MENSAJE FUXION');
  messageParts.push('');
  messageParts.push('🏷 Tipo:');
  messageParts.push(readableTipo);
  messageParts.push('');
  messageParts.push('👤 Nombre:');
  messageParts.push(nombre.trim());
  messageParts.push('');
  messageParts.push('🌎 País:');
  messageParts.push(pais);
  messageParts.push('');
  messageParts.push('📱 WhatsApp:');
  messageParts.push(whatsapp?.trim() || 'No proporcionado');
  messageParts.push('');
  messageParts.push('✉️ Email:');
  messageParts.push(email?.trim() || 'No proporcionado');
  messageParts.push('');
  messageParts.push('💬 Mensaje:');
  messageParts.push('');
  messageParts.push(`"${mensaje.trim()}"`);
  messageParts.push('');
  messageParts.push('⏰ Fecha:');
  messageParts.push(currentDate);

  const message = messageParts.join('\n');

  // ── Enviar a Telegram ────────────────────────────────────────
  const sent = await sendTelegramNotification({ text: message });

  if (!sent) {
    console.warn('support-message: No se pudo enviar la notificación a Telegram');
    res.status(200).json({
      success: true,
      telegram: 'failed'
    });
    return;
  }

  console.log('support-message: Notificación enviada a Telegram correctamente');

  res.status(200).json({
    success: true,
    telegram: 'sent'
  });
}
