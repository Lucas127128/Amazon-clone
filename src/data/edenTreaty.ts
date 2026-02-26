import { treaty } from '@elysiajs/eden';
import type { App } from '../api/index';
export const app = treaty<App>('https://localhost:8080');
