import fuxionDatabase from '@/data/fuxion_database.json';
import { getProductImageUrl } from '@/lib/imageUtils';

export const SITE_URL = 'https://tiendafuxion.space';
export const STORE_NAME = 'Tienda Fuxion Chile';

export const PRIORITY_PRODUCT_SEO = {
  'thermo-t3': {
    seoTitle: 'THERMO T3 Fuxion Chile | Precio, cómo tomarlo y apoyo para entrenar',
    metaDescription: 'THERMO T3 Fuxion en Chile: apoyo para rutinas de control de peso, metabolismo y entrenamiento. Precio, modo de uso y asesoría personalizada por WhatsApp.',
    intro: 'THERMO T3 es una opción Fuxion orientada a personas que entrenan o quieren acompañar una rutina activa de control de peso. Su uso correcto es clave: se toma 30 minutos antes de hacer ejercicio, dentro de un plan con alimentación, hidratación y constancia.',
    seoHeading: 'THERMO T3 Fuxion para control de peso y entrenamiento',
    searchIntent: [
      { title: '¿Para qué sirve THERMO T3?', body: 'Está enfocado en apoyar rutinas activas, metabolismo saludable y energía durante el ejercicio. Es más útil cuando la persona ya está caminando, entrenando o retomando actividad física.' },
      { title: 'Cómo tomar THERMO T3', body: 'La referencia de uso es tomar un sobre 30 minutos antes de hacer ejercicio. No conviene presentarlo como producto de mañana genérico, porque su contexto principal es previo al entrenamiento.' },
      { title: 'Comprar THERMO T3 en Chile', body: 'Puedes pedirlo con asesoría para revisar si calza con tu objetivo, tu horario de entrenamiento y tu tolerancia a productos con cafeína.' }
    ],
    faqs: [
      { question: '¿THERMO T3 se toma en la mañana?', answer: 'La indicación práctica es tomarlo 30 minutos antes de hacer ejercicio. Si entrenas en la mañana, ese puede ser tu horario; si entrenas en otro momento, se ajusta a tu rutina.' },
      { question: '¿THERMO T3 sirve para bajar de peso?', answer: 'Puede acompañar una rutina de control de peso cuando existe actividad física, alimentación ordenada e hidratación. No reemplaza un plan nutricional ni una evaluación profesional.' },
      { question: '¿THERMO T3 tiene cafeína?', answer: 'Sí, pertenece a la línea de control de peso y contiene componentes estimulantes. Si eres sensible a la cafeína, estás embarazada, en lactancia o tienes una condición médica, consulta antes.' }
    ],
    relatedSlugs: ['nocarb-t', 'protein-active-fit', 'pre-sport-pro-edition']
  },
  'nocarb-t': {
    seoTitle: 'NOCARB-T Fuxion Chile | Precio, beneficios y cómo tomarlo',
    metaDescription: 'NOCARB-T Fuxion en Chile: apoyo para hábitos de control de peso y comidas con carbohidratos. Revisa precio, beneficios, modo de uso y asesoría.',
    intro: 'NOCARB-T está pensado para personas que quieren ordenar su alimentación y acompañar comidas donde suelen aparecer carbohidratos. Su valor está en integrarlo con hábitos reales, no en usarlo como permiso para comer sin control.',
    seoHeading: 'NOCARB-T Fuxion para acompañar el control de carbohidratos',
    searchIntent: [
      { title: '¿Para qué sirve NOCARB-T?', body: 'Acompaña rutinas de control de peso y hábitos alimentarios, especialmente cuando la persona quiere mejorar su relación con carbohidratos y azúcar.' },
      { title: 'Cuándo conviene usarlo', body: 'Puede ser útil dentro de una estrategia donde también se revise porción, horarios, hidratación y actividad física.' },
      { title: 'Comprar NOCARB-T en Chile', body: 'Antes de pedirlo, conviene revisar tu objetivo: bajar medidas, controlar antojos, ordenar comidas o complementar ejercicio.' }
    ],
    faqs: [
      { question: '¿NOCARB-T reemplaza una dieta?', answer: 'No. Es un apoyo dentro de hábitos de alimentación. La base sigue siendo una pauta equilibrada, actividad física e hidratación.' },
      { question: '¿NOCARB-T es para cualquier persona?', answer: 'No necesariamente. No se recomienda para menores de 8 años, embarazadas o nodrizas sin indicación profesional. Ante condiciones médicas, consulta primero.' },
      { question: '¿Puedo combinar NOCARB-T con THERMO T3?', answer: 'Depende de tu objetivo, horario y tolerancia. THERMO T3 se relaciona más con ejercicio; NOCARB-T con hábitos alimentarios. Lo ideal es recibir asesoría.' }
    ],
    relatedSlugs: ['thermo-t3', 'prunex-1', 'flora-liv']
  },
  'prunex-1': {
    seoTitle: 'PRUNEX 1 Fuxion Chile | Precio, beneficios y tránsito intestinal',
    metaDescription: 'PRUNEX 1 Fuxion en Chile: producto de apoyo digestivo para tránsito intestinal y bienestar abdominal. Precio, ingredientes, cómo tomarlo y asesoría.',
    intro: 'PRUNEX 1 es uno de los productos más buscados de Fuxion para personas que quieren apoyar su bienestar digestivo y tránsito intestinal. La recomendación debe adaptarse a cada caso, especialmente si existe estreñimiento persistente o una condición digestiva diagnosticada.',
    seoHeading: 'PRUNEX 1 Fuxion para bienestar digestivo',
    searchIntent: [
      { title: '¿Para qué sirve PRUNEX 1?', body: 'Se usa como apoyo para tránsito intestinal y sensación de bienestar abdominal, dentro de una rutina con agua, fibra, movimiento y alimentación ordenada.' },
      { title: 'Cómo tomar PRUNEX 1', body: 'Su modo de uso en la ficha del producto indica tomar un sobre en agua caliente. Si tienes molestias frecuentes, es mejor recibir orientación personalizada.' },
      { title: 'Comprar PRUNEX 1 en Chile', body: 'Puedes pedirlo con asesoría para evaluar si corresponde PRUNEX 1 o una alternativa más suave como Liquid Fiber, según tu objetivo digestivo.' }
    ],
    faqs: [
      { question: '¿PRUNEX 1 sirve para estreñimiento?', answer: 'Puede apoyar el tránsito intestinal, pero si el estreñimiento es severo, frecuente o viene con dolor, lo correcto es consultar a un profesional de salud.' },
      { question: '¿PRUNEX 1 se toma con agua caliente?', answer: 'Sí, su modo de uso indica tomar un sobre en agua caliente.' },
      { question: '¿Cuál es la diferencia entre PRUNEX 1 y Liquid Fiber?', answer: 'PRUNEX 1 suele buscarse para apoyo digestivo más marcado; Liquid Fiber puede ser una opción más suave para hábitos de fibra. La elección depende de la persona.' }
    ],
    relatedSlugs: ['liquid-fiber', 'flora-liv', 'rexet']
  },
  'flora-liv': {
    seoTitle: 'FLORA LIV Fuxion Chile | Probióticos, precio y bienestar digestivo',
    metaDescription: 'FLORA LIV Fuxion en Chile: apoyo para flora intestinal, digestión y bienestar gástrico. Revisa precio, ingredientes, beneficios y asesoría.',
    intro: 'FLORA LIV está orientado al equilibrio de la flora intestinal y bienestar digestivo. Es una alternativa relevante cuando la persona busca apoyo gástrico, digestión más cómoda o reconstruir hábitos después de desórdenes alimentarios o uso de antibióticos.',
    seoHeading: 'FLORA LIV Fuxion para flora intestinal y digestión',
    searchIntent: [
      { title: '¿Para qué sirve FLORA LIV?', body: 'Acompaña el equilibrio de la flora intestinal y rutinas de bienestar digestivo. Incluye probióticos y fibra prebiótica.' },
      { title: 'Cuándo considerar FLORA LIV', body: 'Puede interesar a personas con digestión sensible, cambios de alimentación o necesidad de apoyar su microbiota. No reemplaza tratamiento médico.' },
      { title: 'Comprar FLORA LIV en Chile', body: 'La asesoría ayuda a decidir si conviene usar FLORA LIV solo o junto a productos digestivos como PRUNEX 1 o Liquid Fiber.' }
    ],
    faqs: [
      { question: '¿FLORA LIV tiene probióticos?', answer: 'Sí, la ficha del producto indica bacterias probióticas, fibra prebiótica y componentes como granadilla y aguaymanto.' },
      { question: '¿FLORA LIV sirve para gastritis o colon irritable?', answer: 'Puede acompañar el bienestar digestivo, pero esas condiciones requieren diagnóstico y seguimiento profesional. No debe presentarse como tratamiento.' },
      { question: '¿Se puede combinar FLORA LIV con PRUNEX 1?', answer: 'Puede evaluarse según el objetivo digestivo. PRUNEX 1 apunta más al tránsito intestinal; FLORA LIV al equilibrio de flora intestinal.' }
    ],
    relatedSlugs: ['prunex-1', 'liquid-fiber', 'rexet']
  },
  rexet: {
    seoTitle: 'REXET Fuxion Chile | Precio, beneficios y bienestar hepático',
    metaDescription: 'REXET Fuxion en Chile: apoyo para bienestar hepático y sistema hepatobiliar dentro de hábitos saludables. Precio, ingredientes y asesoría.',
    intro: 'REXET se relaciona con bienestar hepático y rutinas de limpieza del sistema hepatobiliar según la línea Fuxion. Para comunicarlo bien, conviene hablar de apoyo y hábitos, no de cura de enfermedades.',
    seoHeading: 'REXET Fuxion para bienestar hepático',
    searchIntent: [
      { title: '¿Para qué sirve REXET?', body: 'Se enfoca en acompañar rutinas de bienestar hepático y cuidado del sistema hepatobiliar, junto con alimentación ordenada, agua y menor carga de ultraprocesados.' },
      { title: 'REXET y hábitos saludables', body: 'Tiene más sentido cuando la persona también quiere ordenar comidas, descanso, actividad física y consumo de agua.' },
      { title: 'Comprar REXET en Chile', body: 'Antes de pedirlo, es útil revisar si buscas apoyo digestivo, hepático, energía o una rutina integral.' }
    ],
    faqs: [
      { question: '¿REXET sirve para hígado graso?', answer: 'REXET puede presentarse como apoyo de bienestar hepático, pero el hígado graso requiere diagnóstico, seguimiento médico y cambios de hábitos. No debe reemplazar indicaciones profesionales.' },
      { question: '¿REXET es un medicamento?', answer: 'No. Es un producto nutracéutico/alimentario de Fuxion y se debe usar como complemento de hábitos saludables.' },
      { question: '¿Con qué producto se puede complementar REXET?', answer: 'Depende del objetivo. Para digestión puede evaluarse FLORA LIV o PRUNEX 1; para energía puede revisarse VITA XTRA T+ o NUTRADAY.' }
    ],
    relatedSlugs: ['flora-liv', 'prunex-1', 'nutraday']
  },
  nutraday: {
    seoTitle: 'NUTRADAY Fuxion Chile | Precio, vitaminas y nutrición diaria',
    metaDescription: 'NUTRADAY Fuxion en Chile: hidratación nutricional con vitaminas, minerales y antioxidantes para la familia. Precio, beneficios y asesoría.',
    intro: 'NUTRADAY es una alternativa de hidratación nutricional para el día a día. Su búsqueda suele venir de personas que quieren mejorar energía, nutrición básica, antioxidantes y hábitos familiares sin partir por productos más específicos.',
    seoHeading: 'NUTRADAY Fuxion para nutrición diaria e hidratación',
    searchIntent: [
      { title: '¿Para qué sirve NUTRADAY?', body: 'Acompaña la nutrición diaria con vitaminas, minerales y antioxidantes, especialmente cuando se quiere una opción simple para incorporar al día.' },
      { title: 'NUTRADAY para la familia', body: 'Está pensado como apoyo nutricional general. La recomendación debe considerar edad, rutina y necesidades de cada persona.' },
      { title: 'Comprar NUTRADAY en Chile', body: 'Puedes pedirlo con asesoría para decidir si necesitas una opción general como NUTRADAY o una alternativa más enfocada en energía o digestión.' }
    ],
    faqs: [
      { question: '¿NUTRADAY es multivitamínico?', answer: 'La ficha indica vitaminas, minerales orgánicos y antioxidantes. Puede apoyar rutinas de nutrición diaria.' },
      { question: '¿NUTRADAY sirve para energía?', answer: 'Puede apoyar bienestar general y nutrición diaria, pero si el objetivo principal es energía, también puede evaluarse VITA XTRA T+.' },
      { question: '¿NUTRADAY reemplaza comidas?', answer: 'No. Es un complemento de hidratación nutricional y no reemplaza una alimentación completa.' }
    ],
    relatedSlugs: ['vita-xtra-t-plus', 'vera-plus', 'flora-liv']
  },
  'vita-xtra-t-plus': {
    seoTitle: 'VITA XTRA T+ Fuxion Chile | Precio, energía natural y beneficios',
    metaDescription: 'VITA XTRA T+ Fuxion en Chile: apoyo de energía natural, antioxidantes y vitalidad diaria. Revisa precio, ingredientes, modo de uso y asesoría.',
    intro: 'VITA XTRA T+ es una opción Fuxion para quienes buscan energía natural y apoyo antioxidante en la rutina diaria. Es diferente a productos deportivos o de control de peso: su foco es vitalidad y bienestar general.',
    seoHeading: 'VITA XTRA T+ Fuxion para energía natural',
    searchIntent: [
      { title: '¿Para qué sirve VITA XTRA T+?', body: 'Acompaña la energía diaria, vitalidad y protección antioxidante dentro de una rutina equilibrada.' },
      { title: 'Cuándo elegir VITA XTRA T+', body: 'Puede ser una opción cuando la persona siente baja energía, quiere mejorar su rutina diaria o busca un producto de apoyo general.' },
      { title: 'Comprar VITA XTRA T+ en Chile', body: 'La asesoría ayuda a definir si conviene VITA XTRA T+, NUTRADAY u otra alternativa según tu objetivo principal.' }
    ],
    faqs: [
      { question: '¿VITA XTRA T+ da energía?', answer: 'Está orientado a energía natural y vitalidad diaria, apoyado por ingredientes como guayusa, té verde, goji berry y ginseng.' },
      { question: '¿VITA XTRA T+ es lo mismo que THERMO T3?', answer: 'No. VITA XTRA T+ se enfoca en energía diaria; THERMO T3 está más asociado a ejercicio y control de peso.' },
      { question: '¿A qué hora tomar VITA XTRA T+?', answer: 'La ficha indica que puede tomarse en cualquier hora del día. Si eres sensible a estimulantes, evita horarios cercanos al sueño.' }
    ],
    relatedSlugs: ['nutraday', 'thermo-t3', 'on']
  }
};

export const PRODUCT_SEMANTIC_SECTIONS = {
  'thermo-t3': {
    semanticTerms: ['termogenesis', 'metabolismo saludable', 'actividad fisica', 'energia para entrenar', 'L-carnitina', 'te verde', 'te rojo', 'te negro', 'control de peso', 'habitos activos'],
    deepSections: [
      { title: 'Ingredientes clave', body: 'Combina tes, L-carnitina, cetonas de frambuesa, aminoacidos, vitamina B6 y cromo. La comunicacion debe enfocarse en apoyo para energia, entrenamiento y habitos activos.' },
      { title: 'Como funciona en una rutina', body: 'Su mejor contexto es antes de entrenar. Puede acompanar caminatas, gimnasio o actividad fisica regular, junto con hidratacion y alimentacion ordenada.' },
      { title: 'Para quien puede servir', body: 'Personas que ya se mueven o quieren retomar ejercicio y buscan una bebida funcional para acompanar energia y control de peso.' },
      { title: 'Para quien no conviene', body: 'Personas sensibles a estimulantes, con embarazo, lactancia, condiciones cardiacas o uso de medicamentos deben pedir orientacion profesional antes de usarlo.' },
      { title: 'Errores comunes', body: 'Presentarlo como producto para tomar por la manana sin ejercicio, prometer baja de peso rapida o usarlo como reemplazo de alimentacion.' }
    ],
    internalLinks: [
      { slug: 'nocarb-t', reason: 'Para acompanar comidas con carbohidratos dentro de una pauta ordenada.' },
      { slug: 'protein-active-fit', reason: 'Para sumar proteina vegetal y saciedad en rutinas de control de peso.' },
      { slug: 'vita-xtra-t-plus', reason: 'Para energia diaria cuando el foco no es solo entrenamiento.' }
    ]
  },
  'nocarb-t': {
    semanticTerms: ['carbohidratos', 'azucar', 'fibra soluble', 'yacon', 'inulina', 'pectina de manzana', 'cromo', 'canela', 'habitos alimentarios', 'control de porciones'],
    deepSections: [
      { title: 'Ingredientes clave', body: 'Incluye fibras solubles como yacon, acacia, inulina y pectina de manzana, ademas de canela, te verde y cromo.' },
      { title: 'Como funciona en una rutina', body: 'Tiene sentido cuando la persona quiere ordenar comidas, porciones y consumo de carbohidratos. No debe comunicarse como permiso para comer sin medida.' },
      { title: 'Para quien puede servir', body: 'Personas que buscan apoyo para habitos de control de peso y comidas donde suelen aparecer pan, arroz, pasta, dulces u otros carbohidratos.' },
      { title: 'Para quien no conviene', body: 'Menores, embarazadas, nodrizas o personas con condiciones metabolicas deben consultar antes de usarlo.' },
      { title: 'Errores comunes', body: 'Prometer bloqueo total de carbohidratos, asociarlo a diabetes como tratamiento o recomendarlo sin revisar alimentacion y objetivos.' }
    ],
    internalLinks: [
      { slug: 'thermo-t3', reason: 'Si tambien existe actividad fisica y se busca apoyo para entrenamiento.' },
      { slug: 'protein-active-fit', reason: 'Si el objetivo incluye saciedad y mejor aporte proteico.' },
      { slug: 'prunex-1', reason: 'Si ademas hay interes por transito intestinal y rutina digestiva.' }
    ]
  },
  'prunex-1': {
    semanticTerms: ['transito intestinal', 'fibra soluble', 'psyllium', 'inulina de achicoria', 'linaza', 'guindon', 'kelp', 'bienestar abdominal', 'digestion lenta', 'rutina digestiva'],
    deepSections: [
      { title: 'Ingredientes clave', body: 'PRUNEX 1 combina fibras solubles como psyllium, inulina de achicoria y mucilago de linaza, junto con guindon y kelp.' },
      { title: 'Como funciona en una rutina', body: 'Se integra mejor con consumo de agua, movimiento diario, horarios ordenados y alimentacion con fibra. Su uso se comunica como apoyo al transito intestinal.' },
      { title: 'Para quien puede servir', body: 'Personas que buscan bienestar digestivo, sensacion de abdomen mas liviano y apoyo para una rutina intestinal mas regular.' },
      { title: 'Para quien no conviene', body: 'Si hay dolor intenso, estrenimiento severo persistente, sangrado, embarazo, lactancia o diagnostico digestivo, corresponde consultar con un profesional.' },
      { title: 'Errores comunes', body: 'Usarlo sin suficiente agua, presentarlo como tratamiento para estrenimiento severo o combinar varios productos digestivos sin asesoria.' }
    ],
    internalLinks: [
      { slug: 'flora-liv', reason: 'Para apoyar equilibrio de microbiota y flora intestinal.' },
      { slug: 'liquid-fiber', reason: 'Como alternativa mas suave enfocada en fibra diaria.' },
      { slug: 'rexet', reason: 'Para revisar una rutina integral de apoyo digestivo y hepatico.' }
    ]
  },
  'flora-liv': {
    semanticTerms: ['microbiota', 'flora intestinal', 'probioticos', 'prebioticos', 'inulina', 'bacterias beneficiosas', 'equilibrio intestinal', 'salud digestiva', 'digestion sensible', 'bienestar gastrico'],
    deepSections: [
      { title: 'Ingredientes clave', body: 'FLORA LIV incorpora cultivos probioticos, fibra prebiotica, inulina de achicoria, granadilla y aguaymanto para apoyar el equilibrio intestinal.' },
      { title: 'Como funciona en una rutina', body: 'Su enfoque es acompanar la microbiota y la flora intestinal. Conviene reforzarlo con alimentacion ordenada, hidratacion y menor exceso de ultraprocesados.' },
      { title: 'Para quien puede servir', body: 'Personas con digestion sensible, cambios de alimentacion, interes en probioticos o necesidad de apoyar bacterias beneficiosas en la rutina diaria.' },
      { title: 'Para quien no conviene', body: 'Si existen diagnosticos como gastritis, colon irritable, infecciones, uso reciente de antibioticos o sintomas persistentes, debe pedirse orientacion profesional.' },
      { title: 'Errores comunes', body: 'Presentarlo como tratamiento de gastritis o colon irritable, prometer resultados inmediatos o confundirlo con un producto principal para bajar de peso.' }
    ],
    internalLinks: [
      { slug: 'prunex-1', reason: 'Si el foco adicional es transito intestinal.' },
      { slug: 'liquid-fiber', reason: 'Si se busca aumentar fibra prebiotica en la rutina.' },
      { slug: 'rexet', reason: 'Si tambien se quiere revisar apoyo hepatico y digestivo.' }
    ]
  },
  rexet: {
    semanticTerms: ['bienestar hepatico', 'sistema hepatobiliar', 'funcion depurativa', 'alcachofa', 'tuna roja', 'taurina', 'cisteina', 'vitaminas del complejo B', 'habitos saludables', 'apoyo digestivo'],
    deepSections: [
      { title: 'Ingredientes clave', body: 'REXET combina tuna roja, alcachofa, hierba luisa, perejil, acerola, minerales, taurina, cisteina y vitaminas del complejo B, C y D.' },
      { title: 'Como funciona en una rutina', body: 'Su comunicacion debe centrarse en apoyo hepatico y sistema hepatobiliar dentro de habitos saludables: agua, comidas ordenadas, descanso y menor carga de ultraprocesados.' },
      { title: 'Para quien puede servir', body: 'Personas que buscan una bebida funcional asociada a bienestar hepatico, digestion y rutinas de cuidado despues de excesos alimentarios ocasionales.' },
      { title: 'Para quien no conviene', body: 'No debe usarse como solucion para higado graso, enfermedad hepatica, consumo problematico de alcohol o sintomas persistentes. En esos casos corresponde atencion profesional.' },
      { title: 'Errores comunes', body: 'Prometer desintoxicacion del higado, eliminar resaca o presentarlo como sustituto de cambios de habitos.' }
    ],
    internalLinks: [
      { slug: 'flora-liv', reason: 'Para complementar con apoyo de flora intestinal.' },
      { slug: 'prunex-1', reason: 'Si tambien se busca apoyo al transito intestinal.' },
      { slug: 'vita-xtra-t-plus', reason: 'Si el objetivo adicional es energia diaria.' }
    ]
  },
  'vita-xtra-t-plus': {
    semanticTerms: ['energia natural', 'vitalidad diaria', 'guayusa', 'te verde', 'ginseng', 'goji berry', 'antioxidantes', 'estado de alerta', 'rendimiento diario', 'fatiga cotidiana'],
    deepSections: [
      { title: 'Ingredientes clave', body: 'VITA XTRA T+ combina guayusa, te verde, goji berry, ginseng, fibra, vitaminas y minerales, con enfoque en energia diaria y antioxidantes.' },
      { title: 'Como funciona en una rutina', body: 'Se comunica como apoyo para vitalidad y rendimiento diario. Es distinto a productos deportivos o de control de peso porque su foco principal es energia cotidiana.' },
      { title: 'Para quien puede servir', body: 'Personas que sienten baja energia, jornadas exigentes o buscan una alternativa funcional para acompanar animo, alerta y rutina activa.' },
      { title: 'Para quien no conviene', body: 'Personas sensibles a estimulantes, con problemas cardiacos, embarazo, lactancia o uso de medicamentos deben pedir orientacion antes de tomarlo.' },
      { title: 'Errores comunes', body: 'Confundirlo con THERMO T3, prometer que reemplaza descanso o recomendarlo tarde en la noche si hay sensibilidad a estimulantes.' }
    ],
    internalLinks: [
      { slug: 'nutraday', reason: 'Para apoyo nutricional diario mas general.' },
      { slug: 'thermo-t3', reason: 'Si el foco es entrenamiento y actividad fisica.' },
      { slug: 'rexet', reason: 'Si se quiere revisar una rutina de energia y apoyo hepatico.' }
    ]
  }
};
export const slugifyProduct = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const normalizeProductForSeo = (productKey, productData) => {
  const name = productData.nombre || productKey;
  const slug = slugifyProduct(name);
  const benefits = productData.beneficios || [];
  const description = benefits.length
    ? benefits.join('. ')
    : `${name} de Fuxion Biotech para nutricion, bienestar y habitos saludables.`;
  const image = getProductImageUrl(name);

  return {
    id: productKey,
    slug,
    name,
    category: productData.categoria,
    line: productData.linea,
    presentation: productData.presentacion,
    price: productData.precio || 0,
    flavor: productData.sabor,
    flavors: productData.sabores || [],
    ingredients: productData.ingredientes || [],
    benefits,
    usage: productData.modo_uso,
    schedule: productData.horario,
    effect: productData.efecto,
    keyword: productData.palabra_clave,
    image,
    imageUrl: image.startsWith('http') ? image : `${SITE_URL}${image}`,
    url: `${SITE_URL}/producto/${slug}`,
    description
  };
};

export const getAllSeoProducts = () =>
  Object.entries(fuxionDatabase.productos || {}).map(([key, product]) =>
    normalizeProductForSeo(key, product)
  );

export const getSeoProductBySlug = (slug) =>
  getAllSeoProducts().find((product) => product.slug === slug);

export const getProductSeoContent = (product) => {
  if (!product) return null;

  const baseContent = PRIORITY_PRODUCT_SEO[product.slug];
  const semanticContent = PRODUCT_SEMANTIC_SECTIONS[product.slug];

  if (!baseContent && !semanticContent) return null;

  return {
    ...(baseContent || {}),
    ...(semanticContent || {})
  };
};

export const buildProductMetaDescription = (product) => {
  const seoContent = getProductSeoContent(product);
  if (seoContent?.metaDescription) {
    return seoContent.metaDescription;
  }

  const firstBenefit = product.benefits[0] || 'nutricion y bienestar natural';
  return `${product.name} Fuxion en Chile: ${firstBenefit}. Precio $${product.price.toLocaleString('es-CL')}, presentacion ${product.presentation || 'en sobres'} y asesoria personalizada.`;
};

export const buildProductTitle = (product) => {
  const seoContent = getProductSeoContent(product);
  return seoContent?.seoTitle || `${product.name} Fuxion | Precio, Beneficios y Modo de Uso | ${STORE_NAME}`;
};


export const buildProductSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: [product.imageUrl],
  description: buildProductMetaDescription(product),
  sku: product.slug,
  brand: {
    '@type': 'Brand',
    name: 'Fuxion'
  },
  category: product.category,
  offers: {
    '@type': 'Offer',
    url: product.url,
    priceCurrency: 'CLP',
    price: product.price,
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: STORE_NAME,
      url: SITE_URL
    }
  }
});

export const buildProductFaqSchema = (product) => {
  const seoContent = getProductSeoContent(product);
  if (!seoContent?.faqs?.length) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seoContent.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

export const buildStoreSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: STORE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/img/familia.fuxion.png`,
  description: 'Tienda Fuxion en Chile con productos nutraceuticos para nutricion, bienestar, energia, digestion, control de peso y cuidado natural.',
  areaServed: {
    '@type': 'Country',
    name: 'Chile'
  },
  brand: {
    '@type': 'Brand',
    name: 'Fuxion'
  },
  sameAs: [
    SITE_URL
  ]
});

/**
 * LocalBusiness schema for local SEO (Chile).
 */
export const buildLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: STORE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/img/familia.fuxion.png`,
  description: 'Tienda Fuxion en Chile con productos nutraceuticos para nutricion, bienestar, energia, digestion, control de peso y cuidado natural.',
  telephone: '+56912345678',
  email: 'contacto@tiendafuxion.space',
  areaServed: [
    {
      '@type': 'City',
      name: 'Santiago'
    },
    {
      '@type': 'Country',
      name: 'Chile'
    }
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CL'
  },
  priceRange: '$$',
  openingHours: 'Mo-Fr 09:00-18:00',
  sameAs: [
    SITE_URL
  ]
});

/**
 * BreadcrumbList schema for a given array of { name, url } items.
 */
export const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`
  }))
});
