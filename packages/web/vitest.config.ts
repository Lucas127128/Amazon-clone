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
      reportsDirectory: '../../coverage/web',
    },
    projects: [
      {
        test: {
          name: 'bun',
          include: [
            'tests/scripts/utils/**/*.test.ts',
            'tests/scripts/data/**/*.test.ts',
            'tests/scripts/pages/htmlGenerators/**/*.test.ts',
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
          ],
          setupFiles: ['./vitest.setup.ts'],
          environment: 'happy-dom',
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
