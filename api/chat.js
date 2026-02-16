/**
 * Vercel Serverless Function para Chat con APIs de IA
 *
 * Esta función se ejecuta en el BACKEND (servidor de Vercel)
 * para evitar problemas de CORS y proteger las API keys.
 *
 * Sistema de fallback: DeepSeek > Qwen > Gemini
 */

// Configuración de APIs desde variables de entorno (seguras)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const QWEN_API_KEY = process.env.QWEN_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
// Corregido: Usar v1 en lugar de v1beta
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Función para llamar a DeepSeek API
async function callDeepSeekAPI(messages) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: false
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('DeepSeek: No se recibió respuesta');
  }

  console.log('✅ DeepSeek API funcionó correctamente');
  return {
    text: data.choices[0].message.content,
    usage: data.usage,
    model: 'DeepSeek: ' + data.model,
    apiUsed: 'DeepSeek'
  };
}

// Función para llamar a Qwen API (Alibaba Cloud)
async function callQwenAPI(messages) {
  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Qwen Error ${response.status}: ${errorData.error?.message || errorData.message || 'Error desconocido'}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('Qwen: No se recibió respuesta');
  }

  console.log('✅ Qwen API funcionó correctamente (fallback activado)');
  return {
    text: data.choices[0].message.content,
    usage: data.usage,
    model: 'Qwen: ' + (data.model || 'qwen-plus'),
    apiUsed: 'Qwen'
  };
}

// Función para llamar a Gemini API (Google)
async function callGeminiAPI(messages) {
  // Gemini usa un formato diferente, convertimos los mensajes
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  const geminiPrompt = systemMessage
    ? `${systemMessage.content}\n\n${userMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
    : userMessages.map(m => `${m.role}: ${m.content}`).join('\n');

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: geminiPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
  }

  const data = await response.json();

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('Gemini: No se recibió respuesta');
  }

  console.log('✅ Gemini API funcionó correctamente (fallback 2 activado)');
  return {
    text: data.candidates[0].content.parts[0].text,
    usage: data.usageMetadata,
    model: 'Gemini: gemini-1.5-flash',
    apiUsed: 'Gemini'
  };
}

// Handler principal de la función serverless
export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Se requiere un array de mensajes.' });
    }

    // Sistema de fallback: DeepSeek > Qwen > Gemini
    let result = null;
    let errors = [];

    // Intentar con DeepSeek primero
    if (DEEPSEEK_API_KEY) {
      try {
        console.log('🔄 Intentando con DeepSeek API...');
        result = await callDeepSeekAPI(messages);
        return res.status(200).json(result);
      } catch (error) {
        console.warn('⚠️ DeepSeek falló:', error.message);
        errors.push({ api: 'DeepSeek', error: error.message });
      }
    } else {
      errors.push({ api: 'DeepSeek', error: 'API key no configurada' });
    }

    // Si DeepSeek falla, intentar con Qwen
    if (QWEN_API_KEY) {
      try {
        console.log('🔄 Intentando con Qwen API (fallback)...');
        result = await callQwenAPI(messages);
        return res.status(200).json(result);
      } catch (error) {
        console.warn('⚠️ Qwen falló:', error.message);
        errors.push({ api: 'Qwen', error: error.message });
      }
    } else {
      errors.push({ api: 'Qwen', error: 'API key no configurada' });
    }

    // Si Qwen falla, intentar con Gemini
    if (GEMINI_API_KEY) {
      try {
        console.log('🔄 Intentando con Gemini API (fallback final)...');
        result = await callGeminiAPI(messages);
        return res.status(200).json(result);
      } catch (error) {
        console.error('❌ Gemini también falló:', error.message);
        errors.push({ api: 'Gemini', error: error.message });
      }
    } else {
      errors.push({ api: 'Gemini', error: 'API key no configurada' });
    }

    // Si todas fallaron
    return res.status(500).json({
      error: 'Todas las APIs fallaron. Por favor, verifica las API Keys.',
      details: errors
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
}
