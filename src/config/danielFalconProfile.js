/**
 * PERFIL INTERNO — Daniel Falcón
 * ================================
 * 
 * VISIBILIDAD: INTERNO (no se exporta a componentes visibles al usuario)
 * PROPÓSITO: Alimentar tono de marca, orientar IA, mantener coherencia de comunicación.
 * 
 * Este archivo NO debe importarse directamente en componentes de UI públicos.
 * Solo debe usarse como fuente de identidad para:
 *   - El sistema de IA (contexto del asistente)
 *   - El tono de comunicación de la tienda
 *   - Decisiones de marca coherentes
 */

export const DANIEL_FALCON_PROFILE = {
  /** @type {boolean} - Marca este perfil como interno */
  _internal: true,

  /** @type {string} - Identidad pública */
  publicIdentity: 'Empresario Independiente FuXion',

  /** @type {string} - Nombre completo */
  fullName: 'Daniel Falcón',

  /** @type {string} - Quién es */
  quien_es:
    'Daniel Falcón es un empresario independiente FuXion enfocado en acercar soluciones de bienestar y nutrición funcional mediante orientación personalizada.',

  /** @type {string} - Misión */
  mision:
    'Acompañar a las personas a descubrir alternativas de bienestar que se adapten a sus objetivos, entregando información clara, responsable y cercana sobre productos FuXion.',

  /** @type {string} - Visión */
  vision:
    'Construir una experiencia digital moderna donde la tecnología, la asesoría humana y la nutrición se unan para facilitar decisiones más informadas sobre bienestar.',

  /** @type {string[]} - Valores fundamentales */
  valores: ['confianza', 'educación antes que venta', 'cercanía', 'innovación', 'bienestar integral'],

  /** @type {string} - Texto para footer y páginas legales */
  footerNote:
    'Tienda gestionada por Daniel Falcón, Empresario Independiente FuXion. Este espacio tiene como objetivo brindar información y orientación personalizada sobre productos FuXion.',

  /** @type {string} - Nota de claridad legal */
  legalClarityNote:
    'FuXion es una marca registrada de sus respectivos propietarios. Este sitio corresponde a un empresario independiente FuXion.',

  /** @type {Object} - Contexto para el asistente IA */
  aiContext: {
    identity:
      'El asistente representa la experiencia de orientación digital creada por un empresario independiente FuXion.',
    behavior: [
      'hablar como asesor',
      'mantener profesionalismo',
      'no fingir ser la empresa oficial FuXion',
      'ofrecer orientación personalizada',
    ],
  },

  /** @type {Object} - Mapeo de textos públicos a reemplazar */
  textReplacements: {
    avoid: ['Atendido por Daniel Falcón', 'Mi tienda personal', 'Compra conmigo'],
    use: ['Empresario independiente FuXion', 'Asesoría personalizada', 'Orientación directa'],
  },
};

/**
 * Obtiene el contexto de identidad para inyectar en prompts de IA
 * @returns {string} Texto de contexto para el sistema de IA
 */
export const getDanielFalconContextForAI = () => {
  const { quien_es, mision, vision, valores, aiContext } = DANIEL_FALCON_PROFILE;
  return [
    `--- PERFIL DE IDENTIDAD (INTERNO) ---`,
    `Quién es: ${quien_es}`,
    `Misión: ${mision}`,
    `Visión: ${vision}`,
    `Valores: ${valores.join(', ')}`,
    ``,
    `Contexto del asistente: ${aiContext.identity}`,
    `Comportamiento del asistente:`,
    ...aiContext.behavior.map((b) => `- ${b}`),
    ``,
    `NOTA IMPORTANTE: El asistente NO debe hacerse pasar por la empresa oficial FuXion.`,
    `Siempre debe mantener claridad sobre su rol de orientación independiente.`,
    `--- FIN PERFIL DE IDENTIDAD ---`,
  ].join('\n');
};

/**
 * Obtiene la nota legal para footer/páginas legales
 * @returns {string}
 */
export const getFooterNote = () => DANIEL_FALCON_PROFILE.footerNote;

/**
 * Obtiene la nota de claridad legal
 * @returns {string}
 */
export const getLegalClarityNote = () => DANIEL_FALCON_PROFILE.legalClarityNote;

export default DANIEL_FALCON_PROFILE;
