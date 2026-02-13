import {
  removeFromCart,
  addToCart,
  getCart,
  updateDeliveryOption,
  displayCartQuantity,
} from '../../data/cart.ts';
import { getMatchingProduct, getProducts } from '../../data/products.ts';
import {
  checkTruthy,
  isDeliveryOptionId,
  isHTMLInputElement,
} from '../Utils/typeChecker.ts';
import { generateCartSummary } from '../htmlGenerators/cartSummaryHTML.ts';
import { loadPage } from '../checkout.ts';

export async function renderOrderSummary() {
  const checkoutCart = getCart();
  const products = await getProducts();

  const orderSummary = document.querySelector('.order-summary');
  checkTruthy(orderSummary, 'Fail to select HTML element');
  orderSummary.innerHTML = '';
  checkoutCart.forEach((cartItem) => {
    const matchingProduct = getMatchingProduct(
      products,
      cartItem.productId,
    );
    checkTruthy(matchingProduct);
    const cartSummaryHTML = generateCartSummary(matchingProduct, cartItem);
    orderSummary.insertAdjacentHTML('beforeend', cartSummaryHTML);
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
    let quantityToAdd = 0;

    cartItemContainer.addEventListener('click', (event) => {
      const target = <HTMLElement>event.target;
      const targetClassList = Array.from(target.classList);

      if (targetClassList.includes('update-quantity-link')) {
        handleUpdateQuantity(target, productId);
      } else if (targetClassList.includes('save-quantity-link')) {
        addToCart(false, productId, quantityToAdd);
        loadPage();
      } else if (targetClassList.includes('delete-quantity-link')) {
        removeFromCart(productId);
        loadPage();
      }
    });
    cartItemContainer.addEventListener('change', (event) => {
      const { target } = event;
      isHTMLInputElement(target);
      const targetClassList = Array.from(target.classList);

      if (targetClassList.includes('quantity_Input')) {
        quantityToAdd = Number(target.value);
      } else if (targetClassList.includes('delivery-option-input')) {
        const { deliveryChoiceId } = target.dataset;
        isDeliveryOptionId(
          deliveryChoiceId,
          'Fail to get productId from HTML dataset',
        );
        updateDeliveryOption(productId, deliveryChoiceId);
        loadPage();
      }
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
