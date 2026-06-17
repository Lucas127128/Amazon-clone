import { createEventEmitter } from 'better-event';
import { comptime } from 'comptime';
import { CART_CONFIG } from 'shared/constants';
import { DeliveryOptionIdSchema } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import {
  addToCart,
  cartStore,
  getMatchingCart,
  removeFromCart,
} from '#data/cart.ts';

export const uiUpdateEmitter = createEventEmitter({
  on: {
    updateQuantity: {
      // oxlint-disable-next-line
      handler: (productId: string) => {
        const deleteQuantity = document.querySelector(
          `span.delete-quantity-link-${productId}`,
        );
        checkNullish(deleteQuantity, 'Fail to select HTML element');
        deleteQuantity.style.display = 'none';

        const quantityInputHTML = document.querySelector(
          `input.quantity-input-${productId}`,
        );
        const saveQuantityHTML = document.querySelector(
          `span.save-quantity-link-${productId}`,
        );
        checkNullish(saveQuantityHTML, 'Fail to select HTML element');
        checkNullish(quantityInputHTML, 'Fail to select HTML element');
        quantityInputHTML.style.display = 'inline';
        saveQuantityHTML.style.display = 'inline';
      },
    },
    updateQuantityUI: (productId: string) => {
      const deleteQuantity = document.querySelector(
        `span.delete-quantity-link-${productId}`,
      );
      checkNullish(deleteQuantity, 'Fail to select HTML element');
      deleteQuantity.style.display = 'none';

      const quantityInputHTML = document.querySelector(
        `input.quantity-input-${productId}`,
      );
      const saveQuantityHTML = document.querySelector(
        `span.save-quantity-link-${productId}`,
      );
      checkNullish(saveQuantityHTML, 'Fail to select HTML element');
      checkNullish(quantityInputHTML, 'Fail to select HTML element');
      quantityInputHTML.style.display = 'inline';
      saveQuantityHTML.style.display = 'inline';
    },
    saveQuantity: {
      // oxlint-disable-next-line
      handler: async (productId: string) => {
        const quantityInput = document.querySelector(
          `input.quantity-input-${productId}`,
        );
        checkNullish(quantityInput);
        const cart = getMatchingCart(cartStore(), productId);
        checkNullish(cart, 'Fail to get matching cart');
        addToCart(
          {
            ...cart,
            quantity: Number(quantityInput.value),
          },
          false,
        );
      },
    },
    checkInvalidQuantity: {
      // oxlint-disable-next-line
      handler: async (data: { cartItemContainer: HTMLElement }) => {
        const quantityInput = data.cartItemContainer.querySelector(
          'input.quantity-input',
        );
        checkNullish(quantityInput);
        const quantity = Number(quantityInput.value);
        const invalidQuantityWarning = data.cartItemContainer.querySelector(
          'span.invalid-quantity-warning',
        );
        checkNullish(invalidQuantityWarning, 'Fail to select HTML element');
        if (quantity > comptime(() => CART_CONFIG.MAX_QUANTITY_PER_ITEM)) {
          quantityInput.classList.add('quantity-input-warning');
          invalidQuantityWarning.textContent = `Expected quantity to be <=${comptime(() => CART_CONFIG.MAX_QUANTITY_PER_ITEM)}`;
        } else {
          quantityInput.classList.remove('quantity-input-warning');
          invalidQuantityWarning.textContent = '';
        }
      },
    },
    removeFromCart: {
      // oxlint-disable-next-line
      handler: async (productId: string) => {
        removeFromCart(productId);
      },
    },
    changeDeliveryOption: {
      handler: async (data: {
        productId: string;
        deliveryOptionId: string;
        // oxlint-disable-next-line
      }) => {
        const cart = getMatchingCart(cartStore(), data.productId);
        checkNullish(cart, 'The product id is not valid.');
        addToCart(
          {
            ...cart,
            deliveryOptionId: parse(
              DeliveryOptionIdSchema,
              data.deliveryOptionId,
            ),
          },
          false,
        );
      },
    },
  },
});
