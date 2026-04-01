import type { KnipConfig } from 'knip';

const config = {
  entry: ['./web/src/scripts/*.ts', './server/src/api/index.ts'],
  ignoreDependencies: [
    '@types/trusted-types',
    'husky',
    '@socketsecurity/bun-security-scanner',
  ],
} satisfies KnipConfig;

export default config;
