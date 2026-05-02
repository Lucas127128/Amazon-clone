import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    maxConcurrency: 150,
    maxWorkers: 30,
    clearMocks: true,
    // reporters: ['html', 'default'],
    // experimental: { fsModuleCache: true },
    env: {
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    },
    sequence: { concurrent: true },
    typecheck: { enabled: true },
    projects: [
      {
        test: {
          name: 'bun',
          include: [
            'packages/web/tests/scripts/utils/**/*.test.ts',
            'packages/shared/tests/data/**/*.test.ts',
            'packages/shared/tests/utils/money.test.ts',
            'packages/web/tests/scripts/data/orders.test.ts',
            'packages/web/tests/scripts/pages/htmlGenerators/**/*.test.ts',
            'packages/server/tests/src/**/*.test.ts',
          ],
          environment: 'node',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        test: {
          name: 'happy-dom',
          include: [
            'packages/web/tests/scripts/pages/checkout/**/*.test.ts',
            'packages/shared/tests/utils/typechecker.test.ts',
            'packages/web/tests/scripts/data/cart.test.ts',
          ],
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
      {
        test: {
          include: ['packages/server/tests/api/*.test.ts'],
          name: 'api',
          environment: 'node',
        },
      },
    ],
  },
});
