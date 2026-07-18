/**
 * Catálogo Oficial de Etiquetas (Tags)
 * Orientado a entidades científicas, nombres de moléculas, bacterias, etc.
 */

export const TAG_CATALOG = [
  { 
    id: 'helicobacter-pylori', 
    slug: 'helicobacter-pylori', 
    name: 'Helicobacter pylori', 
    color: 'bg-indigo-500', 
    description: 'Bacteria que infecta el epitelio gástrico humano, responsable de la mayoría de las úlceras pépticas y factor de riesgo para el cáncer gástrico.' 
  },
  { 
    id: 'zonulina', 
    slug: 'zonulina', 
    name: 'Zonulina', 
    color: 'bg-purple-500', 
    description: 'Proteína que modula la permeabilidad de las uniones estrechas (tight junctions) entre las células de la pared del tracto digestivo.' 
  },
  { 
    id: 'butirato', 
    slug: 'butirato', 
    name: 'Butirato', 
    color: 'bg-amber-600', 
    description: 'Ácido graso de cadena corta producido por la fermentación bacteriana de la fibra dietética. Es la principal fuente de energía para los colonocitos y tiene fuertes efectos antiinflamatorios.' 
  },
  { 
    id: 'sibo', 
    slug: 'sibo', 
    name: 'SIBO', 
    color: 'bg-red-500', 
    description: 'Sobrecrecimiento Bacteriano en el Intestino Delgado (Small Intestinal Bacterial Overgrowth), causante de malabsorción y fermentación excesiva de carbohidratos.' 
  },
  { 
    id: 'permeabilidad-intestinal', 
    slug: 'permeabilidad-intestinal', 
    name: 'Permeabilidad Intestinal', 
    color: 'bg-orange-500', 
    description: 'Condición en la cual el revestimiento del intestino delgado se daña, permitiendo que toxinas y bacterias pasen al torrente sanguíneo (Leaky Gut).' 
  },
  { 
    id: 'disbiosis', 
    slug: 'disbiosis', 
    name: 'Disbiosis', 
    color: 'bg-teal-600', 
    description: 'Desequilibrio en la comunidad microbiana (microbiota) normal de nuestro cuerpo, frecuentemente asociado a patologías inflamatorias.' 
  },
  { 
    id: 'resistencia-insulina', 
    slug: 'resistencia-insulina', 
    name: 'Resistencia a la Insulina', 
    color: 'bg-rose-500', 
    description: 'Condición metabólica donde las células no responden adecuadamente a la insulina, impidiendo el ingreso de glucosa celular y elevando los niveles en sangre.' 
  }
];

/**
 * Normaliza el nombre de una etiqueta
 */
const normalizeTagName = (name) => {
  const normalized = name.trim();
  const match = TAG_CATALOG.find(t => t.name.toLowerCase() === normalized.toLowerCase());
  return match ? match.name : null;
};

/**
 * Parsea un string de etiquetas separadas por coma hacia un Array estricto.
 */
export const parseTags = (tagString) => {
  if (!tagString || typeof tagString !== 'string') return [];
  
  const rawList = tagString.split(',').map(t => t.trim()).filter(Boolean);
  
  const validTags = rawList
    .map(normalizeTagName)
    .filter(Boolean);
    
  return [...new Set(validTags)];
};

/**
 * Convierte un Array de etiquetas a un string separado por comas.
 */
export const formatTags = (tagArray) => {
  if (!Array.isArray(tagArray)) return '';
  return tagArray.filter(Boolean).join(',');
};

/**
 * Obtiene el objeto de color/badge para una etiqueta dada
 */
export const getTagData = (tagName) => {
  return TAG_CATALOG.find(t => t.name === tagName) || null;
};

/**
 * Obtiene los datos de una etiqueta por su slug
 */
export const getTagBySlug = (slug) => {
  return TAG_CATALOG.find(t => t.slug === slug);
};
