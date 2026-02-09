import { describe, expect, test } from "vitest";
import {
  getMatchingProduct,
  RawProduct,
  Product,
  getMatchingRawProduct,
  fetchProducts,
} from "../../../src/data/products";
import { external } from "../../../src/data/axios";
import { Cart, getMatchingCart } from "../../../src/data/cart";
import correctRawProducts from "../../products.json";

const correctRawProduct: RawProduct = {
  id: "sMmsZ",
  image: "/images/products/facial-tissue-2-ply-18-boxes.webp",
  name: "Ultra Soft Tissue 2-Ply - 18 Box",
  rating: { stars: 4, count: 99 },
  priceCents: 2374,
  keywords: ["kleenex", "tissues", "kitchen", "tissues box", "napkins"],
};
describe("Get matching item", async () => {
  test.concurrent("get matching products", async ({ expect }) => {
    const products = await fetchProducts(external);
    const matchingProduct = getMatchingProduct(products, "sMmsZ");
    const correctProduct = new Product(correctRawProduct, false);
    expect(matchingProduct).toEqual(correctProduct);
  });

  test.concurrent("get matching raw product", async ({ expect }) => {
    const products = (await external.get("/products")).data;
    const matchingProduct = getMatchingRawProduct(products, "sMmsZ");
    expect(matchingProduct).toEqual(correctRawProduct);
  });

  test.concurrent("get matching cart", ({ expect }) => {
    const cart: Cart[] = [
      {
        productId: "sMmsZ",
        quantity: 2,
        deliveryOptionId: "1",
      },
      {
        productId: "ISs-Z",
        quantity: 1,
        deliveryOptionId: "2",
      },
    ];
    const matchingCart = getMatchingCart(cart, "ISs-Z");
    const correctCart = {
      productId: "ISs-Z",
      quantity: 1,
      deliveryOptionId: "2",
    };
    expect(matchingCart).toEqual(correctCart);
  });
});

describe("fetch products", () => {
  test.concurrent("fetch correct products", async ({ expect }) => {
    const products = await fetchProducts();
    expect(products).toEqual(correctRawProducts);
  });

  test.concurrent("Generate product object", ({ expect }) => {
    const product = new Product(correctRawProduct, false);
    const correctProduct: Product = {
      id: "sMmsZ",
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
