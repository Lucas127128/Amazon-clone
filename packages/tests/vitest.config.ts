// import { preview } from '@vitest/browser-preview';
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
    projects: [
      {
        test: {
          name: 'bun',
          include: [
            './normal/web/scripts/utils/**/*.test.ts',
            './normal/shared/data/**/*.test.ts',
            './normal/shared/utils/money.test.ts',
            './normal/web/scripts/data/orders.test.ts',
            './normal/web/scripts/pages/htmlGenerators/**/*.test.ts',
          ],
          environment: 'node',
          setupFiles: ['./normal/vitest.setUp.ts'],
        },
      },
      {
        test: {
          name: 'happy-dom',
          include: [
            './normal/web/scripts/pages/checkout/**/*.test.ts',
            './normal/shared/utils/typechecker.test.ts',
            './normal/web/scripts/data/cart.test.ts',
          ],
          environment: 'happy-dom',
          setupFiles: ['./normal/vitest.setUp.ts'],
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
          include: ['./normal/server/**/*.test.ts'],
          name: 'api',
          environment: 'node',
        },
      },
      // {
      //   test: {
      //     isolate: true,
      //     include: ['./browser/**/*.test.ts'],
      //     name: 'browser',
      //     browser: {
      //       enabled: true,
      //       provider: preview(),
      //       instances: [{ browser: 'chromnium' }],
      //     },
      //   },
      // },
    ],
  },
});
