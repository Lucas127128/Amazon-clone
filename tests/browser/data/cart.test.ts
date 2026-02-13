import { beforeEach, describe, test } from 'vitest';
import { addToCart, getCart } from '../../../src/data/cart.ts';
describe.concurrent('test suite: addToCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test('add a new product to cart', async ({ expect }) => {
    localStorage.setItem('cart', JSON.stringify([]));
    addToCart(false, 'B8WQz', 4);
    const cart = getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].productId).toBe('B8WQz');
    expect(cart[0].quantity).toBe(4);
    localStorage.setItem('cart', JSON.stringify([]));
  });
  test('add an existing product to cart', async ({ expect }) => {
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
    addToCart(false, 'B8WQz', 4);
    const cart = getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].productId).toBe('B8WQz');
    expect(cart[0].quantity).toBe(4);
    localStorage.setItem('cart', JSON.stringify([]));
  });
});
