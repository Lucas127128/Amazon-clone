import { GLOBAL_CONFIG } from 'shared/constants';
import { rawProductsJson } from 'testdata';
import { describe, expect, it } from 'vitest';

import { cachedFetch } from '../src/edenTreaty';

describe.concurrent('cachedFetch', () => {
  it('fetch correct data', async () => {
    const response = await cachedFetch(
      `${GLOBAL_CONFIG.API_URL}/api/products`,
    );
    expect(await response.json()).toEqual(rawProductsJson);
  });
});
