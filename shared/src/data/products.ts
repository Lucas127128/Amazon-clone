import { formatCurrency } from '../utils/money.ts';
import { get, set } from 'idb-keyval';
import { Temporal } from 'temporal-polyfill-lite';
import { app } from './edenTreaty.ts';
import { STORAGE_KEYS } from '../constants.ts';
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

export function transformProducts(
  rawProducts: RawProduct[],
  clothings: string[],
) {
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

  const products = transformProducts(rawProducts, clothings);
  return products;
}

export async function getProducts() {
  async function setProducts() {
    await set(STORAGE_KEYS.PRODUCTS_CACHE, {
      data: await fetchProducts(),
      time: Temporal.Now.plainDateISO().toJSON(),
    });
  }

  const savedProducts = await get(STORAGE_KEYS.PRODUCTS_CACHE);
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
