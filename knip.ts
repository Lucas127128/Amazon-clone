import type { KnipConfig } from 'knip';
const config: KnipConfig = {
  workspaces: {
    'packages/shared': {
      entry: ['vitest.setup.ts'],
    },
    'packages/web': {
      entry: ['vitest.setup.ts'],
    },
  },
  vitest: {
    config: [
      './packages/web/vitest.config.ts',
      './packages/shared/vitest.config.ts',
    ],
  },
  sveltekit: {
    entry: ['./packages/web/vite.config.ts'],
  },
  ignoreDependencies: [
    '@types/trusted-types',
    'husky',
    '@socketsecurity/bun-security-scanner',
    'vite',
  ],
  ignore: ['packages/*/vitest.config.ts'],
};

export default config;
