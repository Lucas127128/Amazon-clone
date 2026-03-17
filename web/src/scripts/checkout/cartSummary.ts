import { CART_CONFIG } from '#root/shared/src/constants.ts';
import {
  removeFromCart,
  addToCart,
  getCart,
  updateDeliveryOption,
  calculateCartQuantity,
} from '#root/shared/src/data/cart.ts';
import {
  getMatchingProduct,
  fetchProducts,
} from '#root/shared/src/data/products.ts';
import { policy } from '../../../../shared/src/utils/trustedTypes.ts';
import {
  checkTruthy,
  isDeliveryOptionId,
  isHTMLInputElement,
} from '../../../../shared/src/utils/typeChecker.ts';
import { generateCartSummary } from '../htmlGenerators/cartSummaryHTML.ts';
import { renderPaymentSummary } from './paymentSummary.ts';
import 'typed-query-selector';

export async function renderOrderSummary() {
  const checkoutCart = getCart();
  const products = await fetchProducts();

  const orderSummary = document.querySelector('.order-summary');
  checkTruthy(orderSummary, 'Fail to select HTML element');
  orderSummary.innerHTML = policy?.createHTML('') as any;
  for (const cartItem of checkoutCart) {
    const matchingProduct = getMatchingProduct(
      products,
      cartItem.productId,
    );
    checkTruthy(matchingProduct);
    const cartSummaryHTML = generateCartSummary(matchingProduct, cartItem);
    const trustedCartSummaryHTML =
      policy?.createHTML(cartSummaryHTML) ?? cartSummaryHTML;
    checkTruthy(trustedCartSummaryHTML);
    orderSummary.insertAdjacentHTML(
      'beforeend',
      trustedCartSummaryHTML as any,
    );
  }

  const cartQuantity = calculateCartQuantity();
  const returnToHomeLink = document.querySelector('.return-to-home-link');
  checkTruthy(returnToHomeLink);
  returnToHomeLink.textContent = `${cartQuantity} items`;

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

  const cartItemContainers = document.querySelectorAll<HTMLElement>(
    '.cart-item-container',
  );
  for (const cartItemContainer of cartItemContainers) {
    const { productId } = cartItemContainer.dataset;
    checkTruthy(productId, 'Fail to get productId from dataset');

    cartItemContainer.addEventListener('click', async (event) => {
      const target = <HTMLElement>event.target;
      const targetClassList = Array.from(target.classList);

      if (targetClassList.includes('update-quantity-link')) {
        handleUpdateQuantity(target, productId);
      } else if (targetClassList.includes('save-quantity-link')) {
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
        await Promise.allSettled([
          renderOrderSummary(),
          renderPaymentSummary(),
        ]);
      } else if (targetClassList.includes('delete-quantity-link')) {
        removeFromCart(productId);
        await Promise.allSettled([
          renderOrderSummary(),
          renderPaymentSummary(),
        ]);
      }
    });

    cartItemContainer.addEventListener('change', async (event) => {
      isHTMLInputElement(event.target);
      const targetClassList = Array.from(event.target.classList);

      if (!targetClassList.includes('delivery-option-input')) return;
      const { deliveryChoiceId } = event.target.dataset;
      isDeliveryOptionId(
        deliveryChoiceId,
        'Fail to get productId from HTML dataset',
      );
      updateDeliveryOption(productId, deliveryChoiceId);
      await Promise.allSettled([
        renderOrderSummary(),
        renderPaymentSummary(),
      ]);
    });
  }

  for (const cartItem of checkoutCart) {
    // const deliveryOptionButtonHTML = document?.querySelector(
    //   `input#${cartItem.deliveryOptionId}-${cartItem.productId}`,
    // );
    // checkTruthy(deliveryOptionButtonHTML);
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
