import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default defineConfig([
  {
    settings: {
      react: {
        version: "detect",
      },
    }
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  tslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: [
      ".next/*",
      '.github/*',
      'node_modules/*',
      'coverage/*',
      'test-results/*',
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
]);