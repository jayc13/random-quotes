import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    ignores: [
      '.github/**',
      'node_modules/**',
      '.next/**',
      'jest.config.js',
      'package.json',
      'package-lock.json',
      'run_tests.sh',
      'tsconfig.json',
      'vercel.json',
      'babel.config.js',
      'next.config.js'
    ],
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});
export default [...compat.extends("next/core-web-vitals")];



// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const patchedConfig = fixupConfigRules([...compat.extends("next/core-web-vitals")]);

const config = [
    ...patchedConfig,
    // Add more flat configs here
    { 
        ignores: [
            ".next/*",
            '.github/*',
              'node_modelues/*',
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
];

export default config;