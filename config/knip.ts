import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['./web/src/scripts/*.ts', './server/src/api/index.ts'],
  ignoreDependencies: ['@types/trusted-types'],
};

export default config;
