import {
  getMatchingProduct,
  getProducts,
} from '#root/shared/src/data/products.ts';
import {
  addToCart,
  calculateCartQuantity,
} from '#root/shared/src/data/cart.ts';
import { getTimeString, Order } from '#root/shared/src/data/orders.ts';
import { checkTruthy } from '../../../shared/src/utils/typeChecker.ts';
import {
  generateOrderContainerHTML,
  generateOrdersProductHTML,
} from './htmlGenerators/ordersHTML.ts';
import { handleSearchInput } from './header.ts';
import { policy } from '../../../shared/src/utils/trustedTypes.ts';
import {
  CART_CONFIG,
  STORAGE_KEYS,
  UI_TIMEOUTS,
} from '#root/shared/src/constants.ts';

function renderPlacedOrder() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  const savedOrders = localStorage.getItem('orders');
  const orders: readonly Order[] = savedOrders
    ? JSON.parse(savedOrders)
    : [];
  const ordersHTML = document.querySelector('.orders-grid');
  checkTruthy(ordersHTML);
  orders.forEach(async (order) => {
    let placedOrderHTML = '';
    const products = await getProducts();
    order.products.forEach((product) => {
      const matchingProduct = getMatchingProduct(
        products,
        product.productId,
      );
      checkTruthy(matchingProduct);
      placedOrderHTML += generateOrdersProductHTML(
        product,
        matchingProduct,
        order.id,
      );
    });
    const orderTime = await getTimeString(order.orderTime);
    const placedOrderContainerHTML = generateOrderContainerHTML(
      order,
      orderTime,
      placedOrderHTML,
    );
    const trustedOrderContainerHTML = policy?.createHTML(
      placedOrderContainerHTML,
    );
    checkTruthy(trustedOrderContainerHTML);
    ordersHTML.insertAdjacentHTML(
      'beforeend',
      trustedOrderContainerHTML as any,
    );
  });

  function displayBuyAgainMessage(
    buyAgainMessageHTML: Element,
    buyAgainSuccessHTML: Element,
  ): void {
    checkTruthy(buyAgainSuccessHTML);
    checkTruthy(buyAgainMessageHTML);
    buyAgainSuccessHTML.classList.add('display-buy-again-success');
    buyAgainMessageHTML.classList.add('hide-buy-again-message');

    const cartQuantity = calculateCartQuantity();
    const returnToHomeLink = document.querySelector('.cart-quantity');
    checkTruthy(returnToHomeLink);
    returnToHomeLink.textContent = `${cartQuantity}`;

    setTimeout(() => {
      buyAgainSuccessHTML.classList.remove('display-buy-again-success');
      buyAgainMessageHTML.classList.remove('hide-buy-again-message');
    }, UI_TIMEOUTS.ADDED_TO_CART_DISPLAY);
  }
  ordersHTML.addEventListener('click', (event) => {
    let buyAgainButton = <HTMLButtonElement>event.target;
    /*
    The event target may be the child element inside the buy again button and
    do not contain the "buy-again-button" class. If this is the situation,
    I need to set the buyAgainButton to its parent element, which is the
    actual buy again button element, not the child element of it.
    */
    if (
      !buyAgainButton.classList.contains('buy-again-button') &&
      !buyAgainButton.parentElement?.classList.contains('buy-again-button')
    ) {
      return;
    } else if (
      !buyAgainButton.classList.contains('buy-again-button') &&
      buyAgainButton.parentElement?.classList.contains('buy-again-button')
    ) {
      buyAgainButton = <HTMLButtonElement>buyAgainButton.parentElement;
    }

    const { productId } = buyAgainButton.dataset;
    const buyAgainSuccessHTML = buyAgainButton.querySelector(
      `span.buy-again-success-${productId}`,
    );
    const buyAgainMessageHTML = buyAgainButton.querySelector(
      `span.buy-again-message-${productId}`,
    );

    checkTruthy(productId, 'Fail to get productId');
    addToCart(
      {
        productId: productId,
        quantity: 1,
        deliveryOptionId: CART_CONFIG.DEFAULT_DELIVERY_OPTION,
      },
      true,
    );

    checkTruthy(buyAgainMessageHTML);
    checkTruthy(buyAgainSuccessHTML);
    displayBuyAgainMessage(buyAgainMessageHTML, buyAgainSuccessHTML);
  });
  const cartQuantity = calculateCartQuantity();
  const returnToHomeLink = document.querySelector('.cart-quantity');
  checkTruthy(returnToHomeLink);
  returnToHomeLink.textContent = `${cartQuantity}`;
}

await Promise.allSettled([renderPlacedOrder(), handleSearchInput()]);
