import { describe, test, expect, beforeEach } from 'bun:test';
import {
  addToCart,
  cart,
  getMatchingCart,
  removeFromCart,
  updateDeliveryOption,
  cartQuantity,
} from '#root/shared/src/data/cart.ts';
import cartJson from '../../cart.json';
import type { Cart } from '#root/shared/src/schema.ts';

beforeEach(() => {
  cart.value = [cartJson[0], cartJson[1], cartJson[2]] as Cart[];
});

describe.concurrent('test suite: addToCart', () => {
  test('add a new product to cart', async () => {
    addToCart(cartJson[3] as Cart);
    expect(cart.value.length).toBe(4);
  });
  test('incrementally add an existing product to cart', async () => {
    addToCart({ ...cart.value[2], quantity: 1 }, true);
    expect(cart.value.length).toBe(3);
    expect(cart.value[2].productId).toBe('acmQY');
    expect(cart.value[2].quantity).toBe(6);
    expect(cart.value[2].deliveryOptionId).toBe('1');
  });
});

describe.concurrent('test suite: getMatchingCart', () => {
  test('get matching cart', () => {
    const matchingCart = getMatchingCart(cart.value, '59LXo');
    expect(matchingCart).toEqual(cart.value[0]);
  });
});

describe.concurrent('test suite: removeFromCart', () => {
  test('remove cartItem', () => {
    removeFromCart('59LXo');
    expect(cart.value[0]).toEqual(cartJson[1] as Cart);
  });
});

describe.concurrent('test suite: updateDeliveryOption', () => {
  test('update delivery option', () => {
    updateDeliveryOption('59LXo', '3');
    const deliveryOptionId = getMatchingCart(
      cart.value,
      '59LXo',
    )?.deliveryOptionId;
    expect(deliveryOptionId).toBe('3');
  });
});

describe.concurrent('test suite: calculateCartQuantity', () => {
  test('display cart quantity', async () => {
    const cartJson = (await Bun.file(
      './tests/normal/cart.json',
    ).json()) as Cart[];
    cart.value = [cartJson[0], cartJson[1], cartJson[2]] as Cart[];
    expect(cartQuantity.value).toBe(7);
  });
});
