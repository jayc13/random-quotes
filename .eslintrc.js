module.exports = [
  {
    ignores: ["node_modules/**"],
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
