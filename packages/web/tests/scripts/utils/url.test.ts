import { describe, expect, it } from 'vitest';

import { getURLParams } from '#utils/url.ts';

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
  it('returns null for missing params', () => {
    const url = new URL('https://example.com');
    const { q, orderId, productId } = getURLParams(url);
    expect(q).toBeNull();
    expect(orderId).toBeNull();
    expect(productId).toBeNull();
  });
  it('returns null for missing params with default values', () => {
    const { q, orderId, productId } = getURLParams();
    expect(q).toBeNull();
    expect(orderId).toBeNull();
    expect(productId).toBeNull();
  });
});
