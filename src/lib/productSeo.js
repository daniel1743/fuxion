import fuxionDatabase from '@/data/fuxion_database.json';
import { getProductImageUrl } from '@/lib/imageUtils';
import { PRODUCT_SEO_EXTENSIONS } from '@/data/productSeoExtensions';

export const SITE_URL = 'https://www.bienestarenclaro.com';
export const STORE_NAME = 'Bienestar en Claro';

export const PRIORITY_PRODUCT_SEO = {
  'thermo-t3': {
    seoTitle: 'Bebida Natural para Quemar Grasa y Energía al Entrenar | Thermo T3 Chile',
    metaDescription: 'Descubre cómo quemar grasa de forma natural con Thermo T3 en Chile. Acelera tu metabolismo, controla tu peso y aumenta tu energía para entrenar. Asesoría por WhatsApp.',
    intro: 'THERMO T3 es una opción Fuxion orientada a personas que entrenan o quieren acompañar una rutina activa de control de peso. Su uso correcto es clave: se toma 30 minutos antes de hacer ejercicio, dentro de un plan con alimentación, hidratación y constancia.',
    seoHeading: 'Bebida Natural para Control de Peso y Energía',
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
    seoTitle: 'Té Natural para Bloquear Carbohidratos y Controlar el Azúcar | Nocarb-T Chile',
    metaDescription: 'Controla tu peso y reduce la asimilación de azúcar con Nocarb-T en Chile. Ideal para acompañar comidas altas en carbohidratos. Revisa beneficios y cómo tomarlo.',
    intro: 'NOCARB-T está pensado para personas que quieren ordenar su alimentación y acompañar comidas donde suelen aparecer carbohidratos. Su valor está en integrarlo con hábitos reales, no en usarlo como permiso para comer sin control.',
    seoHeading: 'Té Natural para el Control de Carbohidratos y Azúcar',
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
    seoTitle: 'Té Natural para el Estreñimiento y Tránsito Intestinal | Prunex 1 Chile',
    metaDescription: 'Alivia el estreñimiento y limpia tu colon naturalmente con Prunex 1 en Chile. Descubre cómo mejorar tu tránsito intestinal y bienestar digestivo. Asesoría personalizada.',
    intro: 'PRUNEX 1 es uno de los productos más buscados de Fuxion para personas que quieren apoyar su bienestar digestivo y tránsito intestinal. La recomendación debe adaptarse a cada caso, especialmente si existe estreñimiento persistente o una condición digestiva diagnosticada.',
    seoHeading: 'Té Natural para el Bienestar Digestivo y Tránsito Intestinal',
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
    seoTitle: 'Probióticos Naturales para la Flora Intestinal y Digestión | Flora Liv Chile',
    metaDescription: 'Regenera tu flora intestinal y mejora tu digestión con probióticos naturales Flora Liv en Chile. Apoyo ideal para gastritis y bienestar gástrico. Conoce sus beneficios.',
    intro: 'FLORA LIV está orientado al equilibrio de la flora intestinal y bienestar digestivo. Es una alternativa relevante cuando la persona busca apoyo gástrico, digestión más cómoda o reconstruir hábitos después de desórdenes alimentarios o uso de antibióticos.',
    seoHeading: 'Probióticos Naturales para la Flora Intestinal',
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
    seoTitle: 'Bebida Natural para Limpiar el Hígado y Bienestar Hepático | Rexet Chile',
    metaDescription: 'Protege y desintoxica tu hígado naturalmente con Rexet en Chile. Apoyo ideal para el sistema hepatobiliar después de excesos. Revisa precio e ingredientes.',
    intro: 'REXET se relaciona con bienestar hepático y rutinas de limpieza del sistema hepatobiliar según la línea Fuxion. Para comunicarlo bien, conviene hablar de apoyo y hábitos, no de cura de enfermedades.',
    seoHeading: 'Bebida Natural para el Bienestar Hepático',
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
    seoTitle: 'Vitaminas y Minerales Naturales para la Nutrición Diaria | Nutraday Chile',
    metaDescription: 'Refuerza las defensas y nutrición de tu familia con Nutraday en Chile. Vitaminas, minerales y antioxidantes 100% naturales. Hidratación sin azúcar.',
    intro: 'NUTRADAY es una alternativa de hidratación nutricional para el día a día. Su búsqueda suele venir de personas que quieren mejorar energía, nutrición básica, antioxidantes y hábitos familiares sin partir por productos más específicos.',
    seoHeading: 'Vitaminas y Antioxidantes para Nutrición Diaria',
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
    seoTitle: 'Bebida Energética Natural sin Azúcar | Vita Xtra T+ Chile',
    metaDescription: 'Aumenta tu energía y vitalidad diaria de forma 100% natural con Vita Xtra T+ en Chile. Bebida energética sin azúcar ni químicos. Revisa sus beneficios.',
    intro: 'VITA XTRA T+ es una opción Fuxion para quienes buscan energía natural y apoyo antioxidante en la rutina diaria. Es diferente a productos deportivos o de control de peso: su foco es vitalidad y bienestar general.',
    seoHeading: 'Bebida Energética Natural para Vitalidad Diaria',
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
  },
  'liquid-fiber': {
    seoTitle: 'Fibra Prebiótica Líquida para Digestión Saludable | Liquid Fiber Chile',
    metaDescription: 'Liquid Fiber: fibra prebiótica suave para tránsito intestinal regular y equilibrio de flora. Ideal para toda la familia. Consulta precio y beneficios.',
    intro: 'LIQUID FIBER es una alternativa suave de fibra prebiótica para acompañar la rutina digestiva diaria. Se presenta como una opción más accesible que PRUNEX 1 para quienes buscan un apoyo constante de fibra.',
    seoHeading: 'Fibra Prebiótica para la Digestión Diaria',
    searchIntent: [
      { title: '¿Para qué sirve Liquid Fiber?', body: 'Acompaña el tránsito intestinal regular y aporta fibra prebiótica para la flora intestinal. Es una opción suave para uso diario.' },
      { title: 'Cómo tomar Liquid Fiber', body: 'Se toma un sobre en agua fría. Puede integrarse como parte de una rutina digestiva junto con hidratación adecuada.' },
      { title: 'Comprar Liquid Fiber en Chile', body: 'Puedes pedirlo con asesoría para evaluar si Liquid Fiber es la mejor opción para tu caso, o si conviene PRUNEX 1.' }
    ],
    faqs: [
      { question: '¿Liquid Fiber es laxante?', answer: 'No es un laxante. Aporta fibra prebiótica que ayuda al tránsito intestinal de forma suave y natural.' },
      { question: '¿Liquid Fiber puede tomarlo toda la familia?', answer: 'Sí, es una opción suave pensada para uso diario. Ante condiciones específicas, consulta con un profesional.' },
      { question: '¿Liquid Fiber o PRUNEX 1?', answer: 'Liquid Fiber es más suave para fibra diaria. PRUNEX 1 apunta a un apoyo digestivo más marcado. Depende de tu objetivo.' }
    ],
    relatedSlugs: ['prunex-1', 'flora-liv', 'rexet']
  },
  'berry-balance': {
    seoTitle: 'Berry Balance — Protección del Tracto Urinario con Cranberry y Probióticos | Chile',
    metaDescription: 'Berry Balance combina cranberry, probióticos y antioxidantes para el cuidado natural del tracto urinario. Conoce beneficios y cómo tomarlo.',
    intro: 'BERRY BALANCE está orientado al cuidado del tracto urinario, apoyando el equilibrio de la flora protectora y el pH saludable del sistema urinario.',
    seoHeading: 'Cuidado Natural del Tracto Urinario',
    searchIntent: [
      { title: '¿Para qué sirve Berry Balance?', body: 'Acompaña el cuidado del tracto urinario y el equilibrio del pH. Combina cranberry, probióticos y antioxidantes.' },
      { title: 'Cómo tomar Berry Balance', body: 'Se disuelve un stick en 180 ml de agua fría, 1 o 2 veces al día, preferiblemente entre comidas.' },
      { title: 'Comprar Berry Balance en Chile', body: 'Puedes pedirlo con asesoría para revisar si corresponde Berry Balance u otras alternativas como VERA+ para defensas.' }
    ],
    faqs: [
      { question: '¿Berry Balance previene infecciones urinarias?', answer: 'Puede acompañar el cuidado del tracto urinario de forma natural. Ante infecciones recurrentes, consulta con un profesional.' },
      { question: '¿Berry Balance tiene probióticos?', answer: 'Sí, incluye probióticos y antioxidantes como cranberry y acerola para el equilibrio urinario.' },
      { question: '¿Berry Balance o FLORA LIV?', answer: 'Berry Balance se enfoca en tracto urinario. FLORA LIV en flora intestinal. Depende de tu objetivo.' }
    ],
    relatedSlugs: ['vera-plus', 'flora-liv', 'nutraday']
  },
  'alpha-balance': {
    seoTitle: 'Alpha Balance — Limpieza Natural del Organismo con Algas y Clorofila | Chile',
    metaDescription: 'Alpha Balance combina alfalfa, algas, clorofila y minerales para apoyar la limpieza natural del organismo. Conoce sus beneficios y cómo tomarlo.',
    intro: 'ALPHA BALANCE se relaciona con la limpieza natural del organismo, apoyando la eliminación de toxinas y metales pesados de forma natural.',
    seoHeading: 'Limpieza Natural del Organismo',
    searchIntent: [
      { title: '¿Para qué sirve Alpha Balance?', body: 'Acompaña la limpieza natural del organismo con alfalfa, algas, clorofila y minerales. Ideal para una rutina de bienestar.' },
      { title: 'Cómo tomar Alpha Balance', body: 'Se toma un sobre en agua fría, preferiblemente en ayunas o cuando se tenga sed.' },
      { title: 'Comprar Alpha Balance en Chile', body: 'Puedes pedirlo con asesoría para evaluar si ALPHA BALANCE encaja con tu rutina de limpieza y bienestar.' }
    ],
    faqs: [
      { question: '¿Alpha Balance limpia el hígado?', answer: 'Puede acompañar la limpieza natural del organismo. Para hígado graso o condiciones hepáticas, consulta con un profesional.' },
      { question: '¿Alpha Balance o REXET?', answer: 'Alpha Balance apoya la limpieza general del organismo. REXET se enfoca en bienestar hepático específico.' },
      { question: '¿Alpha Balance tiene efectos secundarios?', answer: 'Es un producto natural. Ante condiciones médicas, consulta con un profesional antes de usarlo.' }
    ],
    relatedSlugs: ['rexet', 'flora-liv', 'vitaenergia']
  },
  'bioprotein-active': {
    seoTitle: 'BioProtein Active — Proteína Vegetal 100% de Alta Biodisponibilidad | Chile',
    metaDescription: 'BioProtein Active: proteína vegetal de quinua germinada, arveja y arroz germinado. 100% vegetal, alta biodisponibilidad. Consulta precio y beneficios.',
    intro: 'BIOPROTEIN ACTIVE es una fuente de proteína vegetal de calidad, con aminoácidos esenciales y DHA. Está orientada a quienes buscan una proteína 100% vegetal con alta biodisponibilidad.',
    seoHeading: 'Proteína Vegetal de Alta Calidad',
    searchIntent: [
      { title: '¿Para qué sirve BioProtein Active?', body: 'Acompaña la nutrición diaria con proteína vegetal de alta calidad, aminoácidos esenciales y DHA.' },
      { title: 'Cómo tomar BioProtein Active', body: 'Se toma un sobre en agua fría, de media mañana o media tarde. Puede usarse como apoyo proteico después de actividad física.' },
      { title: 'Comprar BioProtein Active en Chile', body: 'Puedes pedirlo con asesoría para revisar si conviene BIOPROTEIN ACTIVE o PROTEIN ACTIVE FIT (versión con enfoque en control de peso).' }
    ],
    faqs: [
      { question: '¿BioProtein Active es vegano?', answer: 'Sí, es 100% vegetal, con proteína de quinua germinada, arveja y arroz germinado.' },
      { question: '¿BioProtein Active o Protein Active Fit?', answer: 'BIOPROTEIN ACTIVE es proteína pura. PROTEIN ACTIVE FIT tiene el mismo perfil con enfoque en control de peso y saciedad.' },
      { question: '¿BioProtein Active tiene DHA?', answer: 'Sí, incluye DHA, ARA y aceite de coco como complemento nutricional.' }
    ],
    relatedSlugs: ['protein-active-fit', 'pre-sport-pro-edition', 'post-sport-pro-edition']
  },
  'vitaenergia': {
    seoTitle: 'VitaEnergía — Multivitamínico Natural para Energía y Vitalidad Diaria | Chile',
    metaDescription: 'VitaEnergía: aminoácidos, vitaminas, minerales orgánicos, camu camu y luteina para combatir la fatiga y mejorar la energía diaria. Conoce beneficios.',
    intro: 'VITAENERGÍA está orientado a disipar la sensación de fatiga cotidiana y mejorar la asimilación de proteínas, con un perfil completo de vitaminas y antioxidantes.',
    seoHeading: 'Multivitamínico Natural para Energía Diaria',
    searchIntent: [
      { title: '¿Para qué sirve VitaEnergía?', body: 'Acompaña la energía diaria, combate la fatiga y aporta vitaminas, minerales y antioxidantes.' },
      { title: 'Cómo tomar VitaEnergía', body: 'Se toma un sobre en agua fría a cualquier hora del día. Puede usarse en momentos de baja energía.' },
      { title: 'Comprar VitaEnergía en Chile', body: 'Puedes pedirlo con asesoría para decidir si VitaEnergía es la mejor opción, o si conviene VITA XTRA T+.' }
    ],
    faqs: [
      { question: '¿VitaEnergía es un multivitamínico?', answer: 'Sí, combina aminoácidos, vitaminas, minerales orgánicos, fibra prebiótica, camu camu y luteina.' },
      { question: '¿VitaEnergía o VITA XTRA T+?', answer: 'VitaEnergía es multivitamínico general. VITA XTRA T+ tiene estimulantes naturales (guayusa, té verde) para energía activa.' },
      { question: '¿VitaEnergía puede tomarlo la familia?', answer: 'Puede apoyar la nutrición diaria, pero la recomendación debe adaptarse a cada caso.' }
    ],
    relatedSlugs: ['vita-xtra-t-plus', 'nutraday', 'vera-plus']
  },
  'vera-plus': {
    seoTitle: 'VERA+ — Refuerzo de Defensas con Aloe Vera y Beta Glucanos | Chile',
    metaDescription: 'VERA+ combina aloe vera, beta glucanos y aminoácidos para reforzar defensas naturales. Ideal para épocas de cambio de estación. Consulta precio y beneficios.',
    intro: 'VERA+ está orientado a reforzar el sistema inmunológico, aumentar la resistencia natural del organismo y apoyar el bienestar respiratorio.',
    seoHeading: 'Refuerzo de Defensas Natural',
    searchIntent: [
      { title: '¿Para qué sirve VERA+?', body: 'Refuerza las defensas con aloe vera, beta glucanos y aminoácidos. Ideal para épocas de cambio de estación.' },
      { title: 'Cómo tomar VERA+', body: 'Se toma un sobre en agua caliente, antes de dormir o cuando se desee.' },
      { title: 'Comprar VERA+ en Chile', body: 'Puedes pedirlo con asesoría para revisar si VERA+ es la mejor opción para tus defensas, junto a GANO+ CAPPUCCINO.' }
    ],
    faqs: [
      { question: '¿VERA+ tiene aloe vera?', answer: 'Sí, combina concentrado de Aloe Vera, Beta Glucanos y aminoácidos como acetilcisteína y L-glutamina.' },
      { question: '¿VERA+ o GANO+ CAPPUCCINO?', answer: 'Ambos apoyan defensas. VERA+ con aloe vera; GANO+ con beta-glucanos y sabor cappuccino.' },
      { question: '¿VERA+ es un medicamento?', answer: 'No. Es un producto nutracéutico de Fuxion para acompañar hábitos saludables.' }
    ],
    relatedSlugs: ['gano-plus-cappuccino', 'vitaenergia', 'nutraday']
  },
  'gano-plus-cappuccino': {
    seoTitle: 'Gano+ Cappuccino — Defensas con Beta Glucanos y Sabor Cappuccino | Chile',
    metaDescription: 'Gano+ Cappuccino combina beta-D-glucanos y micronutrientes en un cappuccino funcional para reforzar defensas y proteger el hígado. Conoce beneficios.',
    intro: 'GANO+ CAPPUCCINO combina beta-D-glucanos, extractos de quilaya y micronutrientes en una bebida caliente sabor cappuccino, orientada a reforzar el sistema inmunológico.',
    seoHeading: 'Bebida Funcional Cappuccino para Defensas',
    searchIntent: [
      { title: '¿Para qué sirve Gano+ Cappuccino?', body: 'Refuerza defensas y protege el hígado en una bebida caliente sabor cappuccino con beta-glucanos.' },
      { title: 'Cómo tomar Gano+ Cappuccino', body: 'Se toma un sobre en agua caliente a la hora que se desee.' },
      { title: 'Comprar Gano+ Cappuccino en Chile', body: 'Puedes pedirlo con asesoría para decidir si GANO+ CAPPUCCINO es la mejor opción, junto a VERA+.' }
    ],
    faqs: [
      { question: '¿Gano+ Cappuccino tiene cafeína?', answer: 'No contiene cafeína. Es una bebida caliente funcional con beta-glucanos y micronutrientes.' },
      { question: '¿Gano+ Cappuccino o VERA+?', answer: 'Ambos apoyan defensas. GANO+ con beta-glucanos y sabor cappuccino; VERA+ con aloe vera.' },
      { question: '¿Gano+ Cappuccino puede tomarlo la familia?', answer: 'Puede apoyar las defensas, pero la recomendación debe adaptarse a cada caso.' }
    ],
    relatedSlugs: ['vera-plus', 'vitaenergia', 'nutraday']
  },
  'pre-sport-pro-edition': {
    seoTitle: 'Pre Sport Pro Edition — Preparación Deportiva con Electrolitos y Aminoácidos | Chile',
    metaDescription: 'Pre Sport Pro Edition prepara el cuerpo antes del ejercicio con aminoácidos, concentrados vegetales y minerales. Consulta precio y beneficios.',
    intro: 'PRE SPORT PRO EDITION combina aminoácidos, concentrados vegetales de sandía, yerba mate y betarraga, y minerales en molécula orgánica para preparar el cuerpo antes de la actividad deportiva.',
    seoHeading: 'Preparación Deportiva Funcional',
    searchIntent: [
      { title: '¿Para qué sirve Pre Sport Pro Edition?', body: 'Prepara el cuerpo para la actividad deportiva intensa, mejora el rendimiento y aumenta la resistencia física.' },
      { title: 'Cómo tomar Pre Sport Pro Edition', body: 'Se toma un sobre en agua fría antes de iniciar la rutina de ejercicio.' },
      { title: 'Comprar Pre Sport Pro Edition en Chile', body: 'Puedes pedirlo con asesoría para revisar si Pre Sport Pro Edition encaja con tu rutina deportiva.' }
    ],
    faqs: [
      { question: '¿Pre Sport Pro Edition es un preentreno?', answer: 'Sí, prepara el cuerpo antes del ejercicio con aminoácidos, concentrados vegetales y electrolitos.' },
      { question: '¿Pre Sport Pro Edition o THERMO T3?', answer: 'Pre Sport Pro Edition es preparación deportiva. THERMO T3 es para energía y metabolismo antes del ejercicio.' },
      { question: '¿Pre Sport Pro Edition o Post Sport Pro Edition?', answer: 'Pre Sport se toma antes del ejercicio. Post Sport se toma después para recuperación.' }
    ],
    relatedSlugs: ['post-sport-pro-edition', 'bioprotein-active', 'thermo-t3']
  },
  'post-sport-pro-edition': {
    seoTitle: 'Post Sport Pro Edition — Recuperación Muscular con BCAAs y Electrolitos | Chile',
    metaDescription: 'Post Sport Pro Edition combina aminoácidos, BCAAs, glutamina y electrolitos para la recuperación muscular post-ejercicio. Consulta precio y beneficios.',
    intro: 'POST SPORT PRO EDITION combina aminoácidos (BCAAs + Glutamina), acerola, granada y agua de coco para apoyar la recuperación muscular y proteger articulaciones.',
    seoHeading: 'Recuperación Muscular Post-Ejercicio',
    searchIntent: [
      { title: '¿Para qué sirve Post Sport Pro Edition?', body: 'Apoya la recuperación muscular, protege articulaciones y reponer sales minerales después del ejercicio.' },
      { title: 'Cómo tomar Post Sport Pro Edition', body: 'Se toma un sobre en agua fría al terminar de hacer ejercicio.' },
      { title: 'Comprar Post Sport Pro Edition en Chile', body: 'Puedes pedirlo con asesoría para revisar si Post Sport Pro Edition encaja con tu rutina deportiva.' }
    ],
    faqs: [
      { question: '¿Post Sport Pro Edition tiene BCAAs?', answer: 'Sí, combina aminoácidos, BCAAs, glutamina, acerola, granada y agua de coco.' },
      { question: '¿Post Sport Pro Edition o BioProtein Active?', answer: 'Post Sport es recuperación post-ejercicio con BCAAs. BioProtein Active es proteína vegetal de calidad.' },
      { question: '¿Post Sport Pro Edition puede tomarlo cualquier persona?', answer: 'Puede apoyar la recuperación, pero la recomendación debe adaptarse a cada caso.' }
    ],
    relatedSlugs: ['pre-sport-pro-edition', 'bioprotein-active', 'protein-active-fit']
  },
  'cafe-cafe-fit-cappuccino': {
    seoTitle: 'Café & Café Fit Cappuccino — Bebida Funcional con Café Tostado | Chile',
    metaDescription: 'Café & Café Fit Cappuccino combina café tostado liofilizado, leche descremada y crema para café en un cappuccino funcional. Conoce beneficios.',
    intro: 'CAFE & CAFE FIT CAPPUCCINO combina café tostado liofilizado, leche descremada y crema para café en un formato práctico de cappuccino instantáneo con enfoque en energía diaria.',
    seoHeading: 'Cappuccino Funcional con Café Tostado',
    searchIntent: [
      { title: '¿Para qué sirve Café & Café Fit Cappuccino?', body: 'Energía diaria en un cappuccino instantáneo con café tostado liofilizado, leche descremada y crema.' },
      { title: 'Cómo tomar Café & Café Fit Cappuccino', body: 'Se toma un sobre en agua caliente durante el día. Se recomienda evitar su consumo en la noche si eres sensible a la cafeína.' },
      { title: 'Comprar Café & Café Fit Cappuccino en Chile', body: 'Puedes pedirlo con asesoría para revisar si Café & Café Fit Cappuccino encaja con tu rutina de café.' }
    ],
    faqs: [
      { question: '¿Café & Café Fit Cappuccino tiene cafeína?', answer: 'Sí, contiene café tostado liofilizado. Si eres sensible a la cafeína, evita su consumo en la noche.' },
      { question: '¿Café & Café Fit Cappuccino o VITA XTRA T+?', answer: 'Café & Café Fit Cappuccino es un cappuccino con café. VITA XTRA T+ es energía natural con guayusa y té verde.' },
      { question: '¿Café & Café Fit Cappuccino es apto para control de peso?', answer: 'Puede acompañar una rutina de control de peso dentro de una alimentación ordenada.' }
    ],
    relatedSlugs: ['vita-xtra-t-plus', 'nutraday', 'thermo-t3']
  },
  'pack-5-14': {
    seoTitle: 'Pack 5/14 — Combo de Control de Peso Guiado por Asesoría Fuxion | Chile',
    metaDescription: 'Pack 5/14: combo de productos Fuxion para apoyar rutinas de control de peso. Incluye productos que se complementan entre sí. Consulta precio y beneficios.',
    intro: 'EL PACK 5/14 es un combo de productos Fuxion diseñado para apoyar rutinas de control de peso y medidas, con productos que se complementan entre sí.',
    seoHeading: 'Plan Estructural de Control de Peso',
    searchIntent: [
      { title: '¿Para qué sirve el Pack 5/14?', body: 'Apoya rutinas de control de peso con productos que se complementan entre sí, guiados por un asesor.' },
      { title: 'Cómo funciona el Pack 5/14', body: 'Incluye productos con horarios específicos que se adaptan a la rutina diaria de la persona.' },
      { title: 'Comprar Pack 5/14 en Chile', body: 'Puedes pedirlo con asesoría para revisar si el Pack 5/14 encaja con tu objetivo de control de peso.' }
    ],
    faqs: [
      { question: '¿Pack 5/14 es un plan de dieta?', answer: 'Es un combo de productos Fuxion diseñado para acompañar rutinas de control de peso. No es un plan de dieta.' },
      { question: '¿Pack 5/14 incluye asesoría?', answer: 'Sí, se recomienda consultar con un asesor para definir la mejor combinación de productos.' },
      { question: '¿Pack 5/14 o productos individuales?', answer: 'El Pack 5/14 incluye productos complementarios. Los individuales permiten mayor flexibilidad.' }
    ],
    relatedSlugs: ['thermo-t3', 'nocarb-t', 'protein-active-fit']
  },
  'probal': {
    seoTitle: 'PROBAL — Equilibrio Hormonal Femenino con Aguaje y Orégano | Chile',
    metaDescription: 'PROBAL combina concentrado de Aguaje, Orégano, Triptofano, Magnesio y Camu-Camu para el equilibrio hormonal femenino. Conoce beneficios.',
    intro: 'PROBAL combina concentrado de Aguaje, Orégano, Triptofano, Magnesio, Camu-Camu y Marigold en un té herbal orientado al equilibrio hormonal femenino.',
    seoHeading: 'Equilibrio Hormonal Femenino Natural',
    searchIntent: [
      { title: '¿Para qué sirve PROBAL?', body: 'Equilibra el balance hormonal femenino, controla molestias del periodo y acompaña la menopausia.' },
      { title: 'Cómo tomar PROBAL', body: 'Se toma un sobre en agua caliente, preferiblemente antes de dormir.' },
      { title: 'Comprar PROBAL en Chile', body: 'Puedes pedirlo con asesoría para revisar si PROBAL es la mejor opción para tu situación hormonal.' }
    ],
    faqs: [
      { question: '¿PROBAL tiene hormonas?', answer: 'No. Combina concentrados naturales de Aguaje y Orégano con Triptofano, Magnesio y vitaminas.' },
      { question: '¿PROBAL o Youth Elixir?', answer: 'PROBAL se enfoca en equilibrio hormonal femenino. Youth Elixir en vitalidad y enfoque anti-edad.' },
      { question: '¿PROBAL puede tomarlo cualquier persona?', answer: 'Está orientado a mujeres que buscan equilibrio hormonal. Ante condiciones específicas, consulta con un profesional.' }
    ],
    relatedSlugs: ['youth-elixir', 'beauty-in', 'passion']
  },
  'passion': {
    seoTitle: 'PASSION — Energía Vital y Potencia Sexual Natural para Hombre y Mujer | Chile',
    metaDescription: 'PASSION combina aminoácidos, jalea real, ginseng y zinc para apoyar la energía vital, la potencia sexual y la fertilidad. Conoce beneficios.',
    intro: 'PASSION combina aminoácidos, concentrado de jalea real, ginseng y zinc para apoyar la energía vital, la potencia sexual y la fertilidad tanto en hombres como en mujeres.',
    seoHeading: 'Energía Vital y Potencia Sexual Natural',
    searchIntent: [
      { title: '¿Para qué sirve PASSION?', body: 'Acompaña la energía vital, la potencia sexual y la fertilidad tanto en hombres como en mujeres.' },
      { title: 'Cómo tomar PASSION', body: 'Se toma un sobre en agua fría a la hora que se desee.' },
      { title: 'Comprar PASSION en Chile', body: 'Puedes pedirlo con asesoría para revisar si PASSION encaja con tu objetivo de energía y vitalidad.' }
    ],
    faqs: [
      { question: '¿PASSION es un afrodisíaco?', answer: 'No es un afrodisíaco. Acompaña la energía vital y la potencia sexual con ginseng, jalea real y zinc.' },
      { question: '¿PASSION solo para hombres?', answer: 'No. Está orientado tanto a hombres como a mujeres para energía vital y fertilidad.' },
      { question: '¿PASSION o PROBAL?', answer: 'PASSION en energía vital y potencia. PROBAL en equilibrio hormonal femenino.' }
    ],
    relatedSlugs: ['youth-elixir', 'beauty-in', 'probal']
  },
  'golden-flx': {
    seoTitle: 'Golden FLX — Curcuma Orgánica para Articulaciones y Movilidad Natural | Chile',
    metaDescription: 'Golden FLX combina curcuma orgánica certificada, jengibre, cardamomo y pimienta negra para apoyo articular natural. Conoce beneficios y precio.',
    intro: 'GOLDEN FLX combina curcuma orgánica certificada, jengibre, cardamomo, leche de coco, pimienta negra y canela en una bebida funcional con propiedades antioxidantes y antiinflamatorias naturales.',
    seoHeading: 'Apoyo Articular Natural con Curcuma Orgánica',
    searchIntent: [
      { title: '¿Para qué sirve Golden FLX?', body: 'Apoya la movilidad articular y bienestar físico con curcuma orgánica, jengibre y cardamomo.' },
      { title: 'Cómo tomar Golden FLX', body: 'Se toma un sobre en agua caliente a la hora que se desee.' },
      { title: 'Comprar Golden FLX en Chile', body: 'Puedes pedirlo con asesoría para revisar si Golden FLX encaja con tu rutina de bienestar físico.' }
    ],
    faqs: [
      { question: '¿Golden FLX es un antiinflamatorio?', answer: 'No es un medicamento. Combina curcuma orgánica con propiedades antiinflamatorias naturales.' },
      { question: '¿Golden FLX o Beauty-In?', answer: 'Golden FLX en articulaciones y movilidad. Beauty-In en colágeno y cuidado de la piel.' },
      { question: '¿Golden FLX puede tomarlo cualquier persona?', answer: 'Puede acompañar el bienestar físico. Ante condiciones específicas, consulta con un profesional.' }
    ],
    relatedSlugs: ['youth-elixir', 'beauty-in', 'passion']
  },
  'on': {
    seoTitle: 'ON Vigor Mental — Concentración, Memoria y Función Neuronal Natural | Chile',
    metaDescription: 'ON combina taurina, yerba mate, camu camu, vitaminas B y DHA para apoyar la concentración, la memoria y la función neuronal. Conoce beneficios.',
    intro: 'ON combina taurina, yerba mate, camu camu, vitaminas del complejo B, minerales orgánicos, DHA y ARA para apoyar la función neuronal y la energía mental.',
    seoHeading: 'Vigor Mental y Función Neuronal',
    searchIntent: [
      { title: '¿Para qué sirve ON?', body: 'Acompaña la función neuronal, la concentración y la energía mental. Ideal para jornadas de estudio o trabajo intelectual.' },
      { title: 'Cómo tomar ON', body: 'Se toma un sobre en agua fría a la hora que se desee.' },
      { title: 'Comprar ON en Chile', body: 'Puedes pedirlo con asesoría para revisar si ON encaja con tu rutina de vigor mental.' }
    ],
    faqs: [
      { question: '¿ON es un estimulante?', answer: 'No es un estimulante. Combina taurina, yerba mate, camu camu y vitaminas del complejo B.' },
      { question: '¿ON o NO STRESS?', answer: 'ON en vigor mental y concentración. NO STRESS en relajación y equilibrio del sistema nervioso.' },
      { question: '¿ON puede tomarlo cualquier persona?', answer: 'Puede acompañar la función neuronal. Ante condiciones específicas, consulta con un profesional.' }
    ],
    relatedSlugs: ['no-stress', 'vita-xtra-t-plus', 'nutraday']
  },
  'no-stress': {
    seoTitle: 'NO STRESS — Relajación Natural con Glicina, Triptofano y Magnesio | Chile',
    metaDescription: 'NO STRESS combina glicina, triptofano, magnesio y vitaminas B para apoyo del estrés y la relajación natural. Conoce beneficios y precio.',
    intro: 'NO STRESS combina aminoácidos como glicina y triptofano, magnesio orgánico, concentrado de limón y vitaminas del complejo B para apoyar el bienestar emocional y la relajación.',
    seoHeading: 'Relajación Natural y Bienestar Emocional',
    searchIntent: [
      { title: '¿Para qué sirve NO STRESS?', body: 'Acompaña el bienestar emocional, la relajación y el equilibrio del sistema nervioso ante el estrés cotidiano.' },
      { title: 'Cómo tomar NO STRESS', body: 'Se toma un sobre en agua fría, antes de dormir o durante el día. No produce sueño.' },
      { title: 'Comprar NO STRESS en Chile', body: 'Puedes pedirlo con asesoría para revisar si NO STRESS encaja con tu rutina de bienestar emocional.' }
    ],
    faqs: [
      { question: '¿NO STRESS produce sueño?', answer: 'No produce sueño. Puede usarse en cualquier momento que se necesite apoyo para el estrés.' },
      { question: '¿NO STRESS o ON?', answer: 'NO STRESS en relajación y equilibrio. ON en vigor mental y concentración.' },
      { question: '¿NO STRESS puede tomarlo cualquier persona?', answer: 'Puede acompañar el bienestar emocional. Ante condiciones específicas, consulta con un profesional.' }
    ],
    relatedSlugs: ['on', 'vita-xtra-t-plus', 'nutraday']
  },
  'youth-elixir': {
    seoTitle: 'Youth Elixir HGH — Vitalidad Anti-Edad y Hormona de la Juventud Natural | Chile',
    metaDescription: 'Youth Elixir HGH combina aminoácidos, antioxidantes, OptiBerrys y vitamina C para estimular la hormona de la juventud natural. Conoce beneficios.',
    intro: 'YOUTH ELIXIR combina aminoácidos, antioxidantes, OptiBerrys, vitamina C y super frutas en una bebida funcional orientada a estimular la glándula pituitaria y apoyar la secreción natural de la hormona del crecimiento.',
    seoHeading: 'Vitalidad Anti-Edad y Hormona de la Juventud',
    searchIntent: [
      { title: '¿Para qué sirve Youth Elixir?', body: 'Mantiene la vitalidad, retarda los efectos del envejecimiento prematuro y mejora la calidad del sueño.' },
      { title: 'Cómo tomar Youth Elixir', body: 'Se toma un sobre en agua fría, preferiblemente en la noche.' },
      { title: 'Comprar Youth Elixir en Chile', body: 'Puedes pedirlo con asesoría para revisar si Youth Elixir encaja con tu rutina anti-edad.' }
    ],
    faqs: [
      { question: '¿Youth Elixir contiene hormonas?', answer: 'No contiene hormonas. Estimula la glándula pituitaria de forma natural.' },
      { question: '¿Youth Elixir o Beauty-In?', answer: 'Youth Elixir en vitalidad y hormona de la juventud. Beauty-In en colágeno y cuidado de la piel.' },
      { question: '¿Youth Elixir puede tomarlo cualquier persona?', answer: 'Puede acompañar la vitalidad. Ante condiciones específicas, consulta con un profesional.' }
    ],
    relatedSlugs: ['beauty-in', 'golden-flx', 'probal']
  },
  'beauty-in': {
    seoTitle: 'Beauty-In — Colágeno Bioactivo Tipo 1 y 3 con CoQ10 y Biotina | Chile',
    metaDescription: 'Beauty-In combina colágeno bioactivo, CoQ10, biotina natural, vitamina E y super frutas para piel, cabello y uñas saludables. Conoce beneficios.',
    intro: 'BEAUTY-IN combina péptidos de colágeno bioactivo optimizado tipos 1 y 3, CoEnzima Q10, Sesbania (biotina natural), vitamina E, super frutas y zinc para nutrir la piel desde adentro.',
    seoHeading: 'Colágeno Bioactivo para Piel, Cabello y Uñas',
    searchIntent: [
      { title: '¿Para qué sirve Beauty-In?', body: 'Nutre la piel desde adentro, mejora la estructura de la dermis y fortalece cabello y uñas.' },
      { title: 'Cómo tomar Beauty-In', body: 'Se toma un sobre en agua fría, antes de dormir o en ayunas.' },
      { title: 'Comprar Beauty-In en Chile', body: 'Puedes pedirlo con asesoría para revisar si Beauty-In encaja con tu rutina de belleza.' }
    ],
    faqs: [
      { question: '¿Beauty-In tiene colágeno hidrolizado?', answer: 'No. Usa colágeno bioactivo optimizado (4 veces más potente que el hidrolizado convencional).' },
      { question: '¿Beauty-In o Youth Elixir?', answer: 'Beauty-In en colágeno y belleza. Youth Elixir en vitalidad y hormona de la juventud.' },
      { question: '¿Beauty-In puede tomarlo cualquier persona?', answer: 'Puede acompañar la belleza natural. Ante condiciones específicas, consulta con un profesional.' }
    ],
    relatedSlugs: ['youth-elixir', 'golden-flx', 'passion']
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
  },
  'liquid-fiber': {
    semanticTerms: ['fibra prebiotica', 'transito intestinal', 'digestion saludable', 'flora intestinal', 'vitaminas', 'minerales', 'evacuaciones regulares', 'bienestar digestivo', 'estrenimiento leve', 'absorcion de nutrientes'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Liquid Fiber combina fibra prebiotica, vitaminas y minerales en un formato suave para el sistema digestivo. Es una opcion menos agresiva que PRUNEX 1, ideal para quienes buscan apoyo digestivo diario.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que quieren mantener un transito intestinal regular, mejorar la absorcion de minerales y apoyar el balance de la flora intestinal sin recurrir a un plan agresivo.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria, antes de dormir o en ayunas. Puede integrarse como parte de una rutina de bienestar digestivo junto con hidratacion adecuada y alimentacion equilibrada.' },
      { title: 'Personas que suelen buscarlo', body: 'Personas con estrenimiento leve o esporadico, quienes buscan una opcion de fibra diaria para toda la familia, o quienes desean un producto digestivo suave y de uso cotidiano.' },
      { title: 'Productos relacionados', body: 'PRUNEX 1 es una opcion mas intensa para transito intestinal. FLORA LIV aporta probioticos para el equilibrio de la microbiota. REXET apoya el bienestar hepatico.' }
    ],
    internalLinks: [
      { slug: 'prunex-1', reason: 'Como alternativa mas intensa para transito intestinal.' },
      { slug: 'flora-liv', reason: 'Para complementar con probioticos y equilibrio de microbiota.' },
      { slug: 'rexet', reason: 'Si se busca apoyo hepatico junto con la rutina digestiva.' }
    ]
  },
  'on': {
    semanticTerms: ['vigor mental', 'concentracion', 'memoria', 'funcion neuronal', 'taurina', 'yerba mate', 'camu camu', 'vitaminas B', 'DHA', 'aprendizaje'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'ON combina taurina, yerba mate, camu camu, vitaminas del complejo B, minerales organicos, DHA y ARA para apoyar la funcion neuronal y la energia mental.' },
      { title: 'Para que esta pensado', body: 'Esta orientado a personas que buscan mantener la mente activa y alerta, mejorar la concentracion, potenciar el aprendizaje y nutrir el cerebro en su rutina diaria.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria a la hora que se desee. Puede usarse durante jornadas de estudio, trabajo intelectual o cuando se necesita mayor claridad mental.' },
      { title: 'Personas que suelen buscarlo', body: 'Estudiantes, profesionales con alta demanda cognitiva, personas que sienten niebla mental o fatiga intelectual, y quienes buscan un apoyo natural para la memoria y el enfoque.' },
      { title: 'Productos relacionados', body: 'NO STRESS complementa el bienestar mental desde la relajacion y el equilibrio del sistema nervioso. VITA XTRA T+ aporta energia diaria. NUTRADAY ofrece nutricion general.' }
    ],
    internalLinks: [
      { slug: 'no-stress', reason: 'Para complementar el bienestar mental con apoyo para el estres y la relajacion.' },
      { slug: 'vita-xtra-t-plus', reason: 'Si se busca energia diaria adicional junto con el enfoque mental.' },
      { slug: 'nutraday', reason: 'Para una base de nutricion general que apoye el rendimiento cognitivo.' }
    ]
  },
  'no-stress': {
    semanticTerms: ['estres', 'ansiedad', 'relajacion', 'sistema nervioso', 'glicina', 'triptofano', 'magnesio', 'vitaminas B', 'bienestar emocional', 'equilibrio mental'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'NO STRESS combina aminoacidos como glicina y triptofano, magnesio organico, concentrado de limon y vitaminas del complejo B para apoyar la nutricion neuronal y el equilibrio del sistema nervioso.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que enfrentan momentos de tension, estres cotidiano o ansiedad, y buscan mantener el cerebro relajado, enfocado y positivo sin producir somnolencia.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria, antes de dormir o durante el dia. No produce sueno, por lo que puede usarse en cualquier momento que se necesite apoyo para el estres.' },
      { title: 'Personas que suelen buscarlo', body: 'Personas con ritmo de vida acelerado, altos niveles de estres laboral o academico, quienes buscan equilibrio emocional y resistencia ante situaciones de tension.' },
      { title: 'Productos relacionados', body: 'ON apoya la concentracion y el vigor mental desde otro angulo. VITA XTRA T+ aporta energia diaria. NUTRADAY ofrece una base de nutricion general para el bienestar.' }
    ],
    internalLinks: [
      { slug: 'on', reason: 'Para complementar el enfoque y la concentracion mental.' },
      { slug: 'vita-xtra-t-plus', reason: 'Si se necesita energia diaria para afrontar jornadas exigentes.' },
      { slug: 'nutraday', reason: 'Para una base nutricional que apoye el bienestar general.' }
    ]
  },
  'protein-active-fit': {
    semanticTerms: ['proteina vegetal', 'control de peso', 'saciedad', 'tonificacion muscular', 'quinua germinada', 'metabolismo', 'biodisponibilidad', 'batido proteico', 'apetito', 'quema de grasa'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Protein Active Fit combina BioProtein Active (quinua germinada, arveja, arroz germinado, algas), enzimas, vitaminas, L-lisina, cromo y zinc en un batido proteico 100% vegetal.' },
      { title: 'Para que esta pensado', body: 'Esta orientado a personas que buscan control de peso, saciedad, tonificacion muscular y un aporte proteico de alta biodisponibilidad dentro de una rutina de alimentacion ordenada.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria, de media manana o media tarde. Puede usarse como reemplazo de una colacion o como apoyo proteico despues de actividad fisica.' },
      { title: 'Personas que suelen buscarlo', body: 'Personas en rutinas de control de peso que buscan reducir el apetito, quienes desean una fuente de proteina vegetal de calidad, y deportistas que buscan tonificar sin productos de origen animal.' },
      { title: 'Productos relacionados', body: 'THERMO T3 apoya la energia y el metabolismo antes del ejercicio. NOCARB-T ayuda a controlar carbohidratos en las comidas. BIOPROTEIN ACTIVE es la base proteica sin enfoque de control de peso.' }
    ],
    internalLinks: [
      { slug: 'thermo-t3', reason: 'Para energia y metabolismo antes del entrenamiento.' },
      { slug: 'nocarb-t', reason: 'Para complementar el control de carbohidratos en las comidas.' },
      { slug: 'nutraday', reason: 'Para una base de nutricion diaria que acompanie la rutina fit.' }
    ]
  },
  'golden-flx': {
    semanticTerms: ['curcuma', 'antiinflamatorio natural', 'articulaciones', 'movilidad', 'jengibre', 'cardamomo', 'antioxidante', 'dolor articular', 'bienestar fisico', 'analgesico natural'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Golden FLX combina curcuma organica certificada, jengibre, cardamomo, leche de coco, pimienta negra y canela en una bebida funcional con propiedades antioxidantes y antiinflamatorias naturales.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que buscan apoyo para la movilidad articular, bienestar fisico y una opcion natural antiinflamatoria que ayude a mantener un estilo de vida activo y sin molestias.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua caliente a la hora que se desee. Puede integrarse como parte de una rutina de bienestar fisico, especialmente para quienes tienen actividad fisica regular o molestias articulares.' },
      { title: 'Personas que suelen buscarlo', body: 'Personas con molestias articulares leves, deportistas que buscan apoyo para la recuperacion, adultos mayores que quieren mantener la movilidad, y quienes prefieren opciones naturales antiinflamatorias.' },
      { title: 'Productos relacionados', body: 'YOUTH ELIXIR apoya la vitalidad y el bienestar desde el enfoque anti-edad. BEAUTY-IN aporta colageno para piel y articulaciones. VITA XTRA T+ ofrece energia diaria.' }
    ],
    internalLinks: [
      { slug: 'vita-xtra-t-plus', reason: 'Para energia diaria que acompanie la movilidad y el bienestar fisico.' },
      { slug: 'nutraday', reason: 'Para una base de nutricion general que apoye el bienestar integral.' },
      { slug: 'rexet', reason: 'Si se busca apoyo hepatico y depurativo dentro de una rutina de bienestar.' }
    ]
  },
  'beauty-in': {
    semanticTerms: ['colageno', 'piel firme', 'anti-edad', 'coenzima Q10', 'biotina natural', 'elastina', 'cabello saludable', 'unas fuertes', 'belleza natural', 'vitamina E'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Beauty-In combina peptidos de colageno bioactivo optimizado tipos 1 y 3, CoEnzima Q10, Sesbania (biotina natural), vitamina E, super frutas y zinc. Su colageno es 4 veces mas potente que el hidrolizado convencional.' },
      { title: 'Objetivo del producto', body: 'Esta orientado a nutrir la piel desde adentro, mejorar la estructura de la dermis, aumentar fibras de colageno y elastina, y fortalecer cabello y unas. Apoya la belleza natural desde un enfoque interno.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria, antes de dormir o en ayunas. Puede integrarse como parte de una rutina de cuidado personal junto con hidratacion, alimentacion equilibrada y proteccion solar.' },
      { title: 'Perfil de usuario interesado', body: 'Mujeres y hombres interesados en el cuidado de la piel, personas que buscan mejorar firmeza y elasticidad, quienes desean fortalecer cabello y unas, y adultos que buscan opciones anti-edad naturales.' },
      { title: 'Relacion con otros productos FuXion', body: 'YOUTH ELIXIR complementa desde la vitalidad y la hormona de la juventud. GOLDEN FLX apoya la movilidad articular. PASSION aporta energia y vitalidad general.' }
    ],
    internalLinks: [
      { slug: 'youth-elixir', reason: 'Para complementar desde el enfoque anti-edad y vitalidad.' },
      { slug: 'golden-flx', reason: 'Para apoyo articular y bienestar fisico integral.' },
      { slug: 'passion', reason: 'Para energia y vitalidad que acompanen la rutina de belleza.' }
    ]
  },
  'youth-elixir': {
    semanticTerms: ['hormona de la juventud', 'anti-edad', 'vitalidad', 'aminoacidos', 'antioxidantes', 'optiberrys', 'vitamina C', 'super frutas', 'sueño reparador', 'envejecimiento saludable'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Youth Elixir combina aminoacidos, antioxidantes, OptiBerrys, vitamina C y super frutas en una bebida funcional orientada a estimular la glandula pituitaria y apoyar la secrecion natural de la hormona del crecimiento.' },
      { title: 'Objetivo del producto', body: 'Esta pensado para personas que buscan mantener la vitalidad, retadar los efectos del envejecimiento prematuro, mejorar la calidad del sueno y aumentar la energia natural del organismo.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria, preferiblemente en la noche. Puede integrarse como parte de una rutina de bienestar anti-edad junto con descanso adecuado y alimentacion equilibrada.' },
      { title: 'Perfil de usuario interesado', body: 'Adultos que buscan opciones anti-edad naturales, personas interesadas en vitalidad y bienestar prolongado, quienes desean mejorar la calidad del sueno y mantener un estilo de vida activo y saludable.' },
      { title: 'Relacion con otros productos FuXion', body: 'BEAUTY-IN aporta colageno para piel y tejidos. GOLDEN FLX apoya la movilidad articular. PROBAL complementa el equilibrio hormonal femenino.' }
    ],
    internalLinks: [
      { slug: 'beauty-in', reason: 'Para complementar con colageno y cuidado de la piel.' },
      { slug: 'golden-flx', reason: 'Para apoyo articular y movilidad dentro de la rutina anti-edad.' },
      { slug: 'probal', reason: 'Para equilibrio hormonal femenino y bienestar integral.' }
    ]
  },
  'vitaenergia': {
    semanticTerms: ['energia natural', 'multivitaminico', 'fatiga', 'aminoacidos', 'camu camu', 'luteina', 'regeneracion celular', 'defensas', 'antioxidantes', 'radicales libres'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Vitaenergia combina aminoacidos, vitaminas, minerales organicos, fibra prebiotica, camu camu y luteina (concentrado de Marigold) para apoyar la energia diaria y la nutricion celular.' },
      { title: 'Objetivo del producto', body: 'Esta orientado a disipar la sensacion de fatiga, mejorar la asimilacion de proteinas, apoyar los procesos de regeneracion celular y reforzar el sistema inmunologico de forma natural.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria a cualquier hora del dia. Puede usarse como parte de una rutina de bienestar diario, especialmente en momentos de baja energia o desgaste fisico.' },
      { title: 'Perfil de usuario interesado', body: 'Personas con sensacion de fatiga cotidiana, quienes buscan un multivitaminico funcional, adultos con rutinas exigentes, y personas interesadas en antioxidantes y proteccion celular.' },
      { title: 'Relacion con otros productos FuXion', body: 'VITA XTRA T+ ofrece energia con guayusa y te verde. NUTRADAY aporta hidratacion nutricional para toda la familia. VERA+ refuerza el sistema inmunologico.' }
    ],
    internalLinks: [
      { slug: 'vita-xtra-t-plus', reason: 'Para una opcion de energia con ingredientes estimulantes naturales.' },
      { slug: 'nutraday', reason: 'Para hidratacion nutricional diaria y vitaminas para la familia.' },
      { slug: 'vera-plus', reason: 'Para reforzar defensas y sistema inmunologico.' }
    ]
  },
  'bioprotein-active': {
    semanticTerms: ['proteina vegetal', 'quinua germinada', 'aminoacidos esenciales', 'regeneracion muscular', 'proteina de arveja', 'DHA', 'aceite de coco', 'biodisponibilidad', 'nutricion deportiva', '100% vegetal'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'BioProtein Active combina proteina de quinua germinada, arroz integral germinado, arveja y algas, ademas de aminoacidos, vitaminas, DHA, ARA y aceite de coco. Es una proteina 100% vegetal con alta biodisponibilidad.' },
      { title: 'Objetivo del producto', body: 'Esta pensado para quienes buscan una fuente de proteina vegetal de calidad, apoyar la regeneracion de tejidos, elevar el perfil proteico de forma eficaz y reducir el dano oxidativo.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria, de media manana o media tarde. Puede usarse como apoyo proteico despues de actividad fisica o como complemento nutricional en cualquier momento del dia.' },
      { title: 'Perfil de usuario interesado', body: 'Deportistas y personas activas que prefieren proteinas vegetales, vegetarianos y veganos, quienes buscan regeneracion muscular y recuperacion, y personas interesadas en nutricion celular de alta calidad.' },
      { title: 'Relacion con otros productos FuXion', body: 'PROTEIN ACTIVE FIT es la version con enfoque en control de peso. PRE SPORT prepara el cuerpo para la actividad deportiva. POST SPORT apoya la recuperacion muscular post-ejercicio.' }
    ],
    internalLinks: [
      { slug: 'protein-active-fit', reason: 'Para una opcion con enfoque en control de peso y saciedad.' },
      { slug: 'pre-sport-pro-edition', reason: 'Para preparar el cuerpo antes de la actividad deportiva.' },
      { slug: 'post-sport-pro-edition', reason: 'Para apoyar la recuperacion muscular despues del ejercicio.' }
    ]
  },
  'vera-plus': {
    semanticTerms: ['defensas', 'sistema inmunologico', 'aloe vera', 'beta glucanos', 'aminoacidos', 'hoja de oliva', 'estres oxidativo', 'bienestar respiratorio', 'resistencia natural', 'proteccion celular'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'VERA+ combina concentrado de Aloe Vera, Beta Glucanos, un mix de aminoacidos (acetilcisteina, glicina, L-glutamina) y concentrado de hoja de oliva para apoyar las defensas del organismo.' },
      { title: 'Objetivo del producto', body: 'Esta orientado a reforzar el sistema inmunologico, aumentar la resistencia natural del organismo, apoyar el bienestar respiratorio y reducir el estres oxidativo dentro de habitos saludables.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua caliente, antes de dormir o cuando se desee. Puede integrarse en una rutina de cuidado inmunologico, especialmente en epocas de cambio de estacion o mayor exposicion.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que buscan reforzar sus defensas de forma natural, quienes se exponen a cambios climaticos o ambientes con alta carga viral, y adultos interesados en el cuidado del sistema respiratorio.' },
      { title: 'Relacion con otros productos FuXion', body: 'GANO+ CAPPUCCINO tambien apoya las defensas con beta-glucanos. VITAENERGIA aporta vitaminas y antioxidantes. NUTRADAY ofrece una base de nutricion diaria.' }
    ],
    internalLinks: [
      { slug: 'vitaenergia', reason: 'Para complementar con vitaminas y energia diaria.' },
      { slug: 'nutraday', reason: 'Para una base de nutricion general que apoye el bienestar.' },
      { slug: 'flora-liv', reason: 'Para apoyar la flora intestinal y las defensas desde el sistema digestivo.' }
    ]
  },
  'post-sport-pro-edition': {
    semanticTerms: ['recuperacion muscular', 'BCAAs', 'glutamina', 'aminoacidos', 'rehidratacion', 'electrolitos', 'agua de coco', 'acelora', 'granada', 'proteccion articular'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'POST SPORT PRO EDITION combina aminoacidos (BCAAs + Glutamina), acerola, granada y agua de coco para apoyar la recuperacion muscular, proteger articulaciones y reponer sales minerales perdidas durante el ejercicio.' },
      { title: 'Objetivo del producto', body: 'Esta orientado a terminar el ejercicio de la mejor forma, ayudando a recuperar, incrementar y fortalecer fibras musculares despues de la actividad deportiva.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria al terminar de hacer ejercicio. Es el complemento ideal para cerrar la rutina deportiva con una recuperacion efectiva.' },
      { title: 'Perfil de usuario interesado', body: 'Deportistas y personas activas que buscan optimizar su recuperacion muscular, quienes realizan entrenamiento de fuerza o resistencia, y personas que quieren proteger sus articulaciones despues del ejercicio.' },
      { title: 'Relacion con otros productos FuXion', body: 'PRE SPORT PRO EDITION prepara el cuerpo antes del ejercicio. BIOPROTEIN ACTIVE aporta proteina vegetal para regeneracion muscular. PROTEIN ACTIVE FIT ofrece proteina con enfoque en control de peso.' }
    ],
    internalLinks: [
      { slug: 'pre-sport-pro-edition', reason: 'Para preparar el cuerpo antes de la actividad deportiva.' },
      { slug: 'bioprotein-active', reason: 'Para proteina vegetal y regeneracion muscular.' },
      { slug: 'protein-active-fit', reason: 'Para proteina con enfoque en control de peso y saciedad.' }
    ]
  },
  'cafe-cafe-fit-cappuccino': {
    semanticTerms: ['cafe', 'cappuccino', 'energia diaria', 'control de peso', 'cafe tostado', 'leche descremada', 'bebida caliente', 'estimulante natural', 'desayuno funcional', 'sabor cappuccino'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'CAFE & CAFE FIT CAPPUCCINO combina cafe tostado liofilizado, leche descremada y crema para cafe en un formato practico de cappuccino instantaneo con enfoque en energia diaria y control de peso.' },
      { title: 'Objetivo del producto', body: 'Esta pensado para quienes buscan una bebida caliente con sabor a cappuccino que aporte energia diaria y pueda acompanar rutinas de control de peso dentro de una alimentacion ordenada.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua caliente durante el dia. Se recomienda evitar su consumo en la noche si se es sensible a la cafeina.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que disfrutan del cafe y buscan una opcion funcional, quienes quieren una bebida caliente que aporte energia sin descuidar el control de peso, y amantes del cappuccino en formato instantaneo.' },
      { title: 'Relacion con otros productos FuXion', body: 'THERMO T3 ofrece energia para entrenamiento. VITA XTRA T+ aporta energia natural con guayusa y te verde. NUTRADAY ofrece hidratacion nutricional diaria.' }
    ],
    internalLinks: [
      { slug: 'thermo-t3', reason: 'Para energia y metabolismo antes del entrenamiento.' },
      { slug: 'vita-xtra-t-plus', reason: 'Para energia natural diaria con ingredientes estimulantes.' },
      { slug: 'nutraday', reason: 'Para hidratacion nutricional diaria y vitaminas.' }
    ]
  },
  'pack-5-14': {
    semanticTerms: ['pack control de peso', 'combo nutricional', 'bajada de medidas', 'plan 5/14', 'rutina de control', 'asesoria personalizada', 'resultados progresivos', 'habitos alimentarios', 'metabolismo', 'transformacion corporal'],
    deepSections: [
      { title: 'Que incluye el Pack 5/14', body: 'El PACK 5/14 es un combo de productos FuXion disenado para apoyar rutinas de control de peso y medidas. Su composicion exacta puede variar segun disponibilidad, por lo que se recomienda consultar con un asesor antes de confirmar el pedido.' },
      { title: 'Objetivo del pack', body: 'Esta orientado a personas que buscan un plan estructurado de apoyo para control de peso, con productos que se complementan entre si para potenciar resultados dentro de una rutina de alimentacion ordenada y actividad fisica.' },
      { title: 'Rutina recomendada', body: 'Se debe seguir la pauta del pack segun la indicacion del asesor. Incluye productos con horarios especificos que se adaptan a la rutina diaria de la persona.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que buscan un plan completo de control de peso, quienes prefieren un combo guiado por un asesor, y personas que quieren resultados progresivos con acompanamiento personalizado.' },
      { title: 'Relacion con otros productos FuXion', body: 'THERMO T3 y NOCARB-T suelen ser parte de rutinas de control de peso. PROTEIN ACTIVE FIT aporta proteina y saciedad. La asesoria personalizada ayuda a definir la mejor combinacion.' }
    ],
    internalLinks: [
      { slug: 'thermo-t3', reason: 'Para energia y metabolismo en rutinas de control de peso.' },
      { slug: 'nocarb-t', reason: 'Para acompanar comidas con carbohidratos dentro del plan.' },
      { slug: 'protein-active-fit', reason: 'Para proteina vegetal y saciedad en la rutina.' }
    ]
  },
  probal: {
    semanticTerms: ['salud femenina', 'balance hormonal', 'menopausia', 'ciclo menstrual', 'aguaje', 'oregano', 'triptofano', 'magnesio', 'camu camu', 'luteina', 'bienestar hormonal', 'cambios de humor'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'PROBAL combina concentrado de Aguaje, concentrado de Oregano, Triptofano, Magnesio, Camu-Camu y Marigold (Luteina) en un te herbal orientado al equilibrio hormonal femenino.' },
      { title: 'Objetivo del producto', body: 'Esta pensado para proteger el balance vital de la mujer, reformar la salud femenina, equilibrar desbalances hormonales, controlar molestias del periodo y mantener el balance durante la menopausia.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua caliente, preferiblemente antes de dormir. Puede integrarse como parte de una rutina de bienestar hormonal femenino.' },
      { title: 'Perfil de usuario interesado', body: 'Mujeres que buscan equilibrio hormonal natural, quienes experimentan molestias del periodo o cambios de humor, mujeres en etapa de menopausia o perimenopausia, y quienes buscan apoyo para la salud femenina integral.' },
      { title: 'Relacion con otros productos FuXion', body: 'YOUTH ELIXIR apoya la vitalidad y el enfoque anti-edad. BEAUTY-IN aporta colageno para piel y tejidos. PASSION ofrece energia y vitalidad general.' }
    ],
    internalLinks: [
      { slug: 'youth-elixir', reason: 'Para complementar desde el enfoque anti-edad y vitalidad.' },
      { slug: 'beauty-in', reason: 'Para colageno y cuidado de la piel en la rutina femenina.' },
      { slug: 'passion', reason: 'Para energia y vitalidad que acompanen el bienestar hormonal.' }
    ]
  },
  'berry-balance': {
    semanticTerms: ['tracto urinario', 'cranberry', 'probioticos', 'antioxidantes', 'berries', 'acerola', 'camu camu', 'flora urinaria', 'ph saludable', 'bienestar urinario'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Berry Balance combina berries, cranberry, acerola, camu camu, pina, probioticos, calcio y antioxidantes para apoyar la salud del tracto urinario y el equilibrio de la flora protectora urinaria.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que buscan cuidar su sistema urinario de forma natural, favorecer el equilibrio del pH y prevenir molestias urinarias recurrentes dentro de una rutina de bienestar.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un stick disuelto en 180 ml de agua fria, 1 o 2 veces al dia, preferiblemente entre comidas o con el estomago vacio. Puede integrarse como parte de una rutina de hidratacion funcional.' },
      { title: 'Perfil de usuario interesado', body: 'Personas con tendencia a molestias urinarias, quienes buscan apoyo natural para el tracto urinario, mujeres que quieren cuidar su salud intima, y personas interesadas en probioticos y antioxidantes.' },
      { title: 'Productos relacionados', body: 'VERA+ refuerza las defensas del organismo. FLORA LIV apoya el equilibrio de la flora intestinal. NUTRADAY ofrece hidratacion nutricional diaria.' }
    ],
    internalLinks: [
      { slug: 'vera-plus', reason: 'Para reforzar defensas y sistema inmunologico.' },
      { slug: 'flora-liv', reason: 'Para apoyar el equilibrio de la flora intestinal.' },
      { slug: 'nutraday', reason: 'Para hidratacion nutricional diaria y vitaminas.' }
    ]
  },
  'alpha-balance': {
    semanticTerms: ['limpieza de sangre', 'metales pesados', 'alfalfa', 'clorofila', 'algas', 'chlorella', 'espirulina', 'pasto de trigo', 'alcalinizante', 'toxinas'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Alpha Balance combina alfalfa, algas (chlorella y espirulina), pasto de trigo, espinaca, manzana verde, limon, jengibre y minerales como magnesio y zinc para apoyar la limpieza del organismo.' },
      { title: 'Para que esta pensado', body: 'Esta orientado a personas que buscan apoyar la limpieza natural del organismo, contribuir a la eliminacion de toxinas y metales pesados, y alcalinizar el cuerpo dentro de una rutina de bienestar.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria, preferiblemente en ayunas o cuando se tenga sed. Puede integrarse como parte de una rutina matutina de bienestar y depuracion natural.' },
      { title: 'Perfil de usuario interesado', body: 'Personas interesadas en la limpieza natural del organismo, quienes buscan eliminar toxinas, personas con problemas de acne o piel, y quienes desean alcalinizar su cuerpo de forma natural.' },
      { title: 'Productos relacionados', body: 'REXET apoya el bienestar hepatico y la funcion depurativa. FLORA LIV contribuye al equilibrio intestinal. VITAENERGIA aporta vitaminas y antioxidantes.' }
    ],
    internalLinks: [
      { slug: 'rexet', reason: 'Para apoyo hepatico y funcion depurativa.' },
      { slug: 'flora-liv', reason: 'Para complementar con equilibrio intestinal.' },
      { slug: 'vitaenergia', reason: 'Para vitaminas, energia y antioxidantes.' }
    ]
  },
  'gano-plus-cappuccino': {
    semanticTerms: ['defensas', 'sistema inmunologico', 'beta glucanos', 'quilaya', 'cappuccino', 'bebida caliente', 'inmunidad', 'higado', 'estres oxidativo', 'bienestar general'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Gano+ Cappuccino combina beta-D-glucanos, extractos de quilaya y micronutrientes en una bebida caliente sabor cappuccino, orientada a reforzar el sistema inmunologico y proteger el higado.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que buscan subir sus defensas de forma natural, reforzar el sistema inmunologico, proteger el higado y reducir el dano oxidativo dentro de una rutina de bienestar diario.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua caliente a la hora que se desee. Puede integrarse como una bebida caliente funcional en la rutina diaria, especialmente en epocas de cambio de estacion.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que buscan reforzar sus defensas, quienes se exponen a cambios climaticos, amantes del cappuccino que quieren una opcion funcional, y adultos interesados en el cuidado inmunologico.' },
      { title: 'Productos relacionados', body: 'VERA+ tambien apoya las defensas con aloe vera y beta glucanos. VITAENERGIA aporta vitaminas y antioxidantes. NUTRADAY ofrece hidratacion nutricional diaria.' }
    ],
    internalLinks: [
      { slug: 'vera-plus', reason: 'Para reforzar defensas con aloe vera y beta glucanos.' },
      { slug: 'vitaenergia', reason: 'Para vitaminas, energia y proteccion antioxidante.' },
      { slug: 'nutraday', reason: 'Para hidratacion nutricional diaria y bienestar general.' }
    ]
  },
  'pre-sport-pro-edition': {
    semanticTerms: ['pre entreno', 'rendimiento deportivo', 'aminoacidos', 'electrolitos', 'resistencia', 'sandia', 'yerba mate', 'beterraga', 'hidratacion deportiva', 'energia para entrenar'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'PRE SPORT PRO EDITION combina aminoacidos, concentrados vegetales de sandia, yerba mate y beterraga, y minerales en molecula organica para preparar el cuerpo antes de la actividad deportiva.' },
      { title: 'Para que esta pensado', body: 'Esta orientado a preparar el cuerpo para la actividad deportiva intensa, mejorar el rendimiento durante el ejercicio, mantener la hidratacion corporal y aumentar la resistencia fisica.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria antes de iniciar la rutina de ejercicio. Es el complemento ideal para abrir la ventana deportiva con energia, hidratacion y preparacion muscular.' },
      { title: 'Perfil de usuario interesado', body: 'Deportistas y personas activas que buscan optimizar su rendimiento, quienes realizan entrenamiento de alta intensidad, y personas que quieren preparar su cuerpo antes del ejercicio.' },
      { title: 'Productos relacionados', body: 'POST SPORT PRO EDITION apoya la recuperacion muscular despues del ejercicio. BIOPROTEIN ACTIVE aporta proteina vegetal para regeneracion. THERMO T3 ofrece energia y metabolismo.' }
    ],
    internalLinks: [
      { slug: 'post-sport-pro-edition', reason: 'Para recuperacion muscular despues del ejercicio.' },
      { slug: 'bioprotein-active', reason: 'Para proteina vegetal y regeneracion muscular.' },
      { slug: 'thermo-t3', reason: 'Para energia y metabolismo antes del entrenamiento.' }
    ]
  },
  passion: {
    semanticTerms: ['energia vital', 'potencia sexual', 'fertilidad', 'ginseng', 'jalea real', 'aminoacidos', 'zinc', 'circulacion', 'vigor', 'bienestar hormonal'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'PASSION combina aminoacidos, concentrado de jalea real, ginseng y zinc para apoyar la energia vital, la potencia sexual y la fertilidad tanto en hombres como en mujeres.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que buscan elevar su nivel de energia y vigor, favorecer la fertilidad, mejorar la circulacion y mantener una vida intima saludable y activa.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria a la hora que se desee. Puede integrarse como parte de una rutina de bienestar general y vitalidad diaria.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que buscan aumentar su energia y vitalidad, quienes desean apoyo para la salud sexual y fertilidad, hombres y mujeres interesados en el bienestar hormonal y la circulacion.' },
      { title: 'Productos relacionados', body: 'YOUTH ELIXIR apoya la vitalidad y el enfoque anti-edad. BEAUTY-IN aporta colageno para piel y tejidos. PROBAL complementa el equilibrio hormonal femenino.' }
    ],
    internalLinks: [
      { slug: 'youth-elixir', reason: 'Para complementar desde el enfoque anti-edad y vitalidad.' },
      { slug: 'beauty-in', reason: 'Para colageno y cuidado de la piel.' },
      { slug: 'probal', reason: 'Para equilibrio hormonal femenino y bienestar integral.' }
    ]
  },
  'liquid-fiber': {
    semanticTerms: ['fibra prebiotica', 'transito intestinal', 'digestion saludable', 'flora intestinal', 'vitaminas', 'minerales', 'evacuaciones regulares', 'bienestar digestivo', 'estrenimiento leve', 'absorcion de nutrientes'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Liquid Fiber combina fibra prebiotica, vitaminas y minerales en un formato suave para el sistema digestivo. Es una opcion menos agresiva que PRUNEX 1, ideal para quienes buscan apoyo digestivo diario.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que quieren mantener un transito intestinal regular, mejorar la absorcion de minerales y apoyar el balance de la flora intestinal sin recurrir a un plan agresivo.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria, antes de dormir o en ayunas. Puede integrarse como parte de una rutina de bienestar digestivo junto con hidratacion adecuada y alimentacion equilibrada.' },
      { title: 'Personas que suelen buscarlo', body: 'Personas con estrenimiento leve o esporadico, quienes buscan una opcion de fibra diaria para toda la familia, o quienes desean un producto digestivo suave y de uso cotidiano.' },
      { title: 'Productos relacionados', body: 'PRUNEX 1 es una opcion mas intensa para transito intestinal. FLORA LIV aporta probioticos para el equilibrio de la microbiota. REXET apoya el bienestar hepatico.' }
    ],
    internalLinks: [
      { slug: 'prunex-1', reason: 'Como alternativa mas intensa para transito intestinal.' },
      { slug: 'flora-liv', reason: 'Para complementar con probioticos y equilibrio de microbiota.' },
      { slug: 'rexet', reason: 'Si se busca apoyo hepatico junto con la rutina digestiva.' }
    ]
  },
  'berry-balance': {
    semanticTerms: ['tracto urinario', 'cranberry', 'probioticos', 'antioxidantes', 'berries', 'acerola', 'camu camu', 'flora urinaria', 'ph saludable', 'bienestar urinario'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Berry Balance combina berries, cranberry, acerola, camu camu, piña, probióticos, calcio y antioxidantes para apoyar la salud del tracto urinario y el equilibrio de la flora protectora urinaria.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que buscan cuidar su sistema urinario de forma natural, favorecer el equilibrio del pH y prevenir molestias urinarias recurrentes dentro de una rutina de bienestar.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un stick disuelto en 180 ml de agua fria, 1 o 2 veces al dia, preferiblemente entre comidas o con el estomago vacio.' },
      { title: 'Perfil de usuario interesado', body: 'Personas con tendencia a molestias urinarias, quienes buscan apoyo natural para el tracto urinario, mujeres que quieren cuidar su salud intima, y personas interesadas en probioticos y antioxidantes.' },
      { title: 'Productos relacionados', body: 'VERA+ refuerza las defensas del organismo. FLORA LIV apoya el equilibrio de la flora intestinal. NUTRADAY ofrece hidratacion nutricional diaria.' }
    ],
    internalLinks: [
      { slug: 'vera-plus', reason: 'Para reforzar defensas y sistema inmunologico.' },
      { slug: 'flora-liv', reason: 'Para apoyar el equilibrio de la flora intestinal.' },
      { slug: 'nutraday', reason: 'Para hidratacion nutricional diaria y vitaminas.' }
    ]
  },
  'alpha-balance': {
    semanticTerms: ['limpieza de sangre', 'metales pesados', 'alfalfa', 'clorofila', 'algas', 'chlorella', 'espirulina', 'pasto de trigo', 'alcalinizante', 'toxinas'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Alpha Balance combina alfalfa, algas (chlorella y espirulina), pasto de trigo, espinaca, manzana verde, limon, jengibre y minerales como magnesio y zinc para apoyar la limpieza del organismo.' },
      { title: 'Para que esta pensado', body: 'Esta orientado a personas que buscan apoyar la limpieza natural del organismo, contribuir a la eliminacion de toxinas y metales pesados, y alcalinizar el cuerpo dentro de una rutina de bienestar.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria, preferiblemente en ayunas o cuando se tenga sed. Puede integrarse como parte de una rutina matutina de bienestar y depuracion natural.' },
      { title: 'Perfil de usuario interesado', body: 'Personas interesadas en la limpieza natural del organismo, quienes buscan eliminar toxinas, personas con problemas de acne o piel, y quienes desean alcalinizar su cuerpo de forma natural.' },
      { title: 'Productos relacionados', body: 'REXET apoya el bienestar hepatico y la funcion depurativa. FLORA LIV contribuye al equilibrio intestinal. VITAENERGIA aporta vitaminas y antioxidantes.' }
    ],
    internalLinks: [
      { slug: 'rexet', reason: 'Para apoyo hepatico y funcion depurativa.' },
      { slug: 'flora-liv', reason: 'Para complementar con equilibrio intestinal.' },
      { slug: 'vitaenergia', reason: 'Para vitaminas, energia y antioxidantes.' }
    ]
  },
  'bioprotein-active': {
    semanticTerms: ['proteina vegetal', 'quinua germinada', 'aminoacidos esenciales', 'regeneracion muscular', 'proteina de arveja', 'DHA', 'aceite de coco', 'biodisponibilidad', 'nutricion deportiva', '100% vegetal'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'BioProtein Active combina proteina de quinua germinada, arroz integral germinado, arveja y algas, ademas de aminoacidos, vitaminas, DHA, ARA y aceite de coco. Es una proteina 100% vegetal con alta biodisponibilidad.' },
      { title: 'Objetivo del producto', body: 'Esta pensado para quienes buscan una fuente de proteina vegetal de calidad, apoyar la regeneracion de tejidos, elevar el perfil proteico de forma eficaz y reducir el dano oxidativo.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria, de media manana o media tarde. Puede usarse como apoyo proteico despues de actividad fisica o como complemento nutricional en cualquier momento del dia.' },
      { title: 'Perfil de usuario interesado', body: 'Deportistas y personas activas que prefieren proteinas vegetales, vegetarianos y veganos, quienes buscan regeneracion muscular y recuperacion, y personas interesadas en nutricion celular de alta calidad.' },
      { title: 'Relacion con otros productos FuXion', body: 'PROTEIN ACTIVE FIT es la version con enfoque en control de peso. PRE SPORT prepara el cuerpo para la actividad deportiva. POST SPORT apoya la recuperacion muscular post-ejercicio.' }
    ],
    internalLinks: [
      { slug: 'protein-active-fit', reason: 'Para una opcion con enfoque en control de peso y saciedad.' },
      { slug: 'pre-sport-pro-edition', reason: 'Para preparar el cuerpo antes de la actividad deportiva.' },
      { slug: 'post-sport-pro-edition', reason: 'Para apoyar la recuperacion muscular despues del ejercicio.' }
    ]
  },
  'vitaenergia': {
    semanticTerms: ['energia natural', 'multivitaminico', 'fatiga', 'aminoacidos', 'camu camu', 'luteina', 'regeneracion celular', 'defensas', 'antioxidantes', 'radicales libres'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Vitaenergia combina aminoacidos, vitaminas, minerales organicos, fibra prebiotica, camu camu y luteina (concentrado de Marigold) para apoyar la energia diaria y la nutricion celular.' },
      { title: 'Objetivo del producto', body: 'Esta orientado a disipar la sensacion de fatiga, mejorar la asimilacion de proteinas, apoyar los procesos de regeneracion celular y reforzar el sistema inmunologico de forma natural.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria a cualquier hora del dia. Puede usarse como parte de una rutina de bienestar diario, especialmente en momentos de baja energia o desgaste fisico.' },
      { title: 'Perfil de usuario interesado', body: 'Personas con sensacion de fatiga cotidiana, quienes buscan un multivitaminico funcional, adultos con rutinas exigentes, y personas interesadas en antioxidantes y proteccion celular.' },
      { title: 'Relacion con otros productos FuXion', body: 'VITA XTRA T+ ofrece energia con guayusa y te verde. NUTRADAY aporta hidratacion nutricional para toda la familia. VERA+ refuerza el sistema inmunologico.' }
    ],
    internalLinks: [
      { slug: 'vita-xtra-t-plus', reason: 'Para una opcion de energia con ingredientes estimulantes naturales.' },
      { slug: 'nutraday', reason: 'Para hidratacion nutricional diaria y vitaminas para la familia.' },
      { slug: 'vera-plus', reason: 'Para reforzar defensas y sistema inmunologico.' }
    ]
  },
  'vera-plus': {
    semanticTerms: ['defensas', 'sistema inmunologico', 'aloe vera', 'beta glucanos', 'aminoacidos', 'hoja de oliva', 'estres oxidativo', 'bienestar respiratorio', 'resistencia natural', 'proteccion celular'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'VERA+ combina concentrado de Aloe Vera, Beta Glucanos, un mix de aminoacidos (acetilcisteina, glicina, L-glutamina) y concentrado de hoja de oliva para apoyar las defensas del organismo.' },
      { title: 'Objetivo del producto', body: 'Esta orientado a reforzar el sistema inmunologico, aumentar la resistencia natural del organismo, apoyar el bienestar respiratorio y reducir el estres oxidativo dentro de habitos saludables.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua caliente, antes de dormir o cuando se desee. Puede integrarse en una rutina de cuidado inmunologico, especialmente en epocas de cambio de estacion o mayor exposicion.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que buscan reforzar sus defensas de forma natural, quienes se exponen a cambios climaticos o ambientes con alta carga viral, y adultos interesados en el cuidado del sistema respiratorio.' },
      { title: 'Relacion con otros productos FuXion', body: 'GANO+ CAPPUCCINO tambien apoya las defensas con beta-glucanos. VITAENERGIA aporta vitaminas y antioxidantes. NUTRADAY ofrece una base de nutricion diaria.' }
    ],
    internalLinks: [
      { slug: 'gano-plus-cappuccino', reason: 'Para complementar defensas con beta-glucanos en cappuccino.' },
      { slug: 'vitaenergia', reason: 'Para vitaminas, energia y proteccion antioxidante.' },
      { slug: 'nutraday', reason: 'Para hidratacion nutricional diaria y bienestar general.' }
    ]
  },
  'gano-plus-cappuccino': {
    semanticTerms: ['defensas', 'sistema inmunologico', 'beta glucanos', 'quilaya', 'cappuccino', 'bebida caliente', 'inmunidad', 'higado', 'estres oxidativo', 'bienestar general'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Gano+ Cappuccino combina beta-D-glucanos, extractos de quilaya y micronutrientes en una bebida caliente sabor cappuccino, orientada a reforzar el sistema inmunologico y proteger el higado.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que buscan subir sus defensas de forma natural, reforzar el sistema inmunologico, proteger el higado y reducir el dano oxidativo dentro de una rutina de bienestar diario.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua caliente a la hora que se desee. Puede integrarse como una bebida caliente funcional en la rutina diaria, especialmente en epocas de cambio de estacion.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que buscan reforzar sus defensas, quienes se exponen a cambios climaticos, amantes del cappuccino que quieren una opcion funcional, y adultos interesados en el cuidado inmunologico.' },
      { title: 'Relacion con otros productos FuXion', body: 'VERA+ tambien apoya las defensas con aloe vera y beta glucanos. VITAENERGIA aporta vitaminas y antioxidantes. NUTRADAY ofrece hidratacion nutricional diaria.' }
    ],
    internalLinks: [
      { slug: 'vera-plus', reason: 'Para reforzar defensas con aloe vera y beta glucanos.' },
      { slug: 'vitaenergia', reason: 'Para vitaminas, energia y proteccion antioxidante.' },
      { slug: 'nutraday', reason: 'Para hidratacion nutricional diaria y bienestar general.' }
    ]
  },
  'pre-sport-pro-edition': {
    semanticTerms: ['pre entreno', 'rendimiento deportivo', 'aminoacidos', 'electrolitos', 'resistencia', 'sandia', 'yerba mate', 'beterraga', 'hidratacion deportiva', 'energia para entrenar'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'PRE SPORT PRO EDITION combina aminoacidos, concentrados vegetales de sandia, yerba mate y beterraga, y minerales en molecula organica para preparar el cuerpo antes de la actividad deportiva.' },
      { title: 'Para que esta pensado', body: 'Esta orientado a preparar el cuerpo para la actividad deportiva intensa, mejorar el rendimiento durante el ejercicio, mantener la hidratacion corporal y aumentar la resistencia fisica.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria antes de iniciar la rutina de ejercicio. Es el complemento ideal para abrir la ventana deportiva con energia, hidratacion y preparacion muscular.' },
      { title: 'Perfil de usuario interesado', body: 'Deportistas y personas activas que buscan optimizar su rendimiento, quienes realizan entrenamiento de alta intensidad, y personas que quieren preparar su cuerpo antes del ejercicio.' },
      { title: 'Relacion con otros productos FuXion', body: 'POST SPORT PRO EDITION apoya la recuperacion muscular despues del ejercicio. BIOPROTEIN ACTIVE aporta proteina vegetal para regeneracion. THERMO T3 ofrece energia y metabolismo.' }
    ],
    internalLinks: [
      { slug: 'post-sport-pro-edition', reason: 'Para recuperacion muscular despues del ejercicio.' },
      { slug: 'bioprotein-active', reason: 'Para proteina vegetal y regeneracion muscular.' },
      { slug: 'thermo-t3', reason: 'Para energia y metabolismo antes del entrenamiento.' }
    ]
  },
  'post-sport-pro-edition': {
    semanticTerms: ['recuperacion muscular', 'BCAAs', 'glutamina', 'aminoacidos', 'rehidratacion', 'electrolitos', 'agua de coco', 'acelera', 'granada', 'proteccion articular'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'POST SPORT PRO EDITION combina aminoacidos (BCAAs + Glutamina), acerola, granada y agua de coco para apoyar la recuperacion muscular, proteger articulaciones y reponer sales minerales perdidas durante el ejercicio.' },
      { title: 'Objetivo del producto', body: 'Esta orientado a terminar el ejercicio de la mejor forma, ayudando a recuperar, incrementar y fortalecer fibras musculares despues de la actividad deportiva.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria al terminar de hacer ejercicio. Es el complemento ideal para cerrar la rutina deportiva con una recuperacion efectiva.' },
      { title: 'Perfil de usuario interesado', body: 'Deportistas y personas activas que buscan optimizar su recuperacion muscular, quienes realizan entrenamiento de fuerza o resistencia, y personas que quieren proteger sus articulaciones despues del ejercicio.' },
      { title: 'Relacion con otros productos FuXion', body: 'PRE SPORT PRO EDITION prepara el cuerpo antes del ejercicio. BIOPROTEIN ACTIVE aporta proteina vegetal para regeneracion muscular. PROTEIN ACTIVE FIT ofrece proteina con enfoque en control de peso.' }
    ],
    internalLinks: [
      { slug: 'pre-sport-pro-edition', reason: 'Para preparar el cuerpo antes de la actividad deportiva.' },
      { slug: 'bioprotein-active', reason: 'Para proteina vegetal y regeneracion muscular.' },
      { slug: 'protein-active-fit', reason: 'Para proteina con enfoque en control de peso y saciedad.' }
    ]
  },
  'cafe-cafe-fit-cappuccino': {
    semanticTerms: ['cafe', 'cappuccino', 'energia diaria', 'control de peso', 'cafe tostado', 'leche descremada', 'bebida caliente', 'estimulante natural', 'desayuno funcional', 'sabor cappuccino'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'CAFE & CAFE FIT CAPPUCCINO combina cafe tostado liofilizado, leche descremada y crema para cafe en un formato practico de cappuccino instantaneo con enfoque en energia diaria y control de peso.' },
      { title: 'Objetivo del producto', body: 'Esta pensado para quienes buscan una bebida caliente con sabor a cappuccino que aporte energia diaria y pueda acompanar rutinas de control de peso dentro de una alimentacion ordenada.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua caliente durante el dia. Se recomienda evitar su consumo en la noche si se es sensible a la cafeina.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que disfrutan del cafe y buscan una opcion funcional, quienes quieren una bebida caliente que aporte energia sin descuidar el control de peso, y amantes del cappuccino en formato instantaneo.' },
      { title: 'Relacion con otros productos FuXion', body: 'THERMO T3 ofrece energia para entrenamiento. VITA XTRA T+ aporta energia natural con guayusa y te verde. NUTRADAY ofrece hidratacion nutricional diaria.' }
    ],
    internalLinks: [
      { slug: 'thermo-t3', reason: 'Para energia y metabolismo antes del entrenamiento.' },
      { slug: 'vita-xtra-t-plus', reason: 'Para energia natural diaria con ingredientes estimulantes.' },
      { slug: 'nutraday', reason: 'Para hidratacion nutricional diaria y vitaminas.' }
    ]
  },
  'pack-5-14': {
    semanticTerms: ['pack control de peso', 'combo nutricional', 'bajada de medidas', 'plan 5/14', 'rutina de control', 'asesoria personalizada', 'resultados progresivos', 'habitos alimentarios', 'metabolismo', 'transformacion corporal'],
    deepSections: [
      { title: 'Que incluye el Pack 5/14', body: 'El PACK 5/14 es un combo de productos FuXion disenado para apoyar rutinas de control de peso y medidas. Su composicion exacta puede variar segun disponibilidad, por lo que se recomienda consultar con un asesor antes de confirmar el pedido.' },
      { title: 'Objetivo del pack', body: 'Esta orientado a personas que buscan un plan estructurado de apoyo para control de peso, con productos que se complementan entre si para potenciar resultados dentro de una rutina de alimentacion ordenada y actividad fisica.' },
      { title: 'Rutina recomendada', body: 'Se debe seguir la pauta del pack segun la indicacion del asesor. Incluye productos con horarios especificos que se adaptan a la rutina diaria de la persona.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que buscan un plan completo de control de peso, quienes prefieren un combo guiado por un asesor, y personas que quieren resultados progresivos con acompanamiento personalizado.' },
      { title: 'Relacion con otros productos FuXion', body: 'THERMO T3 y NOCARB-T suelen ser parte de rutinas de control de peso. PROTEIN ACTIVE FIT aporta proteina y saciedad. La asesoria personalizada ayuda a definir la mejor combinacion.' }
    ],
    internalLinks: [
      { slug: 'thermo-t3', reason: 'Para energia y metabolismo en rutinas de control de peso.' },
      { slug: 'nocarb-t', reason: 'Para acompanar comidas con carbohidratos dentro del plan.' },
      { slug: 'protein-active-fit', reason: 'Para proteina vegetal y saciedad en la rutina.' }
    ]
  },
  'probal': {
    semanticTerms: ['salud femenina', 'balance hormonal', 'menopausia', 'ciclo menstrual', 'aguaje', 'oregano', 'triptofano', 'magnesio', 'camu camu', 'luteina', 'bienestar hormonal', 'cambios de humor'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'PROBAL combina concentrado de Aguaje, concentrado de Oregano, Triptofano, Magnesio, Camu-Camu y Marigold (Luteina) en un te herbal orientado al equilibrio hormonal femenino.' },
      { title: 'Objetivo del producto', body: 'Esta pensado para proteger el balance vital de la mujer, reformar la salud femenina, equilibrar desbalances hormonales, controlar molestias del periodo y mantener el balance durante la menopausia.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua caliente, preferiblemente antes de dormir. Puede integrarse como parte de una rutina de bienestar hormonal femenino.' },
      { title: 'Perfil de usuario interesado', body: 'Mujeres que buscan equilibrio hormonal natural, quienes experimentan molestias del periodo o cambios de humor, mujeres en etapa de menopausia o perimenopausia, y quienes buscan apoyo para la salud femenina integral.' },
      { title: 'Relacion con otros productos FuXion', body: 'YOUTH ELIXIR apoya la vitalidad y el enfoque anti-edad. BEAUTY-IN aporta colageno para piel y tejidos. PASSION ofrece energia y vitalidad general.' }
    ],
    internalLinks: [
      { slug: 'youth-elixir', reason: 'Para complementar desde el enfoque anti-edad y vitalidad.' },
      { slug: 'beauty-in', reason: 'Para colageno y cuidado de la piel en la rutina femenina.' },
      { slug: 'passion', reason: 'Para energia y vitalidad que acompanen el bienestar hormonal.' }
    ]
  },
  'passion': {
    semanticTerms: ['energia vital', 'potencia sexual', 'fertilidad', 'ginseng', 'jalea real', 'aminoacidos', 'zinc', 'circulacion', 'vigor', 'bienestar hormonal'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'PASSION combina aminoacidos, concentrado de jalea real, ginseng y zinc para apoyar la energia vital, la potencia sexual y la fertilidad tanto en hombres como en mujeres.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que buscan elevar su nivel de energia y vigor, favorecer la fertilidad, mejorar la circulacion y mantener una vida intima saludable y activa.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria a la hora que se desee. Puede integrarse como parte de una rutina de bienestar general y vitalidad diaria.' },
      { title: 'Perfil de usuario interesado', body: 'Personas que buscan aumentar su energia y vitalidad, quienes desean apoyo para la salud sexual y fertilidad, hombres y mujeres interesados en el bienestar hormonal y la circulacion.' },
      { title: 'Productos relacionados', body: 'YOUTH ELIXIR apoya la vitalidad y el enfoque anti-edad. BEAUTY-IN aporta colageno para piel y tejidos. PROBAL complementa el equilibrio hormonal femenino.' }
    ],
    internalLinks: [
      { slug: 'youth-elixir', reason: 'Para complementar desde el enfoque anti-edad y vitalidad.' },
      { slug: 'beauty-in', reason: 'Para colageno y cuidado de la piel.' },
      { slug: 'probal', reason: 'Para equilibrio hormonal femenino y bienestar integral.' }
    ]
  },
  'golden-flx': {
    semanticTerms: ['curcuma', 'antiinflamatorio natural', 'articulaciones', 'movilidad', 'jengibre', 'cardamomo', 'antioxidante', 'dolor articular', 'bienestar fisico', 'analgesico natural'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Golden FLX combina curcuma organica certificada, jengibre, cardamomo, leche de coco, pimienta negra y canela en una bebida funcional con propiedades antioxidantes y antiinflamatorias naturales.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que buscan apoyo para la movilidad articular, bienestar fisico y una opcion natural antiinflamatoria que ayude a mantener un estilo de vida activo y sin molestias.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua caliente a la hora que se desee. Puede integrarse como parte de una rutina de bienestar fisico, especialmente para quienes tienen actividad fisica regular o molestias articulares.' },
      { title: 'Personas que suelen buscarlo', body: 'Personas con molestias articulares leves, deportistas que buscan apoyo para la recuperacion, adultos mayores que quieren mantener la movilidad, y quienes prefieren opciones naturales antiinflamatorias.' },
      { title: 'Productos relacionados', body: 'YOUTH ELIXIR apoya la vitalidad y el bienestar desde el enfoque anti-edad. BEAUTY-IN aporta colageno para piel y articulaciones. VITA XTRA T+ ofrece energia diaria.' }
    ],
    internalLinks: [
      { slug: 'vita-xtra-t-plus', reason: 'Para energia diaria que acompanie la movilidad y el bienestar fisico.' },
      { slug: 'nutraday', reason: 'Para una base de nutricion general que apoye el bienestar integral.' },
      { slug: 'rexet', reason: 'Si se busca apoyo hepatico y depurativo dentro de una rutina de bienestar.' }
    ]
  },
  'on': {
    semanticTerms: ['vigor mental', 'concentracion', 'memoria', 'funcion neuronal', 'taurina', 'yerba mate', 'camu camu', 'vitaminas B', 'DHA', 'aprendizaje'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'ON combina taurina, yerba mate, camu camu, vitaminas del complejo B, minerales organicos, DHA y ARA para apoyar la funcion neuronal y la energia mental.' },
      { title: 'Para que esta pensado', body: 'Esta orientado a personas que buscan mantener la mente activa y alerta, mejorar la concentracion, potenciar el aprendizaje y nutrir el cerebro en su rutina diaria.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria a la hora que se desee. Puede usarse durante jornadas de estudio, trabajo intelectual o cuando se necesita mayor claridad mental.' },
      { title: 'Personas que suelen buscarlo', body: 'Estudiantes, profesionales con alta demanda cognitiva, personas que sienten niebla mental o fatiga intelectual, y quienes buscan un apoyo natural para la memoria y el enfoque.' },
      { title: 'Productos relacionados', body: 'NO STRESS complementa el bienestar mental desde la relajacion y el equilibrio del sistema nervioso. VITA XTRA T+ aporta energia diaria. NUTRADAY ofrece nutricion general.' }
    ],
    internalLinks: [
      { slug: 'no-stress', reason: 'Para complementar el bienestar mental con apoyo para el estres y la relajacion.' },
      { slug: 'vita-xtra-t-plus', reason: 'Si se busca energia diaria adicional junto con el enfoque mental.' },
      { slug: 'nutraday', reason: 'Para una base de nutricion general que apoye el rendimiento cognitivo.' }
    ]
  },
  'no-stress': {
    semanticTerms: ['estres', 'ansiedad', 'relajacion', 'sistema nervioso', 'glicina', 'triptofano', 'magnesio', 'vitaminas B', 'bienestar emocional', 'equilibrio mental'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'NO STRESS combina aminoacidos como glicina y triptofano, magnesio organico, concentrado de limon y vitaminas del complejo B para apoyar la nutricion neuronal y el equilibrio del sistema nervioso.' },
      { title: 'Para que esta pensado', body: 'Esta pensado para personas que enfrentan momentos de tension, estres cotidiano o ansiedad, y buscan mantener el cerebro relajado, enfocado y positivo sin producir somnolencia.' },
      { title: 'Como incorporarlo a una rutina', body: 'Se toma un sobre en agua fria, antes de dormir o durante el dia. No produce sueno, por lo que puede usarse en cualquier momento que se necesite apoyo para el estres.' },
      { title: 'Personas que suelen buscarlo', body: 'Personas con ritmo de vida acelerado, altos niveles de estres laboral o academico, quienes buscan equilibrio emocional y resistencia ante situaciones de tension.' },
      { title: 'Productos relacionados', body: 'ON apoya la concentracion y el vigor mental desde otro angulo. VITA XTRA T+ aporta energia diaria. NUTRADAY ofrece una base de nutricion general para el bienestar.' }
    ],
    internalLinks: [
      { slug: 'on', reason: 'Para complementar el enfoque y la concentracion mental.' },
      { slug: 'vita-xtra-t-plus', reason: 'Si se necesita energia diaria para afrontar jornadas exigentes.' },
      { slug: 'nutraday', reason: 'Para una base nutricional que apoye el bienestar general.' }
    ]
  },
  'youth-elixir': {
    semanticTerms: ['hormona de la juventud', 'anti-edad', 'vitalidad', 'aminoacidos', 'antioxidantes', 'optiberrys', 'vitamina C', 'super frutas', 'sueño reparador', 'envejecimiento saludable'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Youth Elixir combina aminoacidos, antioxidantes, OptiBerrys, vitamina C y super frutas en una bebida funcional orientada a estimular la glandula pituitaria y apoyar la secrecion natural de la hormona del crecimiento.' },
      { title: 'Objetivo del producto', body: 'Esta pensado para personas que buscan mantener la vitalidad, retadar los efectos del envejecimiento prematuro, mejorar la calidad del sueno y aumentar la energia natural del organismo.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria, preferiblemente en la noche. Puede integrarse como parte de una rutina de bienestar anti-edad junto con descanso adecuado y alimentacion equilibrada.' },
      { title: 'Perfil de usuario interesado', body: 'Adultos que buscan opciones anti-edad naturales, personas interesadas en vitalidad y bienestar prolongado, quienes desean mejorar la calidad del sueno y mantener un estilo de vida activo y saludable.' },
      { title: 'Relacion con otros productos FuXion', body: 'BEAUTY-IN aporta colageno para piel y tejidos. GOLDEN FLX apoya la movilidad articular. PROBAL complementa el equilibrio hormonal femenino.' }
    ],
    internalLinks: [
      { slug: 'beauty-in', reason: 'Para complementar con colageno y cuidado de la piel.' },
      { slug: 'golden-flx', reason: 'Para apoyo articular y movilidad dentro de la rutina anti-edad.' },
      { slug: 'probal', reason: 'Para equilibrio hormonal femenino y bienestar integral.' }
    ]
  },
  'beauty-in': {
    semanticTerms: ['colageno', 'piel firme', 'anti-edad', 'coenzima Q10', 'biotina natural', 'elastina', 'cabello saludable', 'unas fuertes', 'belleza natural', 'vitamina E'],
    deepSections: [
      { title: 'Ingredientes destacados', body: 'Beauty-In combina peptidos de colageno bioactivo optimizado tipos 1 y 3, CoEnzima Q10, Sesbania (biotina natural), vitamina E, super frutas y zinc. Su colageno es 4 veces mas potente que el hidrolizado convencional.' },
      { title: 'Objetivo del producto', body: 'Esta orientado a nutrir la piel desde adentro, mejorar la estructura de la dermis, aumentar fibras de colageno y elastina, y fortalecer cabello y unas. Apoya la belleza natural desde un enfoque interno.' },
      { title: 'Rutina recomendada', body: 'Se toma un sobre en agua fria, antes de dormir o en ayunas. Puede integrarse como parte de una rutina de cuidado personal junto con hidratacion, alimentacion equilibrada y proteccion solar.' },
      { title: 'Perfil de usuario interesado', body: 'Mujeres y hombres interesados en el cuidado de la piel, personas que buscan mejorar firmeza y elasticidad, quienes desean fortalecer cabello y unas, y adultos que buscan opciones anti-edad naturales.' },
      { title: 'Relacion con otros productos FuXion', body: 'YOUTH ELIXIR complementa desde la vitalidad y la hormona de la juventud. GOLDEN FLX apoya la movilidad articular. PASSION aporta energia y vitalidad general.' }
    ],
    internalLinks: [
      { slug: 'youth-elixir', reason: 'Para complementar desde el enfoque anti-edad y vitalidad.' },
      { slug: 'golden-flx', reason: 'Para apoyo articular y bienestar fisico integral.' },
      { slug: 'passion', reason: 'Para energia y vitalidad que acompanen la rutina de belleza.' }
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
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const normalizeProductForSeo = (productKey, productData) => {
  if (!productData) {
    const fallbackSlug = slugifyProduct(productKey);
    return {
      id: productKey,
      slug: fallbackSlug,
      name: productKey,
      category: '',
      line: '',
      presentation: '',
      price: 0,
      flavor: '',
      flavors: [],
      ingredients: [],
      benefits: [],
      usage: '',
      schedule: '',
      effect: '',
      keyword: '',
      image: '',
      imageUrl: `${SITE_URL}/icons/android-chrome-512x512.png`,
      url: `${SITE_URL}/producto/${fallbackSlug}`,
      description: `${productKey} de Fuxion Biotech para nutricion, bienestar y habitos saludables.`
    };
  }

  const name = productData.nombre || productKey;
  const slug = slugifyProduct(name);
  const benefits = productData.beneficios || [];
  const description = benefits.length
    ? benefits.join('. ')
    : `${name} de Fuxion Biotech para nutricion, bienestar y habitos saludables.`;
  const image = getProductImageUrl(name) || '';

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
  Object.entries(fuxionDatabase.productos || {})
    .filter(([, product]) => product != null)
    .map(([key, product]) =>
      normalizeProductForSeo(key, product)
    );

export const getAllProducts = () =>
  Object.entries(fuxionDatabase.productos || {})
    .filter(([, product]) => product != null)
    .map(([key, product]) =>
      normalizeProductForSeo(key, product)
    );

export const getSeoProductBySlug = (slug) =>
  getAllSeoProducts().find((product) => product.slug === slug);

export const getProductSeoContent = (product) => {
  if (!product) return null;

  const baseContent = PRIORITY_PRODUCT_SEO[product.slug];
  const semanticContent = PRODUCT_SEMANTIC_SECTIONS[product.slug];
  const extensionContent = PRODUCT_SEO_EXTENSIONS[product.slug];

  if (!baseContent && !semanticContent && !extensionContent) return null;

  return {
    ...(baseContent || {}),
    ...(semanticContent || {}),
    ...(extensionContent || {})
  };
};

export const buildProductMetaDescription = (product) => {
  if (!product) return '';

  const seoContent = getProductSeoContent(product);
  if (seoContent?.metaDescription) {
    return seoContent.metaDescription;
  }

  const firstBenefit = product.benefits?.[0] || 'nutricion y bienestar natural';
  const price = product.price || 0;
  const presentation = product.presentation || 'en sobres';
  return `${product.name} Fuxion en Chile: ${firstBenefit}. Precio $${price.toLocaleString('es-CL')}, presentacion ${presentation} y asesoria personalizada.`;
};

export const buildProductTitle = (product) => {
  if (!product) return STORE_NAME;

  const seoContent = getProductSeoContent(product);
  const productName = product.name || product.slug || 'Producto';
  return seoContent?.seoTitle || `${productName} Fuxion | Precio, Beneficios y Modo de Uso | ${STORE_NAME}`;
};


export const buildProductSchema = (product) => {
  if (!product) return null;

  const imageUrl = product.imageUrl || `${SITE_URL}/icons/android-chrome-512x512.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name || product.slug,
    image: [imageUrl],
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
      price: product.price || 0,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: STORE_NAME,
        url: SITE_URL
      }
    }
  };
};

export const buildProductFaqSchema = (product) => {
  if (!product) return null;

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
  image: `${SITE_URL}/prunex-principal.jpeg`,
  description: 'Bienestar en Claro Chile — tienda oficial de productos Fuxion con asesoría personalizada. Nutrición, bienestar natural, digestión, energía, control de peso, defensas y belleza. Envíos a todo Chile.',
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

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: STORE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icons/android-chrome-512x512.png`,
  description: 'Bienestar en Claro Chile — tienda oficial de productos Fuxion con asesoría personalizada. Nutrición, bienestar natural, digestión, energía, control de peso, defensas y belleza. Envíos a todo Chile.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+56989639088',
    contactType: 'customer service',
    areaServed: 'CL',
    availableLanguage: 'Spanish'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CL',
    addressLocality: 'Santiago'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Chile'
  },
  sameAs: [
    SITE_URL,
    'https://instagram.com/bienestarenclaro',
    'https://twitter.com/bienestarenclaro',
    'https://facebook.com/bienestarenclaro',
    'https://linkedin.com/company/bienestarenclaro',
    'https://youtube.com/@bienestarenclaro'
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
  image: `${SITE_URL}/prunex-principal.jpeg`,
  description: 'Bienestar en Claro Chile — tienda oficial de productos Fuxion con asesoría personalizada. Nutrición, bienestar natural, digestión, energía, control de peso, defensas y belleza. Envíos a todo Chile.',
  telephone: '+56989639088',
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
    addressCountry: 'CL',
    addressLocality: 'Santiago'
  },
  priceRange: '$$',
  openingHours: 'Mo-Fr 09:00-18:00',
  sameAs: [
    SITE_URL,
    'https://instagram.com/bienestarenclaro',
    'https://twitter.com/bienestarenclaro'
  ]
});

/**
 * Complete Organization schema with ContactPoint, sameAs, logo.
 */
export const buildCompleteOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: STORE_NAME,
  alternateName: ['Bienestar en Claro Chile', 'Tienda Fuxion Chile'],
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/icons/android-chrome-512x512.png`,
    width: 512,
    height: 512
  },
  description: 'Bienestar en Claro Chile — tienda oficial de productos Fuxion con asesoría personalizada. Nutrición, bienestar natural, digestión, energía, control de peso, defensas y belleza. Envíos a todo Chile.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+56-9-8963-9088',
    contactType: 'customer service',
    areaServed: 'CL',
    availableLanguage: 'Spanish',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ],
      opens: '09:00',
      closes: '21:00'
    }
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CL',
    addressRegion: 'Región Metropolitana'
  },
  sameAs: [
    SITE_URL,
    'https://instagram.com/bienestarenclaro',
    'https://twitter.com/bienestarenclaro',
    'https://facebook.com/bienestarenclaro',
    'https://linkedin.com/company/bienestarenclaro',
    'https://youtube.com/@bienestarenclaro'
  ],
  brand: {
    '@type': 'Brand',
    name: 'Fuxion',
    description: 'Fuxion Biotech — productos nutracéuticos para nutrición y bienestar.'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Chile'
  }
});

/**
 * Person schema for E-E-A-T signals (founder, author, expert).
 */
export const buildPersonSchema = (person) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person?.name || 'Daniel Falcón',
  alternateName: person?.alternateName || ['Daniel Falcon'],
  jobTitle: person?.jobTitle || 'Asesor de Bienestar y Nutrición',
  description: person?.bio || 'Emprendedor chileno apasionado por la nutrición y el bienestar natural.',
  url: `${SITE_URL}/sobre-nosotros`,
  image: person?.image ? `${SITE_URL}${person.image}` : `${SITE_URL}/icons/android-chrome-192x192.png`,
  sameAs: person?.sameAs || [SITE_URL],
  knowsAbout: person?.knowsAbout || [
    'Nutrición',
    'Bienestar',
    'Salud intestinal',
    'Nutracéuticos',
    'Fuxion',
    'Microbiota intestinal',
    'Nutrición funcional',
    'Bienestar natural'
  ],
  worksFor: {
    '@type': 'Organization',
    name: STORE_NAME,
    url: SITE_URL
  }
});

/**
 * WebSite schema with SearchAction for rich results.
 */
export const buildWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: STORE_NAME,
  url: SITE_URL,
  description: 'Bienestar en Claro — tienda oficial de productos Fuxion con asesoría personalizada. Nutrición, bienestar natural, digestión, energía, control de peso, defensas y belleza.',
  publisher: {
    '@type': 'Organization',
    name: STORE_NAME,
    url: SITE_URL
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/explorar?search={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
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

/**
 * Article schema with author, datePublished, dateModified, image, keywords.
 */
export const buildArticleSchema = (article, author) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.image_url ? `${SITE_URL}${article.image_url}` : `${SITE_URL}/icons/android-chrome-512x512.png`,
  author: {
    '@type': 'Person',
    name: author?.name || 'Daniel Falcón',
    jobTitle: author?.jobTitle || 'Investigador de Salud y Bienestar',
    url: `${SITE_URL}/sobre-nosotros`
  },
  publisher: {
    '@type': 'Organization',
    name: STORE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icons/android-chrome-512x512.png`
    }
  },
  datePublished: article.created_at,
  dateModified: article.updated_at || article.created_at,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/articulos/${article.slug}`
  },
  keywords: article.tags?.join(', '),
  articleSection: article.category
});

/**
 * HowTo schema for routines and regimens.
 */
export const buildHowToSchema = (howTo) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: howTo.title,
  description: howTo.description,
  totalEstimatedTime: howTo.totalEstimatedTime || 'PT10M',
  step: (howTo.steps || []).map((step, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: step.name,
    text: step.text,
    url: step.url ? `${SITE_URL}${step.url}` : undefined
  }))
});

/**
 * AggregateRating schema for testimonials/reviews.
 */
export const buildAggregateRatingSchema = (rating) => ({
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  ratingValue: rating.ratingValue || '4.5',
  reviewCount: rating.reviewCount || '120',
  bestRating: rating.bestRating || '5',
  worstRating: rating.worstRating || '1',
  itemReviewed: rating.itemReviewed || STORE_NAME
});
