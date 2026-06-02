import { fireEvent } from '@testing-library/dom';
import * as Effect from 'effect/Effect';
import { STORAGE_KEYS } from 'shared/constants';
import type { Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import {
  cartJson as cart,
  orderJson,
  productsJson as products,
} from 'testdata';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { cartStore } from '#data/cart.ts';
import {
  fetchOrders,
  handlePlaceOrder,
  renderPaymentSummary,
} from '#pages/checkout/paymentSummary.ts';

beforeAll(async () => {
  localStorage.clear();
  document.body.innerHTML = `
      <div class="test-container">
        <div class="payment-summary-body"></div>
        <button class="place-order-button"></button>
      </div>`;
  await renderPaymentSummary({
    cart: cart as Cart[],
    products: products as Product[],
  });
  handlePlaceOrder();
});

beforeEach(() => {
  cartStore(cart as Cart[]);
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

describe('place order', () => {
  it('navigate to order page', async () => {
    const placeOrderButton = document.querySelector(
      'button.place-order-button',
    );
    fireEvent.click(placeOrderButton!);
    await vi.waitFor(
      () => {
        const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
        if (savedOrders === null) {
          throw new Error('Orders not saved to local storage');
        }
      },
      { timeout: 100, interval: 8 },
    );
    expect(location.href).toContain('/orders.html');
  });
  it('saves orders to local storage', async () => {
    const placeOrderButton = document.querySelector(
      'button.place-order-button',
    );
    fireEvent.click(placeOrderButton!);
    await vi.waitFor(
      () => {
        const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
        if (savedOrders === null) {
          throw new Error('Orders not saved to local storage');
        }
      },
      { timeout: 100, interval: 8 },
    );
    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDER);
    expect(savedOrders).not.toBeNull();
  });
});

describe.concurrent('fetchOrders', async () => {
  const orders = await Effect.runPromise(fetchOrders(cart as Cart[]));

  it('return same totalCostCents', () => {
    expect(orders.totalCostCents).toBe(orderJson.totalCostCents);
  });

  it('return same products', () => {
    expect(orders.products).toBe(orders.products);
  });

  it('returns 400 if productId structurally invalid', async () => {
    const error = await Effect.runPromiseExit(
      fetchOrders([
        { productId: 'abc', quantity: 1, deliveryOptionId: '1' },
      ] as Cart[]),
    );
    expect(error._tag).toBe('Failure');
  });
});
