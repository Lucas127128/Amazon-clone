import { initLogger } from 'evlog';
import { createFsDrain } from 'evlog/fs';

export function initEvlog() {
  if (Bun.env.DEV) {
    initLogger({ env: { service: 'api' } });
  } else if (Bun.env.PROD) {
    initLogger({
      env: { service: 'api' },
      drain: createFsDrain({ pretty: true }),
      silent: true,
    });
  }
}
