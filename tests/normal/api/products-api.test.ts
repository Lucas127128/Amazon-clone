import { describe, test, expect } from 'vitest';
import productsJSON from '#root/server/src/api/rawProducts.json';
import clothingList from '#root/server/src/api/clothing.json';
import {
  fetchProducts,
  transformProducts,
} from '#root/shared/src/data/products.ts';

describe.concurrent('products api test', () => {
  test('deliver correct products', async () => {
    const products = transformProducts(productsJSON, clothingList);
    const Products = await fetchProducts();
    Products.forEach((product, productIndex) => {
      expect(product).toEqual(products[productIndex]);
    });
  });
});
