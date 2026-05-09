import { comptime } from 'comptime';
import { CART_CONFIG, UI_TIMEOUTS } from 'shared/constants';
import { checkNullish } from 'shared/typeChecker';

import { addToCart } from '../../data/cart.ts';

function displayBuyAgainMessage(
  buyAgainMessageHTML: HTMLElement,
  buyAgainSuccessHTML: HTMLElement,
) {
  buyAgainSuccessHTML.style.display = 'block';
  buyAgainSuccessHTML.style.opacity = '1';
  buyAgainMessageHTML.style.display = 'none';
  buyAgainMessageHTML.style.opacity = '0';
  setTimeout(
    () => {
      buyAgainMessageHTML.style.display = 'block';
      buyAgainMessageHTML.style.opacity = '1';
      buyAgainSuccessHTML.style.display = 'none';
      buyAgainSuccessHTML.style.opacity = '0';
    },
    comptime(() => UI_TIMEOUTS.ADDED_TO_CART_DISPLAY),
  );
}

export function handleBuyAgainBtn() {
  const buyAgainButtons = document.querySelectorAll(
    'button.buy-again-button',
  );
  for (const buyAgainButton of buyAgainButtons) {
    buyAgainButton.addEventListener('click', () => {
      const { productId } = buyAgainButton.dataset;
      checkNullish(productId, 'Fail to get productId');
      addToCart(
        {
          productId,
          quantity: 1,
          deliveryOptionId: comptime(
            () => CART_CONFIG.DEFAULT_DELIVERY_OPTION,
          ),
        },
        true,
      );

      const buyAgainSuccessHTML = buyAgainButton.querySelector(
        `span.buy-again-success`,
      );
      const buyAgainMessageHTML = buyAgainButton.querySelector(
        `span.buy-again-message`,
      );
      checkNullish(buyAgainMessageHTML);
      checkNullish(buyAgainSuccessHTML);
      displayBuyAgainMessage(buyAgainMessageHTML, buyAgainSuccessHTML);
    });
  }
}
