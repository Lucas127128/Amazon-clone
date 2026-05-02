import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { describe, expect, it } from 'vitest';

import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from '#pages/htmlGenerators/ordersHTML.ts';
import carts from '#testData/cart.json' with { type: 'json' };
import order from '#testData/order.json' with { type: 'json' };
import orderContainerHTML from '#testData/orderContainer.html?raw' with { type: 'text' };
import orderProductHTML from '#testData/ordersProduct.html?raw' with { type: 'text' };
import products from '#testData/products.json' with { type: 'json' };

describe.concurrent('generateOrdersProductHTML', () => {
  it('generate correct html', () => {
    const cart = carts.find((cart) => cart.productId === '59LXo') as Cart;
    const product = getMatchingProduct(products as Product[], '59LXo');
    const html = generateOrdersProductHTML(cart, product!, 'gsZyI1l')
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      orderProductHTML.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});

describe.concurrent('generateOrderContainerHTML', () => {
  it('generate correct html', () => {
    const html = generateOrderContainerHTML(
      order as Order,
      'Wednesday',
      orderProductHTML,
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      orderContainerHTML.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});
