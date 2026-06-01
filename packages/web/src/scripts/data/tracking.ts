import { pipe } from 'effect';
import { getDeliveryDateISO } from 'shared/deliveryOption';
import type { Cart, Order } from 'shared/schema';
import { Temporal } from 'temporal-polyfill-lite';

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
