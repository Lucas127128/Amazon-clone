import { comptime } from 'comptime';
import Emittery from 'emittery';
import { CART_CONFIG } from 'shared/constants';
import {
  type DeliveryOptionId,
  DeliveryOptionIdSchema,
} from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import { parse } from 'valibot';

import {
  addToCart,
  cartStore,
  getMatchingCart,
  removeFromCart,
} from '#data/cart.ts';

export const uiUpdateEmitter = new Emittery<{
  updateQuantity: { productId: string };
  saveQuantity: { productId: string };
  checkInvalidQuantity: { cartItemContainer: HTMLElement };
  removeFromCart: { productId: string };
  changeDeliveryOption: {
    productId: string;
    deliveryOptionId: DeliveryOptionId;
  };
}>();

uiUpdateEmitter.on('updateQuantity', ({ data }) => {
  const deleteQuantity = document.querySelector(
    `span.delete-quantity-link-${data.productId}`,
  );
  checkNullish(deleteQuantity, 'Fail to select HTML element');
  deleteQuantity.style.display = 'none';

  const quantityInputHTML = document.querySelector(
    `input.quantity-input-${data.productId}`,
  );
  const saveQuantityHTML = document.querySelector(
    `span.save-quantity-link-${data.productId}`,
  );
  checkNullish(saveQuantityHTML, 'Fail to select HTML element');
  checkNullish(quantityInputHTML, 'Fail to select HTML element');
  quantityInputHTML.style.display = 'inline';
  saveQuantityHTML.style.display = 'inline';
});

uiUpdateEmitter.on('saveQuantity', ({ data }) => {
  const quantityInput = document.querySelector(
    `input.quantity-input-${data.productId}`,
  );
  checkNullish(quantityInput);
  const cart = getMatchingCart(cartStore(), data.productId);
  checkNullish(cart, 'Fail to get matching cart');
  addToCart(
    {
      ...cart,
      quantity: Number(quantityInput.value),
    },
    false,
  );
});

uiUpdateEmitter.on('checkInvalidQuantity', ({ data }) => {
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
});

uiUpdateEmitter.on('removeFromCart', ({ data }) =>
  removeFromCart(data.productId),
);

uiUpdateEmitter.on('changeDeliveryOption', ({ data }) => {
  const cart = getMatchingCart(cartStore(), data.productId);
  checkNullish(cart, 'The product id is not valid.');
  addToCart(
    {
      ...cart,
      deliveryOptionId: parse(DeliveryOptionIdSchema, data.deliveryOptionId),
    },
    false,
  );
});
