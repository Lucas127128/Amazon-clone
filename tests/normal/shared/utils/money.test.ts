import { test, describe, expect } from 'bun:test';
import { formatCurrency } from '#root/shared/src/utils/money.ts';

describe.concurrent('test suite: FormatCurrency', () => {
  test('converts cents into dollars', async () => {
    expect(formatCurrency(2095)).toBe('20.95');
  });

  test('works with 0', async () => {
    expect(formatCurrency(0)).toBe('0.00');
  });

  test('round up to nearest cents', async () => {
    expect(formatCurrency(2000.5)).toBe('20.01');
  });

  test('round down to nearest cents', async () => {
    expect(formatCurrency(2000.4)).toBe('20.00');
  });
});
