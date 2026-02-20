import { Temporal } from 'temporal-polyfill-lite';
import { Cart } from './cart';
import { getDeliveryDateISO } from './deliveryOption';
import { Order } from './orders';

export function getDeliveryProgress(
  order: Order,
  matchingCart: Cart,
): number {
  const deliveryDate = getDeliveryDateISO(matchingCart.deliveryOptionId);
  const orderTime = Temporal.Instant.from(order.orderTime)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toPlainDate();
  const today = Temporal.Now.plainDateISO();
  const deliveryDuration = deliveryDate
    .since(orderTime)
    .total({ unit: 'hours' });
  const deliveryProgress = today.since(orderTime).total({ unit: 'hours' });
  const deliveryProgressPercent =
    (deliveryProgress / deliveryDuration) * 100 + 5;
  return deliveryProgressPercent;
}
