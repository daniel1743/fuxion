// Design System — Typography Tokens

export const typography = {
  fontFamily: {
    display: ['Inter', '"SF Pro Display"', 'Manrope', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
    body: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs:   ['0.75rem',  { lineHeight: '1rem' }],
    sm:   ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem',     { lineHeight: '1.5rem' }],
    lg:   ['1.125rem', { lineHeight: '1.75rem' }],
    xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem',  { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],
    '5xl': ['3rem',     { lineHeight: '1' }],
    '6xl': ['3.75rem',  { lineHeight: '1' }],
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.15em',
  },
};

export default typography;
