import { Elysia } from 'elysia';
import { evlog } from 'evlog/elysia';
import {
  CartSchemaArray,
  ElysiaValidationErrorSchema,
  OrderSchema,
} from 'shared/schema';
import { minLength, pipe } from 'valibot';

import { Service } from './service';

export const orderPlugin = new Elysia({ prefix: '/api' })
  .use(evlog())
  .use(Service)
  .post(
    '/orders',
    ({ body, request, server, log, Order }) => {
      const clientIP = server?.requestIP(request)?.address;
      log.set({ clientIp: clientIP });
      return Order.createOrder(body);
    },
    {
      response: { 200: OrderSchema, 422: ElysiaValidationErrorSchema },
      body: pipe(CartSchemaArray, minLength(1)),
      detail: {
        description:
          'generate order from a cart(No actual database involved, only for demo)',
      },
    },
  );
console.log('Orders api service starts');
