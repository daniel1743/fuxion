// src/lib/searchEngine.js

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

/**
 * Encuentra coincidencias de `query` en una lista de `items`.
 */
export const smartSearch = (query, items, searchKeys = ['name'], maxResults = 6) => {
  if (!query || query.length === 0) return [];

  const normalizedQuery = normalizeText(query);
  
  if (normalizedQuery.length === 0) return [];

  const results = [];

  for (const item of items) {
    let bestScore = 999;
    let matchType = 'none';

    for (const key of searchKeys) {
      const value = item[key];
      if (!value) continue;

      const normalizedValue = normalizeText(value);

      // 1. Exact Match
      if (normalizedValue === normalizedQuery) {
        bestScore = Math.min(bestScore, 0);
        matchType = 'exact';
      }
      // 2. Starts With
      else if (normalizedValue.startsWith(normalizedQuery)) {
        bestScore = Math.min(bestScore, 1);
        matchType = matchType === 'exact' ? matchType : 'startsWith';
      }
      // 3. Word Starts With
      else if (normalizedValue.includes(` ${normalizedQuery}`)) {
        bestScore = Math.min(bestScore, 2);
        matchType = ['exact', 'startsWith'].includes(matchType) ? matchType : 'wordStartsWith';
      }
      // 4. Contains
      else if (normalizedValue.includes(normalizedQuery)) {
        bestScore = Math.min(bestScore, 3);
        matchType = ['exact', 'startsWith', 'wordStartsWith'].includes(matchType) ? matchType : 'contains';
      }
      // 5. Fuzzy Match
      else if (normalizedQuery.length >= 3) {
        const words = normalizedValue.split(' ');
        for (const word of words) {
          if (Math.abs(word.length - normalizedQuery.length) <= 2) {
            const dist = levenshteinDistance(word, normalizedQuery);
            if (dist <= 1 && normalizedQuery.length <= 4) {
              bestScore = Math.min(bestScore, 4 + dist);
              matchType = matchType === 'none' ? 'fuzzy' : matchType;
            } else if (dist <= 2 && normalizedQuery.length > 4) {
              bestScore = Math.min(bestScore, 4 + dist);
              matchType = matchType === 'none' ? 'fuzzy' : matchType;
            }
          }
        }
      }
    }

    if (bestScore < 999) {
      results.push({ item, score: bestScore, matchType });
    }
  }

  return results
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      const nameA = normalizeText(a.item[searchKeys[0]]);
      const nameB = normalizeText(b.item[searchKeys[0]]);
      return nameA.localeCompare(nameB);
    })
    .slice(0, maxResults)
    .map(res => res.item);
};
