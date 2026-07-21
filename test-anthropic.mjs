import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
loadEnv({ path: path.join(__dirname, '.env') });

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.error('❌ ERROR: No se encontró la variable ANTHROPIC_API_KEY en el archivo .env');
  process.exit(1);
}

console.log('Iniciando prueba con la API de Anthropic...');

async function testAnthropic() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        messages: [
          { role: 'user', content: 'Responde solo con la palabra: CONECTADO' }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error en la API:', data);
    } else {
      console.log('✅ Prueba exitosa. Respuesta de Claude:', data.content[0].text);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testAnthropic();
