import { treaty } from '@elysiajs/eden';
import type { App } from '../api/index';
import config from '#root/config.json';
export const app = treaty<App>(config.apiURL);
