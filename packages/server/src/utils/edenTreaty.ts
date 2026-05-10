import { treaty } from '@elysiajs/eden';

import type { App } from '../api/server.ts';

export const app = treaty<App>('https://localhost:8080');
