import 'typed-query-selector';

import { effect } from 'alien-signals';
import { CART_CONFIG } from 'shared/constants';
import { getMatchingProduct, type Product } from 'shared/products';
import { type Cart, DeliveryOptionIdSchema } from 'shared/schema';
import {
  checkNullish,
  isHTMLElement,
  isHTMLInputElement,
} from 'shared/typeChecker';
import { parse } from 'valibot';

import {
  addToCart,
  cartQuantity,
  cartStore,
  getMatchingCart,
  removeFromCart,
} from '../../data/cart.ts';
import { sanitizer } from '../../utils/trustedTypes.ts';
import { generateCartSummary } from '../htmlGenerators/cartSummaryHTML.ts';

const orderSummary = document.querySelector('div.order-summary');

export async function renderOrderSummary(params: {
  cart: Cart[];
  products: Promise<readonly Product[]> | readonly Product[];
}) {
  const products = await params.products;
  checkNullish(orderSummary, 'Fail to select HTML element');
  orderSummary.innerHTML = window.trustedTypes
    ?.emptyHTML as unknown as string;
  let cartsSummaryHTML = '';
  for (const cartItem of params.cart) {
    const matchingProduct = getMatchingProduct(
      products,
      cartItem.productId,
    );
    checkNullish(matchingProduct);
    const cartSummaryHTML = generateCartSummary(matchingProduct, cartItem);
    cartsSummaryHTML += cartSummaryHTML;
  }
  const trustedHTML = sanitizer?.createHTML(cartsSummaryHTML);
  orderSummary.insertAdjacentHTML(
    'beforeend',
    trustedHTML as unknown as string,
  );
}

const returnToHomeLink = document.querySelector('.return-to-home-link');
checkNullish(returnToHomeLink);
effect(() => {
  returnToHomeLink.textContent = `${cartQuantity()} items`;
});

function handleUpdateQuantity(target: HTMLElement, productId: string) {
  const deleteQuantity = target.parentElement?.querySelector(
    'span.delete-quantity-link',
  );
  checkNullish(deleteQuantity, 'Fail to select HTML element');
  deleteQuantity.style.display = 'none';

  const quantityInputHTML = target.parentElement?.querySelector(
    `input.quantity-input-${productId}`,
  );
  const saveQuantityHTML = target.parentElement?.querySelector(
    `span.save-quantity-link-${productId}`,
  );
  checkNullish(saveQuantityHTML, 'Fail to select HTML element');
  checkNullish(quantityInputHTML, 'Fail to select HTML element');
  quantityInputHTML.style.display = 'inline';
  saveQuantityHTML.style.display = 'inline';
}

function handleSaveQuantity(
  cartItemContainer: HTMLElement,
  productId: string,
) {
  const quantityInput = cartItemContainer.querySelector(
    'input.quantity-input',
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
}

function handleCheckInvalidQuantity(cartItemContainer: HTMLElement) {
  const quantityInput = cartItemContainer.querySelector(
    'input.quantity-input',
  );
  checkNullish(quantityInput);
  const quantity = Number(quantityInput.value);
  const invalidQuantityWarning = cartItemContainer.querySelector(
    'span.invalid-quantity-warning',
  );
  checkNullish(invalidQuantityWarning, 'Fail to select HTML element');
  if (quantity > CART_CONFIG.MAX_QUANTITY_PER_ITEM) {
    quantityInput.classList.add('quantity-input-warning');
    invalidQuantityWarning.textContent = `Expected quantity to be <=${CART_CONFIG.MAX_QUANTITY_PER_ITEM}`;
  } else {
    quantityInput.classList.remove('quantity-input-warning');
    invalidQuantityWarning.textContent = '';
  }
}

function handleOrderEvent(element: HTMLElement) {
  const cartItemContainer = element.closest('div.cart-item-container');
  checkNullish(cartItemContainer);
  const { productId } = cartItemContainer.dataset;
  checkNullish(productId, 'Fail to get productId from dataset');
  return {
    classList: Array.from(element.classList),
    productId,
    cartItemContainer,
  };
}

orderSummary?.addEventListener('click', (event) => {
  const { target } = event;
  isHTMLElement(target, 'target');
  const { classList, productId, cartItemContainer } =
    handleOrderEvent(target);

  if (classList.includes('update-quantity-link')) {
    handleUpdateQuantity(target, productId);
  } else if (classList.includes('save-quantity-link')) {
    handleSaveQuantity(cartItemContainer, productId);
  } else if (classList.includes('delete-quantity-link')) {
    removeFromCart(productId);
  }
});

orderSummary?.addEventListener('keyup', (event: KeyboardEvent) => {
  const { target } = event;
  isHTMLElement(target, 'target');
  const { classList, productId, cartItemContainer } =
    handleOrderEvent(target);
  if (classList.includes('quantity-input')) {
    if (event.key === 'Enter') {
      handleSaveQuantity(cartItemContainer, productId);
    } else {
      handleCheckInvalidQuantity(cartItemContainer);
    }
  }
});

orderSummary?.addEventListener('change', (event) => {
  const { target } = event;
  isHTMLElement(target, 'target');
  const { classList, productId } = handleOrderEvent(target);
  isHTMLInputElement(target);
  if (!classList.includes('delivery-option-input')) return;
  const { deliveryChoiceId } = target.dataset;
  const cart = getMatchingCart(cartStore(), productId);
  checkNullish(cart, 'The product id is not valid.');
  addToCart(
    {
      ...cart,
      deliveryOptionId: parse(DeliveryOptionIdSchema, deliveryChoiceId),
    },
    false,
  );
});
