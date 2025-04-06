import { FlatCompat } from '@eslint/eslintrc';


const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const configs = [
  ...compat.config({
    extends: ['next'],
    ignorePatterns: [
      '.next/',
      'node_modules/',
      'playwright-report/',
      'coverage/',
      '.idea/',
      '.swc/',
      '.test-results/'
    ],
    settings: {

      next: {
        rootDir: './',
      },
    },
  }),
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  {
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    }
  }
];

export default configs;