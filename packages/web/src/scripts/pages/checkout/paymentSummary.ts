import { app } from 'api-client';
import { comptime } from 'comptime';
import { Console } from 'effect';
import * as Effect from 'effect/Effect';
import { STORAGE_KEYS } from 'shared/constants';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import { type Cart, OrdersSchema } from 'shared/schema';
import {
  CreateTrustedHTMLError,
  EdenTreatyValidationError,
  HTMLSelectionError,
  JsonParseError,
  PriceCalculationError,
  UnexpectedNetworkError,
  ValidationError,
} from 'shared/taggedError';
import { checkNullish } from 'shared/typeChecker';
import { safeParse } from 'valibot';

import { cartStore } from '#data/cart.ts';

import { sanitizer } from '../../utils/trustedTypes.ts';
import { generatePaymentSummary } from '../htmlGenerators/paymentSummaryHTML.ts';

export async function renderPaymentSummary(params: {
  cart: Cart[];
  products: readonly Product[];
}) {
  const render = Effect.gen(function* () {
    const { data: prices, error } = calculatePrices(
      params.cart,
      params.products,
    );
    if (error)
      return yield* Effect.fail(new PriceCalculationError(error.productId));

    const paymentSummary = document.querySelector('.payment-summary-body');
    const paymentSummaryHTML = generatePaymentSummary(prices);
    if (!paymentSummary)
      return yield* Effect.fail(
        new HTMLSelectionError('.payment-summary-body'),
      );
    if (!window.trustedTypes) {
      paymentSummary.innerHTML = paymentSummaryHTML;
    } else {
      const cleanHTML = yield* Effect.try({
        try: () => sanitizer?.createHTML(paymentSummaryHTML),
        catch: () => new CreateTrustedHTMLError(),
      });
      paymentSummary.innerHTML = cleanHTML as unknown as string;
    }
    return yield* Effect.succeed(undefined);
  });
  await Effect.runPromise(
    Effect.match(render, {
      onFailure: (error) => {
        Console.error(error);
        const dialog = document.querySelector('dialog.general-error-dialog');
        dialog?.showModal();
      },
      onSuccess: () => {},
    }),
  );
}

export function handlePlaceOrder() {
  const placeOrderButton = document.querySelector(
    'button.place-order-button',
  );
  checkNullish(placeOrderButton, 'Fail to select HTML element');
  placeOrderButton.addEventListener('click', async () => {
    placeOrderButton.setAttribute('disable', 'true');
    placeOrderButton.textContent = 'Ordering...';
    const result = Effect.gen(function* () {
      const { data, error } = yield* Effect.tryPromise({
        try: async () => await app.api.orders.post(cartStore()),
        catch: () => new UnexpectedNetworkError(),
      });

      const response = yield* error
        ? Effect.fail(new EdenTreatyValidationError(error.value.value))
        : Effect.succeed(data);

      const savedOrders = localStorage.getItem(
        comptime(() => STORAGE_KEYS.ORDER),
      );
      const orders = yield* Effect.try({
        try: () => JSON.parse(savedOrders ?? '[]'),
        catch: () =>
          new JsonParseError('Failed to parse orders from localStorage'),
      });
      const validatedOrders = safeParse(OrdersSchema, orders);
      if (validatedOrders.success) {
        validatedOrders.output.unshift(response);
        localStorage.setItem(
          comptime(() => STORAGE_KEYS.ORDER),
          JSON.stringify(validatedOrders.output),
        );
        localStorage.removeItem(comptime(() => STORAGE_KEYS.CART_STATE));
      } else {
        yield* Effect.fail(
          new ValidationError({
            ...validatedOrders.issues[0],
            message: 'Failed to parse orders from localStorage',
          }),
        );
      }
    });

    await Effect.runPromise(
      Effect.match(result, {
        onFailure: (error) => {
          Console.error(error);
          placeOrderButton.textContent =
            'Order failed - please try again later';
          placeOrderButton.style.color = '#f44336';
          const dialog = document.querySelector(
            'dialog.general-error-dialog',
          );
          dialog?.showModal();
        },
        onSuccess: () => {
          location.href = '/orders.html';
        },
      }),
    );
  });
}
