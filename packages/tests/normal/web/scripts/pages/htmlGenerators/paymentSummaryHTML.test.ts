import type { Prices } from 'shared/payment';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import type { Cart } from 'shared/schema';
import { describe, expect, test } from 'vitest';
import { generatePaymentSummary } from 'web/paymentSummaryHTML';

import cart from '#testData/cart.json' with { type: 'json' };
import paymentSummaryHTML from '#testData/paymentSummaryHTML.html?raw' with { type: 'text' };
import products from '#testData/products.json' with { type: 'json' };

describe.concurrent('test suite: generatePaymentSummary', () => {
  test('generate correct HTML', () => {
    const price: Prices = calculatePrices(
      cart as Cart[],
      products as Product[],
    );
    const html = generatePaymentSummary(price)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(
      paymentSummaryHTML.replaceAll('\n', '').replaceAll(' ', ''),
    );
  });
});
