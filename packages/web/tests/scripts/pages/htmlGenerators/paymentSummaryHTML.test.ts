import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import {
  cartJson as cart,
  paymentSummaryHTML,
  productsJson as products,
} from 'testdata';
import { describe, expect, it } from 'vitest';

import { generatePaymentSummary } from '#pages/htmlGenerators/paymentSummaryHTML.ts';

describe.concurrent('generatePaymentSummary', () => {
  it('generate correct HTML', () => {
    const { data: price, error } = calculatePrices(
      cart as Cart[],
      products as Product[],
    );
    if (error) throw new Error(error.message);
    const html = generatePaymentSummary(price)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      paymentSummaryHTML.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});
