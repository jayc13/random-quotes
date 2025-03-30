import generated from '@typescript-eslint/eslint-plugin';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginJest from 'eslint-plugin-jest';

export default [
  {
    ignores: [
      'node_modules',
      '.next',
      'coverage',
      '.idea',
      '.swc',
      'test-results'
    ]
  },
  {
    plugins: {
      '@typescript-eslint': generated,
      'react': eslintPluginReact,
      'jest': eslintPluginJest
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    }
  }
];