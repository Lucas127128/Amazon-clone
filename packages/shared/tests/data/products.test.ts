import correctRawProducts from 'server/rawProducts';
import {
  fetchMatchingProduct,
  fetchProducts,
  getMatchingProduct,
  getMatchingRawProduct,
  Product,
} from 'shared/products';
import type { RawProduct } from 'shared/schema';
import { productsJson as products } from 'testdata';
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
        correctRawProducts as RawProduct[],
        'sMmsZ',
      );
      expect(matchingProduct).toEqual(correctRawProduct);
    });
    it('return undefined if productId is invalid', () => {
      expect(
        getMatchingRawProduct(correctRawProducts as RawProduct[], 'abc'),
      ).toBeUndefined();
    });
  });
});

describe.concurrent('fetch products', () => {
  it('fetch correct products', async () => {
    const fetchedProducts = await fetchProducts();
    expect(fetchedProducts).toEqual(products);
  });

  it('Generate product object', () => {
    const product = new Product(correctRawProduct, false);
    const correctProduct = getMatchingProduct(
      products as Product[],
      'sMmsZ',
    );
    expect(product).toEqual(correctProduct);
  });
});

describe.concurrent('fetchMatchingProduct', () => {
  it('return correct matching product', async () => {
    const product = await fetchMatchingProduct('sMmsZ');
    expect(product).toEqual(
      getMatchingProduct(products as Product[], 'sMmsZ'),
    );
  });
});
