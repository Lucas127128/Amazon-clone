import { fetchProducts, type Product } from 'shared/products';
import { describe, expect, test } from 'vitest';

describe.concurrent('products api test', () => {
  test('deliver correct products', async () => {
    const products = await fetchProducts();
    const realProducts = (await Bun.file(
      './normal/products.json',
    ).json()) as Product[];
    expect(products).toEqual(realProducts);
  });
});
