/**
 * Design System Motion Tokens - Biblia Mobile Premium 2026
 * 
 * Reemplaza las curvas de tiempo estáticas (linear, ease-out) por
 * físicas de resorte kinestésicas reales (Spring Physics).
 */

export const SPRING_PHYSICS = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
  mass: 0.9,
};

export const SPRING_BOUNCE = {
  type: 'spring',
  stiffness: 350,
  damping: 20,
  mass: 0.8,
};

export const SPRING_GENTLE = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const SPRING_SNAPPY = {
  type: 'spring',
  stiffness: 500,
  damping: 32,
};

export const MICRO_INTERACTION = {
  tapScale: 0.96,
  hoverScale: 1.02,
  transition: SPRING_SNAPPY,
};
