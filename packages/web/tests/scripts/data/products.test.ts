import { getMatchingProduct, type Product } from 'shared/products';
import { productsJson } from 'testdata';
import { describe, expect, it } from 'vitest';

import { fetchMatchingProduct, fetchProducts } from '#data/products.ts';
describe.concurrent('fetch products', () => {
  it('fetch correct products', async () => {
    const fetchedProducts = await fetchProducts();
    expect(fetchedProducts).toEqual(productsJson);
  });
});

describe.concurrent('fetchMatchingProduct', () => {
  it('return correct matching product', async () => {
    const product = await fetchMatchingProduct('sMmsZ');
    expect(product).toEqual(
      getMatchingProduct(productsJson as Product[], 'sMmsZ'),
    );
  });
});
