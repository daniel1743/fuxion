// Design System — Semantic Color Tokens
// Base palette extracted from the Fuxion brand (Fondo de Bienestar)
// All component styles must reference these tokens exclusively.

export const colors = {
  // Brand
  brand: {
    primary:   'hsl(151, 55%, 34%)',   // #0E5C53 — Fuxion green
    light:     'hsl(151, 55%, 44%)',   // lighter variant
    muted:     'hsl(151, 20%, 78%)',   // subtle tint
  },

  // Surface palette (dark mode base)
  surface: {
    dark:      '#0a1410',
    muted:     '#0f1f18',
    elevated:  '#1a2e25',
  },

  // Semantic primitives (mapped to CSS vars)
  semantic: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    card:       'hsl(var(--card))',
    popover:    'hsl(var(--popover))',
    primary:    'hsl(var(--primary))',
    'primary-fg': 'hsl(var(--primary-foreground))',
    secondary:  'hsl(var(--secondary))',
    'secondary-fg': 'hsl(var(--secondary-foreground))',
    muted:      'hsl(var(--muted))',
    'muted-fg': 'hsl(var(--muted-foreground))',
    accent:     'hsl(var(--accent))',
    'accent-fg': 'hsl(var(--accent-foreground))',
    destructive: 'hsl(var(--destructive))',
    'destructive-fg': 'hsl(var(--destructive-foreground))',
    border:     'hsl(var(--border))',
    input:      'hsl(var(--input))',
    ring:       'hsl(var(--ring))',
  },

  // WhatsApp
  whatsapp: {
    DEFAULT: '#25D366',
    hover:   '#1fb85a',
    bg:      '#F1FDF8',
  },

  // Extra UI colors used throughout the app
  purple: {
    50:  '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6d28d9',
    900: '#4c1d95',
    950: '#2e1065',
  },
  pink: {
    500: '#ec4899',
  },
  blue: {
    500: '#0ea5e9',
  },
  amber: {
    500: '#f59e0b',
    100: '#fef3c7',
  },
  emerald: {
    50:  '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  sky: {
    500: '#0ea5e9',
  },
  lime: {
    500: '#84cc16',
  },
  slate: {
    50:  '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    500: '#64748b',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  zinc: {
    50:  '#fafafa',
    100: '#f4f4f5',
    800: '#1f2937',
    900: '#111827',
  },
  white: '#ffffff',
  black: '#000000',
};

export default colors;
