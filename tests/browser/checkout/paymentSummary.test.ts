import { afterAll, beforeAll, describe, expect, test } from "vitest";
import {
  addToCart,
  updateDeliveryOption,
  getCart,
} from "../../../src/data/cart.ts";
import { getProducts, getMatchingProduct } from "../../../src/data/products.ts";
import { formatCurrency } from "../../../src/Scripts/Utils/Money.ts";
import { renderOrderSummary } from "../../../src/Scripts/checkout/cartSummary.ts";
import { renderPaymentSummary } from "../../../src/Scripts/checkout/paymentSummary.ts";
import { checkTruthy } from "../../../src/Scripts/Utils/typeChecker.ts";
import sleep from "../../../src/Scripts/Utils/sleep.ts";

document.body.innerHTML = `
<div class="test-container">
  <div class="order-summary"></div>
  <div class="return-to-home-link"></div>
  <div class="payment-summary"></div>
</div>`;

describe("test suite: Render payment summary", () => {
  beforeAll(async () => {
    localStorage.clear();
    addToCart("59LXo", 1);
    addToCart("Hwme8", 2);
    updateDeliveryOption("59LXo", "2");
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
    await sleep(200);
    expect(cartQuantity.innerHTML).toContain(3);
  });

  test.concurrent("display products cost", async ({ expect }) => {
    const cart = getCart();
    let totalProductPrice = 0;
    const products = await getProducts();
    cart.forEach((cartItem) => {
      const matchingProduct = getMatchingProduct(products, cartItem.productId);
      checkTruthy(matchingProduct, "Fail to get the cart");
      totalProductPrice += matchingProduct.priceCents * cartItem.quantity;
    });
    const totalProductsPriceHTML = document.querySelector(
      ".total-products-price",
    );
    checkTruthy(totalProductsPriceHTML, "Fail to select HTML element");
    expect(totalProductsPriceHTML.textContent).toContain(
      `$${formatCurrency(totalProductPrice)}`,
    );

    localStorage.setItem("totalProductPrice", String(totalProductPrice));
  });

  test("display delivery fee", async () => {
    await sleep(20);
    const totalDeliveryFeeHTML = document.querySelector(".total-delivery-fee");
    checkTruthy(totalDeliveryFeeHTML, "Fail to select HTML element");
    expect(totalDeliveryFeeHTML.textContent).toContain(
      `$${formatCurrency(499)}`,
    );
  });

  test("display total price before tax", async () => {
    const totalProductPrice = Number(localStorage.getItem("totalProductPrice"));
    const totalDeliveryFee = 499;
    const totalPriceBeforeTax = totalProductPrice + totalDeliveryFee;
    await sleep(100);
    const totalPriceBeforeTaxHTML = document.querySelector(
      ".total-price-before-tax",
    );
    checkTruthy(totalPriceBeforeTaxHTML, "Fail to select HTML element");
    expect(totalPriceBeforeTaxHTML.textContent).toContain(
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
    expect(totalTaxHTML.textContent).toContain(
      `$${formatCurrency(estimatedTax)}`,
    );
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
    expect(totalCostHTML.textContent).toContain(
      `$${formatCurrency(totalCost)}`,
    );
  });
});
