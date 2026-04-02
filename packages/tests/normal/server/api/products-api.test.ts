import { describe, test, expect } from 'vitest';
import { fetchProducts, type Product } from 'shared/products';

describe.concurrent('products api test', () => {
  test('deliver correct products', async () => {
    const products = await fetchProducts();
    const realProducts = (await Bun.file(
      './tests/normal/products.json',
    ).json()) as Product[];
    expect(products).toEqual(realProducts);
  });
});
