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
      thresholds: {
        lines: 90,
        functions: 90,
        statements: 90,
        branches: 80,
      },
    },
    detectAsyncLeaks: true,
    projects: [
      {
        plugins,
        test: {
          name: 'bun',
          include: ['tests/normal/**/*.test.ts'],
          environment: 'node',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        plugins,
        test: {
          name: 'web',
          include: ['tests/web/**/*.test.ts'],
          environment: 'happy-dom',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
