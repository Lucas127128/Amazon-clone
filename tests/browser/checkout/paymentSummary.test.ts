import { afterAll, beforeAll, describe, expect, test } from "vitest";
import {
  addToCart,
  updateDeliveryOption,
  getCart,
} from "../../../src/data/cart.ts";
import {
  fetchProducts,
  getMatchingProduct,
} from "../../../src/data/products.ts";
import { formatCurrency } from "../../../src/Scripts/Utils/Money.ts";
import { renderOrderSummary } from "../../../src/Scripts/checkout/orderSummary.ts";
import { renderPaymentSummary } from "../../../src/Scripts/checkout/paymentSummary.ts";
import { checkTruthy } from "../../../src/Scripts/Utils/typeChecker.ts";
import { sleep } from "../../../src/Scripts/Utils/sleep.ts";

document.body.innerHTML = `
<div class="test-container">
  <div class="order-summary"></div>
  <div class="return-to-home-link"></div>
  <div class="payment-summary"></div>
</div>`;

describe("test suite: Render payment summary", () => {
  beforeAll(async () => {
    localStorage.clear();
    addToCart("15b6fc6f-327a-4ec4-896f-486349e85a3d", 1);
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 2);
    updateDeliveryOption("15b6fc6f-327a-4ec4-896f-486349e85a3d", "2");
    renderPaymentSummary();
    renderOrderSummary();
  });

  afterAll(() => {
    localStorage.clear();
  });

  test.concurrent("display cart quantity", async ({ expect }) => {
    await sleep(20);
    const cartQuantity = document.querySelector(".cart-item-quantity");
    checkTruthy(cartQuantity, "Fail to select HTML element");
    expect(cartQuantity.innerHTML).toContain(3);
  });

  test.concurrent("display products cost", async ({ expect }) => {
    const cart = getCart();
    let totalProductPrice = 0;
    const products = await fetchProducts();
    cart.forEach((cartItem) => {
      const matchingProduct = getMatchingProduct(products, cartItem.productId);
      checkTruthy(matchingProduct, "Fail to get the cart");
      totalProductPrice += matchingProduct.priceCents * cartItem.quantity;
    });
    const totalProductsPriceHTML = document.querySelector(
      ".total-products-price",
    );
    checkTruthy(totalProductsPriceHTML, "Fail to select HTML element");
    expect(totalProductsPriceHTML.textContent).toBe(
      `$${formatCurrency(totalProductPrice)}`,
    );

    localStorage.setItem("totalProductPrice", String(totalProductPrice));
  });

  test("display delivery fee", async () => {
    let totalDeliveryFee = 0;
    const cart = getCart();
    cart.forEach((cartItem) => {
      let deliveryFee = 0;
      if (cartItem.deliveryOptionId === "1") {
        deliveryFee = 0;
      } else if (cartItem.deliveryOptionId === "2") {
        deliveryFee = 499;
      } else if (cartItem.deliveryOptionId === "3") {
        deliveryFee = 999;
      }
      totalDeliveryFee += deliveryFee;
    });
    await sleep(20);
    const totalDeliveryFeeHTML = document.querySelector(".total-delivery-fee");
    checkTruthy(totalDeliveryFeeHTML, "Fail to select HTML element");
    expect(totalDeliveryFeeHTML.textContent).toBe(
      `$${formatCurrency(totalDeliveryFee)}`,
    );
    localStorage.setItem("totalDeliveryFee", String(totalDeliveryFee));
  });

  test("display total price before tax", async () => {
    const totalProductPrice = Number(localStorage.getItem("totalProductPrice"));
    const totalDeliveryFee = Number(localStorage.getItem("totalDeliveryFee"));
    const totalPriceBeforeTax = totalProductPrice + totalDeliveryFee;
    await sleep(50);
    const totalPriceBeforeTaxHTML = document.querySelector(
      ".total-price-before-tax",
    );
    checkTruthy(totalPriceBeforeTaxHTML, "Fail to select HTML element");
    expect(totalPriceBeforeTaxHTML.textContent).toBe(
      `$${formatCurrency(totalPriceBeforeTax)}`,
    );
    localStorage.setItem("totalPriceBeforeTax", String(totalPriceBeforeTax));
  });

  test.concurrent("display tax", async ({ expect }) => {
    const totalPriceBeforeTax = Number(
      localStorage.getItem("totalPriceBeforeTax"),
    );
    const estimatedTax = totalPriceBeforeTax * 0.1;
    await sleep(20);
    const totalTaxHTML = document.querySelector(".total-tax");
    checkTruthy(totalTaxHTML, "Fail to select HTML element");
    expect(totalTaxHTML.textContent).toBe(`$${formatCurrency(estimatedTax)}`);
    localStorage.setItem("estimatedTax", String(estimatedTax));
  });

  test("display total cost", () => {
    const estimatedTax = Number(localStorage.getItem("estimatedTax"));
    const totalPriceBeforeTax = Number(
      localStorage.getItem("totalPriceBeforeTax"),
    );
    const totalCost = estimatedTax + totalPriceBeforeTax;
    const totalCostHTML = document.querySelector(".total-cost");
    checkTruthy(totalCostHTML, "Fail to select HTML element");
    expect(totalCostHTML.textContent).toBe(`$${formatCurrency(totalCost)}`);
  });
});
