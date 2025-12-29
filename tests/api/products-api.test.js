import { describe, test, expect } from "vitest";
import productsJSON from "../../backend/products.json";
import {
  fetchInternalProducts,
  Products,
  Product,
  Clothing,
} from "../../data/products-backend.ts";

await fetchInternalProducts();

describe("products api test", () => {
  test("products quantity", () => {
    const products = productsJSON.map((productDetails) => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });
    Products.forEach((product, productNumber) => {
      expect(product).toEqual(products[productNumber]);
    });
  });
});
