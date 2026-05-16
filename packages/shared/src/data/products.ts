import { formatCurrency } from '#utils/money.ts';

import type { RawProduct } from '../schema.ts';

export function createProduct(
  rawProduct: RawProduct,
  isClothing: boolean,
) {
  return {
    id: rawProduct.id,
    image: rawProduct.image,
    name: rawProduct.name,
    ratingCount: rawProduct.rating.count,
    ratingStars: rawProduct.rating.stars,
    priceCents: rawProduct.priceCents,
    starsUrl: `/images/ratings/rating-${rawProduct.rating.stars * 10}.png`,
    price: formatCurrency(rawProduct.priceCents),
    isClothing: isClothing,
  };
}

export type Product = ReturnType<typeof createProduct>;

export const getMatchingProduct = (
  products: readonly Product[],
  productId: string,
) => products.find((product) => product.id === productId);

export const getMatchingRawProduct = (
  products: RawProduct[],
  productId: string,
) => products.find((product) => product.id === productId);

export function transformProducts(
  rawProducts: RawProduct[],
  clothings: string[],
) {
  const products: readonly Product[] = rawProducts
    .toSorted(
      (a, b) =>
        b.rating.stars - a.rating.stars || b.rating.count - a.rating.count,
    )
    .map((product) => {
      const isClothing = clothings.includes(product.id);
      return createProduct(product, isClothing);
    });
  return products;
}
