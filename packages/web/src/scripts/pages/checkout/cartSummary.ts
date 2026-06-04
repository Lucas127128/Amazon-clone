import 'typed-query-selector';

import { effect } from 'alien-signals';
import { getMatchingProduct, type Product } from 'shared/products';
import type { Cart, DeliveryOptionId } from 'shared/schema';
import { checkNullish, isHTMLElement } from 'shared/typeChecker';

import { cartQuantity } from '../../data/cart.ts';
import { sanitizer } from '../../utils/trustedTypes.ts';
import { generateCartSummary } from '../htmlGenerators/cartSummaryHTML.ts';
import { uiUpdateEmitter } from './handleQuantity.ts';

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
    const matchingProduct = getMatchingProduct(products, cartItem.productId);
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
  const { classList, productId } = handleOrderEvent(target);

  if (classList.includes('update-quantity-link')) {
    uiUpdateEmitter
      .emit('updateQuantity', { productId })
      .catch((err) => console.error(err));
  } else if (classList.includes('save-quantity-link')) {
    uiUpdateEmitter
      .emit('saveQuantity', { productId })
      .catch((err) => console.error(err));
  } else if (classList.includes('delete-quantity-link')) {
    uiUpdateEmitter
      .emit('removeFromCart', { productId })
      .catch((err) => console.error(err));
  }
});

orderSummary?.addEventListener('keyup', (event: KeyboardEvent) => {
  const { target } = event;
  isHTMLElement(target, 'target');
  const { classList, productId, cartItemContainer } =
    handleOrderEvent(target);
  if (classList.includes('quantity-input')) {
    if (event.key === 'Enter') {
      uiUpdateEmitter
        .emit('saveQuantity', { productId })
        .catch((err) => console.error(err));
    } else {
      uiUpdateEmitter
        .emit('checkInvalidQuantity', { cartItemContainer })
        .catch((err) => console.error(err));
    }
  }
});

orderSummary?.addEventListener('change', (event) => {
  const { target } = event;
  isHTMLElement(target, 'target');
  const { classList, productId } = handleOrderEvent(target);
  if (!classList.includes('delivery-option-input')) return;
  uiUpdateEmitter
    .emit('changeDeliveryOption', {
      productId,
      deliveryOptionId: target.dataset.deliveryChoiceId as DeliveryOptionId,
    })
    .catch((err) => console.error(err));
});
