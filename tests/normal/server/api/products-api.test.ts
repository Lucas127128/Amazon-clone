import { describe, test, expect } from 'vitest';
import productsJSON from '../../products.json';
import { fetchProducts } from '#root/shared/src/data/products.ts';

describe.concurrent('products api test', () => {
  test('deliver correct products', async () => {
    const products = await fetchProducts();
    expect(products).toEqual(productsJSON);
  });
});
