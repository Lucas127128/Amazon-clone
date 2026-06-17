import { CART_CONFIG } from 'shared/constants';
import type { Cart } from 'shared/schema';
import { cartJson } from 'testdata';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  addToCart,
  cartQuantity,
  cartStore,
  getMatchingCart,
  removeFromCart,
} from '#data/cart.ts';

beforeEach(() => {
  cartStore(cartJson.slice(0, 3) as Cart[]);
});
afterEach(() => {
  cartStore([]);
});

describe.concurrent('addToCart', () => {
  it('add a new product to cart', () => {
    addToCart(cartJson[3] as Cart);
    expect(cartStore().length).toBe(4);
  });
  it('incrementally add an existing product to cart', () => {
    cartStore(cartJson.slice(0, 3) as Cart[]);
    addToCart({ ...cartStore()[2]!, quantity: 1 }, true);
    expect(cartStore().length).toBe(3);
    const cart = cartStore()[2]!;
    expect(cart.productId).toBe('acmQY');
    expect(cart.quantity).toBe(6);
    expect(cart.deliveryOptionId).toBe('1');
  });
  it('not incrementally add an existing product to cart', () => {
    cartStore(cartJson.slice(0, 3) as Cart[]);
    addToCart({ ...cartStore()[2]!, quantity: 1 }, false);
    expect(cartStore().length).toBe(3);
    const cart = cartStore()[2]!;
    expect(cart.productId).toBe('acmQY');
    expect(cart.quantity).toBe(1);
    expect(cart.deliveryOptionId).toBe('1');
  });
  it('throw if quantity is bigger than max quantity', () => {
    const cart = cartStore()[2]!;
    expect(() =>
      addToCart(
        {
          ...cart,
          quantity: CART_CONFIG.MAX_QUANTITY_PER_ITEM + 1,
        },
        false,
      ),
    ).toThrow(
      `Invalid value: Expected <=${CART_CONFIG.MAX_QUANTITY_PER_ITEM} but received ${CART_CONFIG.MAX_QUANTITY_PER_ITEM + 1}`,
    );
  });
});

describe.concurrent('getMatchingCart', () => {
  it('get matching cart', () => {
    const matchingCart = getMatchingCart(cartStore(), '59LXo');
    expect(matchingCart).toEqual(cartStore()[0]);
  });
});

describe.concurrent('removeFromCart', () => {
  it('remove cartItem', () => {
    removeFromCart('59LXo');
    expect(cartStore()[0]).toEqual(cartJson[1] as Cart);
  });
});

describe.concurrent('calculateCartQuantity', () => {
  it('display cart quantity', () => {
    cartStore(cartJson.slice(0, 3) as Cart[]);
    expect(cartQuantity()).toBe(7);
  });
});
