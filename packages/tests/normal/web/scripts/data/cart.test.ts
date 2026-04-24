import type { Cart } from 'shared/schema';
import { beforeEach, describe, expect, test } from 'vitest';
import {
  addToCart,
  cartQuantity,
  cartStore,
  getMatchingCart,
  removeFromCart,
  updateDeliveryOption,
} from 'web/cart';

import cartJson from '#testData/cart.json';

beforeEach(() => {
  cartStore.set(() => cartJson.slice(0, 3) as Cart[]);
});

describe.concurrent('addToCart', () => {
  test('add a new product to cart', () => {
    addToCart(cartJson[3] as Cart);
    expect(cartStore.get().length).toBe(4);
  });
  test('incrementally add an existing product to cart', () => {
    cartStore.set(() => cartJson.slice(0, 3) as Cart[]);
    addToCart({ ...cartStore.get()[2], quantity: 1 }, true);
    expect(cartStore.get().length).toBe(3);
    expect(cartStore.get()[2].productId).toBe('acmQY');
    expect(cartStore.get()[2].quantity).toBe(6);
    expect(cartStore.get()[2].deliveryOptionId).toBe('1');
  });
  test('not incrementally add an existing product to cart', () => {
    cartStore.set(() => cartJson.slice(0, 3) as Cart[]);
    addToCart({ ...cartStore.get()[2], quantity: 1 }, false);
    expect(cartStore.get().length).toBe(3);
    expect(cartStore.get()[2].productId).toBe('acmQY');
    expect(cartStore.get()[2].quantity).toBe(1);
    expect(cartStore.get()[2].deliveryOptionId).toBe('1');
  });
});

describe.concurrent('getMatchingCart', () => {
  test('get matching cart', () => {
    const matchingCart = getMatchingCart(cartStore.get(), '59LXo');
    expect(matchingCart).toEqual(cartStore.get()[0]);
  });
});

describe.concurrent('removeFromCart', () => {
  test('remove cartItem', () => {
    removeFromCart('59LXo');
    expect(cartStore.get()[0]).toEqual(cartJson[1] as Cart);
  });
});

describe.concurrent('updateDeliveryOption', () => {
  test('update delivery option', () => {
    updateDeliveryOption('Hwme8', '3');
    const deliveryOptionId = getMatchingCart(
      cartStore.get(),
      'Hwme8',
    )?.deliveryOptionId;
    expect(deliveryOptionId).toBe('3');
  });
});

describe.concurrent('calculateCartQuantity', () => {
  test('display cart quantity', async () => {
    const cartJson = (await Bun.file(
      './testData/cart.json',
    ).json()) as Cart[];
    cartStore.set(() => cartJson.slice(0, 3));
    expect(cartQuantity.get()).toBe(7);
  });
});
