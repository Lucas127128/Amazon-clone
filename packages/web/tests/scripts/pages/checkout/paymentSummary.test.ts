import { fireEvent } from '@testing-library/dom';
import { STORAGE_KEYS } from 'shared/constants';
import type { Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import { cartJson as cart, productsJson as products } from 'testdata';
import { beforeAll, describe, expect, it } from 'vitest';

import { renderPaymentSummary } from '#pages/checkout/paymentSummary.ts';

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
  it('correct total product price', () => {
    const totalProductPrice = document.querySelector(
      '.total-products-price',
    );
    expect(totalProductPrice!.textContent).toContain('241.38');
  });

  it('correct total delivery fee', () => {
    const totalDeliveryFee = document.querySelector('.total-delivery-fee');
    expect(totalDeliveryFee!.textContent).toContain('14.98');
  });

  it('correct cart quantity', () => {
    const cartQuantity = document.querySelector('.cart-item-quantity');
    expect(cartQuantity!.textContent).toContain('11');
  });

  it('correct total price before tax', () => {
    const totalPriceBeforeTax = document.querySelector(
      '.total-price-before-tax',
    );
    expect(totalPriceBeforeTax!.textContent).toContain('256.36');
  });

  it('correct total tax', () => {
    const totalTax = document.querySelector('.total-tax');
    expect(totalTax!.textContent).toContain('25.64');
  });

  it('correct total order price', () => {
    const totalOrderPrice = document.querySelector('.total-cost');
    expect(totalOrderPrice!.textContent).toContain('282.00');
  });
});

describe.concurrent('place order', () => {
  it('navigate to order page', async () => {
    const placeOrderButton = document.querySelector(
      'button.place-order-button',
    );
    fireEvent.click(placeOrderButton!);
    await Bun.sleep(35);
    expect(location.href).toContain('/orders.html');
  });
  it('saves orders to local storage', async () => {
    const placeOrderButton = document.querySelector(
      'button.place-order-button',
    );
    fireEvent.click(placeOrderButton!);
    await Bun.sleep(35);
    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
    expect(savedOrders).not.toBeNull();
  });
});
