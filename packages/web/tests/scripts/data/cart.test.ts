import type { Cart } from 'shared/schema';
import { cartJson } from 'testdata';
import { describe, expect, it } from 'vitest';

import { getMatchingCart } from '#lib/data/cart.ts';

describe.concurrent('getMatchingCart', () => {
  it('get matching cart', () => {
    const matchingCart = getMatchingCart(cartJson as Cart[], '59LXo');
    expect(matchingCart).toEqual(cartJson[0]);
  });
});
