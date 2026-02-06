import { test, describe, expect } from "vitest";
import cart from "../../cart.json";
import { getTimeString } from "../../../src/data/orders.ts";
import { getProducts } from "../../../src/data/products.ts";
import { Order } from "../../../src/data/orders.ts";
import { external } from "../../../src/data/axios.ts";
import { checkTruthy } from "../../../src/Scripts/Utils/typeChecker.ts";
import { Temporal } from "temporal-polyfill";
import { calculatePrices } from "../../../src/data/payment.ts";

const order: Order = (await external.post("/orders", cart)).data;

describe("order api test", () => {
  test.concurrent("order id test", ({ expect }) => {
    expect(typeof order.id).toBe("string");
  });

  test.concurrent("order time test", async ({ expect }) => {
    expect(typeof order.orderTime).toBe("string");
    const date = Temporal.Now.instant().toJSON();
    expect(await getTimeString(order.orderTime)).toBe(
      await getTimeString(date),
    );
  });

  test("order products test", () => {
    //test products length
    expect(cart.length).toBe(order.products.length);

    //test delivery time
    expect(order.products).toEqual(cart);

    let matchingProduct;
    cart.forEach((cartItem) => {
      matchingProduct = order.products.find(
        (product) => cartItem.productId === product.productId,
      );
      //test product quantity
      checkTruthy(matchingProduct);
      expect(matchingProduct.quantity).toBe(cartItem.quantity);
    });

    //test products id
    expect(typeof matchingProduct).toBe("object");
  });

  test.concurrent("order cost test", async ({ expect }) => {
    expect(typeof order.totalCostCents).toBe("number");

    const products = await getProducts();
    const { totalOrderPrice } = calculatePrices(cart, products);
    expect(order.totalCostCents).toBe(totalOrderPrice);
  });
});
