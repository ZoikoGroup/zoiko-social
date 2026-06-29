import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ZoikoSocial brand palette — use these instead of raw hex
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
        sage: {
          DEFAULT: '#5C9E78',
          pale:    '#EAF4EE',
        },
        surface: '#F5F2ED',
        paper:   '#FDFCFA',
      },
      fontFamily: {
        // Brand name only — Georgia for display headings
        serif: ['Georgia', 'Times New Roman', 'serif'],
        // Everything else — system sans-serif stack
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
}

export default config
