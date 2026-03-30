import type { KnipConfig } from 'knip';

const config = {
  entry: ['./web/src/scripts/*.ts', './server/src/api/index.ts'],
  ignoreDependencies: ['@types/trusted-types'],
} satisfies KnipConfig;

export default config;
