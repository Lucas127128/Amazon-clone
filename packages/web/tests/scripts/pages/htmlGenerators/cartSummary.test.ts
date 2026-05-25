import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import { cartJson as cart, productsJson as products } from 'testdata';
import { describe, it } from 'vitest';

import {
  deliveryOptionsHTML,
  generateCartSummary,
} from '#pages/htmlGenerators/cartSummaryHTML.ts';

const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

describe.concurrent('deliveryOptionsHTML', () => {
  it('generate correct html', ({ expect }) => {
    const html = deliveryOptionsHTML('1');
    expect(html).toMatchSnapshot();
  });
});

describe.concurrent('generateCartSummary', () => {
  it('generate correct html', ({ expect }) => {
    const html = generateCartSummary(
      getMatchingProduct(products as Product[], '59LXo')!,
      getMatchingCart(cart as Cart[], '59LXo')!,
    );
    expect(html).toMatchSnapshot();
  });
});
