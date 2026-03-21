import { CART_CONFIG } from '#root/shared/src/constants.ts';
import {
  removeFromCart,
  addToCart,
  updateDeliveryOption,
  cartQuantity,
} from '#root/shared/src/data/cart.ts';
import {
  getMatchingProduct,
  fetchProducts,
} from '#root/shared/src/data/products.ts';
import { Cart } from '#root/shared/src/schema.ts';
import { effect } from '@preact/signals-core';
import { policy } from '../../../../shared/src/utils/trustedTypes.ts';
import {
  checkTruthy,
  isDeliveryOptionId,
  isHTMLInputElement,
} from '../../../../shared/src/utils/typeChecker.ts';
import { generateCartSummary } from '../htmlGenerators/cartSummaryHTML.ts';
import 'typed-query-selector';

let controller = new AbortController();

export async function renderOrderSummary(cart: Cart[]) {
  controller.abort();
  controller = new AbortController();
  const { signal } = controller;

  const products = await fetchProducts();

  const orderSummary = document.querySelector('.order-summary');
  checkTruthy(orderSummary, 'Fail to select HTML element');
  orderSummary.innerHTML = policy?.createHTML('') as any;
  let cartsSummaryHTML = '';
  for (const cartItem of cart) {
    const matchingProduct = getMatchingProduct(
      products,
      cartItem.productId,
    );
    checkTruthy(matchingProduct);
    const cartSummaryHTML = generateCartSummary(matchingProduct, cartItem);
    cartsSummaryHTML += cartSummaryHTML;
  }
  const trustedCartsSummaryHTML = policy?.createHTML(cartsSummaryHTML);
  orderSummary.insertAdjacentHTML(
    'beforeend',
    trustedCartsSummaryHTML as any,
  );

  const returnToHomeLink = document.querySelector('.return-to-home-link');
  checkTruthy(returnToHomeLink);
  effect(() => {
    returnToHomeLink.textContent = `${cartQuantity.value} items`;
  });

  function handleUpdateQuantity(target: HTMLElement, productId: string) {
    const quantityInputHTML = target?.parentElement?.querySelector(
      `input.quantity_Input_${productId}`,
    );
    const saveQuantityHTML = target?.parentElement?.querySelector(
      `.save-quantity-link-${productId}`,
    );
    checkTruthy(saveQuantityHTML, 'Fail to select HTML element');
    checkTruthy(quantityInputHTML, 'Fail to select HTML element');
    quantityInputHTML.classList.add('Display_Update_Element');
    saveQuantityHTML.classList.add('Display_Update_Element');
  }

  async function handleSaveQuantity(
    cartItemContainer: Element,
    productId: string,
  ) {
    const quantityInput = cartItemContainer.querySelector(
      'input.quantity_Input',
    );
    checkTruthy(quantityInput);
    addToCart(
      {
        productId: productId,
        quantity: Number(quantityInput.value),
        deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
      },
      false,
    );
  }
  const cartItemContainers = document.querySelectorAll<HTMLElement>(
    '.cart-item-container',
  );
  for (const cartItemContainer of cartItemContainers) {
    const { productId } = cartItemContainer.dataset;
    checkTruthy(productId, 'Fail to get productId from dataset');

    cartItemContainer.addEventListener(
      'click',
      async (event) => {
        const target = <HTMLElement>event.target;
        const targetClassList = Array.from(target.classList);

        if (targetClassList.includes('update-quantity-link')) {
          handleUpdateQuantity(target, productId);
        } else if (targetClassList.includes('save-quantity-link')) {
          await handleSaveQuantity(cartItemContainer, productId);
        } else if (targetClassList.includes('delete-quantity-link')) {
          removeFromCart(productId);
        }
      },
      { signal },
    );

    cartItemContainer.addEventListener(
      'keyup',
      async (event: KeyboardEvent) => {
        const target = <HTMLElement>event.target;
        const targetClassList = Array.from(target.classList);
        if (
          targetClassList.includes('quantity_Input') &&
          event.key === 'Enter'
        ) {
          await handleSaveQuantity(cartItemContainer, productId);
        }
      },
    );

    cartItemContainer.addEventListener(
      'change',
      async (event) => {
        isHTMLInputElement(event.target);
        const targetClassList = Array.from(event.target.classList);

        if (!targetClassList.includes('delivery-option-input')) return;
        const { deliveryChoiceId } = event.target.dataset;
        isDeliveryOptionId(
          deliveryChoiceId,
          'Fail to get productId from HTML dataset',
        );
        updateDeliveryOption(productId, deliveryChoiceId);
      },
      { signal },
    );
  }

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
