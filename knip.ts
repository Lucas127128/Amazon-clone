import type { KnipConfig } from 'knip';

const config = {
  // entry: [
  //   './packages/web/src/scripts/*.ts',
  //   './packages/server/src/api/index.ts',
  // ],
  workspaces: {
    'packages/server': {
      entry: ['src/api/index.ts'],
    },
    'packages/web': {
      entry: ['src/scripts/*.ts'],
    },
    'packages/tests': {
      entry: ['**/*.test.ts'],
      ignoreFiles: ['./normal/preload.ts'],
    },
  },
  ignoreDependencies: [
    '@types/trusted-types',
    'husky',
    '@socketsecurity/bun-security-scanner',
  ],
} satisfies KnipConfig;

export default config;
