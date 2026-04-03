import { beforeAll, describe, expect, test } from 'bun:test';
import { formatCurrency } from 'shared/money';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { renderPaymentSummary } from 'web/paymentSummary';

const cartJson = (await Bun.file('./normal/cart.json').json()) as Cart[];

beforeAll(async () => {
  localStorage.clear();
  document.body.innerHTML = `
      <div class="test-container">
        <div class="payment-summary"></div>
      </div>`;
  await renderPaymentSummary(cartJson);
});

const products = (await Bun.file(
  './normal/products.json',
).json()) as Product[];

describe.concurrent('test suite: render payment details', () => {
  const prices = calculatePrices(cartJson, products);

  test('correct total product price', () => {
    const totalProductPrice = document.querySelector(
      '.total-products-price',
    );
    checkNullish(totalProductPrice);
    expect(totalProductPrice.textContent).toContain(
      formatCurrency(prices.totalProductPrice),
    );
  });

  test('correct total delivery fee', () => {
    const totalDeliveryFee = document.querySelector('.total-delivery-fee');
    checkNullish(totalDeliveryFee);
    expect(totalDeliveryFee.textContent).toContain(
      formatCurrency(prices.totalDeliveryFee),
    );
  });

  test('correct cart quantity', () => {
    const cartQuantity = document.querySelector('.cart-item-quantity');
    checkNullish(cartQuantity);
    expect(cartQuantity.textContent).toContain(
      prices.cartQuantity.toString(),
    );
  });

  test('correct total price before tax', () => {
    const totalPriceBeforeTax = document.querySelector(
      '.total-price-before-tax',
    );
    checkNullish(totalPriceBeforeTax);
    expect(totalPriceBeforeTax.textContent).toContain(
      formatCurrency(prices.totalPriceBeforeTax),
    );
  });

  test('correct total tax', () => {
    const totalTax = document.querySelector('.total-tax');
    checkNullish(totalTax);
    expect(totalTax.textContent).toContain(
      formatCurrency(prices.totalTax),
    );
  });

  test('correct total order price', () => {
    const totalOrderPrice = document.querySelector('.total-cost');
    checkNullish(totalOrderPrice);
    expect(totalOrderPrice.textContent).toContain(
      formatCurrency(prices.totalOrderPrice),
    );
  });
});
