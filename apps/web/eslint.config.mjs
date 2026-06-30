import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __dirname = dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  // Global ignores: must be a standalone config object in ESLint 9 flat config.
  // An ignores key inside a config object with other keys is a file-pattern filter,
  // not a global ignore — they behave differently.
  { ignores: ['.next/**', 'out/**', 'node_modules/**'] },

  // Next.js core rules + TypeScript recommended.
  // Using `recommended` not `recommended-type-checked` — the type-checked variant
  // requires parserOptions.project (TypeScript language service) which is not
  // configured here. Type safety is covered by the separate `tsc --noEmit` step.
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ),

  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Injection / XSS prevention
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',

      // TypeScript strictness (no-any, clean imports, no dead vars)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Logging discipline (no accidental console.log in prod)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]
