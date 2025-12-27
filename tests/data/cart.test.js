import { describe, expect, test } from "vitest";
import { addToCart, getCart } from "../../data/cart.ts";
describe.concurrent("test suite: addToCart", () => {
  test("add a new product to cart", async ({ expect }) => {
    localStorage.clear();
    addToCart("6b07d4e7-f540-454e-8a1e-363f25dbae7d", 4);
    const cart = getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].ProductId).toBe("6b07d4e7-f540-454e-8a1e-363f25dbae7d");
    expect(cart[0].Quantity).toBe(4);
    localStorage.setItem("cart", JSON.stringify([]));
  });
  test("add an existing product to cart", async ({ expect }) => {
    localStorage.setItem(
      "cart",
      JSON.stringify([
        {
          ProductId: "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
          Quantity: 4,
          deliveryOptionId: "1",
        },
      ])
    );
    addToCart("6b07d4e7-f540-454e-8a1e-363f25dbae7d", 4);
    const cart = getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].ProductId).toBe("6b07d4e7-f540-454e-8a1e-363f25dbae7d");
    expect(cart[0].Quantity).toBe(4);
    localStorage.setItem("cart", JSON.stringify([]));
  });
});
