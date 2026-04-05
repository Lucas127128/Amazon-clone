import type { Cart } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { beforeAll, describe, expect, test } from 'vitest';
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

describe.concurrent('render payment details', () => {
  test('correct total product price', () => {
    const totalProductPrice = document.querySelector(
      '.total-products-price',
    );
    checkNullish(totalProductPrice);
    expect(totalProductPrice.textContent).toContain('241.38');
  });

  test('correct total delivery fee', () => {
    const totalDeliveryFee = document.querySelector('.total-delivery-fee');
    checkNullish(totalDeliveryFee);
    expect(totalDeliveryFee.textContent).toContain('14.98');
  });

  test('correct cart quantity', () => {
    const cartQuantity = document.querySelector('.cart-item-quantity');
    checkNullish(cartQuantity);
    expect(cartQuantity.textContent).toContain('11');
  });

  test('correct total price before tax', () => {
    const totalPriceBeforeTax = document.querySelector(
      '.total-price-before-tax',
    );
    checkNullish(totalPriceBeforeTax);
    expect(totalPriceBeforeTax.textContent).toContain('256.36');
  });

  test('correct total tax', () => {
    const totalTax = document.querySelector('.total-tax');
    checkNullish(totalTax);
    expect(totalTax.textContent).toContain('25.64');
  });

  test('correct total order price', () => {
    const totalOrderPrice = document.querySelector('.total-cost');
    checkNullish(totalOrderPrice);
    expect(totalOrderPrice.textContent).toContain('282.00');
  });
});
