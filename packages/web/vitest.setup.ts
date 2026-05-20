import clothing from 'server/clothing' with { type: 'json' };
import rawProducts from 'server/rawProducts' with { type: 'json' };
import { GLOBAL_CONFIG } from 'shared/constants';
import { getMatchingRawProduct } from 'shared/products';
import type { RawProduct } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';
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
      return Response.json(rawProducts);
    } else if (url === `${GLOBAL_CONFIG.API_URL}/api/clothingList`) {
      return Response.json(clothing);
    } else if (
      url ===
      `${GLOBAL_CONFIG.API_URL}/api/matchingProduct?productId=sMmsZ`
    ) {
      return Response.json(
        getMatchingRawProduct(rawProducts as RawProduct[], 'sMmsZ'),
      );
    } else {
      return await realFetch(input, init);
    }
  },
);
