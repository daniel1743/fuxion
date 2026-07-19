/**
 * AiReportGenerator
 *
 * ÚNICAMENTE usa DeepSeek (deepseek-chat).
 *
 * Otros proveedores (OpenAI, Google Gemini, Qwen, Anthropic Claude)
 * NO están configurados ni funcionan en este proyecto.
 * Para agregar un nuevo proveedor habría que:
 * 1. Agregar su API KEY en las variables de entorno de Vercel
 * 2. Modificar este archivo para hacer fetch a su API
 * 3. Configurar el endpoint /api/generate-report para ese modelo
 *
 * Estado actual: solo DeepSeek es funcional.
 */

export async function generatePremiumReportContent(userData, twinData) {
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
Explica por qué le recomendamos esto específicamente.
Usa listas con viñetas para enumerar y desarrollar cada uno de los 3 hábitos recomendados.

# 4. Plan de Acción Nutricional y Estilo de Vida
Basado en su Índice Integral de Bienestar (IIB), que es de ${iib.score}/100 (Nivel: ${iib.level}).
Habla de sus fortalezas y áreas de mejora.

# 5. Recomendación Premium (Fuxion)
Recomienda 1 o 2 productos Fuxion específicos que resuelvan su mayor problema.
Si su energía es baja, VitaExtra T. Si su digestión es mala, Prunex1 o Flora Liv.
Presenta esto de forma consultiva, no como una venta dura.

# 6. Conclusión y Próximos Pasos
Cierra con un mensaje inspirador. Déjale claro que el bienestar es un viaje de todos los días.

Tono: Profesional, experto, muy humano, empático. No uses lenguaje médico extremadamente complejo. Eres un coach de alto nivel.
`;

  const userPrompt = `
DATOS DEL CLIENTE:
- Nombre: ${userData.name}
- Edad: ${userData.age} años
- Género: ${userData.gender}
- Objetivo: ${userData.goal}
- Actividad Física: ${userData.activityLevel}

BIOMETRÍA Y REQUERIMIENTOS:
- IMC: ${biometrics.bmi} (${biometrics.bmiClass})
- TDEE: ${biometrics.tdee} kcal/día
- Proteína sugerida: ${biometrics.protein} g/día
- Hidratación: ${biometrics.waterL} L/día
- Calidad de Sueño (Score): ${biometrics.sleepScore}/10
- Tránsito Intestinal (Escala Bristol): Evaluación -> ${biometrics.bristolEval}

DOMINIOS (0 a 100):
- Nutrición: ${twinData.twin_state.domains?.nutrition || 0}
- Actividad Física: ${twinData.twin_state.domains?.activity || 0}
- Sueño y Descanso: ${twinData.twin_state.domains?.sleep || 0}
- Salud Mental y Estrés: ${twinData.twin_state.domains?.mental || 0}
- Digestión: ${twinData.twin_state.domains?.digestion || 0}
- Prevención: ${twinData.twin_state.domains?.habits || 0}

RECOMENDACIONES DE MICROHÁBITOS:
${twinData.recommendations.map(r => `- ${r.action}: ${r.why}`).join('\n')}

Redacta el informe ahora.
`;

  try {
    const response = await fetch('/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ systemPrompt, userPrompt })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Error en la generación del reporte';
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) errorMessage = errorData.error;
      } catch (e) {
        errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error('Error generando reporte IA:', err);
    throw err;
  }
}
