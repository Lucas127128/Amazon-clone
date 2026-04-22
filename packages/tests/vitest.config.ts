import { defineConfig } from 'vitest/config';
import { preview } from '@vitest/browser-preview';

export default defineConfig({
  test: {
    pool: 'threads',
    maxConcurrency: 100,
    maxWorkers: 64,
    clearMocks: true,
    // reporters: ['html', 'default'],
    experimental: { fsModuleCache: true, viteModuleRunner: true },
    env: {
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    },
    sequence: { concurrent: true },
    projects: [
      {
        test: {
          include: [
            './normal/web/scripts/utils/**/*.test.ts',
            './normal/shared/data/**/*.test.ts',
            './normal/shared/utils/money.test.ts',
          ],
          name: 'bun',
          environment: 'node',
          setupFiles: ['./normal/vitest.setUp.ts'],
        },
      },
      {
        test: {
          include: [
            './normal/web/scripts/pages/**/*.test.ts',
            './normal/web/scripts/data/**/*.test.ts',
            './normal/shared/utils/typechecker.test.ts',
          ],
          name: 'happy-dom',
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
