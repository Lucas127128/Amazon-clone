import {
  addToCart,
  cart,
  cartQuantity,
  getMatchingCart,
  removeFromCart,
  updateDeliveryOption,
} from 'shared/cart';
import type { Cart } from 'shared/schema';
import { beforeEach, describe, expect, test } from 'vitest';

import cartJson from '../../cart.json';

beforeEach(() => {
  cart.value = [cartJson[0], cartJson[1], cartJson[2]] as Cart[];
});

describe.concurrent('addToCart', () => {
  test('add a new product to cart', () => {
    addToCart(cartJson[3] as Cart);
    expect(cart.value.length).toBe(4);
  });
  test('incrementally add an existing product to cart', () => {
    cart.value = [cartJson[0], cartJson[1], cartJson[2]] as Cart[];
    addToCart({ ...cart.value[2], quantity: 1 }, true);
    expect(cart.value.length).toBe(3);
    expect(cart.value[2].productId).toBe('acmQY');
    expect(cart.value[2].quantity).toBe(6);
    expect(cart.value[2].deliveryOptionId).toBe('1');
  });
});

describe.concurrent('getMatchingCart', () => {
  test('get matching cart', () => {
    const matchingCart = getMatchingCart(cart.value, '59LXo');
    expect(matchingCart).toEqual(cart.value[0]);
  });
});

describe.concurrent('removeFromCart', () => {
  test('remove cartItem', () => {
    removeFromCart('59LXo');
    expect(cart.value[0]).toEqual(cartJson[1] as Cart);
  });
});

describe.concurrent('updateDeliveryOption', () => {
  test('update delivery option', () => {
    updateDeliveryOption('Hwme8', '3');
    const deliveryOptionId = getMatchingCart(
      cart.value,
      'Hwme8',
    )?.deliveryOptionId;
    expect(deliveryOptionId).toBe('3');
  });
});

describe.concurrent('calculateCartQuantity', () => {
  test('display cart quantity', async () => {
    const cartJson = (await Bun.file(
      './normal/cart.json',
    ).json()) as Cart[];
    cart.value = [cartJson[0], cartJson[1], cartJson[2]] as Cart[];
    expect(cartQuantity.value).toBe(7);
  });
});
