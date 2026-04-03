import { getMatchingCart } from 'shared/cart';
import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart, Order } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from 'web/ordersHTML';
import { describe, expect, test } from 'bun:test';

describe.concurrent('generateOrdersProductHTML', () => {
  test('generate correct html', async () => {
    const carts = (await Bun.file('./normal/cart.json').json()) as Cart[];
    const products = (await Bun.file(
      './normal/products.json',
    ).json()) as Product[];
    const cart = getMatchingCart(carts, '59LXo');
    const product = getMatchingProduct(products, '59LXo');
    checkNullish(product);
    checkNullish(cart);
    const html = generateOrdersProductHTML(cart, product, 'gsZyI1l')
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
    console.log(
      generateOrderContainerHTML(order, 'Wednesday', ordersProductHTML),
    );
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
