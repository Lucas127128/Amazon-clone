import type { KnipConfig } from 'knip';
const config: KnipConfig = {
  workspaces: {
    'packages/api-client': {
      entry: ['vitest.setup.ts'],
    },
    'packages/server': {
      entry: ['src/api/index.ts'],
    },
    'packages/shared': {
      entry: ['vitest.setup.ts'],
    },
    'packages/web': {
      entry: ['src/scripts/pages/*.ts', 'vitest.setup.ts'],
    },
  },
  vitest: {
    config: [
      './packages/web/vitest.config.ts',
      './packages/server/vitest.config.ts',
      './packages/shared/vitest.config.ts',
      './packages/api-client/vitest.config.ts',
    ],
  },
  ignoreDependencies: [
    '@types/trusted-types',
    'husky',
    '@socketsecurity/bun-security-scanner',
    'vite',
  ],
  ignore: ['packages/*/vitest.config.ts'],
  ignoreBinaries: ['bombardier', 'codesign'],
};

export default config;
