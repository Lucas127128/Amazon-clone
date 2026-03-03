/// <reference lib="dom" />
import '../../preload.ts';
import 'fake-indexeddb/auto';
import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { Cart } from '#data/cart.ts';
import { getProducts } from '#data/products.ts';
import { formatCurrency } from '#root/src/scripts/Utils/Money.ts';
import { renderPaymentSummary } from '#root/src/scripts/checkout/paymentSummary.ts';
import { checkTruthy } from '#root/src/scripts/Utils/typeChecker.ts';
import cart from '../../cart.json';
import { calculatePrices } from '#root/src/data/payment.ts';
import { clear } from 'idb-keyval';

describe('test suite: Render payment summary', async () => {
  beforeAll(async () => {
    localStorage.clear();
    await clear();
    document.body.innerHTML = `
      <div class="test-container">
        <div class="payment-summary"></div>
      </div>`;
    localStorage.setItem('cart', JSON.stringify(cart));
    await renderPaymentSummary();
  });
  afterAll(async () => {
    document.body.innerHTML = '';
    localStorage.clear();
    await clear();
  });
  const products = await getProducts();
  const prices = calculatePrices(cart as Cart[], products);

  test('correct total product price', () => {
    const totalProductPrice = document.querySelector(
      '.total-products-price',
    );
    checkTruthy(totalProductPrice);
    expect(totalProductPrice.textContent).toContain(
      formatCurrency(prices.totalProductPrice),
    );
  });

  test('correct total delivery fee', () => {
    const totalDeliveryFee = document.querySelector('.total-delivery-fee');
    checkTruthy(totalDeliveryFee);
    expect(totalDeliveryFee.textContent).toContain(
      formatCurrency(prices.totalDeliveryFee),
    );
  });

  test('correct cart quantity', () => {
    const cartQuantity = document.querySelector('.cart-item-quantity');
    checkTruthy(cartQuantity);
    expect(cartQuantity.textContent).toContain(
      prices.cartQuantity.toString(),
    );
  });

  test('correct total price before tax', () => {
    const totalPriceBeforeTax = document.querySelector(
      '.total-price-before-tax',
    );
    checkTruthy(totalPriceBeforeTax);
    expect(totalPriceBeforeTax.textContent).toContain(
      formatCurrency(prices.totalPriceBeforeTax),
    );
  });

  test('correct total tax', () => {
    const totalTax = document.querySelector('.total-tax');
    checkTruthy(totalTax);
    expect(totalTax.textContent).toContain(
      formatCurrency(prices.totalTax),
    );
  });

  test('correct total order price', () => {
    const totalOrderPrice = document.querySelector('.total-cost');
    checkTruthy(totalOrderPrice);
    expect(totalOrderPrice.textContent).toContain(
      formatCurrency(prices.totalOrderPrice),
    );
  });
});
