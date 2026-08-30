import { describe, expect, it } from 'vitest';

import { getCart, getMatchingCart } from '#lib/data/cart.ts';
import type { Cart } from '#lib/schema.ts';
import { cartJson } from '#testdata';

describe.concurrent('getMatchingCart', () => {
  it('get matching cart', () => {
    const matchingCart = getMatchingCart(cartJson as Cart[], '59LXo');
    expect(matchingCart).toEqual(cartJson[0]);
  });
});

describe.concurrent('getCart', () => {
  it('get empty cart in node environment', () => {
    const cart = getCart();
    expect(cart).toEqual([]);
  });
});
