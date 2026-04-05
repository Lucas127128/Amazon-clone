import { defineConfig } from 'vitest/config';
// import { preview } from '@vitest/browser-preview';

export default defineConfig({
  test: {
    pool: 'threads',
    maxConcurrency: 100,
    maxWorkers: 32,
    projects: [
      {
        test: {
          isolate: true,
          include: ['./normal/**/*.test.ts'],
          name: 'happy-dom',
          environment: 'happy-dom',
          setupFiles: ['./normal/preload.ts'],
          environmentOptions: {
            happyDOM: {
              width: 100,
              height: 50,
              settings: {
                fetch: {
                  disableStrictSSL: true,
                  disableSameOriginPolicy: true,
                },
              },
            },
          },
        },
      },
      // { test: { isolate: true, name: 'bun', environment: 'node' } },
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
