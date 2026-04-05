import realProducts from 'server/rawProducts' with { type: 'json' };
import { app } from 'shared/edenTreaty';
import { describe, expect, test } from 'vitest';

describe.concurrent('products api test', () => {
  test('deliver correct products', async () => {
    const products = await app.api.products.get();
    if (products.error) throw products.error;
    expect(products.data).toEqual(realProducts);
  });
});
