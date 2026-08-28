import { getMatchingProduct, type Product } from 'shared/products';
import { productsJson } from 'testdata';
import { describe, expect, it } from 'vitest';

import { fetchMatchingProduct } from '#lib/data/products.ts';

describe.concurrent('fetchMatchingProduct', () => {
  it('return correct matching product', async () => {
    const product = await fetchMatchingProduct('sMmsZ');
    expect(product.data).toEqual(
      getMatchingProduct(productsJson as Product[], 'sMmsZ'),
    );
  });
  it('returns error on invalid product', async () => {
    const result = await fetchMatchingProduct('abcde');
    expect(result.data).toBeNull();
    expect(result.error?.status).toBe(404);
    expect(result.error?.value).toEqual({
      message: 'Product abcde not found',
    });
  });
});
