import {
  getMatchingProduct,
  getMatchingRawProduct,
  Product,
} from 'shared/products';
import type { RawProduct } from 'shared/schema';
import { productsJson as products, rawProductsJson } from 'testdata';
import { describe, expect, it } from 'vitest';

const correctRawProduct: RawProduct = {
  id: 'sMmsZ',
  image: '/images/products/facial-tissue-2-ply-18-boxes.webp',
  name: 'Ultra Soft Tissue 2-Ply - 18 Box',
  rating: { stars: 4, count: 99 },
  priceCents: 2374,
};
describe.concurrent('Get matching item', () => {
  describe.concurrent('getMatchingProduct', () => {
    it('get matching products', () => {
      const matchingProduct = getMatchingProduct(
        products as Product[],
        'sMmsZ',
      );
      const correctProduct = new Product(correctRawProduct, false);
      expect(matchingProduct).toEqual(correctProduct);
    });
    it('return undefined if productId is invalid', () => {
      expect(
        getMatchingProduct(products as Product[], 'abc'),
      ).toBeUndefined();
    });
  });

  describe.concurrent('getMatchingRawProduct', () => {
    it('get matching raw product', () => {
      const matchingProduct = getMatchingRawProduct(
        rawProductsJson as RawProduct[],
        'sMmsZ',
      );
      expect(matchingProduct).toEqual(correctRawProduct);
    });
    it('return undefined if productId is invalid', () => {
      expect(
        getMatchingRawProduct(rawProductsJson as RawProduct[], 'abc'),
      ).toBeUndefined();
    });
  });
});
