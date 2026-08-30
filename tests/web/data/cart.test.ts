import { afterAll, describe, expect, it } from 'vitest';

import { getCart } from '#lib/data/cart.ts';
import { cartJson } from '#testdata';

describe.concurrent('getCart', () => {
  afterAll(() => {
    localStorage.clear();
  });
  it('get truthy localStorage cart in happy dom environment', () => {
    localStorage.setItem('cart', JSON.stringify(cartJson));
    const cart = getCart();
    expect(cart).toEqual(cartJson);
  });
  it('get falsy localStorage cart in happy dom environment', () => {
    localStorage.removeItem('cart');

    const cart = getCart();
    expect(cart).toEqual([]);
  });
});
