import { describe, expect, it } from 'vitest';
import { getURLParams } from 'web/url';

describe.concurrent('getURLParams', () => {
  it('get correct params', () => {
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
