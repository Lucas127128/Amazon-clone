import { app } from 'api-client';
import { comptime } from 'comptime';
import { Console } from 'effect';
import * as Effect from 'effect/Effect';
import { STORAGE_KEYS } from 'shared/constants';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import { type Cart, OrdersSchema } from 'shared/schema';
import {
  EdenTreatyValidationError,
  JsonParseError,
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
  products: Promise<readonly Product[]> | readonly Product[];
}) {
  const products = await params.products;
  const { data: prices, error } = calculatePrices(params.cart, products);
  if (error) throw new Error(error.message);

  const paymentSummary = document.querySelector('.payment-summary-body');
  const paymentSummaryHTML = generatePaymentSummary(prices);
  checkNullish(paymentSummary, 'Fail to select HTML element');
  if (!window.trustedTypes) {
    paymentSummary.innerHTML = paymentSummaryHTML;
  } else {
    paymentSummary.innerHTML = sanitizer?.createHTML(
      paymentSummaryHTML,
    ) as unknown as string;
  }
}

export function handlePlaceOrder() {
  const placeOrderButton = document.querySelector(
    'button.place-order-button',
  );
  checkNullish(placeOrderButton, 'Fail to select HTML element');
  placeOrderButton.addEventListener('click', async () => {
    placeOrderButton.setAttribute('disable', 'true');
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
          const dialog = document.querySelector(
            'dialog.general-error-dialog',
          );
          dialog?.showModal();
          Console.error(error);
        },
        onSuccess: () => {
          location.href = '/orders.html';
        },
      }),
    );
  });
}
