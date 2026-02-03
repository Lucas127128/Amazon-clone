import { describe, expect, test } from "vitest";
import {
  getMatchingProduct,
  RawProduct,
  Product,
  getMatchingRawProduct,
  fetchProducts,
  getMatchingCart,
} from "../../../src/data/products";
import { external } from "../../../src/data/axios";
import { Cart } from "../../../src/data/cart";

const correctRawProduct: RawProduct = {
  id: "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
  image: "/images/products/facial-tissue-2-ply-18-boxes.webp",
  name: "Ultra Soft Tissue 2-Ply - 18 Box",
  rating: { stars: 4, count: 99 },
  priceCents: 2374,
  keywords: ["kleenex", "tissues", "kitchen", "tissues box", "napkins"],
};
describe("Get matching item", async () => {
  test.concurrent("get matching products", async ({ expect }) => {
    const products = await fetchProducts(external);
    const matchingProduct = getMatchingProduct(
      products,
      "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
    );
    const correctProduct = new Product(correctRawProduct, false);
    expect(matchingProduct).toEqual(correctProduct);
  });

  test.concurrent("get matching raw product", async ({ expect }) => {
    const products = (await external.get("/products")).data;
    const matchingProduct = getMatchingRawProduct(
      products,
      "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
    );
    expect(matchingProduct).toEqual(correctRawProduct);
  });

  test.concurrent("get matching cart", ({ expect }) => {
    const cart: Cart[] = [
      {
        productId: "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
        quantity: 2,
        deliveryOptionId: "1",
      },
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        deliveryOptionId: "2",
      },
    ];
    const matchingCart = getMatchingCart(
      cart,
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    );
    const correctCart = {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 1,
      deliveryOptionId: "2",
    };
    expect(matchingCart).toEqual(correctCart);
  });
});

describe("fetch products", () => {
  test.concurrent("fetch correct products", async ({ expect }) => {
    const products = await fetchProducts();
    const correctRawProducts: RawProduct[] = (await external.get("/products"))
      .data;
    const clothingList: string[] = (await external.get("/clothingList")).data;
    correctRawProducts.forEach((correctRawProduct) => {
      const isClothing = clothingList.includes(correctRawProduct.id);
      const correctProduct = new Product(correctRawProduct, isClothing);
      const matchingProduct = getMatchingProduct(
        products,
        correctRawProduct.id,
      );
      expect(matchingProduct).toEqual(correctProduct);
    });
  });

  test.concurrent("Generate product object", ({ expect }) => {
    const product = new Product(correctRawProduct, false);
    const correctProduct: Product = {
      id: "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
      image: "/images/products/facial-tissue-2-ply-18-boxes.webp",
      keywords: ["kleenex", "tissues", "kitchen", "tissues box", "napkins"],
      name: "Ultra Soft Tissue 2-Ply - 18 Box",
      priceCents: 2374,
      ratingCount: 99,
      extraInfoHTML: "",
      price: "23.74",
      starsUrl: "/images/ratings/rating-40.png",
    };
    expect(product).toEqual(correctProduct);
  });
});
