import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    maxConcurrency: 150,
    maxWorkers: 30,
    clearMocks: true,
    // reporters: ['html', 'default'],
    experimental: { fsModuleCache: true },
    env: {
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    },
    sequence: { concurrent: true },
    typecheck: { enabled: true },
    coverage: {
      provider: 'istanbul',
      reporter: ['json'],
      reportsDirectory: '../../coverage/server',
    },
    projects: [
      {
        test: {
          name: 'bun',
          include: ['tests/src/**/*.test.ts'],
          environment: 'node',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        test: {
          include: ['tests/api/*.test.ts'],
          name: 'api',
          environment: 'node',
        },
      },
    ],
  },
});
