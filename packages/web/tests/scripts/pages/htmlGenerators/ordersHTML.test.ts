import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import {
  cartJson as carts,
  orderContainerHTML,
  orderJson as order,
  ordersProductHTML as orderProductHTML,
  productsJson as products,
} from 'testdata';
import { describe, expect, it } from 'vitest';

import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from '#pages/htmlGenerators/ordersHTML.ts';

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
