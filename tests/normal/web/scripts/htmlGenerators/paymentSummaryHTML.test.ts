import type { Prices } from '#root/shared/src/data/payment.ts';
import { calculatePrices } from '#root/shared/src/data/payment.ts';
import { describe, expect, test } from 'bun:test';
import products from '../../../products.json';
import { generatePaymentSummary } from '#root/web/src/scripts/htmlGenerators/paymentSummaryHTML.ts';
import type { Cart } from '#root/shared/src/schema.ts';

describe.concurrent('test suite: generatePaymentSummary', () => {
  test('generate correct HTML', async () => {
    const cart = await Bun.file('./tests/normal/cart.json').json();
    const price: Prices = calculatePrices(cart as Cart[], products);
    const html = generatePaymentSummary(price)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./tests/normal/paymentSummaryHTML.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});
