import nextConfig from 'eslint-config-next'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  // Global ignores — standalone config object required in ESLint 9 flat config
  { ignores: ['.next/**', 'out/**', 'node_modules/**'] },

  // eslint-config-next v16 exports a native ESLint 9 flat config array:
  //   [0] next       — all Next.js + React rules for *.{js,ts,tsx,...}
  //   [1] next/typescript — registers @typescript-eslint plugin + parser
  //   [2] global settings
  // No FlatCompat needed — spreading directly avoids the circular JSON bug
  // in @eslint/eslintrc v3.3.x when processing eslint-plugin-react's flat config.
  ...nextConfig,

  // Custom security + TypeScript rules on top of the base config
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      // Injection / XSS prevention
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',

      // TypeScript strictness
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Logging discipline
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]
