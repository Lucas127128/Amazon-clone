import { CART_CONFIG } from '#root/config/constants.ts';
import {
  removeFromCart,
  addToCart,
  updateDeliveryOption,
  cartQuantity,
} from '#data/cart.ts';
import { getMatchingProduct, fetchProducts } from '#data/products.ts';
import {
  DeliveryOptionIdSchema,
  type Cart,
} from '#root/shared/src/schema.ts';
import { effect } from '@preact/signals-core';
import { policy } from '#utils/trustedTypes.ts';
import { checkNullish, isHTMLInputElement } from '#utils/typeChecker.ts';
import { generateCartSummary } from '../htmlGenerators/cartSummaryHTML.ts';
import { parse } from 'valibot';
import 'typed-query-selector';

const orderSummary = document.querySelector('div.order-summary');

export async function renderOrderSummary(cart: Cart[]) {
  const products = await fetchProducts();
  checkNullish(orderSummary, 'Fail to select HTML element');
  orderSummary.innerHTML = policy?.createHTML('') as any;
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
  const trustedCartsSummaryHTML = policy?.createHTML(cartsSummaryHTML);
  orderSummary.insertAdjacentHTML(
    'beforeend',
    trustedCartsSummaryHTML as any,
  );
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
effect(() => {
  returnToHomeLink.textContent = `${cartQuantity.value} items`;
});

function handleUpdateQuantity(target: HTMLElement, productId: string) {
  const quantityInputHTML = target?.parentElement?.querySelector(
    `input.quantity-input-${productId}`,
  );
  const saveQuantityHTML = target?.parentElement?.querySelector(
    `span.save-quantity-link-${productId}`,
  );
  checkNullish(saveQuantityHTML, 'Fail to select HTML element');
  checkNullish(quantityInputHTML, 'Fail to select HTML element');
  quantityInputHTML.style.display = 'inline';
  saveQuantityHTML.style.display = 'inline';
}

async function handleSaveQuantity(
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

function handleOrderEvent(event: Event) {
  const target = event.target as HTMLElement;
  const cartItemContainer = target?.closest('div.cart-item-container');
  checkNullish(cartItemContainer);
  const { productId } = cartItemContainer.dataset;
  checkNullish(productId, 'Fail to get productId from dataset');
  return {
    classList: Array.from(target.classList),
    productId,
    cartItemContainer,
  };
}

orderSummary?.addEventListener('click', async (event) => {
  const { classList, productId, cartItemContainer } =
    handleOrderEvent(event);
  const target = event.target as HTMLElement;

  if (classList.includes('update-quantity-link')) {
    handleUpdateQuantity(target, productId);
  } else if (classList.includes('save-quantity-link')) {
    await handleSaveQuantity(cartItemContainer, productId);
  } else if (classList.includes('delete-quantity-link')) {
    removeFromCart(productId);
  }
});

orderSummary?.addEventListener('keyup', async (event: KeyboardEvent) => {
  const { classList, productId, cartItemContainer } =
    handleOrderEvent(event);
  if (classList.includes('quantity-input') && event.key === 'Enter')
    await handleSaveQuantity(cartItemContainer, productId);
});

orderSummary?.addEventListener('change', async (event) => {
  const { classList, productId } = handleOrderEvent(event);
  const { target } = event;
  isHTMLInputElement(target);
  if (!classList.includes('delivery-option-input')) return;
  const { deliveryChoiceId } = target.dataset;
  updateDeliveryOption(
    productId,
    parse(DeliveryOptionIdSchema, deliveryChoiceId),
  );
});
