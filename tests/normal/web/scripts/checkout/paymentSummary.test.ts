/// <reference lib="dom" />
import 'fake-indexeddb/auto';
import { beforeAll, describe, expect, test } from 'bun:test';
import { Cart } from '#root/shared/src/schema.ts';
import { getProducts } from '#root/shared/src/data/products.ts';
import { formatCurrency } from '#root/shared/src/utils/money.ts';
import { renderPaymentSummary } from '#root/web/src/scripts/checkout/paymentSummary.ts';
import { checkTruthy } from '#root/shared/src/utils/typeChecker.ts';
import cart from '../../../../cart.json';
import { calculatePrices } from '#root/shared/src/data/payment.ts';
import { clear } from 'idb-keyval';
import { STORAGE_KEYS } from '#root/shared/src/constants.ts';

describe('test suite: Render payment summary', async () => {
  beforeAll(async () => {
    await clear();
    localStorage.clear();
    document.body.innerHTML = `
      <div class="test-container">
        <div class="payment-summary"></div>
      </div>`;
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    await renderPaymentSummary();
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
