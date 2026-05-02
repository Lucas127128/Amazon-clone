import clothingListJson from 'server/clothing' with { type: 'json' };
import rawProductsJson from 'server/rawProducts' with { type: 'json' };
import { describe, expect, it } from 'vitest';

import { Service } from '../../../../src/api/products/service.ts';

describe.concurrent('Service', () => {
  describe.concurrent('getProducts', () => {
    it('returns right raw products', () => {
      const rawProducts = Service.getProducts();
      expect(rawProducts).toEqual(rawProductsJson);
    });
  });
  describe.concurrent('getClothingList', () => {
    it('returns right clothing list', () => {
      const clothingList = Service.getClothingList();
      expect(clothingList).toEqual(clothingListJson);
    });
  });
  describe.concurrent('getMatchingProduct', () => {
    it('returns right raw product', () => {
      const rawProduct = Service.getMatchingProduct('sMmsZ');
      expect(rawProduct.code).toBe(200);
      expect(rawProduct.response).toEqual(
        rawProductsJson.find((product) => product.id === 'sMmsZ'),
      );
    });
    it('returns 404 error if productId is invalid', () => {
      const rawProduct = Service.getMatchingProduct('abcde');
      expect(rawProduct.code).toBe(404);
      expect(rawProduct.response).toEqual({
        message: 'Product not found',
      });
    });
  });
});
