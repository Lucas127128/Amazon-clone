import { defineConfig } from 'vitest/config';
import { preview } from '@vitest/browser-preview';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ['tests/normal/**/*.test.ts'],
          name: 'normal',
          environment: 'node',
        },
      },
      {
        test: {
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
