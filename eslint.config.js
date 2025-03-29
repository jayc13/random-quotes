const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat();

module.exports = [
  {
    ignores: [
      '.github/**',
      'node_modules/**',
      'jest.config.js',
      'package.json',
      'package-lock.json',
      'run_tests.sh',
      'tsconfig.json',
      'vercel.json',
      'babel.config.js',
      'next.config.js'
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...compat.extends("next", "next/core-web-vitals"),
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
];