import { describe, test, expect } from 'vitest';
import productsJSON from '#root/src/api/rawProducts.json';
import clothingList from '#root/src/api/clothing.json';
import { fetchProducts, transformProducts } from '#data/products.ts';

describe('products api test', () => {
  test('deliver correct products', async () => {
    const products = transformProducts(productsJSON, clothingList);
    const Products = await fetchProducts();
    Products.forEach((product, productIndex) => {
      expect(product).toEqual(products[productIndex]);
    });
  });
});
