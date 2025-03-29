module.exports = [
  {
    ignores: [
        '.github/**',
        'node_modules/**',
        'jest.config.js',
        'package.json',
        'run_tests.sh',
        'tsconfig.json',
        'vercel.json',
        'babel.config.js',
        'next.config.js'
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: ["next", "next/core-web-vitals"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
];
