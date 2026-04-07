import type { Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import { beforeAll, describe, expect, test } from 'vitest';
import { renderPaymentSummary } from 'web/paymentSummary';

import cart from '#testData/cart.json' with { type: 'json' };
import products from '#testData/products.json' with { type: 'json' };

beforeAll(async () => {
  localStorage.clear();
  document.body.innerHTML = `
      <div class="test-container">
        <div class="payment-summary"></div>
      </div>`;
  await renderPaymentSummary({
    cart: cart as Cart[],
    products: products as Product[],
  });
});

describe.concurrent('render payment details', () => {
  test('correct total product price', () => {
    const totalProductPrice = document.querySelector(
      '.total-products-price',
    );
    expect(totalProductPrice!.textContent).toContain('241.38');
  });

  test('correct total delivery fee', () => {
    const totalDeliveryFee = document.querySelector('.total-delivery-fee');
    expect(totalDeliveryFee!.textContent).toContain('14.98');
  });

  test('correct cart quantity', () => {
    const cartQuantity = document.querySelector('.cart-item-quantity');
    expect(cartQuantity!.textContent).toContain('11');
  });

  test('correct total price before tax', () => {
    const totalPriceBeforeTax = document.querySelector(
      '.total-price-before-tax',
    );
    expect(totalPriceBeforeTax!.textContent).toContain('256.36');
  });

  test('correct total tax', () => {
    const totalTax = document.querySelector('.total-tax');
    expect(totalTax!.textContent).toContain('25.64');
  });

  test('correct total order price', () => {
    const totalOrderPrice = document.querySelector('.total-cost');
    expect(totalOrderPrice!.textContent).toContain('282.00');
  });
});
