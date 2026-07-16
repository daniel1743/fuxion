import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function for /api/waitlist
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, phone, weight, height, goal } = req.body;

  if (!name || !email || !goal) {
    return res.status(400).json({ error: 'Nombre, email y objetivo son obligatorios' });
  }

  try {
    // 1. Guardar en Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: dbError } = await supabase
        .from('waitlist_subscriptions')
        .insert([{ 
          name, 
          email, 
          phone: phone || null, 
          weight_kg: weight ? parseFloat(weight) : null, 
          height_cm: height ? parseFloat(height) : null, 
          primary_goal: goal 
        }]);

      if (dbError) {
        console.error('Error insertando en Supabase:', dbError);
        // Continuamos para intentar enviar el mensaje por Telegram al menos
      }
    }

    // 2. Notificar por Telegram
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      const message = `
🎉 *Nueva Suscripción Premium (Bienestar en Claro)* 🎉

👤 *Nombre:* ${name}
📧 *Email:* ${email}
📱 *WhatsApp:* ${phone || 'No proporcionado'}
🎯 *Objetivo:* ${goal}
⚖️ *Peso:* ${weight ? weight + ' kg' : 'No especificado'}
📏 *Altura:* ${height ? height + ' cm' : 'No especificado'}
      `;

      const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    }

    return res.status(200).json({ success: true, message: 'Inscripción exitosa' });
  } catch (error) {
    console.error('Waitlist API Error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
