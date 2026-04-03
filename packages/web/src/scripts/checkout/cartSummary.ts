import { CART_CONFIG } from 'shared/constants';
import {
  removeFromCart,
  addToCart,
  updateDeliveryOption,
  cartQuantity,
} from 'shared/cart';
import { getMatchingProduct, fetchProducts } from 'shared/products';
import { DeliveryOptionIdSchema, type Cart } from 'shared/schema';
import { effect } from '@preact/signals-core';
import { policy } from 'shared/trustedType';
import {
  checkNullish,
  isHTMLElement,
  isHTMLInputElement,
} from 'shared/typeChecker';
import { generateCartSummary } from '../htmlGenerators/cartSummaryHTML.ts';
import { parse } from 'valibot';
import 'typed-query-selector';

policy();

const orderSummary = document.querySelector('div.order-summary');

export async function renderOrderSummary(cart: Cart[]) {
  const products = await fetchProducts();
  checkNullish(orderSummary, 'Fail to select HTML element');
  orderSummary.innerHTML = '';
  let cartsSummaryHTML = '';
  for (const cartItem of cart) {
    const matchingProduct = getMatchingProduct(
      products,
      cartItem.productId,
    );
    checkNullish(matchingProduct);
    const cartSummaryHTML = generateCartSummary(matchingProduct, cartItem);
    cartsSummaryHTML += cartSummaryHTML;
  }
  orderSummary.insertAdjacentHTML('beforeend', cartsSummaryHTML);
  for (const cartItem of cart) {
    const deliveryOptionButtonHTML = document.getElementById(
      `${cartItem.deliveryOptionId}-${cartItem.productId}`,
    );
    isHTMLInputElement(
      deliveryOptionButtonHTML,
      'Fail to get the HTML element',
    );
    deliveryOptionButtonHTML.checked = true;
  }
}

const returnToHomeLink = document.querySelector('.return-to-home-link');
checkNullish(returnToHomeLink);
effect(
  () => {
    returnToHomeLink.textContent = `${cartQuantity.value} items`;
  },
  { name: 'update cart quantity in dom' },
);

function handleUpdateQuantity(target: HTMLElement, productId: string) {
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
  addToCart(
    {
      productId: productId,
      quantity: Number(quantityInput.value),
      deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
    },
    false,
  );
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
  if (classList.includes('quantity-input') && event.key === 'Enter')
    handleSaveQuantity(cartItemContainer, productId);
});

orderSummary?.addEventListener('change', (event) => {
  const { target } = event;
  isHTMLElement(target, 'target');
  const { classList, productId } = handleOrderEvent(target);
  isHTMLInputElement(target);
  if (!classList.includes('delivery-option-input')) return;
  const { deliveryChoiceId } = target.dataset;
  updateDeliveryOption(
    productId,
    parse(DeliveryOptionIdSchema, deliveryChoiceId),
  );
});
