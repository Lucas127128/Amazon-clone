import { GLOBAL_CONFIG } from 'shared/constants';
import { getMatchingRawProduct } from 'shared/products';
import type { RawProduct } from 'shared/schema';
import {
  clothingsJson,
  rawProductsJson,
} from 'testdata' with { type: 'json' };
import { vi } from 'vitest';

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
      url === `${GLOBAL_CONFIG.API_URL}/api/matchingProduct?productId=sMmsZ`
    ) {
      return Response.json(
        getMatchingRawProduct(rawProductsJson as RawProduct[], 'sMmsZ'),
      );
    } else {
      return await realFetch(input, init);
    }
  },
);
