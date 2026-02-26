import { formatCurrency } from '../scripts/Utils/Money.ts';
import { get, set } from 'idb-keyval';
import { Temporal } from 'temporal-polyfill-lite';
import { app } from './edenTreaty.ts';
import { object, number, string, array, InferOutput } from 'valibot';

export const getMatchingProduct = (
  products: readonly Product[],
  productId: string,
) => products.find((product) => product.id === productId);

export const getMatchingRawProduct = (
  products: RawProduct[],
  productId: string,
) => products.find((product) => product.id === productId);

const RatingSchema = object({
  stars: number(),
  count: number(),
});

export const RawProductSchema = object({
  id: string(),
  image: string(),
  name: string(),
  rating: RatingSchema,
  priceCents: number(),
  keywords: array(string()),
});

export type RawProduct = InferOutput<typeof RawProductSchema>;

export class Product {
  constructor(productDetails: RawProduct, isClothing: boolean) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.ratingCount = productDetails.rating.count;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
    this.starsUrl = `/images/ratings/rating-${productDetails.rating.stars * 10}.png`;
    this.price = `${formatCurrency(productDetails.priceCents)}`;
    if (isClothing) {
      this.extraInfoHTML = `
        <a href='/images/clothing-size-chart.webp' target='_blank'>
          Size chart
        </a>
      `;
    }
  }
  id: string;
  image: string;
  name: string;
  ratingCount: number;
  priceCents: number;
  keywords: string[];
  extraInfoHTML: string = '';
  starsUrl: string;
  price: string;
}

export async function fetchProducts(): Promise<readonly Product[]> {
  const [clothingsResponse, productsResponse] = await Promise.all([
    app.api.clothingList.get(),
    app.api.products.get(),
  ]);
  if (clothingsResponse.error) throw clothingsResponse.error;
  if (productsResponse.error) throw productsResponse.error;
  const [clothings, rawProducts] = [
    clothingsResponse.data,
    productsResponse.data,
  ];

  const products = transformProducts(rawProducts, clothings);
  return products;
}

export function transformProducts(
  rawProducts: RawProduct[],
  clothings: string[],
): readonly Product[] {
  const products: readonly Product[] = rawProducts
    .sort((a, b) => {
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

export async function getProducts() {
  async function setProducts() {
    await set('products', {
      data: await fetchProducts(),
      time: Temporal.Now.plainDateISO().toJSON(),
    });
  }

  const savedProducts = await get('products');
  const today = Temporal.Now.plainDateISO().toJSON();
  const isFreshData = savedProducts
    ? savedProducts.time === today
      ? true
      : false
    : false;
  if (!isFreshData) {
    setProducts().catch((error) => {
      console.error(`Unexpected promise error: ${error}`);
    });
  }

  const products: readonly Product[] = savedProducts
    ? savedProducts.data
    : await fetchProducts();
  return products;
}
