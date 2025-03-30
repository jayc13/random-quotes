import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "./tests/integration/"
  ],
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.ts',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/pages/services/',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  reporters: ['default', 'jest-junit'],
  detectOpenHandles: true,
  cache: false,
};

export default config;