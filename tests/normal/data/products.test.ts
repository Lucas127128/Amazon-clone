import { describe, test, expect } from 'vitest';
import {
  getMatchingProduct,
  RawProduct,
  Product,
  getMatchingRawProduct,
  fetchProducts,
  transformProducts,
} from '#root/shared/src/data/products.ts';
import correctRawProducts from '#root/server/src/api/rawProducts.json';
import { app } from '#root/shared/src/data/edenTreaty.ts';

const correctRawProduct: RawProduct = {
  id: 'sMmsZ',
  image: '/images/products/facial-tissue-2-ply-18-boxes.webp',
  name: 'Ultra Soft Tissue 2-Ply - 18 Box',
  rating: { stars: 4, count: 99 },
  priceCents: 2374,
  keywords: ['kleenex', 'tissues', 'kitchen', 'tissues box', 'napkins'],
};
describe.concurrent('Get matching item', async () => {
  test('get matching products', async () => {
    const products = await fetchProducts();
    const matchingProduct = getMatchingProduct(products, 'sMmsZ');
    const correctProduct = new Product(correctRawProduct, false);
    expect(matchingProduct).toEqual(correctProduct);
  });

  test('get matching raw product', async () => {
    const products: RawProduct[] = await (
      await fetch('https://localhost:8080/api/products')
    ).json();
    const matchingProduct = getMatchingRawProduct(products, 'sMmsZ');
    expect(matchingProduct).toEqual(correctRawProduct);
  });
});

describe.concurrent('fetch products', () => {
  test('fetch correct products', async () => {
    const products = await fetchProducts();
    const { data: clothings, error } = await app.api.clothingList.get();
    if (error) throw error;
    expect(products).toEqual(
      transformProducts(correctRawProducts, clothings),
    );
  });

  test('Generate product object', () => {
    const product = new Product(correctRawProduct, false);
    const correctProduct: Product = {
      id: 'sMmsZ',
      image: '/images/products/facial-tissue-2-ply-18-boxes.webp',
      keywords: [
        'kleenex',
        'tissues',
        'kitchen',
        'tissues box',
        'napkins',
      ],
      name: 'Ultra Soft Tissue 2-Ply - 18 Box',
      priceCents: 2374,
      ratingCount: 99,
      extraInfoHTML: '',
      price: '23.74',
      starsUrl: '/images/ratings/rating-40.png',
    };
    expect(product).toEqual(correctProduct);
  });
});
