import { treaty } from '@elysiajs/eden';
import type { App } from '#root/server/src/api/server.ts';
import config from '#root/config/config.json' with { type: 'json' };
export const app = treaty<App>(config.apiURL);
