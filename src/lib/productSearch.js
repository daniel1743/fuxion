const normalizeText = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const intentRules = [
  {
    keywords: ['higado', 'higado graso', 'limpieza de higado', 'resaca', 'desintoxicacion hepatica', 'toxinas higado'],
    products: ['REXET', 'THERMO T3', 'ALPHA BALANCE']
  },
  {
    keywords: ['colon', 'estrenimiento', 'estreñimiento', 'transito intestinal', 'abdomen hinchado', 'hinchazon', 'fibra', 'digestivo'],
    products: ['PRUNEX 1', 'LIQUID FIBER', 'FLORA LIV']
  },
  {
    keywords: ['bajar de peso', 'control de peso', 'adelgazar', 'grasa', 'metabolismo', 'ansiedad por comer', 'carbohidratos', 'azucar'],
    products: ['THERMO T3', 'NOCARB-T', 'PROTEIN ACTIVE FIT', 'PACK 5/14']
  },
  {
    keywords: ['defensas', 'inmunidad', 'gripe', 'resfrio', 'respiratorio', 'sistema inmune'],
    products: ['VERA+', 'GANO+ CAPPUCCINO']
  },
  {
    keywords: ['energia', 'cansancio', 'fatiga', 'rendimiento', 'vitalidad', 'animo'],
    products: ['VITA XTRA T+', 'VITAENERGÍA', 'NUTRADAY', 'ON']
  },
  {
    keywords: ['estres', 'ansiedad', 'sueño', 'dormir', 'nervios', 'relajacion', 'concentracion', 'memoria'],
    products: ['NO STRESS', 'ON']
  },
  {
    keywords: ['piel', 'colageno', 'arrugas', 'cabello', 'uñas', 'belleza', 'anti edad', 'rejuvenecer'],
    products: ['BEAUTY-IN', 'YOUTH ELIXIR', 'GOLDEN FLX']
  },
  {
    keywords: ['articulaciones', 'dolor articular', 'inflamacion', 'movilidad', 'rodillas'],
    products: ['GOLDEN FLX']
  },
  {
    keywords: ['vias urinarias', 'urinario', 'retencion de liquidos', 'riñon', 'rinon', 'calculos'],
    products: ['BERRY BALANCE']
  },
  {
    keywords: ['hormonas', 'menopausia', 'periodo', 'mujer', 'balance hormonal'],
    products: ['PROBAL']
  },
  {
    keywords: ['deporte', 'entrenar', 'pre entreno', 'post entreno', 'recuperacion muscular', 'hidratacion deportiva'],
    products: ['PRE SPORT PRO EDITION', 'POST SPORT PRO EDITION', 'PROTEIN ACTIVE FIT']
  }
];

const searchableText = (product) => normalizeText([
  product.name,
  product.categoria,
  product.description,
  ...(product.beneficios || []),
  ...(product.ingredientes || []),
  ...(product.specs || []).map((spec) => `${spec.label} ${spec.value}`)
].join(' '));

const scoreProduct = (product, query) => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return 0;

  const text = searchableText(product);
  const terms = normalizedQuery.split(' ').filter((term) => term.length > 2);
  let score = 0;

  if (normalizeText(product.name).includes(normalizedQuery)) score += 80;
  if (text.includes(normalizedQuery)) score += 35;

  terms.forEach((term) => {
    if (normalizeText(product.name).includes(term)) score += 16;
    if (text.includes(term)) score += 7;
  });

  intentRules.forEach((rule) => {
    const intentMatched = rule.keywords.some((keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      return normalizedQuery.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedQuery);
    });

    if (intentMatched && rule.products.some((name) => normalizeText(product.name).includes(normalizeText(name)))) {
      score += 90;
    }
  });

  return score;
};

export const searchProductsByNeed = (products, query) =>
  products
    .map((product) => ({ product, score: scoreProduct(product, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);

export const getRelatedProducts = (products, selectedProducts, query = '') => {
  const selectedIds = new Set(selectedProducts.map((product) => product.id));
  const byNeed = searchProductsByNeed(products, query).filter((product) => !selectedIds.has(product.id));

  if (byNeed.length >= 4) {
    return byNeed.slice(0, 4);
  }

  const categories = new Set(selectedProducts.map((product) => product.categoria));
  const byCategory = products.filter((product) => !selectedIds.has(product.id) && categories.has(product.categoria));
  const merged = [...byNeed];

  byCategory.forEach((product) => {
    if (!merged.some((item) => item.id === product.id)) {
      merged.push(product);
    }
  });

  return merged.slice(0, 4);
};
