import { formatCurrency } from "../Scripts/Utils/Money.ts";
import { Cart } from "./cart.ts";
import { external } from "./axios.ts";
import { AxiosInstance } from "axios";

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
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
    if (isClothing) {
      this.extraInfoHTML = `
        <a href='/images/clothing-size-chart.webp' target='_blank'>
          Size chart
        </a>
      `;
    } else {
      this.extraInfoHTML = ``;
    }
  }

  getStarsUrl() {
    return `/images/ratings/rating-${this.rating.stars * 10}.png`;
  }
  getPrice() {
    return `${formatCurrency(this.priceCents)}`;
  }

  getImageURL() {
    return this.image;
  }
  id: string;
  image: string;
  name: string;
  rating: Rating;
  priceCents: number;
  keywords: string[];
  extraInfoHTML: string;
}

export async function fetchProducts(
  axiosInstance: AxiosInstance = external,
): Promise<Product[]> {
  const rawProducts: RawProduct[] = (await axiosInstance.get("/products")).data;
  const clothings: string[] = (await axiosInstance.get("/clothingList")).data;
  const products = rawProducts.map((product) => {
    const isClothing = clothings.includes(product.id);
    return new Product(product, isClothing);
  });
  return products;
}
