import products from 'server/rawProducts' with { type: 'json' };
import { app } from 'shared/edenTreaty';
import { getMatchingRawProduct } from 'shared/products';
import type { RawProduct } from 'shared/schema';
import { describe, expect, it } from 'vitest';

describe('matching product api test', () => {
  it('return right matching product', async () => {
    const result = await app.api.matchingProduct.get({
      query: { productId: 'HYNZb' },
    });
    const matchingProduct = getMatchingRawProduct(
      products as RawProduct[],
      'HYNZb',
    );
    expect(result.data).toEqual(matchingProduct);
  });
  it('returns 404 error if productId is invalid', async () => {
    const result = await app.api.matchingProduct.get({
      query: { productId: 'abcde' },
    });
    expect(result.error).toBeTruthy();
    expect(result.error?.status).toBe(404);
    expect(result.error?.value.message).toBe('Product not found');
  });
  it('returns 400 error if productId is structurally invalid', async () => {
    const result = await app.api.matchingProduct.get({
      query: { productId: 'a' },
    });
    expect(result.error).toBeTruthy();
    expect(result.error?.status).toBe(400);
    expect(result.error?.value.message).toBe(
      'Invalid length: Expected >=5 but received 1',
    );
  });
});
