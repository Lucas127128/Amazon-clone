import { describe, expect, test } from 'bun:test';
import { formatCurrency } from 'shared/money';

describe.concurrent('formatCurrency', () => {
  test('converts cents into dollars', () => {
    expect(formatCurrency(2095)).toBe('20.95');
  });

  test('works with 0', () => {
    expect(formatCurrency(0)).toBe('0.00');
  });

  test('round up to nearest cents', () => {
    expect(formatCurrency(2000.5)).toBe('20.01');
  });

  test('round down to nearest cents', () => {
    expect(formatCurrency(2000.4)).toBe('20.00');
  });
});
