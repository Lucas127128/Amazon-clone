import { pipe } from 'fp-ts/function';
import { Temporal } from 'temporal-polyfill-lite';

import type { Cart } from '../schema';
import type { Order } from '../schema';
import { getDeliveryDateISO } from './deliveryOption';

export function getDeliveryProgress(order: Order, matchingCart: Cart) {
  const orderTime = Temporal.Instant.from(
    order.orderTime,
  ).toZonedDateTimeISO(Temporal.Now.timeZoneId());
  const deliveryProgress = Temporal.Now.zonedDateTimeISO()
    .since(orderTime)
    .total({ unit: 'hours' });

  return pipe(
    getDeliveryDateISO(matchingCart.deliveryOptionId),
    (deliveryDate) =>
      deliveryDate.since(orderTime).total({ unit: 'hours' }),
    (deliveryDuration) => (deliveryProgress / deliveryDuration) * 100 + 5,
  );
}
