/**
 * Vercel Serverless Function para Chat con APIs de IA
 *
 * Esta función se ejecuta en el BACKEND (servidor de Vercel)
 * para evitar problemas de CORS y proteger las API keys.
 *
 * Sistema de fallback: DeepSeek > Qwen > Gemini
 */

// Configuración de APIs desde variables de entorno (seguras).
// Se acepta el prefijo VITE_ solo como compatibilidad con instalaciones antiguas.
const getApiKey = (name) => process.env[`VITE_${name}`] || process.env[name];

const DEEPSEEK_API_KEY = getApiKey('DEEPSEEK_API_KEY');
const QWEN_API_KEY = getApiKey('QWEN_API_KEY');
const GEMINI_API_KEY = getApiKey('GEMINI_API_KEY');

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
// Corregido: Usar v1 en lugar de v1beta
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const API_PROVIDERS = {
  deepseek: {
    name: 'DeepSeek',
    hasKey: () => Boolean(DEEPSEEK_API_KEY),
    call: callDeepSeekAPI
  },
  qwen: {
    name: 'Qwen',
    hasKey: () => Boolean(QWEN_API_KEY),
    call: callQwenAPI
  },
  gemini: {
    name: 'Gemini',
    hasKey: () => Boolean(GEMINI_API_KEY),
    call: callGeminiAPI
  }
};

const getProviderOrder = (preferredProvider = 'deepseek') => {
  const fallbackOrder = ['deepseek', 'qwen', 'gemini'];
  const normalizedProvider = String(preferredProvider).toLowerCase();

  if (!API_PROVIDERS[normalizedProvider]) {
    return fallbackOrder;
  }

  return [
    normalizedProvider,
    ...fallbackOrder.filter(provider => provider !== normalizedProvider)
  ];
};

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
    const { messages, preferredProvider = 'deepseek' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Se requiere un array de mensajes.' });
    }

    // Sistema de fallback por defecto: DeepSeek > Qwen > Gemini
    let errors = [];
    const providerOrder = getProviderOrder(preferredProvider);

    for (const providerKey of providerOrder) {
      const provider = API_PROVIDERS[providerKey];

      if (!provider.hasKey()) {
        errors.push({ api: provider.name, error: 'API key no configurada' });
        continue;
      }

      try {
        console.log(`🔄 Intentando con ${provider.name} API...`);
        const result = await provider.call(messages);
        return res.status(200).json(result);
      } catch (error) {
        console.warn(`⚠️ ${provider.name} falló:`, error.message);
        errors.push({ api: provider.name, error: error.message });
      }
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
