import {
  removeFromCart,
  addToCart,
  getCart,
  updateDeliveryOption,
  displayCartQuantity,
} from '#data/cart.ts';
import { getMatchingProduct, getProducts } from '#data/products.ts';
import { policy } from '../Utils/trustedTypes.ts';
import {
  checkTruthy,
  isDeliveryOptionId,
  isHTMLInputElement,
} from '../Utils/typeChecker.ts';
import { generateCartSummary } from '../htmlGenerators/cartSummaryHTML.ts';
import { renderPaymentSummary } from './paymentSummary.ts';

export async function renderOrderSummary() {
  const checkoutCart = getCart();
  const products = await getProducts();

  const orderSummary = document.querySelector('.order-summary');
  checkTruthy(orderSummary, 'Fail to select HTML element');
  orderSummary.innerHTML = policy?.createHTML('') as any;
  checkoutCart.forEach((cartItem) => {
    const matchingProduct = getMatchingProduct(
      products,
      cartItem.productId,
    );
    checkTruthy(matchingProduct);
    const cartSummaryHTML = generateCartSummary(matchingProduct, cartItem);
    const trustedCartSummaryHTML = policy?.createHTML(cartSummaryHTML);
    checkTruthy(trustedCartSummaryHTML);
    orderSummary.insertAdjacentHTML(
      'beforeend',
      trustedCartSummaryHTML as any,
    );
  });

  displayCartQuantity('return-to-home-link', ' items');

  function handleUpdateQuantity(target: HTMLElement, productId: string) {
    const quantityInputHTML = target?.parentElement?.querySelector(
      `.quantity_Input_${productId}`,
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
  cartItemContainers.forEach((cartItemContainer) => {
    const { productId } = cartItemContainer.dataset;
    checkTruthy(productId, 'Fail to get productId from dataset');

    cartItemContainer.addEventListener('click', async (event) => {
      const target = <HTMLElement>event.target;
      const targetClassList = Array.from(target.classList);

      if (targetClassList.includes('update-quantity-link')) {
        handleUpdateQuantity(target, productId);
      } else if (targetClassList.includes('save-quantity-link')) {
        const quantityInput =
          cartItemContainer.querySelector('.quantity_Input');
        isHTMLInputElement(quantityInput);
        addToCart(
          {
            productId: productId,
            quantity: Number(quantityInput.value),
            deliveryOptionId: '1',
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
  });

  checkoutCart.forEach((cartItem) => {
    const deliveryOptionButtonHTML = document.getElementById(
      `${cartItem.deliveryOptionId}-${cartItem.productId}`,
    );
    isHTMLInputElement(
      deliveryOptionButtonHTML,
      'Fail to get the HTML element',
    );
    deliveryOptionButtonHTML.checked = true;
  });
}
