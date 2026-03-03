import { defineConfig } from 'vitest/config';
import { preview } from '@vitest/browser-preview';

export default defineConfig({
  test: {
    pool: 'threads',
    maxConcurrency: 40,
    watch: true,
    projects: [
      {
        test: {
          isolate: false,
          include: ['tests/browser/**/*.test.ts'],
          name: 'browser',
          browser: {
            enabled: true,
            provider: preview(),
            instances: [{ browser: 'webkit' }],
          },
        },
      },
    ],
  },
});
