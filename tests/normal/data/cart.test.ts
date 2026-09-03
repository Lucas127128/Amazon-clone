import { describe, expect, it } from 'vitest';

import { Cart, getMatchingCart } from '#lib/data/cart.svelte.ts';
import type { Cart as CartItem } from '#lib/schema.ts';
import { cartJson } from '#testdata';

describe.concurrent('getMatchingCart', () => {
  it('get matching cart', () => {
    const matchingCart = getMatchingCart(cartJson as CartItem[], '59LXo');
    expect(matchingCart).toEqual(cartJson[0]);
  });
});

describe.concurrent('Cart class', () => {
  it('constructs with items', () => {
    const cart = new Cart([]);
    expect(cart.items).toEqual([]);
    expect(cart.quantity).toBe(0);
  });

  it('constructs without items', () => {
    const cart = new Cart();
    expect(cart.items).toEqual([]);
    expect(cart.quantity).toBe(0);
  });

  it('adds items with new product', () => {
    const cart = new Cart();
    cart.add('59LXo');
    expect(cart.items).toEqual([
      { productId: '59LXo', quantity: 1, deliveryOptionId: '1' },
    ]);
    expect(cart.quantity).toBe(1);
  });

  it('adds items with old product', () => {
    const cart = new Cart();
    cart.add('59LXo');
    cart.add('59LXo', 2);
    expect(cart.items).toEqual([
      { productId: '59LXo', quantity: 3, deliveryOptionId: '1' },
    ]);
    expect(cart.quantity).toBe(3);
  });

  it('updateQuantity', () => {
    const cart = new Cart();
    cart.add('59LXo');
    cart.updateQuantity('59LXo', 6);
    expect(cart.items).toEqual([
      { productId: '59LXo', quantity: 6, deliveryOptionId: '1' },
    ]);
    expect(cart.quantity).toBe(6);
  });

  it('updateDeliveryOption', () => {
    const cart = new Cart();
    cart.add('59LXo');
    cart.updateDeliveryOption('59LXo', '2');
    expect(cart.items).toEqual([
      { productId: '59LXo', quantity: 1, deliveryOptionId: '2' },
    ]);
  });

  it('removes', () => {
    const cart = new Cart();
    cart.add('59LXo');
    cart.remove('59LXo');
    expect(cart.items).toEqual([]);
    expect(cart.quantity).toBe(0);
  });

  it('clear', () => {
    const cart = new Cart();
    cart.add('59LXo');
    cart.clear();
    expect(cart.items).toEqual([]);
    expect(cart.quantity).toBe(0);
  });
});
