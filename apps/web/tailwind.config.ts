import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ZoikoSocial brand palette — derived from logo (#066879 teal primary, #E88924 orange accent).
        // Tokens are driven by CSS variables (see globals.css :root / .dark) so they respond to the
        // active theme. Values are HSL triplets; the `<alpha-value>` placeholder keeps Tailwind
        // opacity modifiers (e.g. `bg-surface/50`) working.
        primary: 'hsl(var(--zk-primary) / <alpha-value>)',
        'primary-container': 'hsl(var(--zk-primary-container) / <alpha-value>)',
        'on-primary': 'hsl(var(--zk-on-primary) / <alpha-value>)',
        'primary-fixed': 'hsl(var(--zk-primary-fixed) / <alpha-value>)',
        'primary-fixed-dim': 'hsl(var(--zk-primary-fixed-dim) / <alpha-value>)',
        'on-primary-fixed': 'hsl(var(--zk-on-primary-fixed) / <alpha-value>)',
        'on-primary-fixed-variant': 'hsl(var(--zk-on-primary-fixed-variant) / <alpha-value>)',

        secondary: 'hsl(var(--zk-secondary) / <alpha-value>)',
        'secondary-container': 'hsl(var(--zk-secondary-container) / <alpha-value>)',
        'on-secondary': 'hsl(var(--zk-on-secondary) / <alpha-value>)',
        'on-secondary-container': 'hsl(var(--zk-on-secondary-container) / <alpha-value>)',
        'secondary-fixed': 'hsl(var(--zk-secondary-fixed) / <alpha-value>)',
        'secondary-fixed-dim': 'hsl(var(--zk-secondary-fixed-dim) / <alpha-value>)',
        'on-secondary-fixed': 'hsl(var(--zk-on-secondary-fixed) / <alpha-value>)',
        'on-secondary-fixed-variant': 'hsl(var(--zk-on-secondary-fixed-variant) / <alpha-value>)',

        tertiary: 'hsl(var(--zk-tertiary) / <alpha-value>)',
        'tertiary-container': 'hsl(var(--zk-tertiary-container) / <alpha-value>)',
        'on-tertiary': 'hsl(var(--zk-on-tertiary) / <alpha-value>)',
        'on-tertiary-container': 'hsl(var(--zk-on-tertiary-container) / <alpha-value>)',
        'tertiary-fixed': 'hsl(var(--zk-tertiary-fixed) / <alpha-value>)',
        'tertiary-fixed-dim': 'hsl(var(--zk-tertiary-fixed-dim) / <alpha-value>)',
        'on-tertiary-fixed': 'hsl(var(--zk-on-tertiary-fixed) / <alpha-value>)',
        'on-tertiary-fixed-variant': 'hsl(var(--zk-on-tertiary-fixed-variant) / <alpha-value>)',

        error: 'hsl(var(--zk-error) / <alpha-value>)',
        'error-container': 'hsl(var(--zk-error-container) / <alpha-value>)',
        'on-error': 'hsl(var(--zk-on-error) / <alpha-value>)',
        'on-error-container': 'hsl(var(--zk-on-error-container) / <alpha-value>)',

        background: 'hsl(var(--zk-background) / <alpha-value>)',
        'on-background': 'hsl(var(--zk-on-background) / <alpha-value>)',
        surface: 'hsl(var(--zk-surface) / <alpha-value>)',
        'surface-dim': 'hsl(var(--zk-surface-dim) / <alpha-value>)',
        'surface-bright': 'hsl(var(--zk-surface-bright) / <alpha-value>)',
        'surface-container-lowest': 'hsl(var(--zk-surface-container-lowest) / <alpha-value>)',
        'surface-container-low': 'hsl(var(--zk-surface-container-low) / <alpha-value>)',
        'surface-container': 'hsl(var(--zk-surface-container) / <alpha-value>)',
        'surface-container-high': 'hsl(var(--zk-surface-container-high) / <alpha-value>)',
        'surface-container-highest': 'hsl(var(--zk-surface-container-highest) / <alpha-value>)',
        'on-surface': 'hsl(var(--zk-on-surface) / <alpha-value>)',
        'on-surface-variant': 'hsl(var(--zk-on-surface-variant) / <alpha-value>)',
        'surface-variant': 'hsl(var(--zk-surface-variant) / <alpha-value>)',
        outline: 'hsl(var(--zk-outline) / <alpha-value>)',
        'outline-variant': 'hsl(var(--zk-outline-variant) / <alpha-value>)',
        'surface-tint': 'hsl(var(--zk-surface-tint) / <alpha-value>)',

        'inverse-surface': 'hsl(var(--zk-inverse-surface) / <alpha-value>)',
        'inverse-on-surface': 'hsl(var(--zk-inverse-on-surface) / <alpha-value>)',
        'inverse-primary': 'hsl(var(--zk-inverse-primary) / <alpha-value>)',

        // Convenience aliases used by auth pages and various components
        teal: {
          deep:  '#0C2A28',
          mid:   '#1D4440',
          light: '#2A5E58',
          muted: '#4A726E',
          wash:  '#E8F2F0',
          pale:  '#F0F7F6',
        },
        amber: {
          DEFAULT: '#D9920A',
          light:   '#F4A820',
          pale:    '#FEF3DA',
        },

        // ── shadcn/ui compatibility ──────────────────────────
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        'muted': {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'accent': {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'destructive': {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'card': {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'popover': {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      fontFamily: {
        headline: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        label: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '500' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'headline-xl': ['48px', { lineHeight: '56px', fontWeight: '700' }],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      spacing: {
        gutter: '24px',
        'margin-desktop': '40px',
        'margin-mobile': '16px',
        'container-max': '1280px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
