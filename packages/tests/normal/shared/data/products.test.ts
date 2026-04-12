import correctRawProducts from 'server/rawProducts';
import {
  fetchMatchingProduct,
  fetchProducts,
  getMatchingProduct,
  getMatchingRawProduct,
  Product,
} from 'shared/products';
import type { RawProduct } from 'shared/schema';
import { describe, expect, test } from 'vitest';

import products from '#testData/products.json' with { type: 'json' };

const correctRawProduct: RawProduct = {
  id: 'sMmsZ',
  image: '/images/products/facial-tissue-2-ply-18-boxes.webp',
  name: 'Ultra Soft Tissue 2-Ply - 18 Box',
  rating: { stars: 4, count: 99 },
  priceCents: 2374,
};
describe.concurrent('Get matching item', () => {
  test('get matching products', () => {
    const matchingProduct = getMatchingProduct(
      products as Product[],
      'sMmsZ',
    );
    const correctProduct = new Product(correctRawProduct, false);
    expect(matchingProduct).toEqual(correctProduct);
  });

  test('get matching raw product', () => {
    const matchingProduct = getMatchingRawProduct(
      correctRawProducts as RawProduct[],
      'sMmsZ',
    );
    expect(matchingProduct).toEqual(correctRawProduct);
  });
});

describe.concurrent('fetch products', () => {
  test('fetch correct products', async () => {
    const fetchedProducts = await fetchProducts();
    expect(fetchedProducts).toEqual(products);
  });

  test('Generate product object', () => {
    const product = new Product(correctRawProduct, false);
    const correctProduct = getMatchingProduct(
      products as Product[],
      'sMmsZ',
    );
    expect(product).toEqual(correctProduct);
  });
});

describe.concurrent('fetchMatchingProduct', () => {
  test('return correct matching product', async () => {
    const product = await fetchMatchingProduct('sMmsZ');
    expect(product).toEqual(
      getMatchingProduct(products as Product[], 'sMmsZ'),
    );
  });
});
