import { getMatchingCart } from '#root/shared/src/data/cart.ts';
import {
  getMatchingProduct,
  type Product,
} from '#root/shared/src/data/products.ts';
import type { Cart, Order } from '#root/shared/src/schema.ts';
import { checkNullish } from '#root/shared/src/utils/typeChecker.ts';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from '#root/web/src/scripts/htmlGenerators/ordersHTML.ts';
import { describe, expect, test } from 'bun:test';

describe.concurrent('generateOrdersProductHTML', () => {
  test('generate correct html', async () => {
    const carts = (await Bun.file(
      './tests/normal/cart.json',
    ).json()) as Cart[];
    const products = (await Bun.file(
      './tests/normal/products.json',
    ).json()) as Product[];
    const cart = getMatchingCart(carts, '59LXo');
    const product = getMatchingProduct(products, '59LXo');
    checkNullish(product);
    checkNullish(cart);
    const html = generateOrdersProductHTML(cart, product, 'gsZyI1l')
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./tests/normal/ordersProduct.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});

describe.concurrent('generateOrderContainerHTML', () => {
  test('generate correct html', async () => {
    const ordersProductHTML = await Bun.file(
      './tests/normal/ordersProduct.html',
    ).text();
    const order = (await Bun.file(
      './tests/normal/order.json',
    ).json()) as Order;
    const html = generateOrderContainerHTML(
      order,
      'Wednesday',
      ordersProductHTML,
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./tests/normal/orderContainer.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});
