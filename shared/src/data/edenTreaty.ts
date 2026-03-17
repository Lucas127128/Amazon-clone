import { treaty } from '@elysiajs/eden';
import { fetchFactory } from 'fetchache';
import * as kvs from 'idb-keyval';
import type { App } from '#root/server/src/api/server.ts';
import config from '#root/config/config.json' with { type: 'json' };

const myCache = {
  get: async (key: string) => {
    return await kvs.get(key);
  },
  set: async (key: string, value: any) => {
    await kvs.set(key, value);
  },
  delete: async (key: string) => {
    await kvs.del(key);
  },
};

const fetchWithCache = fetchFactory({
  fetch: globalThis.fetch,
  Response: globalThis.Response,
  Request: globalThis.Request,
  cache: myCache,
});
export const app = treaty<App>(config.apiURL, {
  fetcher: fetchWithCache as typeof fetch,
});
