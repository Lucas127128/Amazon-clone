import { describe, expect, test } from "vitest";
import { addToCart } from "../../data/cart.js";
import "bun-storage/auto";
describe.concurrent("test suite: addToCart", () => {
  test("add a new product to cart", async ({ expect }) => {
    addToCart("6b07d4e7-f540-454e-8a1e-363f25dbae7d", 4);
    const cart = JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
    expect(cart.length).toBe(1);
    expect(cart[0].ProductId).toBe("6b07d4e7-f540-454e-8a1e-363f25dbae7d");
    expect(cart[0].Quantity).toBe(4);
    localStorage.setItem("local_Storage_Cart", JSON.stringify([]));
  });
  test("add an existing product to cart", async ({ expect }) => {
    localStorage.setItem(
      "local_Storage_Cart",
      JSON.stringify([
        {
          ProductId: "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
          Quantity: 4,
          deliveryOptionId: "1",
        },
      ])
    );
    addToCart("6b07d4e7-f540-454e-8a1e-363f25dbae7d", 4);
    const cart = JSON.parse(localStorage.getItem("local_Storage_Cart")) || [];
    expect(cart.length).toBe(1);
    expect(cart[0].ProductId).toBe("6b07d4e7-f540-454e-8a1e-363f25dbae7d");
    expect(cart[0].Quantity).toBe(4);
    localStorage.setItem("local_Storage_Cart", JSON.stringify([]));
  });
});
