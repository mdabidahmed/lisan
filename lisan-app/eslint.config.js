import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'dev-dist/**',
      'coverage/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'design-reference/**',
      // Scratch browser profiles used for local visual rendering.
      '**/.preview/**',
    ],
  },

  // Application source: fully type-aware linting.
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],
      // Optional chaining on DOM/BOM APIs is deliberate: jsdom and older browsers do not
      // implement every surface we feature-detect.
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        { allowConstantLoopConditions: true },
      ],

      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'object-shorthand': 'error',

      // The Icon component is the single source of UI glyphs.
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML is not allowed; render trusted React nodes instead.',
        },
      ],
    },
  },

  // The route table necessarily pairs lazy component references with plain exports.
  {
    files: ['src/app/router.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Tests relax a few rules that fight with mocking.
  {
    files: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },

  // Only the audio service may touch the speech synthesis API directly.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/services/audio/**', 'src/test/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'speechSynthesis',
          message: 'Use the audio service (useAudio) instead of speechSynthesis directly.',
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'speechSynthesis',
          message: 'Use the audio service (useAudio) instead of speechSynthesis directly.',
        },
        {
          object: 'window',
          property: 'localStorage',
          message: 'Use the storage service instead of localStorage directly.',
        },
        {
          object: 'window',
          property: 'sessionStorage',
          message: 'Use the storage service instead of sessionStorage directly.',
        },
      ],
    },
  },

  // Node-side tooling files.
  {
    files: ['*.config.{js,ts}', 'e2e/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.node,
    },
  },

  prettier,
);
