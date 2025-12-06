import { Cart, addToCart } from "../data/cart.js";
import { Products, fetchProducts } from "../data/products.js";
let ProductsHTML = "";
function renderAmazonHomePage() {
  Products.forEach((products) => {
    ProductsHTML += `
        <div class="product-container">
            <div class="product-image-container">
                <img class="product-image"
                src="${products.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${products.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars"
                src="${products.getStarsUrl()}">
                <div class="product-rating-count link-primary">
                ${products.rating.count}
                </div>
            </div>

            <div class="product-price">
                $${products.getPrice()}
            </div>

            <div class="product-quantity-container">
                <select class = "ProductQuantitySelector">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                </select>
            </div>
            ${products.extraInfoHTML()}

            <div class="product-spacer"></div>

            <div class="added-to-cart added-to-cart-${products.id}">
                <img src="images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary"
            data-product-id="${products.id}">
                Add to Cart
            </button>
            </div>
        </div>
    `;
  });
  const cartQuantityHTML = document.querySelector(".cart-quantity");
  const productsGrid = document.querySelector(".products-grid");
  productsGrid.innerHTML = ProductsHTML;
  const addToCartButton = document.querySelectorAll(".add-to-cart-button");
  let cartQuantity = 0;
  if (
    localStorage.getItem("local_Storage_Cart") === null ||
    localStorage.getItem("local_Storage_Cart") === undefined
  ) {
    localStorage.setItem("local_Storage_Cart", JSON.stringify([]));
  }
  JSON.parse(localStorage.getItem("local_Storage_Cart")).forEach((value) => {
    cartQuantity += value.Quantity;
  });
  cartQuantityHTML.innerHTML = cartQuantity;
  function displayCartQuantity(
    CartQuantity,
    CartQuantityHTML,
    QuantitySelectorHTML
  ) {
    let cartQuantity = CartQuantity;
    Cart.forEach((cartItem) => {
      QuantitySelectorHTML.value = cartItem.Quantity;
      cartQuantity += cartItem.Quantity;
    });
    CartQuantityHTML.innerHTML = cartQuantity;
  }
  function displayAdded(ProductId) {
    const addedToCart = document.querySelector(`.added-to-cart-${ProductId}`);
    addedToCart.classList.add("display-added-to-cart");
    setTimeout(() => {
      addedToCart.classList.remove("display-added-to-cart");
    }, 1500);
  }
  addToCartButton.forEach((button) => {
    button.addEventListener("click", () => {
      clearTimeout();
      const productId = button.dataset.productId;
      const productContainer = button.closest(".product-container");
      const quantitySelectorHTML = productContainer.querySelector(
        ".ProductQuantitySelector"
      );
      const quantityToAdd = parseInt(quantitySelectorHTML.value);
      const cartQuantity = 0;
      addToCart(productId, quantityToAdd);
      displayCartQuantity(cartQuantity, cartQuantityHTML, quantitySelectorHTML);
      displayAdded(productId);
    });
  });
}

async function loadPage() {
  try {
      await fetchProducts();
      renderAmazonHomePage();
    } catch(error) {
      console.log(`unexpected network error: ${error}`);
    }
}
loadPage();
