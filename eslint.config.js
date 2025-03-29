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
