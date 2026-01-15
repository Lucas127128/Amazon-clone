import { describe, test, expect } from "vitest";
import productsJSON from "../../../src/api/products.json";
import {
  fetchInternalProducts,
  Products,
  Product,
  Clothing,
} from "../../../src/data/products.ts";
import {
  ClothingInterface,
  ProductInterface,
} from "../../../src/data/products.ts";

await fetchInternalProducts();

describe("products api test", () => {
  test("products quantity", () => {
    const products = productsJSON.map(
      (productDetails: ProductInterface | ClothingInterface) => {
        if (productDetails?.type === "clothing") {
          return new Clothing(productDetails as ClothingInterface);
        }
        return new Product(productDetails);
      }
    );
    Products.forEach((product, productNumber) => {
      expect(product).toEqual(products[productNumber]);
    });
  });
});
