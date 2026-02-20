import { test, describe, expect } from 'vitest';
import cartJSON from '../../cart.json';
import { getTimeString } from '../../../src/data/orders.ts';
import { fetchProducts } from '../../../src/data/products.ts';
import { Order } from '../../../src/data/orders.ts';
import { checkTruthy } from '../../../src/scripts/Utils/typeChecker.ts';
import { Temporal } from 'temporal-polyfill-lite';
import { calculatePrices } from '../../../src/data/payment.ts';
import { Cart } from '../../../src/data/cart.ts';

const cart = cartJSON as Cart[];

const order: Order = await (
  await fetch('https://localhost:8080/api/orders', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(cart),
  })
).json();

describe('order api test', () => {
  test.concurrent('order id test', () => {
    expect(typeof order.id).toBe('string');
  });

  test.concurrent('order time test', async () => {
    expect(typeof order.orderTime).toBe('string');
    const date = Temporal.Now.instant().toJSON();
    expect(await getTimeString(order.orderTime)).toBe(
      await getTimeString(date),
    );
  });

  test('order products test', () => {
    //test products length
    expect(cart.length).toBe(order.products.length);

    //test delivery time
    expect(order.products).toEqual(cart);

    let matchingProduct;
    cart.forEach((cartItem) => {
      matchingProduct = order.products.find(
        (product) => cartItem.productId === product.productId,
      );
      //test product quantity
      checkTruthy(matchingProduct);
      expect(matchingProduct.quantity).toBe(cartItem.quantity);
    });

    //test products id
    expect(typeof matchingProduct).toBe('object');
  });

  test.concurrent('order cost test', async () => {
    expect(typeof order.totalCostCents).toBe('number');

    const products = await fetchProducts();
    const { totalOrderPrice } = calculatePrices(cart, products);
    expect(order.totalCostCents).toBe(totalOrderPrice);
  });
});
