import { comptime } from 'comptime/vite';
import { defineConfig } from 'vitest/config';

const plugins = [comptime()];

export default defineConfig({
  test: {
    pool: 'threads',
    maxConcurrency: 150,
    maxWorkers: 30,
    clearMocks: true,
    experimental: { fsModuleCache: true },
    sequence: { concurrent: true },
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'text'],
      reportsDirectory: '../../coverage/web',
    },
    detectAsyncLeaks: true,
    projects: [
      {
        plugins,
        test: {
          name: 'bun',
          include: [
            'tests/data/orders.test.ts',
            'tests/data/search.test.ts',
            'tests/data/tracking.test.ts',
            'tests/data/cart.test.ts',
          ],
          environment: 'node',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
