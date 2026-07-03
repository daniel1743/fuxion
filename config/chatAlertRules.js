export const TELEGRAM_CONFIG = {
  apiBaseUrl: process.env.TELEGRAM_API_BASE_URL || 'https://api.telegram.org',
  botUsername: '@Asistentefuxion_bot',
  defaultChatId: process.env.TELEGRAM_CHAT_ID || '1645823624',
  tokenEnvVar: 'TELEGRAM_BOT_TOKEN'
};

export const CHAT_EVENT_SCORES = {
  PRODUCT_INTEREST: 10,
  BENEFITS: 15,
  INGREDIENTS: 10,
  PRICE: 20,
  SHIPPING: 15,
  STOCK: 15,
  MULTIPLE_PRODUCT_COMPARISON: 20,
  REPEATED_PRODUCT: 20,
  LONG_CONVERSATION: 20,
  ADVISOR_DECLINED: 30,
  CART_INTEREST: 40,
  MEDICAL_WARNING: 30
};

export const NOTIFICATION_RULES = {
  scoreThreshold: 80,
  alwaysNotifyEvents: [
    'ADVISOR_DECLINED',
    'LONG_CONVERSATION',
    'MEDICAL_WARNING',
    'REPEATED_PRODUCT',
    'MULTIPLE_PRODUCT_COMPARISON',
    'CART_INTEREST'
  ]
};

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
    'vera', 'vera+',
    'gano',
    'cafe', 'cafe fit', 'cappuccino',
    'youth elixir', 'youth elixir hgh',
    'digestivo', 'digestion', 'probiotico', 'probioticos', 'colon',
    'producto digestivo', 'salud intestinal',
    'energia', 'energia', 'defensas', 'inmunologico',
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
  questionWords: /\b(quien|que|cu[aá]l|d[oó]nde|por qu[eé]|qui[eé]n|c[uú]ando|cu[aá]nto)\b/i
};

export const TELEGRAM_MESSAGE_TEMPLATE = `🔥 CLIENTE DE ALTO INTERÉS

👤 Sesión:
{session}

📦 Producto:
{product}

⭐ Score:
{score}

⏱ Tiempo:
{minutes} minutos

💬 Preguntas:
{questions}

🚫 Asesor rechazado:
{advisor_declined}

📋 Resumen:

{summary}

----------------------------

Hora:
{datetime}`;
