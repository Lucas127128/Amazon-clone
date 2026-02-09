import { bench } from "vitest";
import { filterFromCart, removeFromCart, addToCart } from "../data/cart.ts";
import products from "../backend/rawProducts.json" with { type: "json" };

const productsId = [];
products.forEach((product) => {
  productsId.push(product.id);
});

productsId.forEach((productId) => {
  const numbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ];
  const randomNumber = numbers[Math.floor(Math.round() * numbers.length)];
  addToCart(false, productId, randomNumber);
});

bench("filter", () => {
  const randomProductId =
    productsId[Math.floor(Math.round() * productsId.length)];
  filterFromCart(randomProductId);
});

bench("forEach", () => {
  const randomProductId =
    productsId[Math.floor(Math.round() * productsId.length)];
  removeFromCart(randomProductId);
});
