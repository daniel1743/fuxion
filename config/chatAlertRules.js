export const TELEGRAM_CONFIG = {
  apiBaseUrl: process.env.TELEGRAM_API_BASE_URL || 'https://api.telegram.org',
  botUsername: '@Asistentefuxion_bot',
  defaultChatId: process.env.TELEGRAM_CHAT_ID || '1645823624',
  tokenEnvVar: 'TELEGRAM_BOT_TOKEN'
};

// ===================================================================
// BUY_INTENT_SCORE - Sistema de scoring por intención comercial real
// ===================================================================

// Señales fuertes (+40)
// REGLA: "quiero saber", "quiero información", "quiero conocer" NO son compra.
// Solo frases explícitas de compra/pedido.
export const BUY_INTENT_STRONG = {
  buyPhrases: /\b(quiero comprar|c[oó]mo compro|d[oó]nde compro|quiero pedir|quiero hacer pedido|quiero pagarlo|lo quiero|tienen disponible)\b/i,
  score: 40
};

// Señales fuertes (+30)

export const BUY_INTENT_PRICE = {
  priceQuestion: /\b(precio|cu[aá]nto cuesta|valor)\b/i,
  score: 30
};

export const BUY_INTENT_LOGISTICS = {
  logisticsQuestion: /\b(env[ií]an|delivery|despacho|d[oó]nde entregan)\b/i,
  score: 30
};

// Señales fuertes (+25)
export const BUY_INTENT_SPECIFIC_PROBLEM = {
  specificProblem: /\b(tengo estre[ñn]imiento|quiero energ[ií]a|quiero bajar de peso|necesito algo para)\b/i,
  score: 25
};

// Señales fuertes (+20)
export const BUY_INTENT_REPEATED_PRODUCT = {
  score: 20
};

// Señales medias (+10)
export const BUY_INTENT_MEDIUM = {
  benefits: /\b(beneficios?|sirve|para qu[eé]|para que|qu[eé] hace|funciona)\b/i,
  ingredients: /\b(ingredientes?|contiene|composici[oó]n)\b/i,
  comparison: /\b(vs|versus|comparar|diferencia entre|mejor que)\b/i,
  score: 10
};

// ===================================================================
// BUSINESS_INTENT - Detección de interés en oportunidad de negocio
// ===================================================================
// Patrón único de intención de negocio para notificaciones Telegram.
// REGLA CRÍTICA: Solo términos específicos o con contexto FuXion.
// Se eliminaron términos genéricos sueltos que generaban falsos positivos:
//   - "negocio" solo, "ingresos" solo, "dinero extra" solo
//   - "ganar dinero", "trabajo desde casa", "ingreso pasivo"
//   - "independencia financiera", "libertad financiera"
//   - "ser socio", "afiliarme", "oportunidad de negocio"
//   - "plan de compensación", "generar ingresos"
// Estos términos aparecen en videos y descripciones sin relación con FuXion.
export const BUSINESS_INTENT_PATTERNS = /\b(quiero vender fuXion|quiero vender fuxion|hacer el negocio|c[oó]mo gano dinero con fuXion|c[oó]mo gano dinero con fuxion|c[oó]mo ganar dinero con fuXion|c[oó]mo ganar dinero con fuxion|quiero emprender con fuXion|quiero emprender con fuxion|emprender con fuXion|emprender con fuxion|ser distribuidor fuXion|ser distribuidor de fuxion|quiero ser distribuidor|distribuidor fuXion|distribuidor de fuxion|oportunidad fuXion|oportunidad fuxion|unirme a fuXion|unirme a fuxion|afiliarme a fuXion|afiliarme a fuxion|ser parte de fuXion|ser parte de fuxion|trabajar con fuXion|trabajar con fuxion|ganar dinero con fuXion|ganar dinero con fuxion|c[oó]mo funciona el negocio fuXion|c[oó]mo funciona el negocio de fuxion|vender fuXion|vender fuxion|oportunidad de negocio fuXion|oportunidad de negocio de fuxion|socio fuXion|socio fuxion|plan de negocio fuXion|plan de negocio de fuxion|negocio fuXion|negocio de fuxion|bonos fuXion|rangos fuXion|bono auto fuXion|fondo pa[ií]s fuXion)\b/i;

// ===================================================================
// NIVELES DE INTENCIÓN - FASE FINAL 4
// ===================================================================
// REGLA TELEGRAM FASE FINAL 4:
//   nivel_1_curioso (0-30):     NO enviar Telegram, guardar memoria
//   nivel_2_interesado (31-60): guardar seguimiento, no alertar salvo repetición fuerte
//   nivel_3_posible_compra (61-80): enviar Telegram
//   nivel_4_cliente_caliente (81-100): Telegram inmediato
export const INTENT_LEVELS = {
  curious: { min: 0, max: 31, label: '🔍 Curioso', notify: false, save: true },
  interested: { min: 31, max: 61, label: '💡 Interesado', notify: false, save: true },
  possiblePurchase: { min: 61, max: 81, label: '💭 Posible compra', notify: true, save: true },
  hotClient: { min: 81, max: Infinity, label: '🔥 Cliente caliente', notify: true, save: true },
  business: { min: 0, max: Infinity, label: '🚀 OPORTUNIDAD NEGOCIO', notify: true, save: true }
};

// ===================================================================
// SEÑALES HUMANAS - Solicitud de asesor humano
// ===================================================================
export const HUMAN_REQUEST_PATTERNS = /\b(asesor|humano|persona real|whatsapp|necesito ayuda|quiero hablar con alguien|hablar con un asesor|contactar con un asesor|asesor humano|atenci[oó]n personalizada|ayuda humana|quiero que me ayude una persona|hablar con una persona)\b/i;

// ===================================================================
// SEÑALES DE NEGOCIO FUXION - Separado de compra producto
// ===================================================================
// BUSINESS_OPPORTUNITY_PATTERNS: usado para sugerencias internas y recomendaciones.
// Más permisivo que BUSINESS_INTENT_PATTERNS (permite detectar interés sin notificar).
// Versión ampliada para recomendaciones, versión estricta para alertas Telegram.
export const BUSINESS_OPPORTUNITY_PATTERNS = /\b(vender fuxion|vender fuXion|oportunidad fuXion|oportunidad fuxion|distribuidor fuXion|distribuidor de fuxion|ganar dinero con fuXion|ganar dinero con fuxion|emprender con fuXion|emprender con fuxion|ser distribuidor fuXion|ser distribuidor de fuxion|hacerme distribuidor|plan de negocio fuXion|plan de negocio de fuxion|c[oó]mo funciona el negocio fuXion|c[oó]mo funciona el negocio de fuxion|quiero vender fuXion|quiero vender fuxion|oportunidad de negocio fuXion|oportunidad de negocio de fuxion|socio fuXion|socio fuxion|unirme a fuXion|unirme a fuxion|ser parte de fuXion|ser parte de fuxion|plan de compensaci[oó]n fuXion|plan de compensaci[oó]n de fuxion|bonos fuXion|rangos fuXion|bono auto fuXion|fondo pa[ií]s fuXion|trabajar con fuXion|trabajar con fuxion|vender productos fuXion|vender productos de fuxion)\b/i;

// ===================================================================
// MAPA DE CATEGORÍAS DE PRODUCTOS PARA RESUMEN INTELIGENTE
// ===================================================================
export const PRODUCT_CATEGORY_MAP = {
  'prunex': 'Bienestar digestivo',
  'prunex 1': 'Bienestar digestivo',
  'flora liv': 'Bienestar digestivo',
  'floraliv': 'Bienestar digestivo',
  'liquid fiber': 'Bienestar digestivo',
  'liquid fibre': 'Bienestar digestivo',
  'liquidfiber': 'Bienestar digestivo',
  'berry balance': 'Bienestar digestivo',
  'berrybalance': 'Bienestar digestivo',
  'rexet': 'Bienestar digestivo',
  'alpha balance': 'Bienestar digestivo',
  'alpha': 'Bienestar digestivo',
  'thermo t3': 'Control de peso',
  'thermot3': 'Control de peso',
  'nocarb': 'Control de peso',
  'nocarb t': 'Control de peso',
  'nocarb-t': 'Control de peso',
  'no carb': 'Control de peso',
  'on': 'Energía y vitalidad',
  'vita xtra': 'Energía y vitalidad',
  'vitaextra': 'Energía y vitalidad',
  'vitaenergía': 'Energía y vitalidad',
  'vitaenergia': 'Energía y vitalidad',
  'no stress': 'Energía y vitalidad',
  'nostress': 'Energía y vitalidad',
  'passion': 'Energía y vitalidad',
  'vera': 'Energía y vitalidad',
  'vera+': 'Energía y vitalidad',
  'gano': 'Energía y vitalidad',
  'cafe': 'Energía y vitalidad',
  'cafe fit': 'Energía y vitalidad',
  'cappuccino': 'Energía y vitalidad',
  'nutraday': 'Energía y vitalidad',
  'beauty in': 'Belleza y cuidado personal',
  'beauty-in': 'Belleza y cuidado personal',
  'beautyin': 'Belleza y cuidado personal',
  'youth elixir': 'Belleza y cuidado personal',
  'youth elixir hgh': 'Belleza y cuidado personal',
  'probal': 'Belleza y cuidado personal',
  'protein active': 'Rendimiento deportivo',
  'proteinactive': 'Rendimiento deportivo',
  'protein active fit': 'Rendimiento deportivo',
  'bioprotein': 'Rendimiento deportivo',
  'bioprotein active': 'Rendimiento deportivo',
  'pre sport': 'Rendimiento deportivo',
  'presport': 'Rendimiento deportivo',
  'post sport': 'Rendimiento deportivo',
  'postsport': 'Rendimiento deportivo',
  'golden flx': 'Rendimiento deportivo',
  'goldenflx': 'Rendimiento deportivo'
};


// ===================================================================
// PATRONES DE PRODUCTOS (para detección)
// ===================================================================
export const CHAT_RULE_PATTERNS = {
  products: [
    'prunex', 'prunex 1',
    'flora liv', 'floraliv',
    'thermo t3', 'thermot3',
    'nocarb', 'nocarb t', 'nocarb-t', 'no carb',
    'berry balance', 'berrybalance',
    'liquid fiber', 'liquid fibre', 'liquidfiber',
    'rexet', 'alpha balance', 'alpha',
    'beauty in', 'beauty-in', 'beautyin',
    'golden flx', 'goldenflx',
    'passion',
    'probal',
    'on',
    'no stress', 'nostress',
    'pre sport', 'presport',
    'post sport', 'postsport',
    'protein active', 'proteinactive', 'protein active fit',
    'bioprotein', 'bioprotein active',
    'vitamina', 'vita xtra', 'vitaextra', 'vita xtra t+', 'vitaenergia',
    'beta', 'beta+',
    'cafe fit', 'cappuccino',
    'youth elixir', 'youth elixir hgh',
    'digestivo', 'digestion', 'probiotico', 'probioticos',
    'producto digestivo', 'salud intestinal',
    'energia vital', 'vitalidad', 'defensas', 'inmunologico',
    'control peso', 'bajar de peso', 'perder peso'
  ],
  price: /\b(precio|cuesta|valor|cu[eé]nto vale|cu[eé]nto sale|cost[oa]|tarifa)\b/i,
  shipping: /\b(env[ií]o|despacho|retiro|entrega|llega|llegar)\b/i,
  stock: /\b(stock|disponible|hay existencias|agotado|quedan|queda|sistema disponible|disponibilidad)\b/i,
  benefits: /\b(beneficios?|sirve|ayuda|para qu[eé]|para que|qué hace|que hace|funciona|funcionar|mejor)\b/i,
  ingredients: /\b(ingredientes?|contiene|composici[oó]n|fabricado con|incluye)\b/i,
  comparison: /\b(vs|versus|comparar|comparaci[oó]n|diferencia entre|mejor que|mejor por)\b/i,
  cartInterest: /\b(carrito|pedido|comprar|compra|agregar al carrito|hacer pedido|checkout|pedido listo|pagar)\b/i,
  advisorDecline: /\b(no gracias|prefiero continuar|prefiero seguir|sin asesor|me quedo aqu[ií]|seguir aqu[ií])\b/i,
  medicalWarning: /\b(dolor intenso|dificultad respiratoria|p[eé]rdida de conciencia|v[oó]mito con sangre|sangrado abundante|dolor tor[aác]cico intenso|fiebre alta|dolor en el pecho|mareo grave|palpitaciones intensas)\b/i,
  questionWords: /\b(quien|que|cu[aá]l|d[oó]nde|por qu[eé]|qui[eé]n|c[uú]ando|cu[aá]nto)\b/i,
  businessOpportunity: /\b(vender fuxion|vender fuXion|hacer el negocio fuxion|hacer el negocio fuXion|c[oó]mo gano dinero con fuxion|c[oó]mo gano dinero con fuXion|c[oó]mo ganar dinero con fuxion|c[oó]mo ganar dinero con fuXion|quiero emprender con fuxion|quiero emprender con fuXion|ser distribuidor fuxion|ser distribuidor de fuxion|oportunidad fuxion|oportunidad fuXion|plan de negocio fuxion|plan de negocio de fuxion|negocio fuxion|negocio fuXion|trabajar con fuxion|trabajar con fuXion|emprender con fuxion|emprender con fuXion|unirme a fuxion|unirme a fuXion|ser parte de fuxion|ser parte de fuXion|plan de compensaci[oó]n fuxion|plan de compensaci[oó]n de fuxion|ganar dinero con fuxion|ganar dinero con fuXion|c[oó]mo funciona el negocio fuxion|c[oó]mo funciona el negocio de fuxion|quiero vender fuxion|quiero vender fuXion|vender productos fuxion|vender productos de fuxion|socio fuxion|socio fuXion|bonos fuxion|rangos fuxion|bono auto fuxion|fondo pa[ií]s fuxion)\b/i
};

// ===================================================================
// TEMPLATES DE TELEGRAM
// ===================================================================
// REGLA TELEGRAM FIX PHASE 1:
//   interesado (40-69): "💡 Posible interés FuXion"
//   compra (70+):       "🔥 Cliente con intención de compra"
export const TELEGRAM_INTERESTED_TEMPLATE = `💡 Posible interés FuXion

👤 Cliente:
{nombre}

📦 Producto:
{product}

🎯 Intención compra:
{score}%

⏱ Conversación:
{minutes} min

💬 Mensajes:
{questions}

🧠 Detectado:
{summary}

Último mensaje:
"{lastMessage}"

Acción recomendada:
Seguimiento informativo`;

export const TELEGRAM_BUYING_TEMPLATE = `🔥 Cliente con intención de compra

👤 Cliente:
{nombre}

📦 Producto:
{product}

🎯 Intención compra:
{score}%

⏱ Conversación:
{minutes} min

💬 Mensajes:
{questions}

🧠 Detectado:
{summary}

Último mensaje:
"{lastMessage}"

Acción recomendada:
Contactar ahora`;

export const TELEGRAM_BUSINESS_TEMPLATE = `🚀 OPORTUNIDAD NEGOCIO

👤 Usuario:
{nombre}

⏱ Tiempo conversación:
{minutes} min

💬 Mensajes:
{questions}

🎯 Interés detectado:
Negocio FuXion

Señales:
- quiere emprender
- pregunta ingresos
- quiere ser distribuidor

Último mensaje:
"{lastMessage}"

Acción:
Contactar personalmente`;


