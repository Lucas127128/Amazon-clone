import { formatCurrency } from "../Scripts/Utils/Money.ts";
import { Cart } from "./cart.ts";
import { external } from "./axios.ts";
import { AxiosInstance } from "axios";
import { get, set } from "idb-keyval";

export function getMatchingCart(
  cart: Cart[],
  productId: string,
): Cart | undefined {
  const matchingItem = cart.find(
    (cartItem) => cartItem.productId === productId,
  );
  return matchingItem;
}

export function getMatchingProduct(
  products: Product[],
  productId: string,
): Product | undefined {
  const matchingItem = products.find((product) => product.id === productId);
  return matchingItem;
}

export function getMatchingRawProduct(
  products: RawProduct[],
  productId: string,
): RawProduct | undefined {
  const matchingItem = products.find((product) => product.id === productId);
  return matchingItem;
}

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
  axiosInstance: AxiosInstance = external,
): Promise<Product[]> {
  const clothings: string[] = (await axiosInstance.get("/clothingList")).data;
  const rawProducts: RawProduct[] = (await axiosInstance.get("/products")).data;
  const products = transformProducts(rawProducts, clothings);
  return products;
}

export function transformProducts(
  rawProducts: RawProduct[],
  clothings: string[],
): Product[] {
  const products = rawProducts
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

export async function getProducts(): Promise<Product[]> {
  new Promise(() => {
    fetchProducts().then(async (products) => {
      set("products", products);
    });
  });
  const products = (await get("products")) || (await fetchProducts());
  return products;
}
