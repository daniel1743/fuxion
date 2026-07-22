const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_ONEPROVIDER_MODEL = 'claude-sonnet-5';
const DEFAULT_DEEPSEEK_MODEL = 'deepseek-reasoner';

function normalizeOpenAiResponse(content, provider, model, usage = {}) {
  return {
    provider,
    model,
    usage,
    choices: [
      {
        message: {
          role: 'assistant',
          content,
        },
      },
    ],
  };
}

async function parseErrorResponse(response) {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json.error?.message || json.message || text;
  } catch (_) {
    return text || `${response.status} ${response.statusText}`;
  }
}

function extractAnthropicText(data) {
  const textBlock = data.content?.find((block) => block.type === 'text');
  if (!textBlock?.text) {
    throw new Error('Sonnet no devolvió un bloque de texto válido.');
  }
  return textBlock.text;
}

async function callAnthropicOfficial({ systemPrompt, userPrompt }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY no configurada.');

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.55,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic ${response.status}: ${await parseErrorResponse(response)}`);
  }

  const data = await response.json();
  return normalizeOpenAiResponse(extractAnthropicText(data), 'anthropic', model, data.usage || {});
}

async function callOneProviderSonnet({ systemPrompt, userPrompt }) {
  const apiKey = process.env.ONEPROVIDER_API_KEY;
  if (!apiKey) throw new Error('ONEPROVIDER_API_KEY no configurada.');

  const baseUrl = process.env.ONEPROVIDER_BASE_URL || 'https://api.oneprovider.dev';
  const model = process.env.REPORT_AI_MODEL || process.env.AI_MODEL || DEFAULT_ONEPROVIDER_MODEL;
  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.55,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OneProvider Sonnet ${response.status}: ${await parseErrorResponse(response)}`);
  }

  const data = await response.json();
  return normalizeOpenAiResponse(extractAnthropicText(data), 'oneprovider-sonnet', model, data.usage || {});
}

async function callDeepSeek({ systemPrompt, userPrompt }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY no configurada.');

  const model = process.env.DEEPSEEK_REPORT_MODEL || DEFAULT_DEEPSEEK_MODEL;
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek ${response.status}: ${await parseErrorResponse(response)}`);
  }

  const data = await response.json();
  return {
    ...data,
    provider: 'deepseek',
    model,
  };
}

function getProviderChain() {
  const preferred = (process.env.REPORT_AI_PROVIDER || 'sonnet').toLowerCase();
  const sonnetProviders = [callAnthropicOfficial, callOneProviderSonnet];
  const deepSeekProviders = [callDeepSeek];

  if (preferred === 'deepseek') return [...deepSeekProviders, ...sonnetProviders];
  if (preferred === 'oneprovider') return [callOneProviderSonnet, callAnthropicOfficial, ...deepSeekProviders];
  if (preferred === 'anthropic') return [callAnthropicOfficial, callOneProviderSonnet, ...deepSeekProviders];
  return [...sonnetProviders, ...deepSeekProviders];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { systemPrompt, userPrompt } = req.body || {};
  if (!systemPrompt || !userPrompt) {
    return res.status(400).json({ error: 'systemPrompt y userPrompt son requeridos.' });
  }

  const attempts = [];

  for (const providerCall of getProviderChain()) {
    const startedAt = Date.now();
    try {
      const data = await providerCall({ systemPrompt, userPrompt });
      return res.status(200).json({
        ...data,
        fallback_attempts: attempts,
      });
    } catch (err) {
      attempts.push({
        provider: providerCall.name,
        status: 'failed',
        elapsed_ms: Date.now() - startedAt,
        message: err.message,
      });
      console.error(`[generate-report] ${providerCall.name} failed:`, err.message);
    }
  }

  return res.status(500).json({
    error: 'No se pudo generar el informe con Sonnet ni con DeepSeek.',
    attempts,
  });
}
