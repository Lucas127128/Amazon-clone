import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    maxConcurrency: 150,
    maxWorkers: 30,
    clearMocks: true,
    // reporters: ['html', 'default'],
    experimental: { fsModuleCache: true },
    sequence: { concurrent: true },
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'text'],
      reportsDirectory: '../../coverage/shared',
    },
    detectAsyncLeaks: true,
    projects: [
      {
        test: {
          name: 'bun',
          include: [
            'tests/data/**/*.test.ts',
            'tests/utils/money.test.ts',
            'tests/utils/typechecker.test.ts',
          ],
          environment: 'node',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
