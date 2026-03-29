import { describe, test, expect } from 'bun:test';
import {
  getMatchingProduct,
  Product,
  getMatchingRawProduct,
  fetchProducts,
} from '#root/shared/src/data/products.ts';
import correctRawProducts from '#root/server/src/api/rawProducts.json';
import correctProducts from '../../products.json';
import type { RawProduct } from '#root/shared/src/schema.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';

const correctRawProduct: RawProduct = {
  id: 'sMmsZ',
  image: '/images/products/facial-tissue-2-ply-18-boxes.webp',
  name: 'Ultra Soft Tissue 2-Ply - 18 Box',
  rating: { stars: 4, count: 99 },
  priceCents: 2374,
};
describe.concurrent('Get matching item', async () => {
  test('get matching products', async () => {
    const products = await fetchProducts();
    const matchingProduct = getMatchingProduct(products, 'sMmsZ');
    const correctProduct = new Product(correctRawProduct, false);
    expect(matchingProduct).toEqual(correctProduct);
  });

  test('get matching raw product', async () => {
    const matchingProduct = getMatchingRawProduct(
      correctRawProducts,
      'sMmsZ',
    );
    expect(matchingProduct).toEqual(correctRawProduct);
  });
});

describe.concurrent('fetch products', () => {
  test('fetch correct products', async () => {
    const products = await fetchProducts();
    expect(products).toEqual(correctProducts);
  });

  test('Generate product object', () => {
    const product = new Product(correctRawProduct, false);
    const correctProduct = getMatchingProduct(correctProducts, 'sMmsZ');
    checkNullish(correctProduct);
    expect(product).toEqual(correctProduct);
  });
});
