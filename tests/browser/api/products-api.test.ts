import { describe, test, expect } from "vitest";
import productsJSON from "../../../src/api/products.json";
import clothingList from "../../../src/api/clothing.json";
import { fetchProducts, Product } from "../../../src/data/products.ts";

describe("products api test", () => {
  test("deliver correct products", async () => {
    const products = productsJSON.map((product) => {
      const isClothing = clothingList.includes(product.id);
      return new Product(product, isClothing);
    });
    const Products = await fetchProducts();
    Products.forEach((product, productIndex) => {
      expect(product).toEqual(products[productIndex]);
    });
  });
});
