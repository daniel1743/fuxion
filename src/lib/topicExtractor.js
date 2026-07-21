/**
 * Topic Extractor — Extrae temas de un artículo desde su contenido.
 * Escanea el texto buscando keywords mapeadas a categorías oficiales.
 * Permite que un artículo muestre múltiples badges (ej: "Azúcar, Peso, Ejercicio" → Diabetes, Pérdida de Peso, Metabolismo).
 */

import { getCategoryData, parseCategories } from './categoryCatalog';

/**
 * Mapa de keywords → categoría oficial.
 * Se usan frases largas para evitar falsos positivos.
 */
const TOPIC_KEYWORD_MAP = [
  { name: 'Diabetes', keywords: ['resistencia a la insulina', 'resistencia insulínica', 'glucemia', 'hiperglucemia', 'hipoglucemia', 'hemoglobina glicosilada', 'hba1c', 'índice glucémico', 'carga glucémica', 'diabetes tipo 2', 'diabetes mellitus', 'cetoacidosis', 'glucosa en sangre', 'control glucémico'] },
  { name: 'Pérdida de Peso', keywords: ['pérdida de peso', 'perdida de peso', 'adelgazamiento', 'reducción de peso', 'reduccion de peso', 'recomposición corporal', 'recomposicion corporal', 'reducción de grasa', 'reduccion de grasa', 'déficit calórico', 'déficit calorico', 'ayuno intermitente', 'ayuno intermittent', 'intermittent fasting', 'cetosis', 'dieta cetogénica', 'dieta keto', 'ayuno'] },
  { name: 'Sobrepeso', keywords: ['sobrepeso', 'obesidad', 'índice de masa corporal', 'indice de masa corporal', 'imc', 'adiposidad', 'tejido adiposo visceral', 'tejido adiposo subcutaneo', 'masa grasa', 'obesidad visceral'] },
  { name: 'Metabolismo', keywords: ['metabolismo basal', 'tasa metabólica', 'tasa metabolica', 'tmb', 'flexibilidad metabólica', 'flexibilidad metabolica', 'termogénesis', 'termogenesis', 'ciclo de krebs', 'mitocondria', 'mitocondrias', 'atp', 'producción de energía', 'produccion de energia', 'basal metabolic rate', 'neat'] },
  { name: 'Nutrición', keywords: ['micronutrientes', 'macronutrientes', 'vitamina b12', 'vitamina d3', 'vitamina d', 'vitamina c', 'vitamina a', 'magnesio', 'zinc', 'hierro', 'calcio', 'omega-3', 'omega 3', 'ácido fólico', 'acido folico', 'proteínas', 'proteinas', 'aminoácidos', 'aminoacidos', 'fibra dietética', 'fibra dietetica', 'bioavailability', 'biodisponibilidad', 'nutrición clínica', 'nutricion clinica', 'nutrición funcional', 'nutricion funcional', 'vitaminas'] },
  { name: 'Salud Cardiovascular', keywords: ['colesterol ldl', 'colesterol hdl', 'triglicéridos', 'trigliceridos', 'colesterol', 'presión arterial', 'presion arterial', 'hipertensión', 'hipertension', 'cardiovascular', 'corazón', 'corazon', 'arterias', 'placa de ateroma', 'fibrilación auricular', 'fibrilacion auricular', 'ictus', 'accidente cerebrovascular', 'trombosis', 'embolia', 'lípidos', 'lipidos', 'lipoproteínas', 'lipoproteinas', 'apob', 'apoa1', 'apob/apoa1', 'vo2 max', 'vo2max', 'cardiaco', 'taquicardia', 'bradicardia'] },
  { name: 'Inflamación', keywords: ['inflamación', 'inflamacion', 'proinflamatorio', 'antiinflamatorio', 'citocinas', 'tnf-alfa', 'tnf-a', 'il-6', 'il-1', 'il-10', 'hs-crp', 'c-reactiva', 'crp', 'inflamación crónica', 'inflamacion cronica', 'inflamación sistémica', 'inflamacion sistemica', 'inflamasoma', 'nf-kb', 'inflamacion de bajo grado'] },
  { name: 'Salud Hormonal', keywords: ['hormona', 'hormonas', 'testosterona', 'estrógeno', 'estrogeno', 'progesterona', 'progesterone', 'cortisol', 'adrenalina', 'melatonina', 'tsh', 'ft3', 'ft4', 'tiroides', 'menopausia', 'perimenopausia', 'andropausia', 'pubertad', 'sindrome ovario poliquistico', 'pcos', 'hirsutismo', 'amenorrea', 'dismenorrea', 'ciclo menstrual', 'fertilidad', 'infertilidad', 'ovulación', 'ovulacion', 'hormonas sexuales', 'hormona del crecimiento', 'somatomedina', 'gh', 'igf-1', 'insulina-like growth factor', 'eje hpa', 'eje hipotalamo hipofisis adrenal'] },
  { name: 'Bienestar Mental', keywords: ['ansiedad', 'depresión', 'depresion', 'neurotransmisor', 'neurotransmisores', 'dopamina', 'serotonina', 'gaba', 'glutamato', 'noradrenalina', 'oxitocina', 'endorfina', 'neuroplasticidad', 'neurogénesis', 'neurogenesis', 'hipocampo', 'amígdala', 'amigdala', 'corteza prefrontal', 'cognitivo', 'cognitivos', 'función cognitiva', 'funcion cognitiva', 'memoria', 'atención', 'atencion', 'concentración', 'concentracion', 'niebla mental', 'brain fog', 'estrés', 'stress', 'burnout', 'fatiga', 'fatiga crónica', 'fatiga cronica', 'esfuerzo mental', 'rumiación', 'rumiacion', 'rumination', 'ansiedad generalizada', 'trastorno de ansiedad', 'toc', 'tdah', 'trastorno bipolar', 'trastorno límite de personalidad', 'trastorno limite personalidad', 'psicosis', 'esquizofrenia', 'anorexia', 'bulimia', 'trastorno obsesivo compulsivo'] },
  { name: 'Sueño y Descanso', keywords: ['sueño', 'sueno', 'insomnio', 'insomnia', 'apnea', 'apnea obstructiva del sueño', 'apnea del sueño', 'ritmos circadianos', 'arquitectura del sueño', 'sueño profundo', 'sueño rem', 'sueno rem', 'sueño reparador', 'fase rem', 'fases del sueño', 'fases del sueno', 'melatonina', 'hipnótico', 'hipnotico', 'trastorno del sueño'] },
  { name: 'Estrés y Ansiedad', keywords: ['estrés', 'estres', 'ansiedad', 'ansiedade', 'cortisol', 'eje hpa', 'eje hipotalamo hipofisis adrenal', 'respiración diafragmática', 'respiracion diafragmatica', 'tono vagal', 'variabilidad cardiaca', 'variabilidad cardíaca', 'respuesta de lucha o huida', 'respuesta simpática', 'respuesta simpatica', 'medula adrenal'] },
  { name: 'Motivación', keywords: ['motivación', 'motivacion', 'motivación intrínseca', 'motivacion intrinseca', 'motivación extrínseca', 'motivacion extrinseca', 'perseverancia', 'disciplina', 'hábito', 'habito', 'adherencia', 'cambio de comportamiento', 'autoeficacia'] },
  { name: 'Salud Digestiva', keywords: ['estómago', 'estomago', 'gástrico', 'gastrico', 'gastritis', 'úlcera', 'ulcera', 'úlcera péptica', 'ulcera peptica', 'reflujo', 'reflujo gastroesofágico', 'reflujo gastroesofagico', 'reflujo gastroesofagico', 'reflujo gastroesofagico', 'reflujo gastroesofagico', 'reflujo gastroesofagico', 'reflujo gastroesofagico'] },
  { name: 'Microbiota', keywords: ['microbiota', 'microbioma', 'flora intestinal', 'disbiosis', 'bacterias beneficiosas', 'bacterias malas', 'probióticos', 'probioticos', 'prebióticos', 'prebioticos', 'postbióticos', 'postbioticos', 'butirato', 'acido butirico', 'fermentación', 'fermentacion', 'colon', 'colonocitos', 'capa de moco', 'moco intestinal', 'eje intestino-cerebro', 'eje intestino-cerebro', 'eje intestino-cerebro', 'eje intestino-cerebro', 'eje intestino-cerebro'] },
  { name: 'Hígado Graso', keywords: ['hígado graso', 'higado graso', 'hígado graso', 'higado graso', 'hígado graso', 'higado graso', 'hígado graso', 'higado graso'] },
  { name: 'Salud del Hígado', keywords: ['hígado', 'higado', 'desintoxicación', 'desintoxicacion', 'detox', 'detox', 'detox', 'detox', 'detox', 'detox'] },
  { name: 'Hidratación', keywords: ['hidratación', 'hidratacion', 'electrolitos', 'electrolitos', 'agua', 'agua', 'agua', 'agua', 'agua', 'agua'] },
  { name: 'Sistema Inmunitario', keywords: ['sistema inmunitario', 'sistema inmunologico', 'sistema inmune', 'sistema inmune', 'sistema inmunologico', 'sistema inmunitario', 'sistema inmunitario', 'sistema inmunitario'] },
];

/**
 * Extrae temas de un artículo a partir de su contenido.
 * @param {string} content - Contenido del artículo (markdown)
 * @param {string} [existingCategory] - Categoría(s) ya asignada(s) para no duplicar
 * @returns {{ name: string, color: string }[]} Lista de temas detectados
 */
export function extractTopics(content, existingCategory = '') {
  if (!content || typeof content !== 'string') return [];

  const lowerContent = content.toLowerCase();

  // Parsear categorías existentes para evitar duplicados
  const existingCats = new Set(
    parseCategories(existingCategory).map(c => c.toLowerCase())
  );

  // Contar cuántas veces aparece cada tema
  const scores = [];
  TOPIC_KEYWORD_MAP.forEach(topic => {
    let matchCount = 0;
    topic.keywords.forEach(keyword => {
      const regex = new RegExp(keyword.toLowerCase(), 'gi');
      let m;
      while ((m = regex.exec(lowerContent)) !== null) {
        matchCount++;
      }
    });
    if (matchCount > 0) {
      scores.push({ name: topic.name, score: matchCount });
    }
  });

  // Ordenar por relevancia y tomar los top 4
  scores.sort((a, b) => b.score - a.score);
  const topTopics = scores.slice(0, 4).map(t => t.name);

  // Mapear a objetos con color
  return topTopics
    .filter(name => !existingCats.has(name.toLowerCase()))
    .map(name => ({
      name,
      color: getCategoryData(name).color,
    }));
}

/**
 * Versión simplificada: solo nombres de temas.
 */
export function extractTopicNames(content, existingCategory = '') {
  return extractTopics(content, existingCategory).map(t => t.name);
}
