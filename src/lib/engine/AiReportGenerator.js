/**
 * AiReportGenerator
 * Se encarga de ensamblar el prompt maestro con los datos del Gemelo Digital
 * y llamar a la API de LLM (ej. OpenAI) para generar el contenido Markdown del reporte Premium.
 */

export async function generatePremiumReportContent(userData, twinData, apiKey) {
  if (!apiKey) {
    throw new Error('Falta la API Key para generar el reporte de IA.');
  }

  const { biometrics, iib } = twinData.twin_state;
  const profile = twinData.behavior_profile;

  const systemPrompt = `
Eres el Coach Principal de Bienestar en Claro, una marca premium que vende suplementos naturales (Fuxion) y planes de salud. 
Acabas de analizar los resultados de una evaluación muy exhaustiva de un cliente. 
Tu tarea es escribir un INFORME PERSONALIZADO DE BIENESTAR EN FORMATO MARKDOWN.
El reporte debe ser extenso (equivalente a 15-20 páginas), extremadamente empático, motivador, y escrito directamente al cliente en segunda persona (tú).

ESTRUCTURA OBLIGATORIA DEL DOCUMENTO:
(Usa títulos H1 (#) y H2 (##) para separar secciones)

# 1. Introducción
Un mensaje cálido de bienvenida. Reconoce su esfuerzo por llegar aquí. Menciona su nombre y su objetivo principal (bajar de peso, mantener, etc.).

# 2. Análisis Metabólico y Biometría
Explícale su IMC y sus calorías diarias (TDEE). No le digas solo números; explícale qué significan para su cuerpo.

# 3. La Prioridad de Hoy: Sus 3 Microhábitos
Detalla cuáles son los 3 cambios que más impacto tendrán en su vida (extraídos de sus recomendaciones). 

# 4. Plan de Acción: Nutrición
Crea ejemplos de desayunos, almuerzos, cenas y colaciones basados en su requerimiento de proteína. Dale opciones si entrena o no entrena.

# 5. Plan de Acción: Hidratación
Menciona cuánta agua necesita. Dale un plan progresivo de 4 semanas para alcanzar la meta (no todo de golpe). Da tips de cómo saborizar el agua.

# 6. Plan de Acción: Salud Digestiva
Recomendaciones para mejorar su tránsito intestinal según sus respuestas (ej. añadir chía, evitar fritos).

# 7. Plan de Acción: Movimiento y Descanso
Estrategias realistas para moverse más. Si es sedentario, empieza con algo suave. Agrega consejos de higiene del sueño.

# 8. Lista de Compras Recomendada
Qué alimentos e infusiones debería comprar esta semana.

# 9. Calendario Semanal
Un checklist de lunes a domingo.

# 10. Desafío 30 Días
Un reto progresivo de 4 semanas.

# 11. Obstáculos y Cómo Superarlos
Qué hacer si falla un día, si tiene una fiesta, o si se siente desmotivado.

Tono: Profesional, experto, muy humano, empático. No uses lenguaje médico extremadamente complejo. Eres un coach de alto nivel.
`;

  const userPrompt = `
DATOS DEL USUARIO:
- Nombre: ${userData.name || 'Cliente'}
- Edad: ${userData.age}
- Género: ${userData.gender}
- Peso: ${userData.weight} kg
- Altura: ${userData.height} cm
- Objetivo Principal: ${profile.goal}
- Nivel de Actividad: ${profile.activity_level}

BIOMETRÍA Y CÁLCULOS:
- IMC: ${biometrics.bmi} (${biometrics.bmiClass})
- Tasa Metabólica Basal / Calorías (TDEE): ${biometrics.tdee}
- Proteína diaria recomendada: ${biometrics.protein}g
- Agua diaria recomendada: ${biometrics.waterL} Litros
- Nivel de Estrés (1-10): ${twinData.answers?.stressLevel || 'No especificado'}
- Calidad de Sueño (1-5): ${twinData.answers?.sleepQuality || 'No especificada'}
- Frecuencia digestiva: ${twinData.answers?.bowelFrequency || 'No especificada'}

RECOMENDACIONES DEL ALGORITMO:
${twinData.recommendations.map(r => `- ${r.action}: ${r.why}`).join('\\n')}

Redacta el informe ahora.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error en la API de OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error('Error generando reporte IA:', err);
    throw err;
  }
}
