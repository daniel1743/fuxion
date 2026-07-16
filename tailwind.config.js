/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontSize: {
				'xxs': ['0.625rem', { lineHeight: '1rem' }],
			},
			zIndex: {
				'hide': '-1',
				'base': '0',
				'content': '10',
				'sticky': '20',
				'header': '30',
				'nav': '40',
				'floating': '45',
				'backdrop': '50',
				'modal': '60',
				'dropdown': '70',
				'toast': '80',
				'max': '9999',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				fuxion: {
					DEFAULT: '#0E5C53',
					light: '#136a64',
				},
				whatsapp: {
					DEFAULT: '#25D366',
					hover: '#1fb85a',
					bg: '#F1FDF8',
				},
				surface: {
					dark: '#0a1410',
					muted: '#0f1f18',
					elevated: '#1a2e25',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '20px',
				'3xl': '28px',
				'card': '16px',
				'sheet': '24px',
				'pill': '9999px',
			},
			boxShadow: {
				'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
				'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08)',
				'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
				'elevation-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
				'elevation-5': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'premium-soft': '0 12px 30px -10px rgba(14,92,83,0.3)',
				'premium-hover': '0 8px 32px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)',
				'premium-dark': '0 8px 32px -4px rgba(0,0,0,0.4)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			transitionTimingFunction: {
				'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
