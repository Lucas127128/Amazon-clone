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
    projects: [
      {
        test: {
          sequence: { concurrent: true },
          include: [
            './normal/web/**/*.test.ts',
            './normal/shared/**/*.test.ts',
          ],
          name: 'happy-dom',
          environment: 'happy-dom',
          setupFiles: ['./normal/happyDom.setUp.ts'],
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
          sequence: { concurrent: true },
          include: ['./normal/server/**/*.test.ts'],
          name: 'bun',
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
