/**
 * Test OneProvider API response format
 */
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath)) loadEnv({ path: envPath });

const BASE_URL = process.env.ONEPROVIDER_BASE_URL || 'https://api.oneprovider.dev';
const API_KEY = process.env.ONEPROVIDER_API_KEY;
const MODEL = process.env.AI_MODEL || 'claude-sonnet-5';
const ANTHROPIC_VERSION = '2023-06-01';

const response = await fetch(BASE_URL + '/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'anthropic-version': ANTHROPIC_VERSION,
  },
  body: JSON.stringify({
    model: MODEL,
    system: 'Eres un asistente útil.',
    messages: [{ role: 'user', content: 'Di solo "hola".' }],
    max_tokens: 100,
    temperature: 0.6,
  }),
});

console.log('Status:', response.status);
const text = await response.text();
console.log('Raw response (first 1000 chars):');
console.log(text.substring(0, 1000));
console.log('\nParsed:');
const data = JSON.parse(text);
console.log(JSON.stringify(data, null, 2).substring(0, 2000));
