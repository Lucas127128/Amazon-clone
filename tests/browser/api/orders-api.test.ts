import { test, describe, expect, beforeAll, vi } from "vitest";
import cart from "../../../src/api/cart.json";
import { getTimeString } from "../../../src/data/orders.ts";
import { getDeliveryDate } from "../../../src/data/deliveryOption.ts";
import {
  getMatchingProduct,
  fetchProducts,
} from "../../../src/data/products.ts";
import { Order } from "../../../src/data/orders.ts";
import { external } from "../../../src/data/axios.ts";
import { checkTruthy } from "../../../src/Scripts/Utils/typeChecker.ts";
import { Temporal } from "temporal-polyfill";

const order: Order = (await external.post("/orders", cart)).data;
await fetchProducts();

describe("order api test", () => {
  test.concurrent("order id test", ({ expect }) => {
    expect(typeof order.id).toBe("string");
  });

  test.concurrent("order time test", ({ expect }) => {
    expect(typeof order.orderTime).toBe("string");
    const date = Temporal.Now.instant().toJSON();
    expect(getTimeString(order.orderTime)).toBe(getTimeString(date));
  });

  test("order products test", () => {
    //test products length
    expect(cart.length).toBe(order.products.length);

    //test delivery time
    order.products.forEach((products, productNumber: number) => {
      expect(typeof products.estimatedDeliveryTime).toBe("string");

      const cartItem = cart[productNumber];
      const estimatedDeliveryTime = getDeliveryDate(cartItem.deliveryOptionId);
      console.log(products.estimatedDeliveryTime);
      expect(getTimeString(products.estimatedDeliveryTime)).toEqual(
        estimatedDeliveryTime,
      );
    });

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

    let totalCostCents = 0;
    const products = await fetchProducts();
    cart.forEach((cartItem) => {
      const matchingProduct = getMatchingProduct(products, cartItem?.productId);
      checkTruthy(matchingProduct, "There is no matching product");
      totalCostCents += matchingProduct.priceCents;
    });
    expect(order.totalCostCents).toBe(totalCostCents);
  });
});
