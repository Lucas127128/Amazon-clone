import { formatCurrency } from '#utils/money.ts';
import { app } from './edenTreaty.ts';
import type { RawProduct } from '../schema.ts';

export const getMatchingProduct = (
  products: readonly Product[],
  productId: string,
) => products.find((product) => product.id === productId);

export const getMatchingRawProduct = (
  products: RawProduct[],
  productId: string,
) => products.find((product) => product.id === productId);

export class Product {
  constructor(productDetails: RawProduct, isClothing: boolean) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.ratingCount = productDetails.rating.count;
    this.priceCents = productDetails.priceCents;
    this.starsUrl = `/images/ratings/rating-${productDetails.rating.stars * 10}.png`;
    this.price = formatCurrency(productDetails.priceCents);
    this.isClothing = isClothing;
  }
  id;
  image;
  name;
  ratingCount;
  priceCents;
  isClothing;
  starsUrl;
  price;
}

export function transformProducts(
  rawProducts: RawProduct[],
  clothings: string[],
) {
  const products: readonly Product[] = rawProducts
    .toSorted((a, b) => {
      if (a.rating.stars === b.rating.stars) {
        return b.rating.count - a.rating.count;
      }
      return b.rating.stars - a.rating.stars;
    })
    .map((product) => {
      const isClothing = clothings.includes(product.id);
      return new Product(product, isClothing);
    });
  return products;
}

export async function fetchProducts() {
  const [
    { data: clothings, error: clothingsError },
    { data: rawProducts, error: productsError },
  ] = await Promise.all([
    app.api.clothingList.get(),
    app.api.products.get(),
  ]);
  if (clothingsError) throw clothingsError;
  if (productsError) throw productsError;

  return transformProducts(rawProducts, clothings);
}
