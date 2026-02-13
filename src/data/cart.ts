import { checkTruthy } from "../Scripts/Utils/typeChecker.ts";
import { deliveryOptionId } from "./deliveryOption.ts";

export const getMatchingCart = (cart: Cart[], productId: string) =>
  cart.find((cartItem) => cartItem.productId === productId);

export function addToCart(
  increment: boolean = false,
  productId: string,
  quantityToAdd: number,
  deliveryOptionId: deliveryOptionId = "1",
) {
  const cart = getCart();
  const matchingCart = getMatchingCart(cart, productId);
  matchingCart
    ? increment
      ? (matchingCart.quantity += quantityToAdd)
      : (matchingCart.quantity = quantityToAdd)
    : cart.push({
        productId: productId,
        quantity: quantityToAdd,
        deliveryOptionId: deliveryOptionId,
      });
  localStorage.setItem("cart", JSON.stringify(cart));
}

export interface Cart {
  productId: string;
  quantity: number;
  deliveryOptionId: deliveryOptionId;
}

export function removeFromCart(productId: string) {
  const cart: Cart[] = getCart().filter(
    (cartItem: Cart) => cartItem.productId !== productId,
  );
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateDeliveryOption(
  productId: string,
  deliveryOptionId: deliveryOptionId,
) {
  const cart = getCart();
  const matchingItem = getMatchingCart(cart, productId);
  checkTruthy(matchingItem, "The product id is not valid.");
  matchingItem.deliveryOptionId = deliveryOptionId;
  localStorage.setItem("cart", JSON.stringify(cart));
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
  const cartQuantityHTML = document.querySelector(
    `.${cartQuantityHTMLClass}`,
  );
  const cart = getCart();
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  checkTruthy(cartQuantityHTML);
  cartQuantityHTML.textContent = String(cartQuantity) + extraString;
}
