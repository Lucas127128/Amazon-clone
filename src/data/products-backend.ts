import { formatCurrency } from "../Scripts/Utils/Money.ts";
import { Cart } from "./cart.ts";

export function getMatchingCart(
  cart: Cart[],
  productId: string
): Cart | undefined {
  const matchingItem = cart.find(
    (cartItem) => cartItem.ProductId === productId
  );
  return matchingItem;
}

export function getMatchingProduct(
  products: ProductInterface[],
  productId: string
): ProductInterface | undefined {
  const MatchingItem = products.find((product) => product.id === productId);
  return MatchingItem;
}
interface Rating {
  stars: number;
  count: number;
}
interface ProductInterface {
  id: string;
  image: string;
  name: string;
  rating: Rating;
  priceCents: number;
  keywords: string[];
  type: string;
}

interface ClothingInterface extends ProductInterface {
  sizeChartLink: string;
  type: string;
}
export class Product {
  constructor(productDetails: ProductInterface) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }
  getStarsUrl() {
    return `/images/ratings/rating-${this.rating.stars * 10}.png`;
  }
  getPrice() {
    return `${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return ``;
  }
  getImageURL() {
    return this.image;
  }
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;
}

export class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails: ClothingInterface) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
    <a href="${this.sizeChartLink}" target="_blank">
      Size chart
    </a>
    `;
  }
}

export let Products: ClothingInterface[] | ProductInterface[] = [];

export function fetchProducts() {
  const promise = fetch("https://localhost:3001/products")
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {
      Products = productsData.map(
        (productDetails: ProductInterface | ClothingInterface) => {
          if (productDetails?.type === "clothing") {
            return new Clothing(productDetails as ClothingInterface);
          }
          return new Product(productDetails);
        }
      );
    });
  return promise;
}

export function fetchInternalProducts() {
  const promise = fetch("http://localhost:3000/products")
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {
      Products = productsData.map(
        (productDetails: ProductInterface | ClothingInterface) => {
          if (productDetails?.type === "clothing") {
            return new Clothing(productDetails as ClothingInterface);
          }
          return new Product(productDetails);
        }
      );
    });
  return promise;
}
