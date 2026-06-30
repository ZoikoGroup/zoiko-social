import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __dirname = dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  { ignores: ['.next/**', 'out/**', 'node_modules/**'] },

  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ),

  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-eval': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]
