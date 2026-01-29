import { getMatchingCart } from "./products.ts";
import { checkTruthy } from "../Scripts/Utils/typeChecker.ts";

export function addToCart(productId: string, quantityToAdd: number) {
  const cart = getCart();
  console.log(cart);
  const matchingItem = getMatchingCart(cart, productId);
  if (matchingItem) {
    matchingItem.quantity = quantityToAdd;
  } else {
    cart.push({
      productId: productId,
      quantity: quantityToAdd,
      deliveryOptionId: "1",
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function incrementAddToCart(productId: string, quantityToAdd: number) {
  const cart = getCart();
  const matchingItem = getMatchingCart(cart, productId);
  if (matchingItem) {
    matchingItem.quantity += quantityToAdd;
  } else {
    cart.push({
      productId: productId,
      quantity: quantityToAdd,
      deliveryOptionId: "1",
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

export interface Cart {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
}
export function removeFromCart(productId: string) {
  const cart: Cart[] = getCart().filter(
    (cartItem: Cart) => cartItem.productId !== productId,
  );
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateDeliveryOption(
  productId: string,
  deliveryOptionId: string,
) {
  const cart = getCart();
  const matchingItem = getMatchingCart(cart, productId);
  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    console.error(
      "Cannot update delivery option because the product id is not valid.",
    );
  }
}

export function getCart(): Cart[] {
  const savedCart = localStorage.getItem("cart");
  const cart: Cart[] = savedCart ? JSON.parse(savedCart) : [];
  return cart;
}

export function displayCartQuantity(
  cartQuantityHTMLClass: string,
  extraString: string = "",
) {
  let cartQuantity = 0;
  const cartQuantityHTML = document.querySelector(`.${cartQuantityHTMLClass}`);
  const cart = getCart();
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  checkTruthy(cartQuantityHTML);
  cartQuantityHTML.textContent = String(cartQuantity) + extraString;
}
