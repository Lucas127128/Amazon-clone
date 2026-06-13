import { Effect } from 'effect';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import { cartJson as cart, productsJson as products } from 'testdata';
import { describe, it } from 'vitest';

import { generatePaymentSummary } from '#pages/htmlGenerators/paymentSummaryHTML.ts';

describe.concurrent('generatePaymentSummary', () => {
  it('generate correct HTML', ({ expect }) => {
    const price = Effect.runSync(
      calculatePrices(cart as Cart[], products as Product[]),
    );
    const html = generatePaymentSummary(price);
    expect(html).toMatchSnapshot();
  });
});
