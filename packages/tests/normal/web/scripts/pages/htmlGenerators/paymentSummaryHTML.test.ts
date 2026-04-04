import { describe, expect, test } from 'bun:test';
import type { Prices } from 'shared/payment';
import { calculatePrices } from 'shared/payment';
import type { Cart } from 'shared/schema';
import { generatePaymentSummary } from 'web/paymentSummaryHTML';

import products from '../../../../products.json';

describe.concurrent('test suite: generatePaymentSummary', () => {
  test('generate correct HTML', async () => {
    const cart = (await Bun.file('./normal/cart.json').json()) as Cart[];
    const price: Prices = calculatePrices(cart, products);
    const html = generatePaymentSummary(price)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./normal/paymentSummaryHTML.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});
