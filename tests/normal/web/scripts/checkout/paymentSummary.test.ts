/// <reference lib="dom" />
import { beforeAll, describe, expect, test } from 'bun:test';
import { Cart } from '#root/shared/src/schema.ts';
import { type Product } from '#root/shared/src/data/products.ts';
import { formatCurrency } from '#root/shared/src/utils/money.ts';
import { renderPaymentSummary } from '#root/web/src/scripts/checkout/paymentSummary.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import { calculatePrices } from '#root/shared/src/data/payment.ts';

const cartJson: Cart[] = await Bun.file('./tests/normal/cart.json').json();

beforeAll(async () => {
  localStorage.clear();
  document.body.innerHTML = `
      <div class="test-container">
        <div class="payment-summary"></div>
      </div>`;
  await renderPaymentSummary(cartJson);
});

describe.concurrent('test suite: render payment details', async () => {
  const products: Product[] = await Bun.file(
    './tests/normal/products.json',
  ).json();
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
