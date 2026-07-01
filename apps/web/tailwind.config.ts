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
        // ZoikoSocial brand palette — derived from logo (#066879 teal primary, #E88924 orange accent)
        primary: '#066879',
        'primary-container': '#D6EEF2',
        'on-primary': '#ffffff',
        'primary-fixed': '#D6EEF2',
        'primary-fixed-dim': '#A8D4DC',
        'on-primary-fixed': '#012630',
        'on-primary-fixed-variant': '#034A57',

        secondary: '#E88924',
        'secondary-container': '#FEF0DC',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#5C2A00',
        'secondary-fixed': '#FEF0DC',
        'secondary-fixed-dim': '#F9C97A',
        'on-secondary-fixed': '#5C2A00',
        'on-secondary-fixed-variant': '#A85A00',

        tertiary: '#6B7280',
        'tertiary-container': '#E5E7EB',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#374151',
        'tertiary-fixed': '#F3F4F6',
        'tertiary-fixed-dim': '#D1D5DB',
        'on-tertiary-fixed': '#111827',
        'on-tertiary-fixed-variant': '#4B5563',

        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        background: '#F7F8F8',
        'on-background': '#111111',
        surface: '#ffffff',
        'surface-dim': '#E5E7EB',
        'surface-bright': '#ffffff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#F7F8F8',
        'surface-container': '#F0F1F1',
        'surface-container-high': '#E8E9E9',
        'surface-container-highest': '#E0E1E1',
        'on-surface': '#111111',
        'on-surface-variant': '#374151',
        'surface-variant': '#E5E7EB',
        outline: '#6B7280',
        'outline-variant': '#D1D5DB',
        'surface-tint': '#066879',

        'inverse-surface': '#1F2937',
        'inverse-on-surface': '#F9FAFB',
        'inverse-primary': '#A8D4DC',
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
