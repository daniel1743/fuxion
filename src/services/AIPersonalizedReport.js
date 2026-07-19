/**
 * Generador de texto personalizado con IA.
 * Solo 5 llamadas a DeepSeek. Cada una enfocada.
 */

const API_URL = 'https://api.deepseek.com/chat/completions';

function getApiKey() {
  return typeof window !== 'undefined'
    ? ''
    : process.env.DEEPSEEK_API_KEY || '';
}

async function callDeepSeek(messages, temperature = 0.7) {
  const key = getApiKey();
  if (!key) return null;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature,
        max_tokens: 1500,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

// ─── Llamada 1: Análisis general ─────────────────────────────────────

export async function generateExecutiveSummary(scores, answers) {
  const prompt = `Analiza este perfil de salud y dame 3 prioridades concretas.

Datos:
- Edad: ${answers.edad || '?'} años
- IMC: ${answers.imc || '?'}
- Índice de Bienestar: ${scores.ib}/100
- Fortalezas: ${scores.strengths.join(', ')}
- Riesgos: ${scores.risks.join(', ')}
- Prioridades: ${scores.priorities.map(p => p.label).join(', ')}
- Edad biológica estimada: ${scores.age.biological} años (${scores.age.delta > 0 ? '+' : ''}${scores.age.delta} años vs cronológica)

Cada prioridad debe incluir:
1. Qué hacer exactamente
2. Por qué importa
3. Impacto estimado

Formato: 3 párrafos cortos, máximo 4 líneas cada uno.`;

  return callDeepSeek([
    {
      role: 'system',
      content: 'Eres un médico experto en medicina preventiva y bienestar. Habla de forma directa, profesional, empática.',
    },
    { role: 'user', content: prompt },
  ]);
}

// ─── Llamada 2: Alimentación personalizada ───────────────────────────

export async function generateNutritionPlan(scores, answers) {
  const prompt = `Dame un plan de alimentación personalizado para esta persona:

Datos:
- Edades: ${answers.edad} años
- Peso: ${answers.peso} kg
- Objetivo: ${answers.objetivo || 'mantenimiento'}
- Nutrición score: ${scores.areas.nutrition}/100
- Frutas/verduras: ${answers.frutas_verduras}/5
- Proteína: ${answers.proteina}
- Azúcar: ${answers.azucar}/10
- Ultraprocesados: ${answers.ultraprocesados}
- Alcohol: ${answers.alcohol}/10
- No le gusta tomar agua: ${answers.no_bebe_agua === 'si' ? 'Sí' : 'No'}

Dame:
1. Alimentos para comer MÁS (lista de 6)
2. Alimentos para REDUCIR (lista de 4)
3. Alimentos para EVITAR (lista de 3)
4. Mejores horarios para comer
5. Ideas de desayuno (3 opciones)
6. Ideas de almuerzo (5 opciones)
7. Ideas de cena (5 opciones)
8. Snacks saludables (8 opciones)

Formato: solo texto, sin marcadores especiales, separado por líneas.`;

  return callDeepSeek([
    {
      role: 'system',
      content: 'Eres un nutricionista experto. Da recomendaciones prácticas, concretas, no genéricas.',
    },
    { role: 'user', content: prompt },
  ]);
}

// ─── Llamada 3: Sueño personalizado ──────────────────────────────────

export async function generateSleepPlan(scores, answers) {
  const prompt = `Analiza el sueño de esta persona y sugiere mejoras:

Datos:
- Horas promedio: ${answers.horas}
- Calidad: ${answers.calidad_sueno}/10
- Despertares: ${answers.despertares} veces
- Usa pantallas antes de dormir: ${answers.pantallas}
- Temperatura ambiente: ${answers.temperatura}
- Estresado: ${answers.estres > 6 ? 'Sí' : 'No'}
- Nivel de estrés general: ${answers.estres}/10
- Sueño score: ${scores.areas.sleep}/100

Determina su cronotipo probable y sugiere:
1. Cronotipo estimado
2. Principales problemas de sueño
3. Rutina de 30 minutos antes de dormir
4. 5 errores que probablemente está cometiendo

Formato: solo texto, sin marcadores especiales, separado por líneas.`;

  return callDeepSeek([
    {
      role: 'system',
      content: 'Eres un especialista en medicina del sueño. Da recomendaciones basadas en evidencia.',
    },
    { role: 'user', content: prompt },
  ]);
}

// ─── Llamada 4: Actividad física personalizada ───────────────────────

export async function generateActivityPlan(scores, answers) {
  const prompt = `Genera un plan de actividad física personalizado:

Datos:
- Edad: ${answers.edad} años
- Peso: ${answers.peso} kg
- Objetivo: ${answers.objetivo || 'mantenimiento'}
- Días de ejercicio actual: ${answers.dias_ejercicio}
- Tipo de ejercicio: ${answers.tipo_ejercicio || 'ninguno'}
- Duración promedio: ${answers.duracion} minutos
- Ejercicio score: ${scores.areas.exercise}/100

Crea un plan semanal de lunes a domingo con:
- Día
- Tipo de ejercicio
- Duración
- Intensidad
- Breve descripción

Adapta al nivel actual (si hace poco ejercicio, empieza suave).

Formato: solo texto, sin marcadores especiales, separado por líneas.`;

  return callDeepSeek([
    {
      role: 'system',
      content: 'Eres un entrenador personal experto. Diseña planes seguros y efectivos.',
    },
    { role: 'user', content: prompt },
  ]);
}

// ─── Llamada 5: Plan de acción de 90 días ────────────────────────────

export async function generateActionPlan(scores, answers) {
  const prompt = `Crea un plan de acción de 90 días basado en las prioridades de esta persona:

Datos:
- IB: ${scores.ib}/100
- Edad biológica: ${scores.age.biological} años
- Prioridades: ${scores.priorities.map(p => p.label).join(', ')}
- Fortalezas: ${scores.strengths.join(', ')}

Crea un plan de 4 semanas con objetivos específicos para cada semana.
Cada semana debe incluir:
- 2-3 metas concretas y medibles
- Qué hacer exactamente
- Cómo medir el progreso

Formato: solo texto, sin marcadores especiales, separado por líneas.`;

  return callDeepSeek([
    {
      role: 'system',
      content: 'Eres un coach de bienestar. Crea planes de acción prácticos y alcanzables.',
    },
    { role: 'user', content: prompt },
  ]);
}

// ─── Función principal: genera todo el informe ────────────────────────

export async function generateFullReport(scores, answers) {
  return {
    executiveSummary: await generateExecutiveSummary(scores, answers),
    nutritionPlan: await generateNutritionPlan(scores, answers),
    sleepPlan: await generateSleepPlan(scores, answers),
    activityPlan: await generateActivityPlan(scores, answers),
    actionPlan: await generateActionPlan(scores, answers),
    timestamp: new Date().toISOString(),
  };
}

export default {
  generateExecutiveSummary,
  generateNutritionPlan,
  generateSleepPlan,
  generateActivityPlan,
  generateActionPlan,
  generateFullReport,
};
