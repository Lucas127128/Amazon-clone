import { getURLParams } from '#root/shared/src/utils/url.ts';
import { describe, expect, test } from 'bun:test';

describe.concurrent('getURLParams', () => {
  test('get correct params', () => {
    const url = new URL('https://example.com');
    url.searchParams.set('q', 'water');
    url.searchParams.set('orderId', 'ab12345');
    url.searchParams.set('productId', 'ab123');
    const { q, orderId, productId } = getURLParams(url);
    expect(q).toBe('water');
    expect(orderId).toBe('ab12345');
    expect(productId).toBe('ab123');
  });
});
