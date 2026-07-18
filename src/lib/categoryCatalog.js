/**
 * Catálogo Oficial de Categorías del Blog (Strict Mode)
 * Basado en la arquitectura v2 (Topical Authority, AEO, GEO)
 */

export const CATEGORY_CATALOG = [
  { id: 'salud-digestiva', slug: 'salud-digestiva', name: 'Salud Digestiva', color: 'bg-emerald-500', icon: 'Leaf', description: 'Descubre cómo optimizar tu sistema digestivo para mejorar tu salud integral. Artículos científicos sobre el intestino, microbioma y patologías gastrointestinales.' },
  { id: 'microbiota', slug: 'microbiota', name: 'Microbiota', color: 'bg-teal-500', icon: 'Microscope', description: 'Todo sobre la flora intestinal, microorganismos simbióticos, y cómo el microbioma afecta tu sistema inmunológico, metabolismo y cerebro.' },
  { id: 'higado-graso', slug: 'higado-graso', name: 'Hígado Graso', color: 'bg-orange-500', icon: 'Activity', description: 'Información y estrategias basadas en ciencia para revertir y controlar la esteatosis hepática no alcohólica (EHNA) y proteger tu hígado.' },
  { id: 'salud-higado', slug: 'salud-del-higado', name: 'Salud del Hígado', color: 'bg-amber-500', icon: 'Heart', description: 'Cuidado hepático integral: nutrición, desintoxicación natural y prevención de enfermedades del órgano más vital del metabolismo.' },
  { id: 'sistema-inmunitario', slug: 'sistema-inmunitario', name: 'Sistema Inmunitario', color: 'bg-blue-500', icon: 'Shield', description: 'Fortalece tus defensas naturales. Conoce cómo la nutrición, el sueño y la microbiota regulan tu capacidad para combatir patógenos e inflamación.' },
  { id: 'inmunidad', slug: 'inmunidad', name: 'Inmunidad', color: 'bg-indigo-500', icon: 'ShieldCheck', description: 'Recursos sobre inmunología funcional, alergias alimentarias, autoinmunidad y barreras de defensa del cuerpo.' },
  { id: 'diabetes', slug: 'diabetes', name: 'Diabetes', color: 'bg-red-500', icon: 'Activity', description: 'Control de glucemia, resistencia a la insulina y estrategias nutricionales avanzadas para manejar y prevenir la diabetes tipo 2.' },
  { id: 'inflamacion', slug: 'inflamacion', name: 'Inflamación', color: 'bg-rose-500', icon: 'Flame', description: 'La raíz oculta de las enfermedades crónicas. Aprende a modular la inflamación sistémica a través del estilo de vida y la dieta antiinflamatoria.' },
  { id: 'metabolismo', slug: 'metabolismo', name: 'Metabolismo', color: 'bg-fuchsia-500', icon: 'Zap', description: 'Optimiza tu flexibilidad metabólica, producción de energía mitocondrial y equilibrio hormonal para un rendimiento físico óptimo.' },
  { id: 'nutricion', slug: 'nutricion', name: 'Nutrición', color: 'bg-pink-500', icon: 'Apple', description: 'Nutrición clínica y funcional. Macro y micronutrientes, dietas terapéuticas y el impacto de los alimentos en tu fisiología celular.' },
  { id: 'perdida-peso', slug: 'perdida-de-peso', name: 'Pérdida de Peso', color: 'bg-green-500', icon: 'TrendingDown', description: 'Enfoques científicos y sostenibles para la recomposición corporal, sin dietas extremas, enfocados en sanar el metabolismo.' },
  { id: 'sobrepeso', slug: 'sobrepeso', name: 'Sobrepeso', color: 'bg-red-400', icon: 'Scale', description: 'Abordaje integral del exceso de peso, analizando factores hormonales, ambientales y genéticos para recuperar la salud.' },
  { id: 'salud-cardiovascular', slug: 'salud-cardiovascular', name: 'Salud Cardiovascular', color: 'bg-red-600', icon: 'HeartPulse', description: 'Prevención de enfermedades cardíacas, modulación del colesterol, triglicéridos y optimización de la presión arterial.' },
  { id: 'salud-hormonal', slug: 'salud-hormonal', name: 'Salud Hormonal', color: 'bg-purple-600', icon: 'Dna', description: 'Equilibrio endocrino, ritmos circadianos, gestión del cortisol, tiroides y el impacto de las hormonas en el bienestar diario.' },
  { id: 'bienestar-mental', slug: 'bienestar-mental', name: 'Bienestar Mental', color: 'bg-sky-500', icon: 'Brain', description: 'El eje intestino-cerebro, neurotransmisores, gestión del estrés, ansiedad y cómo la fisiología impacta tu estado de ánimo.' },
  { id: 'bienestar', slug: 'bienestar', name: 'Bienestar', color: 'bg-purple-500', icon: 'Smile', description: 'Hábitos de vida saludables, longevidad, sueño reparador y prácticas para alcanzar un estado de homeostasis física y mental.' },
  { id: 'motivacion', slug: 'motivacion', name: 'Motivación', color: 'bg-yellow-500', icon: 'Sun', description: 'Estrategias psicológicas para adherencia de hábitos, cambio de mentalidad y consistencia en tu viaje hacia la salud.' },
];

/**
 * Normaliza y formatea el nombre de una categoría basándose en el catálogo oficial
 */
const normalizeCategoryName = (name) => {
  const normalized = name.trim();
  // Busca una coincidencia insensible a mayúsculas
  const match = CATEGORY_CATALOG.find(c => c.name.toLowerCase() === normalized.toLowerCase());
  return match ? match.name : null;
};

/**
 * Parsea un string de categorías separadas por coma hacia un Array estricto.
 * @param {string} categoryString - Ej: "Hígado Graso, Nutrición"
 * @returns {string[]} Ej: ["Hígado Graso", "Nutrición"]
 */
export const parseCategories = (categoryString) => {
  if (!categoryString || typeof categoryString !== 'string') return [];
  
  // Dividir, limpiar espacios, filtrar vacíos
  const rawList = categoryString.split(',').map(c => c.trim()).filter(Boolean);
  
  // Normalizar y filtrar categorías que NO estén en el catálogo
  const validCategories = rawList
    .map(normalizeCategoryName)
    .filter(Boolean);
    
  // Eliminar duplicados
  return [...new Set(validCategories)];
};

/**
 * Convierte un Array de categorías de vuelta a un string separado por comas
 * ideal para guardar en DB.
 * @param {string[]} categoryArray 
 * @returns {string}
 */
export const formatCategories = (categoryArray) => {
  if (!Array.isArray(categoryArray)) return '';
  return categoryArray.filter(Boolean).join(',');
};

/**
 * Obtiene la categoría principal (índice 0)
 */
export const getPrimaryCategory = (categoryString) => {
  const parsed = parseCategories(categoryString);
  return parsed.length > 0 ? parsed[0] : null;
};

/**
 * Obtiene el objeto de color/badge para una categoría dada
 */
export const getCategoryData = (categoryName) => {
  return CATEGORY_CATALOG.find(c => c.name === categoryName) || CATEGORY_CATALOG[0];
};

/**
 * Obtiene los datos de una categoría por su slug
 */
export const getCategoryBySlug = (slug) => {
  return CATEGORY_CATALOG.find(c => c.slug === slug);
};
