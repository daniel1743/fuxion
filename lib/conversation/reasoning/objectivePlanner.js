/**
 * Objective Planner
 *
 * Construye un plan de bienestar personalizado basado en los
 * objetivos, síntomas y productos del usuario.
 *
 * Prioriza objetivos, relaciona productos y genera un plan
 * de acción ordenado.
 */

import {
  getComplementaryProducts,
  getAlternativeProducts,
  getProductPhase,
  generateUsagePlan,
  getProductCategory
} from './productRelationshipEngine.js';

// ===================================================================
// MAPA DE OBJETIVOS A CATEGORÍAS DE PRODUCTOS
// ===================================================================
const OBJECTIVE_CATEGORY_MAP = {
  'mejorar salud digestiva': {
    categories: ['Limpieza del Colon', 'Limpieza del Sistema Digestivo', 'Regeneración Flora Intestinal'],
    priority: 9,
    explanation: 'La salud intestinal es la base del bienestar general'
  },
  'apoyar salud hepática': {
    categories: ['Desintoxicación Hepática', 'Balance Metabólico'],
    priority: 8,
    explanation: 'El hígado es clave para la desintoxicación del cuerpo'
  },
  'control de peso': {
    categories: ['Control de Peso', 'Sport'],
    priority: 7,
    explanation: 'El control de peso requiere un enfoque integral'
  },
  'mejorar descanso': {
    categories: ['Vigor Mental', 'Bienestar Hormonal'],
    priority: 6,
    explanation: 'Un buen descanso es fundamental para la salud'
  },
  'manejo del estrés': {
    categories: ['Vigor Mental'],
    priority: 6,
    explanation: 'El estrés afecta todos los aspectos de la salud'
  },
  'aumentar energía': {
    categories: ['Energía'],
    priority: 5,
    explanation: 'La energía es necesaria para las actividades diarias'
  },
  'mejorar concentración': {
    categories: ['Vigor Mental'],
    priority: 5,
    explanation: 'La concentración mejora con la nutrición adecuada'
  },
  'fortalecer defensas': {
    categories: ['Defensas'],
    priority: 7,
    explanation: 'Un sistema inmune fuerte protege la salud'
  },
  'cuidado de la piel': {
    categories: ['Belleza'],
    priority: 4,
    explanation: 'La piel refleja la salud interna'
  },
  'mejorar digestión': {
    categories: ['Limpieza del Sistema Digestivo', 'Regeneración Flora Intestinal'],
    priority: 9,
    explanation: 'Una buena digestión es clave para absorber nutrientes'
  },
  'cuidado articular': {
    categories: ['Cuidado Articular'],
    priority: 5,
    explanation: 'Las articulaciones necesitan nutrientes específicos'
  },
  'salud urinaria': {
    categories: ['Salud Urinaria'],
    priority: 6,
    explanation: 'La salud urinaria es importante para el bienestar'
  }
};

// ===================================================================
// FUNCIONES DEL PLANIFICADOR
// ===================================================================

/**
 * Prioriza los objetivos del usuario según su importancia
 */
export const prioritizeObjectives = (objectives = []) => {
  if (!objectives.length) return [];

  return objectives
    .map(obj => {
      const mapping = OBJECTIVE_CATEGORY_MAP[obj.objective] || {};
      return {
        ...obj,
        priority: mapping.priority || 5,
        categories: mapping.categories || [],
        explanation: mapping.explanation || ''
      };
    })
    .sort((a, b) => b.priority - a.priority);
};

/**
 * Genera un plan de bienestar personalizado
 */
export const generateWellnessPlan = (profile) => {
  if (!profile) return null;

  const prioritizedObjectives = prioritizeObjectives(profile.objectives);
  if (!prioritizedObjectives.length) return null;

  const plan = {
    objectives: prioritizedObjectives.map(o => ({
      objective: o.objective,
      priority: o.priority,
      explanation: o.explanation
    })),
    recommendedProducts: [],
    complementaryProducts: [],
    usagePlan: [],
    pendingQuestions: []
  };

  // Recolectar productos recomendados de todos los objetivos
  const allRecommended = new Set();

  // Usar productos del perfil
  (profile.productsRecommended || []).forEach(p => allRecommended.add(p));
  (profile.productsViewed || []).forEach(p => allRecommended.add(p));

  plan.recommendedProducts = [...allRecommended];

  // Generar plan de uso ordenado
  plan.usagePlan = generateUsagePlan(plan.recommendedProducts);

  // Productos complementarios que NO están en la lista
  const allComplements = new Set();
  plan.recommendedProducts.forEach(p => {
    getComplementaryProducts(p).forEach(c => {
      if (!plan.recommendedProducts.includes(c)) {
        allComplements.add(c);
      }
    });
  });
  plan.complementaryProducts = [...allComplements];

  // Preguntas pendientes
  if (profile.objectives.length > 0 && profile.messageCount <= 3) {
    plan.pendingQuestions.push('Preguntar si el usuario quiere profundizar en sus objetivos.');
  }

  // Si hay productos recomendados pero no se ha explicado el uso
  const pendingExplain = plan.recommendedProducts.filter(p => {
    const explained = profile.explainedTopics[p] || [];
    return !explained.includes('uso') && !explained.includes('preparacion');
  });
  if (pendingExplain.length > 0) {
    plan.pendingQuestions.push(`Explicar uso practico de: ${pendingExplain.join(', ')}.`);
  }

  return plan;
};

/**
 * Genera un resumen del plan para inyectar en el prompt
 */
export const generatePlanSummary = (profile) => {
  const plan = generateWellnessPlan(profile);
  if (!plan) return '';

  const lines = [];

  // Objetivos priorizados
  if (plan.objectives.length > 0) {
    lines.push('PLAN DE BIENESTAR:');
    plan.objectives.forEach((obj, i) => {
      lines.push(`${i + 1}. ${obj.objective} (prioridad: ${obj.priority}/10)`);
    });
  }

  // Productos recomendados
  if (plan.recommendedProducts.length > 0) {
    lines.push(`Productos recomendados: ${plan.recommendedProducts.join(', ')}`);
  }

  // Orden de uso
  if (plan.usagePlan.length > 1) {
    const order = plan.usagePlan.map((p, i) => `${i + 1}. ${p.name}`).join(' → ');
    lines.push(`Orden sugerido: ${order}`);
  }

  // Complementos
  if (plan.complementaryProducts.length > 0) {
    lines.push(`Complementos sugeridos: ${plan.complementaryProducts.join(', ')}`);
  }

  // Preguntas pendientes
  if (plan.pendingQuestions.length > 0) {
    lines.push('Pendiente:');
    plan.pendingQuestions.forEach(q => lines.push(`- ${q}`));
  }

  return lines.join('\n');
};

/**
 * Detecta si hay objetivos relacionados que se pueden agrupar
 */
export const detectRelatedObjectives = (objectives = []) => {
  if (!objectives.length) return [];

  const groups = [];
  const digestiveObjectives = ['mejorar salud digestiva', 'mejorar digestión', 'apoyar salud hepática'];
  const weightObjectives = ['control de peso', 'aumentar energía'];
  const mentalObjectives = ['mejorar concentración', 'manejo del estrés', 'mejorar descanso'];

  const hasDigestive = objectives.some(o => digestiveObjectives.includes(o.objective));
  const hasWeight = objectives.some(o => weightObjectives.includes(o.objective));
  const hasMental = objectives.some(o => mentalObjectives.includes(o.objective));

  if (hasDigestive) {
    groups.push({
      name: 'Salud Digestiva Integral',
      objectives: objectives.filter(o => digestiveObjectives.includes(o.objective)),
      recommendation: 'Comenzar con limpieza (Prunex 1 o Liquid Fiber), luego regenerar flora (Flora Liv)'
    });
  }

  if (hasWeight) {
    groups.push({
      name: 'Control de Peso',
      objectives: objectives.filter(o => weightObjectives.includes(o.objective)),
      recommendation: 'Combinar termogénico (Thermo T3) con bloqueador de carbohidratos (Nocarb-T)'
    });
  }

  if (hasMental) {
    groups.push({
      name: 'Bienestar Mental',
      objectives: objectives.filter(o => mentalObjectives.includes(o.objective)),
      recommendation: 'Alternar entre ON (enfoque) y NO STRESS (relajación) según necesidad'
    });
  }

  return groups;
};

export default {
  prioritizeObjectives,
  generateWellnessPlan,
  generatePlanSummary,
  detectRelatedObjectives
};
