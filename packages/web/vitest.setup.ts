import { GLOBAL_CONFIG } from 'shared/constants';
import { getMatchingRawProduct } from 'shared/products';
import type { RawProduct } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';
import {
  clothingsJson,
  rawProductsJson,
} from 'testdata' with { type: 'json' };
import { vi } from 'vitest';

vi.stubEnv('TZ', 'UTC');
const fakeTime = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 3,
  day: 5,
  hour: 12,
  timeZone: 'UTC',
}).toString({ timeZoneName: 'never' });
vi.setSystemTime(fakeTime);
vi.useFakeTimers();

const realFetch = fetch;
vi.spyOn(globalThis, 'fetch').mockImplementation(
  async (input: string | URL | Request, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    if (url === `${GLOBAL_CONFIG.API_URL}/api/products`) {
      return Response.json(rawProductsJson);
    } else if (url === `${GLOBAL_CONFIG.API_URL}/api/clothingList`) {
      return Response.json(clothingsJson);
    } else if (
      url ===
      `${GLOBAL_CONFIG.API_URL}/api/matchingProduct?productId=sMmsZ`
    ) {
      return Response.json(
        getMatchingRawProduct(rawProductsJson as RawProduct[], 'sMmsZ'),
      );
    } else if (url === `${GLOBAL_CONFIG.API_URL}/api/matchingProducts`) {
      // prettier-ignore
      const ids = JSON.parse(init?.body as string) as string[];
      if (ids[0] === 'FETCH_ERROR') {
        return Response.json(
          {
            message: 'Product FETCH_ERROR not found',
          },
          {
            status: 404,
          },
        );
      }
      const match = ids[0] === 'sMmsZ';
      return match
        ? Response.json([
            getMatchingRawProduct(
              rawProductsJson as RawProduct[],
              'sMmsZ',
            ),
          ])
        : await realFetch(input, init);
    } else if (url === `${GLOBAL_CONFIG.API_URL}/api/search/products`) {
      const body = JSON.parse(init?.body as string) as {
        q: string;
        limit: number;
      };
      if (body.q === 'SEARCH_ERROR') {
        return Response.json({ message: 'Search error' }, { status: 500 });
      }
      if (body.q === 'FETCH_ERROR') {
        return Response.json(['FETCH_ERROR']);
      }
      const match =
        body.q === '2 Slot Toaster - Black' && body.limit === 3;
      return match
        ? Response.json(['7nDww', '6IxpJ', 'I2PJ7'])
        : await realFetch(input, init);
    } else {
      return await realFetch(input, init);
    }
  },
);
