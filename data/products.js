import { formatCurrency } from "../Scripts/Utils/Money.js";

export function getMatchingCart(cart, productId) {
  const matchingItem = cart.find(
    (cartItem) => cartItem.ProductId === productId
  );
  return matchingItem;
}

export function getMatchingProduct(products, productId) {
  const MatchingItem = products.find((product) => product.id === productId);
  return MatchingItem;
}

class Product {
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
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
  id;
  image;
  name;
  rating;
  priceCents;
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
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

const tshirt = new Clothing({
  id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
  image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
  name: "Adults Plain Cotton T-Shirt - 2 Pack",
  rating: {
    stars: 4.5,
    count: 56,
  },
  priceCents: 799,
  keywords: ["tshirts", "apparel", "mens"],
  type: "clothing",
  sizeChartLink: "images/clothing-size-chart.png",
});

const product1 = new Product({
  id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  image: "images/products/athletic-cotton-socks-6-pairs.jpg",
  name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
  rating: {
    stars: 4.5,
    count: 87,
  },
  priceCents: 1090,
  keywords: ["socks", "sports", "apparel"],
});
export let Products = [];

export function fetchProducts() {
  const promise = fetch("https://localhost:3001/products")
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {
      Products = productsData.map((productDetails) => {
        if (productDetails.type === "clothing") {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });
    });
  return promise;
}

export function fetchInternalProducts() {
  const promise = fetch("http://localhost:3000/products")
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {
      Products = productsData.map((productDetails) => {
        if (productDetails.type === "clothing") {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });
    });
  return promise;
}