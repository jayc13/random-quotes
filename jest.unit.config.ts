import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  preset: 'ts-jest',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  roots: [
    "./tests/unit/"
  ],
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.ts',
    '<rootDir>/tests/unit/**/*.test.tsx',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: [],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  reporters: ['default', 'jest-junit'],
  cache: false
};

export default createJestConfig(config);