import { comptime } from 'comptime';
import { Console } from 'effect';
import * as Effect from 'effect/Effect';
import { STORAGE_KEYS } from 'shared/constants';
import { OrdersSchema } from 'shared/schema';
import {
  CreateTrustedHTMLError,
  EdenTreatyValidationError,
  HTMLSelectionError,
  JsonParseError,
  LocalStorageError,
  MatchingCartError,
  MatchingOrderError,
  ProductApiNotFoundError,
  UnexpectedNetworkError,
  URLParamsError,
  ValidationError,
} from 'shared/taggedError';
import { safeParse } from 'valibot';

import { fetchMatchingProduct } from '#data/products.ts';

import { getMatchingCart } from '../data/cart.ts';
import { getMatchingOrder } from '../data/orders.ts';
import { sanitizer } from '../utils/trustedTypes.ts';
import { getURLParams } from '../utils/url.ts';
import { handleSearchInput } from './header';
import { generateTrackingHTML } from './htmlGenerators/trackingHTML';

const renderTrackingSummary = Effect.gen(function* () {
  const { orderId, productId } = getURLParams();
  if (orderId === null)
    return yield* Effect.fail(new URLParamsError('orderId', 'missing'));
  if (productId === null)
    return yield* Effect.fail(new URLParamsError('productId', 'missing'));

  const { data: product, error: productError } = yield* Effect.tryPromise({
    try: async () => await fetchMatchingProduct(productId),
    catch: () => new UnexpectedNetworkError(),
  });
  if (productError) {
    if (productError.status === 422)
      return yield* Effect.fail(
        new EdenTreatyValidationError(productError.value),
      );
    else
      return yield* Effect.fail(
        new ProductApiNotFoundError(productError.value.message),
      );
  }
  const savedOrders = localStorage.getItem(
    comptime(() => STORAGE_KEYS.ORDER),
  );
  if (savedOrders === null)
    return yield* Effect.fail(
      new LocalStorageError(
        comptime(() => STORAGE_KEYS.ORDER),
        'missing',
      ),
    );

  const orders = yield* Effect.try({
    try: () => JSON.parse(savedOrders),
    catch: () =>
      new JsonParseError('cannot parse orders from local storage'),
  });
  const parsedOrders = safeParse(OrdersSchema, orders);
  if (!parsedOrders.success)
    return yield* Effect.fail(
      new ValidationError({
        ...parsedOrders.issues[0],
      }),
    );

  const matchingOrder = getMatchingOrder(parsedOrders.output, orderId);
  if (!matchingOrder)
    return yield* Effect.fail(new MatchingOrderError(orderId));

  const cart = matchingOrder.products;
  const matchingCart = getMatchingCart(cart, productId);
  if (!matchingCart)
    return yield* Effect.fail(new MatchingCartError(productId));

  const trackingHTML = yield* generateTrackingHTML(
    product,
    matchingOrder,
    matchingCart,
  );

  const trustedHTML = sanitizer?.createHTML(trackingHTML);
  if (!trustedHTML) return yield* Effect.fail(new CreateTrustedHTMLError());
  const backToOrderLink = document.querySelector('.back-to-orders-link');
  if (!backToOrderLink)
    return yield* Effect.fail(
      new HTMLSelectionError('.back-to-orders-link'),
    );
  backToOrderLink.insertAdjacentHTML(
    'afterend',
    trustedHTML as unknown as string,
  );
  return yield* Effect.succeed('Render completed');
});

await Effect.runPromise(
  Effect.match(renderTrackingSummary, {
    onSuccess: () => {},
    onFailure: (error) => {
      const dialog = document.querySelector('dialog.general-error-dialog');
      dialog?.showModal();
      Console.error(error);
    },
  }),
);
handleSearchInput();
