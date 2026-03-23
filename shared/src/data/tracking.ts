import { Temporal } from 'temporal-polyfill-lite';
import { Cart } from '../schema';
import { getDeliveryDateISO } from './deliveryOption';
import { Order } from '../schema';
import { pipe } from 'fp-ts/function';

export function getDeliveryProgress(order: Order, matchingCart: Cart) {
  const orderTime = Temporal.Instant.from(order.orderTime)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toPlainDate();
  const deliveryProgress = Temporal.Now.plainDateISO()
    .since(orderTime)
    .total({ unit: 'hours' });

  return pipe(
    getDeliveryDateISO(matchingCart.deliveryOptionId),
    (deliveryDate) =>
      deliveryDate.since(orderTime).total({ unit: 'hours' }),
    (deliveryDuration) => (deliveryProgress / deliveryDuration) * 100 + 5,
  );
}
