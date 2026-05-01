import type { KnipConfig } from 'knip';
const config: KnipConfig = {
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
  ],
  ignoreFiles: ['.agents/skills/**'],
  ignoreBinaries: ['bombardier', 'codesign'],
};

export default config;
