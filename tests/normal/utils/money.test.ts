import { test, describe, expectTypeOf, expect } from 'vitest';
import { formatCurrency } from '#root/src/scripts/Utils/Money.ts';

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

  test('converts negative cents to dollar', async () => {
    expect(formatCurrency(-2095)).toBe('-20.95');
  });

  test('not to convert string', async () => {
    expect(formatCurrency('money' as any)).toBe('NaN');
  });

  test('return string', async () => {
    expectTypeOf(formatCurrency('2095' as any)).toBeString();
  });
});
