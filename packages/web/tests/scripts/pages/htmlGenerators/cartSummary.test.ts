import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import {
  cartJson as cart,
  cartSummaryHTML,
  deliveryOptionsHTML as deliveryOptionsHTMLText,
  productsJson as products,
} from 'testdata';
import { describe, expect, it } from 'vitest';

import {
  deliveryOptionsHTML,
  generateCartSummary,
} from '#pages/htmlGenerators/cartSummaryHTML.ts';

const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

describe.concurrent('deliveryOptionsHTML', () => {
  it('generate correct html', () => {
    const html = deliveryOptionsHTML('1')
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      deliveryOptionsHTMLText.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});

describe.concurrent('generateCartSummary', () => {
  it('generate correct html', () => {
    const html = generateCartSummary(
      getMatchingProduct(products as Product[], '59LXo')!,
      getMatchingCart(cart as Cart[], '59LXo')!,
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      cartSummaryHTML.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});
