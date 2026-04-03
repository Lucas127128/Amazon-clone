import { parse } from 'valibot';

import { PriceCentsSchema } from '../schema';
export function formatCurrency(priceCents: number) {
  return (Math.round(parse(PriceCentsSchema, priceCents)) / 100).toFixed(
    2,
  );
}
