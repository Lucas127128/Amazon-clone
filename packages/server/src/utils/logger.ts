import { initLogger } from 'evlog';

export function initEvlog() {
  if (Bun.env.DEV) {
    initLogger({ env: { service: 'api' } });
  } else if (Bun.env.PROD) {
    initLogger({
      env: { service: 'api' },
      sampling: { rates: { info: 0, debug: 0, warn: 0, error: 100 } },
    });
  }
}
