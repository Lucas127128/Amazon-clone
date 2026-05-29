import { Elysia } from 'elysia';
import { log } from 'evlog';
import {
  CartsSchema,
  ElysiaValidationErrorSchema,
  OrderSchema,
} from 'shared/schema';
import { minLength, pipe } from 'valibot';

import { createProdDataProvider } from '#utils/dataProvider.ts';
import { createEvlogMiddleware } from '#utils/logger.ts';

import { createOrdersService } from './service.ts';

const OrderService = createOrdersService(await createProdDataProvider());

export const orderPlugin = new Elysia({ prefix: '/api' })
  .onStart(() => {
    log.info({ event: 'service.start', service: 'orders' });
  })
  .use(createEvlogMiddleware())
  .onBeforeHandle(({ request, server, log }) => {
    const clientIP = server?.requestIP(request)?.address;
    log.set({ clientIp: clientIP });
  })
  .post('/orders', ({ body }) => OrderService.createOrder(body), {
    response: { 200: OrderSchema, 422: ElysiaValidationErrorSchema },
    body: pipe(CartsSchema, minLength(1)),
    detail: {
      description:
        'generate order from a cart(No actual database involved, only for demo)',
    },
  });
