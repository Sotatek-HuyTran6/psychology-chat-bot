import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    
    languageOptions: {
      ...tseslint.configs.recommended.languageOptions,
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'prettier': prettier,
    },

    rules: {
      // ESLint base rules
      ...js.configs.recommended.rules,
      
      // Disable base ESLint rules that are covered by TypeScript equivalents
      'no-unused-vars': 'off',
      
      // TypeScript rules
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error', 
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off', // Using TypeScript
      'react/display-name': 'off',
      
      // React Hooks rules - Critical for preventing cascading renders
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'warn', 
        {
          'additionalHooks': '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
          'enableDangerousAutofixSuggestionMode': true
        }
      ]
      
      // React Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      
      // Prettier
      'prettier/prettier': 'error',

      // Additional rules to prevent cascading renders and side effects
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-expressions': 'error',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]