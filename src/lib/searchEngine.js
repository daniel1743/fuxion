import Fuse from 'fuse.js';

/**

/**
 * Normaliza un texto para búsqueda (minúsculas, sin acentos, sin espacios extra).
 */
export const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD') // Separa caracteres de sus acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .toLowerCase()
    .replace(/\s+/g, ' ') // Quita espacios extra
    .trim();
};

/**
 * Calcula una distancia Levenshtein simple para fuzzy matching.
 */
const levenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[b.length][a.length];
};

export const smartSearch = (query, items, searchKeys = ['name'], maxResults = 6) => {
  if (!query || query.length === 0) return [];
  
  const options = {
    keys: searchKeys,
    includeMatches: true,
    threshold: 0.4, // Grado de tolerancia para fuzzy matching
    minMatchCharLength: 2,
    shouldSort: true,
    ignoreLocation: true,
  };

  const fuse = new Fuse(items, options);
  const results = fuse.search(query);

  // Mapeamos los resultados de Fuse para devolver la misma estructura o similar
  // Fuse devuelve: { item, matches: [{ indices, value, key }] }
  // Nosotros devolvemos el item pero podemos añadir los 'matches' para resaltado
  return results.slice(0, maxResults).map(res => ({
    ...res.item,
    _matches: res.matches // Inyectamos matches para resaltado en SmartSearchAutocomplete
  }));
};
