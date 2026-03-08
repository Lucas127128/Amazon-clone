import 'fake-indexeddb/auto';
import { describe, test, expect } from 'bun:test';
import {
  addToCart,
  getCart,
  getMatchingCart,
  removeFromCart,
  updateDeliveryOption,
  calculateCartQuantity,
} from '#root/shared/src/data/cart.ts';
import { checkTruthy } from '#root/shared/src/utils/typeChecker.ts';
import { STORAGE_KEYS } from '#root/shared/src/constants.ts';
import { Cart } from '#root/shared/src/schema.ts';

const cart: Cart[] = [
  {
    productId: 'sMmsZ',
    quantity: 2,
    deliveryOptionId: '1',
  },
  {
    productId: 'ISs-Z',
    quantity: 1,
    deliveryOptionId: '2',
  },
];

describe.concurrent('test suite: addToCart', () => {
  test('add a new product to cart', async () => {
    addToCart(cart[0], false);
    const savedCart = getCart();
    expect(savedCart.length).toBe(1);
    expect(savedCart[0]).toEqual(cart[0]);
  });
  test('add an existing product to cart', async () => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([cart[0]]));
    addToCart(cart[0], true);
    const savedCart = getCart();
    expect(savedCart.length).toBe(1);
    expect(savedCart[0].productId).toBe('sMmsZ');
    expect(savedCart[0].quantity).toBe(4);
  });
});

describe.concurrent('test suite: getMatchingCart', () => {
  test('get matching cart', () => {
    const matchingCart = getMatchingCart(cart, 'ISs-Z');
    expect(matchingCart).toEqual(cart[1]);
  });
});

describe.concurrent('test suite: removeFromCart', () => {
  test('remove cartItem', () => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    removeFromCart('ISs-Z');
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    checkTruthy(savedCart, 'Fail to get cart from localStorage');
    expect(JSON.parse(savedCart)[0]).toEqual(cart[0]);
  });
});

describe.concurrent('test suite: updateDeliveryOption', () => {
  test('update delivery option', () => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    updateDeliveryOption('sMmsZ', '3');
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    checkTruthy(savedCart, 'Fail to get cart from localStorage');
    const deliveryOptionId = getMatchingCart(
      JSON.parse(savedCart),
      'sMmsZ',
    )?.deliveryOptionId;
    expect(deliveryOptionId).toBe('3');
  });
});

describe.concurrent('test suite: calculateCartQuantity', () => {
  test('display cart quantity', () => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    calculateCartQuantity();
    const cartQuantity = calculateCartQuantity();
    expect(cartQuantity).toBe(3);
  });
});
