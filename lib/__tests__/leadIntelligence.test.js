/**
 * Lead Intelligence Engine - Phase 2 Tests
 * 
 * Valida los 6 módulos del sistema CRM inteligente:
 *   1. leadProfile - Resumen del cliente
 *   2. customerStage - Etapa del cliente
 *   3. contactDetection - Detección de contacto
 *   4. spamPrevention - Cooldown
 *   5. businessOpportunity - Oportunidad negocio
 *   6. interestScore - Cálculo de interés mejorado
 * 
 * Ejecutar: npx jest lib/__tests__/leadIntelligence.test.js --no-coverage
 */

import {
  createLeadProfile,
  detectarCustomerStage,
  detectarContacto,
  checkCooldown,
  registerNotification,
  detectBusinessOpportunity,
  buildTelegramMessageV2
} from '../leadIntelligence.js';

// ===================================================================
// HELPERS
// ===================================================================

const makeUserMsg = (content, timestamp) => ({
  role: 'user',
  content,
  timestamp: timestamp || new Date().toISOString()
});

const makeAssistantMsg = (content) => ({
  role: 'assistant',
  content
});

// ===================================================================
// TEST 1: LEAD PROFILE - Resumen del cliente
// ===================================================================

describe('createLeadProfile', () => {
  test('debe crear perfil para cliente anónimo', () => {
    const messages = [
      makeUserMsg('Hola, qué es Prunex?'),
      makeAssistantMsg('Prunex es un producto...'),
      makeUserMsg('Y cuánto cuesta?')
    ];

    const profile = createLeadProfile({
      sessionId: 'test-session-1',
      messages,
      productNames: ['prunex'],
      durationMinutes: 3,
      score: 40,
      detectedSignals: ['pregunta precio'],
      lastMessage: 'Y cuánto cuesta?',
      isBusinessIntent: false
    });

    expect(profile).toBeDefined();
    expect(profile.cliente.tipo).toBe('anonimo');
    expect(profile.productoPrincipal).toBe('prunex');
    expect(profile.mensajes.total).toBe(2);
    expect(profile.mensajes.preguntas).toBeGreaterThanOrEqual(1);
    expect(profile.etapa).toBeDefined();
    expect(profile.etapa.id).toBeDefined();
    expect(profile.interes).toBeGreaterThanOrEqual(0);
    expect(profile.contacto).toBeDefined();
    expect(profile.sugerencia).toBeDefined();
    expect(profile.ultimaFrase).toBe('Y cuánto cuesta?');
  });

  test('debe crear perfil para cliente registrado', () => {
    const profile = createLeadProfile({
      sessionId: 'test-session-2',
      userName: 'Juan Pérez',
      userEmail: 'juan@email.com',
      messages: [makeUserMsg('Quiero comprar ON')],
      productNames: ['on'],
      score: 80,
      detectedSignals: ['quiere comprar'],
      lastMessage: 'Quiero comprar ON',
      isBusinessIntent: false
    });

    expect(profile.cliente.tipo).toBe('registrado');
    expect(profile.cliente.nombre).toBe('Juan Pérez');
    expect(profile.cliente.email).toBe('juan@email.com');
  });

  test('debe manejar múltiples productos (principal + secundarios)', () => {
    const profile = createLeadProfile({
      sessionId: 'test-session-3',
      messages: [makeUserMsg('Me interesa Prunex y también ON')],
      productNames: ['prunex', 'on'],
      score: 50,
      lastMessage: 'Me interesa Prunex y también ON',
      isBusinessIntent: false
    });

    expect(profile.productoPrincipal).toBe('prunex');
    expect(profile.productosSecundarios).toContain('on');
  });

  test('debe manejar sin productos', () => {
    const profile = createLeadProfile({
      sessionId: 'test-session-4',
      messages: [makeUserMsg('Hola, cómo estás?')],
      productNames: [],
      score: 0,
      lastMessage: 'Hola, cómo estás?',
      isBusinessIntent: false
    });

    expect(profile.productoPrincipal).toBe('Sin producto específico');
    expect(profile.productosSecundarios).toEqual([]);
  });
});

// ===================================================================
// TEST 2: CUSTOMER STAGE - Etapa del cliente
// ===================================================================

describe('detectarCustomerStage', () => {
  test('debe detectar etapa "explorando" para preguntas informativas', () => {
    const messages = [
      makeUserMsg('Qué es Prunex?'),
      makeUserMsg('Para qué sirve?')
    ];

    const etapa = detectarCustomerStage(messages, [], 20, false);
    expect(etapa.id).toBe('explorando');
    expect(etapa.label).toContain('Explorando');
  });

  test('debe detectar etapa "evaluando" para preguntas de precio/beneficios', () => {
    const messages = [
      makeUserMsg('Qué es Prunex?'),
      makeUserMsg('Cuánto cuesta?'),
      makeUserMsg('Tiene beneficios?')
    ];

    const etapa = detectarCustomerStage(messages, ['pregunta precio'], 50, false);
    expect(etapa.id).toBe('evaluando');
    expect(etapa.label).toContain('Evaluando');
  });

  test('debe detectar etapa "compra" para intención de compra explícita', () => {
    const messages = [
      makeUserMsg('Quiero comprar ON'),
      makeUserMsg('Cómo puedo pagar?')
    ];

    const etapa = detectarCustomerStage(messages, ['quiere comprar'], 80, false);
    expect(etapa.id).toBe('compra');
    expect(etapa.label).toContain('Listo para comprar');
  });

  test('debe detectar etapa "negocio" para intención de negocio', () => {
    const messages = [
      makeUserMsg('Quiero vender productos FuXion'),
      makeUserMsg('Cómo puedo ser distribuidor?')
    ];

    const etapa = detectarCustomerStage(messages, [], 0, true);
    expect(etapa.id).toBe('negocio');
    expect(etapa.label).toContain('Oportunidad negocio');
  });

  test('debe priorizar negocio sobre compra', () => {
    const messages = [
      makeUserMsg('Quiero comprar productos y también quiero vender FuXion')
    ];

    const etapa = detectarCustomerStage(messages, ['quiere comprar'], 80, true);
    expect(etapa.id).toBe('negocio');
  });

  test('debe devolver "explorando" por defecto si no hay señales', () => {
    const messages = [
      makeUserMsg('Hola, buen día')
    ];

    const etapa = detectarCustomerStage(messages, [], 0, false);
    expect(etapa.id).toBe('explorando');
  });
});

// ===================================================================
// TEST 3: CONTACT DETECTION - Detección de datos de contacto
// ===================================================================

describe('detectarContacto', () => {
  test('debe detectar número de teléfono', () => {
    const messages = [
      makeUserMsg('Mi número es 912345678')
    ];

    const contacto = detectarContacto(messages);
    expect(contacto.disponible).toBe(true);
    expect(contacto.contactos.some(c => c.tipo === 'telefono')).toBe(true);
    expect(contacto.resumen).toContain('Contacto disponible');
  });

  test('debe detectar correo electrónico', () => {
    const messages = [
      makeUserMsg('Mi correo es juan@email.com')
    ];

    const contacto = detectarContacto(messages);
    expect(contacto.disponible).toBe(true);
    expect(contacto.contactos.some(c => c.tipo === 'correo')).toBe(true);
  });

  test('debe detectar WhatsApp', () => {
    const messages = [
      makeUserMsg('Mi whatsapp es 912345678')
    ];

    const contacto = detectarContacto(messages);
    expect(contacto.disponible).toBe(true);
    expect(contacto.contactos.some(c => c.tipo === 'whatsapp')).toBe(true);
  });

  test('debe retornar no disponible si no hay datos', () => {
    const messages = [
      makeUserMsg('Qué es Prunex?')
    ];

    const contacto = detectarContacto(messages);
    expect(contacto.disponible).toBe(false);
    expect(contacto.resumen).toContain('Sin datos de contacto');
  });

  test('debe detectar múltiples tipos de contacto', () => {
    const messages = [
      makeUserMsg('Mi teléfono es 912345678 y mi correo es juan@email.com')
    ];

    const contacto = detectarContacto(messages);
    expect(contacto.disponible).toBe(true);
    expect(contacto.contactos.length).toBeGreaterThanOrEqual(2);
  });
});

// ===================================================================
// TEST 4: SPAM PREVENTION - Cooldown system
// ===================================================================

describe('checkCooldown', () => {
  beforeEach(() => {
    // Limpiar sesiones notificadas entre tests
    // Nota: como notifiedSessions no se exporta, probamos a través de
    // registerNotification + checkCooldown
  });

  test('debe permitir primera notificación', () => {
    const result = checkCooldown('new-session', {
      score: 50,
      etapaId: 'evaluando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    expect(result.permitido).toBe(true);
    expect(result.razon).toContain('Primera notificación');
  });

  test('debe permitir si no hay sessionId', () => {
    const result = checkCooldown(null, { score: 50 });
    expect(result.permitido).toBe(true);
  });

  test('debe bloquear si mismo estado dentro de cooldown', () => {
    const sessionId = 'test-cooldown-1';

    // Registrar primera notificación
    registerNotification(sessionId, {
      score: 50,
      etapaId: 'evaluando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    // Mismo estado - debe bloquear
    const result = checkCooldown(sessionId, {
      score: 50,
      etapaId: 'evaluando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    expect(result.permitido).toBe(false);
    expect(result.razon).toContain('Cooldown activo');
  });

  test('debe permitir si cambia la etapa', () => {
    const sessionId = 'test-cooldown-2';

    registerNotification(sessionId, {
      score: 50,
      etapaId: 'evaluando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    // Cambió a compra - debe permitir
    const result = checkCooldown(sessionId, {
      score: 80,
      etapaId: 'compra',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    expect(result.permitido).toBe(true);
    expect(result.razon).toContain('Cambio de etapa');
  });

  test('debe permitir si aumenta score +20', () => {
    const sessionId = 'test-cooldown-3';

    registerNotification(sessionId, {
      score: 30,
      etapaId: 'explorando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    // Aumentó +20 (30 → 50)
    const result = checkCooldown(sessionId, {
      score: 50,
      etapaId: 'explorando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    expect(result.permitido).toBe(true);
    expect(result.razon).toContain('Aumento de intención');
  });

  test('debe permitir si detecta oportunidad negocio', () => {
    const sessionId = 'test-cooldown-4';

    registerNotification(sessionId, {
      score: 50,
      etapaId: 'evaluando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    // Nueva detección de negocio
    const result = checkCooldown(sessionId, {
      score: 0,
      etapaId: 'negocio',
      isBusinessIntent: true,
      productPrincipal: 'prunex'
    });

    expect(result.permitido).toBe(true);
    expect(result.razon).toContain('oportunidad negocio');
  });

  test('NO debe permitir si aumento es menor a +20', () => {
    const sessionId = 'test-cooldown-5';

    registerNotification(sessionId, {
      score: 40,
      etapaId: 'evaluando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    // Solo aumentó +10 (40 → 50)
    const result = checkCooldown(sessionId, {
      score: 50,
      etapaId: 'evaluando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    expect(result.permitido).toBe(false);
  });
});

// ===================================================================
// TEST 5: BUSINESS OPPORTUNITY - Detección independiente
// ===================================================================

describe('detectBusinessOpportunity', () => {
  test('debe detectar oportunidad de negocio por "vender"', () => {
    const messages = [
      makeUserMsg('Quiero vender productos FuXion')
    ];

    const result = detectBusinessOpportunity(messages);
    expect(result).not.toBeNull();
    expect(result.detectado).toBe(true);
    expect(result.señales.length).toBeGreaterThan(0);
    expect(result.requiereContactoHumano).toBe(true);
  });

  test('debe detectar oportunidad por "ser distribuidor"', () => {
    const messages = [
      makeUserMsg('Cómo puedo ser distribuidor?')
    ];

    const result = detectBusinessOpportunity(messages);
    expect(result).not.toBeNull();
    expect(result.detectado).toBe(true);
  });

  test('debe detectar oportunidad por "ganar dinero"', () => {
    const messages = [
      makeUserMsg('Quiero ganar dinero con FuXion')
    ];

    const result = detectBusinessOpportunity(messages);
    expect(result).not.toBeNull();
    expect(result.detectado).toBe(true);
  });

  test('debe retornar null si no hay señales de negocio', () => {
    const messages = [
      makeUserMsg('Qué es Prunex?'),
      makeUserMsg('Cuánto cuesta?')
    ];

    const result = detectBusinessOpportunity(messages);
    expect(result).toBeNull();
  });

  test('debe detectar múltiples señales de negocio', () => {
    const messages = [
      makeUserMsg('Quiero vender FuXion y ganar dinero como distribuidor')
    ];

    const result = detectBusinessOpportunity(messages);
    expect(result).not.toBeNull();
    expect(result.señales.length).toBeGreaterThanOrEqual(2);
  });
});

// ===================================================================
// TEST 6: TELEGRAM MESSAGE V2 - Mensaje enriquecido
// ===================================================================

describe('buildTelegramMessageV2', () => {
  test('debe construir mensaje para cliente anónimo explorando', () => {
    const profile = createLeadProfile({
      sessionId: 'test-msg-1',
      messages: [makeUserMsg('Qué es Prunex?')],
      productNames: ['prunex'],
      score: 20,
      lastMessage: 'Qué es Prunex?',
      isBusinessIntent: false
    });

    const message = buildTelegramMessageV2(profile);
    expect(message).toBeDefined();
    expect(message).toContain('🔍');
    expect(message).toContain('explorando productos');
    expect(message).toContain('prunex');
    expect(message).toContain('Sin datos de contacto');
  });

  test('debe construir mensaje para cliente listo para comprar', () => {
    const profile = createLeadProfile({
      sessionId: 'test-msg-2',
      messages: [makeUserMsg('Quiero comprar ON, cómo pago?')],
      productNames: ['on'],
      score: 80,
      detectedSignals: ['quiere comprar'],
      lastMessage: 'Quiero comprar ON, cómo pago?',
      isBusinessIntent: false
    });

    const message = buildTelegramMessageV2(profile);
    expect(message).toContain('🔥');
    expect(message).toContain('Listo para comprar');
    expect(message).toContain('on');
    expect(message).toContain('Sugerencia');
  });

  test('debe construir mensaje para oportunidad de negocio', () => {
    const profile = createLeadProfile({
      sessionId: 'test-msg-3',
      messages: [makeUserMsg('Quiero ser distribuidor FuXion')],
      productNames: [],
      score: 0,
      lastMessage: 'Quiero ser distribuidor FuXion',
      isBusinessIntent: true
    });

    const message = buildTelegramMessageV2(profile);
    expect(message).toContain('🚀');
    expect(message).toContain('Posible socio');
    expect(message).toContain('Contactar personalmente');
  });

  test('debe incluir datos de contacto si están disponibles', () => {
    const profile = createLeadProfile({
      sessionId: 'test-msg-4',
      messages: [
        makeUserMsg('Quiero comprar ON, mi whatsapp es 912345678')
      ],
      productNames: ['on'],
      score: 80,
      detectedSignals: ['quiere comprar'],
      lastMessage: 'Quiero comprar ON, mi whatsapp es 912345678',
      isBusinessIntent: false
    });

    const message = buildTelegramMessageV2(profile);
    expect(message).toContain('Contacto disponible');
  });

  test('debe incluir señales detectadas en lenguaje humano', () => {
    const profile = createLeadProfile({
      sessionId: 'test-msg-5',
      messages: [
        makeUserMsg('Cuánto cuesta Prunex?'),
        makeUserMsg('Hacen envíos?')
      ],
      productNames: ['prunex'],
      score: 60,
      detectedSignals: ['pregunta precio', 'consulta despacho'],
      lastMessage: 'Hacen envíos?',
      isBusinessIntent: false
    });

    const message = buildTelegramMessageV2(profile);
    expect(message).toContain('preguntó precio');
    expect(message).toContain('preguntó despacho');
  });
});

// ===================================================================
// TEST 7: INTEGRACIÓN - Flujo completo
// ===================================================================

describe('Flujo completo Lead Intelligence', () => {
  test('debe procesar conversación completa de compra', () => {
    const messages = [
      makeUserMsg('Hola, qué es Prunex?'),
      makeAssistantMsg('Prunex es un producto...'),
      makeUserMsg('Cuánto cuesta?'),
      makeAssistantMsg('Cuesta $X...'),
      makeUserMsg('Y cómo lo puedo comprar?'),
      makeAssistantMsg('Puedes comprar...'),
      makeUserMsg('Quiero comprarlo, mi teléfono es 912345678')
    ];

    // 1. Detectar etapa
    const etapa = detectarCustomerStage(messages, ['quiere comprar', 'pregunta precio'], 80, false);
    expect(etapa.id).toBe('compra');

    // 2. Detectar contacto
    const contacto = detectarContacto(messages);
    expect(contacto.disponible).toBe(true);

    // 3. Crear perfil
    const profile = createLeadProfile({
      sessionId: 'test-integration-1',
      messages,
      productNames: ['prunex'],
      durationMinutes: 5,
      score: 80,
      detectedSignals: ['quiere comprar', 'pregunta precio'],
      lastMessage: 'Quiero comprarlo, mi teléfono es 912345678',
      isBusinessIntent: false
    });

    expect(profile.etapa.id).toBe('compra');
    expect(profile.contacto.disponible).toBe(true);
    expect(profile.interes).toBeGreaterThanOrEqual(80);

    // 4. Construir mensaje
    const message = buildTelegramMessageV2(profile);
    expect(message).toContain('🔥');
    expect(message).toContain('prunex');
    expect(message).toContain('Contacto disponible');
  });

  test('debe procesar conversación de negocio', () => {
    const messages = [
      makeUserMsg('Hola, quiero información'),
      makeAssistantMsg('Claro, qué necesitas?'),
      makeUserMsg('Quiero vender productos FuXion, cómo puedo ser distribuidor?')
    ];

    // 1. Detectar oportunidad negocio
    const opportunity = detectBusinessOpportunity(messages);
    expect(opportunity).not.toBeNull();
    expect(opportunity.detectado).toBe(true);

    // 2. Detectar etapa
    const etapa = detectarCustomerStage(messages, [], 0, true);
    expect(etapa.id).toBe('negocio');

    // 3. Crear perfil
    const profile = createLeadProfile({
      sessionId: 'test-integration-2',
      messages,
      productNames: [],
      score: 0,
      detectedSignals: [],
      lastMessage: 'Quiero vender productos FuXion, cómo puedo ser distribuidor?',
      isBusinessIntent: true
    });

    expect(profile.etapa.id).toBe('negocio');
    expect(profile.interes).toBe(85);

    // 4. Construir mensaje
    const message = buildTelegramMessageV2(profile);
    expect(message).toContain('🚀');
    expect(message).toContain('Contactar personalmente');
  });

  test('cooldown debe prevenir duplicados en misma sesión', () => {
    const sessionId = 'test-integration-cooldown';

    // Primera notificación
    registerNotification(sessionId, {
      score: 50,
      etapaId: 'evaluando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });

    // Misma sesión, mismo estado - debe bloquear
    const result1 = checkCooldown(sessionId, {
      score: 50,
      etapaId: 'evaluando',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });
    expect(result1.permitido).toBe(false);

    // Cambió a compra - debe permitir
    const result2 = checkCooldown(sessionId, {
      score: 80,
      etapaId: 'compra',
      isBusinessIntent: false,
      productPrincipal: 'prunex'
    });
    expect(result2.permitido).toBe(true);
  });
});
