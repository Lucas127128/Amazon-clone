import { describe, expect, it } from 'vitest';

import realProducts from '../../rawData/rawProducts.json' with { type: 'json' };
import { app } from '../../src/utils/edenTreaty.ts';

describe.concurrent('products api test', () => {
  it('deliver correct products', async () => {
    const products = await app.api.products.get();
    if (products.error) throw products.error;
    expect(products.data).toEqual(realProducts);
  });
});
