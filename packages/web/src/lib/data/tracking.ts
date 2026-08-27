import * as Effect from 'effect/Effect';
import { getDeliveryDateISO } from 'shared/deliveryOption';
import type { Cart, Order } from 'shared/schema';
import { UnexpectedError } from 'shared/taggedError';
import { Temporal } from 'temporal-polyfill-lite';

export function getDeliveryProgress(order: Order, matchingCart: Cart) {
  const orderTime = Temporal.Instant.from(
    order.orderTime,
  ).toZonedDateTimeISO(Temporal.Now.timeZoneId());
  const deliveryProgress = Temporal.Now.zonedDateTimeISO()
    .since(orderTime)
    .total({ unit: 'hours' });
  return Effect.try({
    try: () => getDeliveryDateISO(matchingCart.deliveryOptionId),
    // will change to real error once other code is effect based
    catch: () => new UnexpectedError(),
  }).pipe(
    Effect.andThen((deliveryDate) =>
      Effect.succeed(deliveryDate.since(orderTime).total({ unit: 'hours' })),
    ),
    Effect.andThen((deliveryDuration) =>
      Effect.succeed((deliveryProgress / deliveryDuration) * 100 + 5),
    ),
  );
}
