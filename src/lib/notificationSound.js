/**
 * Sonido de notificación — FuXion Store
 *
 * Genera un tono ascendente agradable de dos notas (~300 ms) usando la Web Audio API.
 * No requiere archivos de audio externos.
 *
 * El AudioContext se inicializa de forma perezosa (lazy) para cumplir con las
 * políticas de autoplay de los navegadores modernos.
 */

/** @type {AudioContext | null} Singleton perezoso del contexto de audio */
let audioCtx = null;

/** Indica si el usuario ya interactuó y el contexto puede reproducir */
let soundEnabled = false;

/**
 * Obtiene o crea el AudioContext singleton.
 * Se llama de forma interna; no exportado.
 * @returns {AudioContext}
 */
const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.warn('[NotificationSound] Web Audio API no disponible en este navegador.');
      return null;
    }
    audioCtx = new AudioContextClass();
  }

  // Resumir si está suspendido (políticas de autoplay)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Silenciar error si el navegador lo rechaza
    });
  }

  return audioCtx;
};

/**
 * Solicita permiso de audio al usuario.
 * Debe llamarse como respuesta a una interacción del usuario (click, tap, etc.)
 * para desbloquear el AudioContext en navegadores que lo requieren.
 *
 * @returns {Promise<boolean>} `true` si el permiso fue concedido.
 */
export const requestSoundPermission = async () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    soundEnabled = true;
    return true;
  } catch (err) {
    console.warn('[NotificationSound] No se pudo habilitar el audio:', err);
    return false;
  }
};

/**
 * Reproduce un chime ascendente de dos tonos.
 *
 * Nota 1: ~523 Hz (C5) — 150 ms
 * Nota 2: ~659 Hz (E5) — 150 ms
 *
 * Usa osciladores de onda sinusoidal con envolvente suave (fade-in / fade-out)
 * para evitar clics audibles.
 */
export const playNotificationSound = () => {
  // No reproducir si el sonido no está habilitado todavía
  if (!soundEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // ── Configuración de las notas ──────────────────────────────────
  const notes = [
    { freq: 523.25, start: now,       end: now + 0.15 },  // C5
    { freq: 659.25, start: now + 0.15, end: now + 0.30 },  // E5
  ];

  // ── Nodo de ganancia maestro (volumen global del chime) ────────
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.25, now);    // Volumen moderado
  masterGain.connect(ctx.destination);

  notes.forEach(({ freq, start, end }) => {
    // Oscilador sinusoidal para un tono limpio
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    // Envolvente de ganancia individual (ataque + liberación)
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, start);

    // Ataque suave (fade-in ~20 ms)
    noteGain.gain.linearRampToValueAtTime(1, start + 0.02);

    // Sostenimiento y liberación suave (fade-out ~30 ms antes del final)
    noteGain.gain.setValueAtTime(1, end - 0.03);
    noteGain.gain.linearRampToValueAtTime(0, end);

    // Conectar cadena: oscilador → ganancia nota → ganancia maestra
    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(start);
    osc.stop(end + 0.01); // Margen mínimo para evitar cortes
  });
};
