import { formatCurrency } from "../Scripts/Utils/Money.ts";
import { Cart } from "./cart.ts";

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

interface Rating {
  stars: number;
  count: number;
}

export interface ProductInterface {
  id: string;
  image: string;
  name: string;
  rating: Rating;
  priceCents: number;
  keywords: string[];
}

export class Product {
  constructor(productDetails: ProductInterface, isClothing = false) {
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

export let Products: Product[] = [];

export async function fetchProducts() {
  const productsPromise = await fetch("https://localhost:3001/products");
  const clothingListPromise = await fetch(
    "https://localhost:3001/clothingList",
  );
  const products: ProductInterface[] = await productsPromise.json();
  const clothingList: string[] = await clothingListPromise.json();
  Products = products.map((product) => {
    clothingList.forEach((clothingId) => {
      if (clothingId === product.id) {
        return new Product(product, true);
      }
    });
    return new Product(product);
  });
}

export async function fetchInternalProducts() {
  const productsPromise = await fetch("http://localhost:3000/products");
  const clothingListPromise = await fetch("http://localhost:3000/clothingList");
  const products: ProductInterface[] = await productsPromise.json();
  const clothingList: string[] = await clothingListPromise.json();
  Products = products.map((product) => {
    clothingList.forEach((clothingId) => {
      if (clothingId === product.id) {
        return new Product(product, true);
      }
    });
    return new Product(product);
  });
}
