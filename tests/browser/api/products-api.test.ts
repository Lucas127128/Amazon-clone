import { describe, test, expect } from "vitest";
import productsJSON from "../../../src/api/products.json";
import clothingList from "../../../src/api/clothing.json";
import {
  fetchProducts,
  Product,
  Products,
} from "../../../src/data/products.ts";

describe("products api test", () => {
  test("deliver correct products", async () => {
    await fetchProducts();
    const products = productsJSON.map((product) => {
      clothingList.forEach((clothingId) => {
        if (clothingId === product.id) {
          return new Product(product, true);
        }
      });
      return new Product(product);
    });
    Products.forEach((product, productIndex) => {
      expect(product).toEqual(products[productIndex]);
    });
  });
});
