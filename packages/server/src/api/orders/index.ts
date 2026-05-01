import { Elysia } from 'elysia';
import { evlog } from 'evlog/elysia';
import {
  CartSchemaArray,
  ElysiaValidationErrorSchema,
  OrderSchema,
} from 'shared/schema';
import { minLength, pipe } from 'valibot';

import { OrderService } from './service';

export const orderPlugin = new Elysia({ prefix: '/api' })
  .use(evlog())
  .onBeforeHandle(({ request, server, log }) => {
    const clientIP = server?.requestIP(request)?.address;
    log.set({ clientIp: clientIP });
  })
  .post('/orders', ({ body }) => OrderService.createOrder(body), {
    response: { 200: OrderSchema, 422: ElysiaValidationErrorSchema },
    body: pipe(CartSchemaArray, minLength(1)),
    detail: {
      description:
        'generate order from a cart(No actual database involved, only for demo)',
    },
  });
console.log('Orders api service starts');
