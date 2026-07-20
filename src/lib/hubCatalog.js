/**
 * Catálogo de hubs temáticos para Authority SEO
 * Cada hub representa un silo temático completo
 */

export const HUB_CATALOG = [
  {
    slug: 'higado-graso',
    name: 'Hígado Graso',
    description: 'Todo lo que necesitas saber sobre hígado graso no alcohólico: causas, síntomas, tratamientos naturales y productos para apoyar tu hígado.',
    longDescription: 'El hígado graso no alcohólico (NAFLD) afecta a millones de personas en Chile. Esta condición, donde la grasa se acumula en el hígado sin relación con el consumo de alcohol, puede progresar a cirrosis si no se trata. En este hub encontrarás guías completas sobre diagnóstico, tratamientos y productos que apoyan la salud hepática.',
    subtopics: [
      { name: 'Causas del hígado graso', description: 'Obesidad, diabetes tipo 2, resistencia a la insulina y sedentarismo', articleCount: 5 },
      { name: 'Síntomas y diagnóstico', description: 'Cómo detectar el hígado graso en etapas tempranas', articleCount: 3 },
      { name: 'Tratamientos naturales', description: 'Alimentación, ejercicio y suplementos para el hígado', articleCount: 8 },
      { name: 'Productos para el hígado', description: 'Rexet, omega-3, curcumina y más', articleCount: 4 },
    ],
    articles: [
      { title: 'Hígado graso: causas y síntomas', excerpt: 'Todo sobre NAFLD y cómo afecta tu salud hepática.', url: '/articulos/higado-graso-causas', image: '/branding/social/og-image.png' },
      { title: 'Cómo tratar el hígado graso naturalmente', excerpt: 'Alimentación, ejercicio y suplementos efectivos.', url: '/articulos/higado-graso-tratamiento', image: '/branding/social/og-image.png' },
      { title: '¿Qué es la cirrosis hepática?', excerpt: 'La etapa avanzada del daño hepático.', url: '/articulos/cirrosis-hepatica', image: '/branding/social/og-image.png' },
      { title: 'Refluxo gastroesofágico: causas y tratamiento', excerpt: 'ERGE y cómo manejarlo efectivamente.', url: '/articulos/reflujo-gastroesofagico', image: '/branding/social/og-image.png' },
      { title: 'Hígado graso en jóvenes', excerpt: 'Por qué cada vez más jóvenes desarrollan esta condición.', url: '/articulos/higado-graso-jovenes', image: '/branding/social/og-image.png' },
    ],
    products: [
      { name: 'Rexet', reason: 'Apoyo hepático y desintoxicación del hígado', url: '/producto/rexet' },
      { name: 'Omega-3', reason: 'Reduce inflamación hepática', url: '/producto/omega-3' },
      { name: 'Curcumina', reason: 'Efectos hepatoprotectores', url: '/producto/curcumina' },
    ],
  },
  {
    slug: 'microbiota-intestinal',
    name: 'Microbiota Intestinal',
    description: 'Guía completa sobre tu microbiota intestinal: qué es, cómo funciona, cómo cuidarla y los mejores productos para tu salud digestiva.',
    longDescription: 'Tu microbiota intestinal es el ecosistema de billones de bacterias que habitan en tu intestino. Estas bacterias no solo afectan tu digestión, sino también tu sistema inmune, tu estado de ánimo y hasta tu peso. Descubre cómo optimizar tu microbiota con alimentación, hábitos y productos específicos.',
    subtopics: [
      { name: 'Qué es la microbiota', description: 'El ecosistema de bacterias en tu intestino', articleCount: 4 },
      { name: 'Disbiosis', description: 'Cuando las bacterias se desequilibran', articleCount: 5 },
      { name: 'Probióticos', description: 'Bacterias beneficiosas y cómo elegirlas', articleCount: 6 },
      { name: 'Fibra prebiótica', description: 'Alimenta tu microbiota', articleCount: 4 },
    ],
    articles: [
      { title: 'Microbiota intestinal: todo lo que necesitas saber', excerpt: 'El ecosistema de bacterias que controla tu salud.', url: '/articulos/microbiota-intestinal', image: '/branding/social/og-image.png' },
      { title: 'Disbiosis intestinal: causas y síntomas', excerpt: 'El desequilibrio de tu microbiota y cómo detectarlo.', url: '/articulos/disbiosis-intestinal', image: '/branding/social/og-image.png' },
      { title: 'Mejores probióticos para tu salud', excerpt: 'Bacterias beneficiosas y cómo funcionan.', url: '/articulos/probioticos-salud', image: '/branding/social/og-image.png' },
      { title: 'Fibra prebiótica: alimenta tu microbiota', excerpt: 'Por qué la fibra es clave para tu digestión.', url: '/articulos/fibra-prebiotica', image: '/branding/social/og-image.png' },
      { title: 'Eje intestino-cerebro', excerpt: 'Cómo tu microbiota afecta tu estado de ánimo.', url: '/articulos/eje-intestino-cerebro', image: '/branding/social/og-image.png' },
    ],
    products: [
      { name: 'Flora Liv', reason: 'Probióticos y equilibrio de flora intestinal', url: '/producto/flora-liv' },
      { name: 'Liquid Fiber', reason: 'Fibra prebiótica diaria', url: '/producto/liquid-fiber' },
      { name: 'Prunex 1', reason: 'Apoyo al tránsito intestinal', url: '/producto/prunex-1' },
    ],
  },
  {
    slug: 'estrenimiento-cronico',
    name: 'Estreñimiento Crónico',
    description: 'Todo sobre el estreñimiento crónico: causas, tratamientos, productos naturales y cuándo consultar a un médico.',
    longDescription: 'El estreñimiento crónico afecta a millones de personas. Más que un inconveniente, puede ser síntoma de problemas de salud subyacentes como disbiosis, síndrome del intestino irritable o problemas de alimentación. Aprende a manejarlo con tratamientos naturales, cambios de hábito y productos específicos.',
    subtopics: [
      { name: 'Causas del estreñimiento', description: 'Alimentación, estrés, medicamentos', articleCount: 4 },
      { name: 'Tratamientos naturales', description: 'Psyllium, fibra, probióticos', articleCount: 6 },
      { name: 'Productos para estreñimiento', description: 'Prunex 1, Liquid Fiber, Flora Liv', articleCount: 3 },
      { name: 'Cuándo ir al médico', description: 'Signos de alerta y cuándo consultar', articleCount: 2 },
    ],
    articles: [
      { title: 'Estreñimiento crónico: causas y tratamientos', excerpt: 'Todo sobre el estreñimiento y cómo manejarlo.', url: '/articulos/estrenimiento-cronico', image: '/branding/social/og-image.png' },
      { title: 'Psyllium para el estreñimiento', excerpt: 'Fibra soluble y cómo funciona.', url: '/articulos/psyllium-estrenimiento', image: '/branding/social/og-image.png' },
      { title: 'Prunex 1: todo lo que necesitas saber', excerpt: 'El té natural para el tránsito intestinal.', url: '/articulos/prunex-1', image: '/branding/social/og-image.png' },
      { title: 'Liquid Fiber vs Prunex 1', excerpt: '¿Cuál elegir según tu caso?', url: '/articulos/liquid-fiber-vs-prunex-1', image: '/branding/social/og-image.png' },
      { title: 'Estreñimiento y SII', excerpt: 'Cómo el colon irritable afecta tu tránsito.', url: '/articulos/estrenimiento-sii', image: '/branding/social/og-image.png' },
    ],
    products: [
      { name: 'Prunex 1', reason: 'Té natural para tránsito intestinal', url: '/producto/prunex-1' },
      { name: 'Liquid Fiber', reason: 'Fibra prebiótica suave', url: '/producto/liquid-fiber' },
      { name: 'Flora Liv', reason: 'Probióticos para equilibrio digestivo', url: '/producto/flora-liv' },
    ],
  },
  {
    slug: 'control-peso',
    name: 'Control de Peso',
    description: 'Guía completa sobre control de peso: obesidad, resistencia a la insulina, tratamientos y productos Fuxion para ayudarte.',
    longDescription: 'El control de peso va mucho más allá de contar calorías. Implica comprender tu metabolismo, tu microbiota, tus hormonas y tus hábitos. En este hub encontrarás guías basadas en evidencia sobre cómo lograr un peso saludable de forma sostenible.',
    subtopics: [
      { name: 'Obesidad y metabolismo', description: 'Entendiendo la obesidad y el metabolismo', articleCount: 5 },
      { name: 'Resistencia a la insulina', description: 'Cuándo preocuparse y cómo tratar', articleCount: 4 },
      { name: 'Productos para control de peso', description: 'Thermo T3, NoCarb-T, Protein Active Fit', articleCount: 6 },
      { name: 'Hábitos saludables', description: 'Ejercicio, alimentación y sueño', articleCount: 8 },
    ],
    articles: [
      { title: 'Obesidad: causas y tratamientos', excerpt: 'Entendiendo la obesidad y cómo abordarla.', url: '/articulos/obesidad-causas', image: '/branding/social/og-image.png' },
      { title: 'Resistencia a la insulina', excerpt: 'El factor oculto del aumento de peso.', url: '/articulos/resistencia-insulina', image: '/branding/social/og-image.png' },
      { title: 'Thermo T3: guía completa', excerpt: 'El quemador de grasa de Fuxion.', url: '/articulos/thermo-t3', image: '/branding/social/og-image.png' },
      { title: 'NoCarb-T: control de carbohidratos', excerpt: 'Cómo funciona y cuándo usarlo.', url: '/articulos/nocarb-t', image: '/branding/social/og-image.png' },
      { title: 'Ayuno intermitente y peso', excerpt: 'Lo que dice la ciencia.', url: '/articulos/ayuno-intermitente', image: '/branding/social/og-image.png' },
    ],
    products: [
      { name: 'Thermo T3', reason: 'Apoyo metabólico y energía para entrenar', url: '/producto/thermo-t3' },
      { name: 'NoCarb-T', reason: 'Bloqueo de carbohidratos', url: '/producto/nocarb-t' },
      { name: 'Protein Active Fit', reason: 'Proteína vegetal y saciedad', url: '/producto/protein-active-fit' },
    ],
  },
  {
    slug: 'sindrome-intestino-irritable',
    name: 'Síndrome del Intestino Irritable',
    description: 'Todo sobre el SII: síntomas, diagnóstico, tratamientos y productos que pueden ayudarte a manejar esta condición.',
    longDescription: 'El síndrome del intestino irritable (SII) afecta a millones de personas en Chile. Esta condición del tracto digestivo puede causar dolor abdominal, hinchazón, estreñimiento o diarrea, y tiene una fuerte conexión con la microbiota intestinal y el estrés. Aprende a manejarlo con tratamientos basados en evidencia.',
    subtopics: [
      { name: 'Síntomas del SII', description: 'Hinchazón, dolor, diarrea, estreñimiento', articleCount: 3 },
      { name: 'Diagnóstico', description: 'Criterios de Roma IV y pruebas', articleCount: 3 },
      { name: 'Tratamientos', description: 'Dieta FODMAP, probióticos, medicamentos', articleCount: 6 },
      { name: 'Estrés y SII', description: 'La conexión intestino-cerebro', articleCount: 4 },
    ],
    articles: [
      { title: 'Síndrome del intestino irritable: guía completa', excerpt: 'Todo sobre el SII, síntomas y tratamientos.', url: '/articulos/sindrome-intestino-irritable', image: '/branding/social/og-image.png' },
      { title: 'Dieta FODMAP para el SII', excerpt: 'Cómo identificar alimentos desencadenantes.', url: '/articulos/dieta-fodmap', image: '/branding/social/og-image.png' },
      { title: 'Probióticos para SII', excerpt: '¿Cuál cepa elegir?', url: '/articulos/probioticos-sii', image: '/branding/social/og-image.png' },
      { title: 'Estrés y SII', excerpt: 'Cómo el estrés afecta tu intestino.', url: '/articulos/estres-sii', image: '/branding/social/og-image.png' },
    ],
    products: [
      { name: 'Flora Liv', reason: 'Probióticos para equilibrio intestinal', url: '/producto/flora-liv' },
      { name: 'Liquid Fiber', reason: 'Fibra suave para el tránsito', url: '/producto/liquid-fiber' },
      { name: 'Prunex 1', reason: 'Apoyo al tránsito intestinal', url: '/producto/prunex-1' },
    ],
  },
];
