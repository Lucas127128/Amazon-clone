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
      reporter: ['json', 'text'],
      reportsDirectory: '../../coverage/shared',
    },
    projects: [
      {
        test: {
          name: 'bun',
          include: [
            'tests/data/**/*.test.ts',
            'tests/utils/money.test.ts',
          ],
          environment: 'node',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        test: {
          name: 'happy-dom',
          include: ['tests/utils/typechecker.test.ts'],
          environment: 'happy-dom',
          setupFiles: ['./vitest.setup.ts'],
          environmentOptions: {
            happyDOM: {
              width: 4,
              height: 3,
              settings: {
                fetch: {
                  disableStrictSSL: true,
                  disableSameOriginPolicy: true,
                },
                disableCSSFileLoading: true,
                disableComputedStyleRendering: true,
              },
            },
          },
        },
      },
    ],
  },
});
