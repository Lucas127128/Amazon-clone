import '../../preload.ts';
import 'fake-indexeddb/auto';
import {
  beforeEach,
  describe,
  test,
  expect,
  afterAll,
  beforeAll,
} from 'bun:test';
import { addToCart, getCart, Cart, getMatchingCart } from '#data/cart.ts';
import { clear } from 'idb-keyval';
describe.concurrent('test suite: addToCart', () => {
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
  test.concurrent('add a new product to cart', async () => {
    localStorage.setItem('cart', JSON.stringify([]));
    addToCart(
      { productId: 'B8WQz', quantity: 4, deliveryOptionId: '1' },
      false,
    );
    const cart = getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].productId).toBe('B8WQz');
    expect(cart[0].quantity).toBe(4);
  });
  test.concurrent('add an existing product to cart', async () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([
        {
          productId: 'B8WQz',
          quantity: 4,
          deliveryOptionId: '1',
        },
      ]),
    );
    addToCart(
      { productId: 'B8WQz', quantity: 4, deliveryOptionId: '1' },
      false,
    );
    const cart = getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].productId).toBe('B8WQz');
    expect(cart[0].quantity).toBe(4);
  });
});

describe('test suite: getMatchingCart', () => {
  test.concurrent('get matching cart', () => {
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
    const matchingCart = getMatchingCart(cart, 'ISs-Z');
    const correctCart = {
      productId: 'ISs-Z',
      quantity: 1,
      deliveryOptionId: '2',
    } as const;
    expect(matchingCart).toEqual(correctCart);
  });
});
