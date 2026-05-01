import { createAtom } from '@tanstack/store';
import { CART_CONFIG } from 'shared/constants';
import type { Cart } from 'shared/schema';
import { beforeEach, describe, expect, it } from 'vitest';
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
  it('add a new product to cart', () => {
    addToCart(cartJson[3] as Cart);
    expect(cartStore.get().length).toBe(4);
  });
  it('incrementally add an existing product to cart', () => {
    cartStore.set(() => cartJson.slice(0, 3) as Cart[]);
    addToCart({ ...cartStore.get()[2], quantity: 1 }, true);
    expect(cartStore.get().length).toBe(3);
    expect(cartStore.get()[2].productId).toBe('acmQY');
    expect(cartStore.get()[2].quantity).toBe(6);
    expect(cartStore.get()[2].deliveryOptionId).toBe('1');
  });
  it('not incrementally add an existing product to cart', () => {
    cartStore.set(() => cartJson.slice(0, 3) as Cart[]);
    addToCart({ ...cartStore.get()[2], quantity: 1 }, false);
    expect(cartStore.get().length).toBe(3);
    expect(cartStore.get()[2].productId).toBe('acmQY');
    expect(cartStore.get()[2].quantity).toBe(1);
    expect(cartStore.get()[2].deliveryOptionId).toBe('1');
  });
  it('throw if quantity is bigger than max quantity', async () => {
    const cartJson = (await Bun.file(
      './testData/cart.json',
    ).json()) as Cart[];
    const cart = createAtom(cartJson.slice(0, 3));
    expect(() =>
      addToCart(
        {
          ...cart.get()[2],
          quantity: CART_CONFIG.MAX_QUANTITY_PER_ITEM + 1,
        },
        false,
        cart,
      ),
    ).toThrow('Invalid value: Expected <=10 but received 11');
  });
});

describe.concurrent('getMatchingCart', () => {
  it('get matching cart', () => {
    const matchingCart = getMatchingCart(cartStore.get(), '59LXo');
    expect(matchingCart).toEqual(cartStore.get()[0]);
  });
});

describe.concurrent('removeFromCart', () => {
  it('remove cartItem', () => {
    removeFromCart('59LXo');
    expect(cartStore.get()[0]).toEqual(cartJson[1] as Cart);
  });
});

describe.concurrent('updateDeliveryOption', () => {
  it('update delivery option', () => {
    // console.log(cartStore.get());
    cartStore.set(() => cartJson.slice(0, 3) as Cart[]);
    updateDeliveryOption('Hwme8', '3');
    const deliveryOptionId = getMatchingCart(
      cartStore.get(),
      'Hwme8',
    )?.deliveryOptionId;
    expect(deliveryOptionId).toBe('3');
  });
});

describe.concurrent('calculateCartQuantity', () => {
  it('display cart quantity', async () => {
    const cartJson = (await Bun.file(
      './testData/cart.json',
    ).json()) as Cart[];
    cartStore.set(() => cartJson.slice(0, 3));
    expect(cartQuantity.get()).toBe(7);
  });
});
