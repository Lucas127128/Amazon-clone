import { getMatchingCart } from 'shared/cart';
import { getMatchingProduct } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { describe, expect, test } from 'vitest';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from 'web/ordersHTML';

import carts from '../../../../cart.json' with { type: 'json' };
import products from '../../../../products.json' with { type: 'json' };

describe.concurrent('generateOrdersProductHTML', () => {
  test('generate correct html', async () => {
    const cart = getMatchingCart(carts as Cart[], '59LXo');
    const product = getMatchingProduct(products, '59LXo');
    const html = generateOrdersProductHTML(cart!, product!, 'gsZyI1l')
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./normal/ordersProduct.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});

describe.concurrent('generateOrderContainerHTML', () => {
  test('generate correct html', async () => {
    const ordersProductHTML = await Bun.file(
      './normal/ordersProduct.html',
    ).text();
    const order = (await Bun.file('./normal/order.json').json()) as Order;
    const html = generateOrderContainerHTML(
      order,
      'Wednesday',
      ordersProductHTML,
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./normal/orderContainer.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});
