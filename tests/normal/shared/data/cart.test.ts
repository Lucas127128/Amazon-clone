import 'fake-indexeddb/auto';
import {
  beforeEach,
  describe,
  test,
  expect,
  afterAll,
  beforeAll,
} from 'bun:test';
import {
  addToCart,
  getCart,
  Cart,
  getMatchingCart,
  removeFromCart,
  updateDeliveryOption,
  calculateCartQuantity,
} from '#root/shared/src/data/cart.ts';
import { clear } from 'idb-keyval';
import { checkTruthy } from '#root/shared/src/utils/typeChecker.ts';
import { CART_CONFIG, STORAGE_KEYS } from '#root/shared/src/constants.ts';

beforeEach(() => {
  localStorage.clear();
});
beforeAll(async () => {
  localStorage.clear();
  await clear();
});
afterAll(async () => {
  localStorage.clear();
  await clear();
});

describe.concurrent('test suite: addToCart', () => {
  const cartItem = {
    productId: 'B8WQz',
    quantity: 4,
    deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
  } as const;
  test('add a new product to cart', async () => {
    addToCart(cartItem, false);
    const cart = getCart();
    expect(cart.length).toBe(1);
    expect(cart[0]).toEqual(cartItem);
  });
  test('add an existing product to cart', async () => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([cartItem]));
    addToCart(cartItem, true);
    const cart = getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].productId).toBe('B8WQz');
    expect(cart[0].quantity).toBe(8);
  });
});

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

describe.concurrent('test suite: getMatchingCart', () => {
  test('get matching cart', () => {
    const matchingCart = getMatchingCart(cart, 'ISs-Z');
    const correctCart = {
      productId: 'ISs-Z',
      quantity: 1,
      deliveryOptionId: '2',
    } as const;
    expect(matchingCart).toEqual(correctCart);
  });
});

describe.concurrent('test suite: removeFromCart', () => {
  test('remove cartItem', () => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    removeFromCart('ISs-Z');
    const correctCart: Cart = {
      productId: 'sMmsZ',
      quantity: 2,
      deliveryOptionId: '1',
    };
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    checkTruthy(savedCart, 'Fail to get cart from localStorage');
    expect(JSON.parse(savedCart)[0]).toEqual(correctCart);
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
