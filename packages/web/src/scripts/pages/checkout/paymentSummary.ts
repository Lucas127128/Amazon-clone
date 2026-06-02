import { app } from 'api-client';
import { comptime } from 'comptime';
import * as Effect from 'effect/Effect';
import { STORAGE_KEYS } from 'shared/constants';
import { calculatePrices } from 'shared/payment';
import type { Product } from 'shared/products';
import { type Cart, OrdersSchema } from 'shared/schema';
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

export function fetchOrders(cart: Cart[]) {
  // eslint-disable-next-line
  return Effect.promise(() => app.api.orders.post(cart)).pipe(
    Effect.andThen(({ data, error }) => {
      if (error) return Effect.fail(error.value.value);
      return Effect.succeed(data);
    }),
  );
}

export function handlePlaceOrder() {
  const placeOrderButton = document.querySelector(
    'button.place-order-button',
  );
  checkNullish(placeOrderButton, 'Fail to select HTML element');
  placeOrderButton.addEventListener('click', async () => {
    placeOrderButton.disabled = true;
    const result = Effect.gen(function* () {
      const response = yield* fetchOrders(cartStore());
      const savedOrders = localStorage.getItem(
        comptime(() => STORAGE_KEYS.ORDER),
      );
      const orders = Effect.try(() => JSON.parse(savedOrders ?? '[]'));
      const parsedOrders = yield* orders;
      const validatedOrders = safeParse(OrdersSchema, parsedOrders);
      if (validatedOrders.success) {
        validatedOrders.output.unshift(response);
      } else {
        yield* Effect.fail('Failed to parse orders from localStorage');
      }
      localStorage.setItem(
        comptime(() => STORAGE_KEYS.ORDER),
        JSON.stringify(validatedOrders.output),
      );
      localStorage.removeItem(comptime(() => STORAGE_KEYS.CART_STATE));
    });

    await Effect.runPromise(
      Effect.match(result, {
        onFailure: (error) => {
          const dialog = document.querySelector(
            'dialog.general-error-dialog',
          );
          checkNullish(dialog);
          dialog.showModal();
          console.log(error);
        },
        onSuccess: () => {
          location.href = '/orders.html';
        },
      }),
    );
  });
}
