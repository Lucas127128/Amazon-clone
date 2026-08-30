import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  vitest: {
    config: ['./vitest.config.ts'],
  },
  sveltekit: {
    entry: ['./vite.config.ts'],
  },
  ignoreDependencies: [
    '@types/trusted-types',
    'husky',
    '@socketsecurity/bun-security-scanner',
  ],
};

export default config;
