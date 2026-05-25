import { treaty } from '@elysiajs/eden';
import { GLOBAL_CONFIG } from 'shared/constants';

import type { App } from '../api/server.ts';

export const app = treaty<App>(GLOBAL_CONFIG.API_URL);
