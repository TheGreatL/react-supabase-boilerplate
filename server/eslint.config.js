import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Ignore build artifacts
  {
    ignores: ['dist', 'node_modules', 'generated']
  },
  // 2. Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended, // Back to standard recommended (less strict)
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  // 3. Custom Rules
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/require-await': 'warn', // This now has the type info it needs
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },
  // 4. Disable type-checked rules for JS files
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked
  }
);
