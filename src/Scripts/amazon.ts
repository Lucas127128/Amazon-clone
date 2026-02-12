import { addToCart, displayCartQuantity } from "../data/cart";
import { getProducts } from "../data/products";
import { checkTruthy } from "./Utils/typeChecker";
import { generateAmazonHTML } from "./htmlGenerators/amazonHTML";

async function renderAmazonHomePage() {
  const productsGrid = document.querySelector(".products-grid");
  checkTruthy(productsGrid, "Fail to select HTML element");
  const products = await getProducts();

  products.forEach((product) => {
    const productsHTML = generateAmazonHTML(product);
    productsGrid.insertAdjacentHTML("beforeend", productsHTML);
  });

  function displayAdded(productId: string) {
    const addedToCart = document.querySelector(`.added-to-cart-${productId}`);
    checkTruthy(addedToCart, "Fail to select HTML element");
    addedToCart.classList.add("display-added-to-cart");
    setTimeout(() => {
      addedToCart.classList.remove("display-added-to-cart");
    }, 1500);
  }

  productsGrid.addEventListener("click", (event) => {
    const button = <HTMLButtonElement>event.target;
    if (!button.classList.contains("add-to-cart-button")) {
      return;
    }

    const { productId } = button.dataset;
    const productContainer = button.parentElement;
    const quantitySelectorHTML =
      productContainer?.querySelector<HTMLInputElement>(
        ".ProductQuantitySelector",
      );
    checkTruthy(
      quantitySelectorHTML,
      "Fail to get the HTML element or the product id dataset is incorrect",
    );
    checkTruthy(
      productId,
      "Fail to get the HTML element or the product id dataset is incorrect",
    );
    const quantityToAdd = parseInt(quantitySelectorHTML.value);
    addToCart(true, productId, quantityToAdd);
    displayCartQuantity("cart-quantity");
    displayAdded(productId);
  });
  displayCartQuantity("cart-quantity");
}

function loadPage() {
  Promise.try(() => {
    return renderAmazonHomePage();
  }).catch((error) => {
    console.error(`unexpected error: ${error}`);
  });
}
loadPage();
