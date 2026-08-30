import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  vitest: {
    config: ['./vitest.config.ts'],
  },
  sveltekit: {
    entry: ['./vite.config.ts'],
  },
  ignoreDependencies: ['husky', '@socketsecurity/bun-security-scanner'],
};

export default config;
