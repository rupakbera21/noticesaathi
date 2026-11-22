import nextPlugin from 'eslint-config-next'
import tseslint from 'typescript-eslint'

const eslintConfig = tseslint.config(
  {
    ignores: ['.next/**', 'coverage/**', 'node_modules/**', 'dist/**', 'out/**'],
  },
  ...nextPlugin,
  ...tseslint.configs.recommended,
  {
    rules: {
      // File and function size limits
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 80, skipBlankLines: true, skipComments: true }],
      'complexity': ['error', { max: 12 }],
      'max-depth': ['error', { max: 4 }],
      // Code quality
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // No TODO comments in code — trade-offs go in README
      'no-warning-comments': ['error', { terms: ['TODO', 'FIXME', 'HACK', 'XXX'], location: 'start' }],
    },
  },
  {
    // Relax limits for config, tests, and scripts
    files: [
      '**/*.config.*',
      '**/__tests__/**',
      '**/*.spec.*',
      '**/*.test.*',
      'jest.setup.ts',
      'scripts/**',
    ],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'no-console': 'off',
    },
  }
)

export default eslintConfig
