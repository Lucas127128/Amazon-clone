import { KyInstance } from "ky";
import { formatCurrency } from "../Scripts/Utils/Money.ts";
import { kyExternal } from "./ky.ts";
import { get, set } from "idb-keyval";

export const getMatchingProduct = (
  products: readonly Product[],
  productId: string,
) => products.find((product) => product.id === productId);

export const getMatchingRawProduct = (
  products: RawProduct[],
  productId: string,
) => products.find((product) => product.id === productId);

interface Rating {
  stars: number;
  count: number;
}

export interface RawProduct {
  id: string;
  image: string;
  name: string;
  rating: Rating;
  priceCents: number;
  keywords: string[];
}

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
  extraInfoHTML: string = "";
  starsUrl: string;
  price: string;
}

export async function fetchProducts(
  kyInstance: KyInstance = kyExternal,
): Promise<readonly Product[]> {
  const clothings: string[] = await kyInstance("clothingList").json();
  const rawProducts: RawProduct[] = await kyInstance("products").json();
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

export async function getProducts(): Promise<readonly Product[]> {
  new Promise(() => {
    fetchProducts()
      .then(async (products) => {
        await set("products", products);
      })
      .catch((error) => {
        console.error(`Unexpected promise error: ${error}`);
      });
  }).catch((error) => {
    console.error(`Unexpected promise error: ${error}`);
  });
  const products = (await get("products")) || (await fetchProducts());
  return products;
}
