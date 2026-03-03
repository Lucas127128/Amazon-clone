import { treaty } from '@elysiajs/eden';
import type { App } from '../api/server';
import config from '#root/config/config.json' with { type: 'json' };
export const app = treaty<App>(config.apiURL);
