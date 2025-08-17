import {Cart, RemoveFromCart} from'../data/cart.js'
import {Products} from '../data/products.js'
import { FormatCurrency} from './Utils/Money.js'
let Local_Storage_Cart = localStorage.getItem('local_Storage_Cart')
if(Local_Storage_Cart===null){
    let CheckoutCart = Cart
}
let CheckoutCart = JSON.parse(localStorage.getItem('local_Storage_Cart'))
let cartSummaryHTML =''
CheckoutCart.forEach(function (cartItem) {
    const productId = cartItem.ProductId
    let matchingProduct;

    Products.forEach((product)=>{
        if(product.id===productId){
            matchingProduct=product
        }
    })

    cartSummaryHTML+=`
    <div class="cart-item-container">
        <div class="delivery-date">
            Delivery date: Wednesday, June 15
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${FormatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label">${cartItem.Quantity}</span>
                </span>
                <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Update
                </span>
                <span class="delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>

            <div class="delivery-option">
                <input type="radio" class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                    FREE Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio" checked class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                    $4.99 - Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio" class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Monday, June 13
                </div>
                <div class="delivery-option-price">
                    $9.99 - Shipping
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    `
})
let Update_Quantity_Link = document.querySelectorAll('.js-update-quantity-link')
const Order_Summary = document.querySelector('.order-summary')
Order_Summary.innerHTML = cartSummaryHTML

document.querySelectorAll(`.update-quantity-link`).forEach((Link)=>{
    Link.addEventListener('click', function(){
        const ProductId=Link.dataset.productId
        console.log(ProductId)
    })
})
document.querySelectorAll('.delete-quantity-link').forEach((Link)=>{
    Link.addEventListener('click', function(){
        const ProductId=Link.dataset.productId
        console.log(ProductId)
        RemoveFromCart(ProductId)
        console.log(Cart)
        localStorage.setItem('local_Storage_Cart',JSON.stringify(Cart))
        location.reload()
    })
})