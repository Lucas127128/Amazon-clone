import { calculatePrices, Prices } from '#root/src/data/payment.ts';
import { describe, expect, test } from 'bun:test';
import products from '../../../products.json';
import { Cart } from '#data/cart.ts';
import { generatePaymentSummary } from '#root/src/scripts/htmlGenerators/paymentSummaryHTML.ts';

describe.concurrent('test suite: generatePaymentSummary', () => {
  test('generate correct HTML', async () => {
    const cart = <Cart[]>(
      (await import('../../../cart.json', { with: { type: 'json' } }))
        .default
    );
    const price: Prices = calculatePrices(cart, products);
    const html = generatePaymentSummary(price)
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    const correctHTML = (
      await Bun.file('./tests/paymentSummaryHTML.html').text()
    )
      .replaceAll('\n', '')
      .replaceAll(' ', '');
    expect(html).toBe(correctHTML);
  });
});
