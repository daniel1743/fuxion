/**
 * providers/oneprovider.js
 *
 * Cliente para OneProvider (API compatible con Anthropic).
 * POST https://api.oneprovider.dev/v1/messages
 *
 * Uso:
 *   import { generateContent } from '../providers/oneprovider.js';
 *   const { content } = await generateContent({ systemPrompt, userPrompt });
 */

import { config as loadEnv } from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (scripts/providers/ -> project root = ..)
const envPath = join(__dirname, '..', '..', '.env');
if (existsSync(envPath)) {
  loadEnv({ path: envPath });
}

const BASE_URL = process.env.ONEPROVIDER_BASE_URL || 'https://api.oneprovider.dev';
const API_KEY = process.env.ONEPROVIDER_API_KEY;
const MODEL = process.env.AI_MODEL || 'claude-sonnet-5';
const ANTHROPIC_VERSION = '2023-06-01';

export async function generateContent({ systemPrompt, userPrompt }) {
  const response = await fetch(BASE_URL + '/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: 4096,
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OneProvider HTTP Error ${response.status}: ${text}`);
  }

  const data = await response.json();

  if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
    throw new Error('OneProvider: respuesta incompleta o malformada (sin content).');
  }

  // Extract text content, skipping 'thinking' blocks
  const textBlock = data.content.find(block => block.type === 'text');
  if (!textBlock) {
    throw new Error('OneProvider: respuesta sin bloque de texto (solo thinking).');
  }

  return {
    content: textBlock.text,
    usage: data.usage || {},
  };
}
