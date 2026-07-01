import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm terracotta primary palette (LinkedIn-inspired)
        primary: '#99452c',
        'primary-container': '#e27d60',
        'on-primary': '#ffffff',
        'primary-fixed': '#ffdbd1',
        'primary-fixed-dim': '#ffb5a0',
        'on-primary-fixed': '#3b0900',
        'on-primary-fixed-variant': '#7b2e17',

        secondary: '#436646',
        'secondary-container': '#c2eac1',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#486b4a',
        'secondary-fixed': '#c5edc4',
        'secondary-fixed-dim': '#a9d1a9',
        'on-secondary-fixed': '#002108',
        'on-secondary-fixed-variant': '#2c4e30',

        tertiary: '#645e49',
        'tertiary-container': '#a09981',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#36311f',
        'tertiary-fixed': '#ebe2c8',
        'tertiary-fixed-dim': '#cec6ad',
        'on-tertiary-fixed': '#1f1c0b',
        'on-tertiary-fixed-variant': '#4c4733',

        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        background: '#f4fbfa',
        'on-background': '#161d1d',
        surface: '#f4fbfa',
        'surface-dim': '#d4dbdb',
        'surface-bright': '#f4fbfa',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eef5f4',
        'surface-container': '#e8efef',
        'surface-container-high': '#e3e9ea',
        'surface-container-highest': '#dde4e3',
        'on-surface': '#161d1d',
        'on-surface-variant': '#55433d',
        'surface-variant': '#dde4e3',
        outline: '#88726c',
        'outline-variant': '#dbc1ba',
        'surface-tint': '#99452c',

        'inverse-surface': '#2b3232',
        'inverse-on-surface': '#ebf2f2',
        'inverse-primary': '#ffb5a0',
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
  plugins: [],
}

export default config
