import { Cart, Add_To_cart } from "../data/cart.js";
import { Products,checkProductReady } from "../data/products.js";
let ProductsHTML = "";
function renderAmazonHomePage(){
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
const cartQuantity = document.querySelector(".cart-quantity");
let ProductQuantity = 0;
let ProductId = "";
const ProductsGrid = document.querySelector(".products-grid");
ProductsGrid.innerHTML = ProductsHTML;
let AddToCartButton = document.querySelectorAll(".add-to-cart-button");
let cart_Quantity = 0;
if (localStorage.getItem("local_Storage_Cart")===null||localStorage.getItem("local_Storage_Cart")===undefined) {
  localStorage.setItem("local_Storage_Cart", JSON.stringify([]));
}
JSON.parse(localStorage.getItem("local_Storage_Cart")).forEach((value) => {
  cart_Quantity += value.Quantity;
});
cartQuantity.innerHTML = cart_Quantity;
function Display_Cart_Quantity(
  CartQuantityP,
  cartQuantityP,
  QuantitySelectorP
) {
  Cart.forEach((cartItem) => {
    CartQuantityP += cartItem.Quantity;
    console.log(cartItem.Quantity);
    QuantitySelectorP.value = cartItem.Quantity;
  });
  cartQuantityP.innerHTML = CartQuantityP;
}
function Display_Added() {
  const Added_To_Cart = document.querySelector(`.added-to-cart-${ProductId}`);
  Added_To_Cart.classList.add("display-added-to-cart");
  setTimeout(() => {
    Added_To_Cart.classList.remove("display-added-to-cart");
  }, 1500);
}
AddToCartButton.forEach((Button) => {
  Button.addEventListener("click", () => {
    ProductId = Button.dataset.productId;
    clearTimeout();
    let ProductContainer = Button.closest(".product-container");
    let QuantitySelector = ProductContainer.querySelector(
      ".ProductQuantitySelector"
    );
    let QuantityToAdd = parseInt(QuantitySelector.value);
    let CartQuantity = 0;
    Add_To_cart(ProductId, QuantityToAdd);
    console.log(Cart);
    Display_Cart_Quantity(CartQuantity, cartQuantity, QuantitySelector);
    Display_Added();
  });
});
}
checkProductReady(renderAmazonHomePage)
