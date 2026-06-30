import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
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
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
