import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/__tests__/unit/**/*.test.ts',
    '<rootDir>/__tests__/unit/**/*.test.tsx',
    '<rootDir>/__tests__/integration/**/*.test.ts',
    '<rootDir>/__tests__/components/**/*.test.tsx',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
  ],
  coverageThreshold: {
    global: { lines: 70, branches: 70, functions: 70 },
    './src/services/': { lines: 85, branches: 70, functions: 85 },
    './src/app/api/': { lines: 80, branches: 65, functions: 80 },
    './src/domain/': { lines: 85, branches: 85, functions: 85 },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/schemas/**',
    '!src/app/layout.tsx',
    '!src/app/page.tsx',
    '!src/**/*.stories.tsx',
  ],
}

export default createJestConfig(config)
