import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/domain/$1',
    '^@application/(.*)$': '<rootDir>/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/index.ts',
    '!main.ts',
    '!**/*.test.ts',
    '!shared/utils/logger.ts',
    '!infrastructure/database/connection.ts',
    '!infrastructure/database/PostgresSubscriptionRepository.ts',
    '!infrastructure/webhook/WebhookNotifier.ts',
    '!infrastructure/container.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
};

export default config;