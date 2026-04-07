// import type { KnipConfig } from 'knip';
const config = {
  workspaces: {
    'packages/server': {
      entry: ['src/api/index.ts'],
    },
    'packages/web': {
      entry: ['src/scripts/pages/*.ts'],
    },
    'packages/tests': {
      entry: ['**/*.test.ts'],
    },
  },
  ignoreDependencies: [
    '@types/trusted-types',
    'husky',
    '@socketsecurity/bun-security-scanner',
    'vite',
  ],
  ignoreBinaries: ['bombardier'],
};
// } satisfies KnipConfig;

export default config;
