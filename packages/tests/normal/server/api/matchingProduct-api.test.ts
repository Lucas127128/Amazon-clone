import products from 'server/rawProducts' with { type: 'json' };
import { app } from 'shared/edenTreaty';
import { getMatchingRawProduct } from 'shared/products';
import type { RawProduct } from 'shared/schema';
import { describe, expect, test } from 'vitest';

describe('matching product api test', () => {
  test('return right matching product', async () => {
    const result = await app.api.matchingProduct.get({
      query: { productId: 'HYNZb' },
    });
    const matchingProduct = getMatchingRawProduct(
      products as RawProduct[],
      'HYNZb',
    );
    expect(result.data).toEqual(matchingProduct);
  });
});
