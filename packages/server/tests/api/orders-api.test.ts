import { app } from 'shared/edenTreaty';
import type { Cart } from 'shared/schema';
import { cartJson as cart, orderJson as correctOrder } from 'testdata';
import { describe, expect, it } from 'vitest';

describe.concurrent('order api test', async () => {
  const { data: order, error } = await app.api.orders.post(cart as Cart[]);
  if (error) throw error;

  it('Return right totalCostCents', () => {
    expect(order.totalCostCents).toBe(correctOrder.totalCostCents);
  });
  it('Return right products', () => {
    expect(order.products).toEqual(correctOrder.products);
  });

  it('returns 422 if productId not found', async () => {
    const result = await app.api.orders.post([
      { productId: 'abcde', quantity: 3, deliveryOptionId: '1' },
    ]);
    expect(result.error?.status).toBe(422);
    if (result.error?.status === 422)
      // eslint-disable-next-line
      expect(result.error.value.value.message).toBe(
        'productId is not found',
      );
  });

  it('returns 400 if productId structurally invalid', async () => {
    const result = await app.api.orders.post([
      { productId: 'a', quantity: 3, deliveryOptionId: '1' },
    ]);
    // return 400 because the productId length is not 5 and body cannot be parsed
    expect(result.error?.status).toBe(400);
  });

  it('returns 400 if body length is 0', async () => {
    const result = await app.api.orders.post([]);
    expect(result.error?.status).toBe(400);
  });
});
