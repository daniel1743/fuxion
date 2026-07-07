/**
 * Elegant confetti utility for important celebrations only.
 * Uses canvas-confetti with premium, controlled settings.
 * Duration: short. Style: elegant. No overuse.
 */
import confetti from 'canvas-confetti';

const isReducedMotion = () => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Fire a short, elegant confetti burst.
 * Use ONLY for: form submitted (opportunity), advisor request sent, purchase completed.
 */
export const fireElegantConfetti = () => {
  if (isReducedMotion()) return;

  const duration = 800; // short burst
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#059669', '#10b981', '#34d399', '#fbbf24', '#f59e0b'],
      startVelocity: 25,
      gravity: 0.8,
      scalar: 0.8,
      ticks: 60,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#059669', '#10b981', '#34d399', '#fbbf24', '#f59e0b'],
      startVelocity: 25,
      gravity: 0.8,
      scalar: 0.8,
      ticks: 60,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

/**
 * Single burst for very subtle celebration.
 */
export const fireSubtleBurst = () => {
  if (isReducedMotion()) return;

  confetti({
    particleCount: 15,
    spread: 45,
    origin: { y: 0.6 },
    colors: ['#059669', '#10b981', '#34d399'],
    startVelocity: 20,
    gravity: 1,
    scalar: 0.7,
    ticks: 40,
  });
};
