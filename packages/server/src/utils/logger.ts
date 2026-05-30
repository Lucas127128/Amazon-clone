import type { DrainContext } from 'evlog';
import { initLogger } from 'evlog';
import { evlog, useLogger } from 'evlog/elysia';
import {
  createRequestSizeEnricher,
  createUserAgentEnricher,
} from 'evlog/enrichers';
import { createFsDrain } from 'evlog/fs';
import { createDrainPipeline } from 'evlog/pipeline';

export function createEvlogMiddleware() {
  return evlog({
    enrich: (ctx) => {
      createRequestSizeEnricher()(ctx);
      createUserAgentEnricher()(ctx);
    },
  });
}

export function createLogger() {
  return Bun.env.NODE_ENV === 'test' ? undefined : useLogger();
}

export function initEvlog() {
  if (Bun.env.DEV) {
    initLogger({ env: { service: 'api' } });
  } else if (Bun.env.PROD) {
    const drain = createDrainPipeline<DrainContext>({
      batch: { size: 100, intervalMs: 1000 },
      retry: {
        maxAttempts: 3,
        initialDelayMs: 1000,
        maxDelayMs: 30000,
      },
      maxBufferSize: 2500,
      onDropped: (events, error) => {
        console.error(
          `[evlog] Dropped ${events.length} events: ${error?.message}`,
        );
      },
    })(createFsDrain({ pretty: true, dir: '/tmp/.evlog/log' }));

    process.on('SIGTERM', async () => await drain.flush());

    initLogger({
      env: { service: 'api' },
      drain,
      silent: true,
    });
  }
}
