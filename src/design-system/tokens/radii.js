// Design System — Border Radius Tokens

export const radii = {
  none:     '0',
  sm:       'calc(var(--radius) - 4px)',
  md:       'calc(var(--radius) - 2px)',
  base:     'var(--radius)',
  lg:       'var(--radius)',
  xl:       '0.75rem',      // 12px
  '2xl':    '1.25rem',      // 20px
  '3xl':    '1.75rem',      // 28px
  full:     '9999px',
  // Semantic presets
  card:     '16px',
  sheet:    '24px',
  pill:     '9999px',
};

export default radii;
