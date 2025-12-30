import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  // ===============================
  // APP CODE (src)
  // ===============================
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Framer Motion JSX usage
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(motion|AnimatePresence|[A-Z_])',
          argsIgnorePattern: '^(As|[A-Z_])',
        },
      ],



      // Allow intentional animation patterns
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // ===============================
  // TEST FILES (Vitest)
  // ===============================
  {
    files: ['src/**/*.{test,integration.test}.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        // Vitest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
])
