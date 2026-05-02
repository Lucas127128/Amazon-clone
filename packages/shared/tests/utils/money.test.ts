import { formatCurrency } from 'shared/money';
import { describe, expect, it } from 'vitest';

describe.concurrent('formatCurrency', () => {
  it('converts cents into dollars', () => {
    expect(formatCurrency(2095)).toBe('20.95');
  });

  it('works with 0', () => {
    expect(formatCurrency(0)).toBe('0.00');
  });

  it('round up to off cents', () => {
    expect(formatCurrency(2000.5)).toBe('20.01');
    expect(formatCurrency(2000.4)).toBe('20.00');
  });
});
