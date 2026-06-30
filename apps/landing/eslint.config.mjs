import nextConfig from 'eslint-config-next'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  { ignores: ['.next/**', 'out/**', 'node_modules/**'] },

  ...nextConfig,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-eval': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]
