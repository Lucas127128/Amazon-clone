import {Cart, RemoveFromCart} from'../data/cart.js'
import {Products} from '../data/products.js'
import { FormatCurrency} from './Utils/Money.js'
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import {deliveryOption} from '../data/deliveryOption.js'
hello()
const Today = dayjs()
let deliveryDate = Today.add(7, "days")
deliveryDate=deliveryDate.format('dddd, MMMM D')
console.log(deliveryDate)

let Local_Storage_Cart = localStorage.getItem('local_Storage_Cart')
if(Local_Storage_Cart===null){
    let CheckoutCart = Cart
}
let CheckoutCart = JSON.parse(localStorage.getItem('local_Storage_Cart'))
let cartSummaryHTML =''
function Add_To_cart(productId, quantityToAdd){
    let MatchingItem;
    CheckoutCart.forEach((cartItem)=>{
        if(productId===cartItem.ProductId){
            MatchingItem=cartItem
        }
    })
    if(MatchingItem){
        MatchingItem.Quantity=QuantityToAdd
    }else{
        CheckoutCart.push({
        ProductId: productId,
        Quantity: quantityToAdd
    })
    }
    localStorage.setItem('local_Storage_Cart',JSON.stringify(CheckoutCart))
}
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
        <div class="delivery-date-${matchingProduct.id} delivery-date" data-product-id="${matchingProduct.id}">
            Delivery date: 
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
                <input type="number" class="quantity_Input_${matchingProduct.id} quantity_Input" style="width: 40px;">
                <span class="save-quantity-link-${matchingProduct.id} link-primary save-quantity-link" 
                data-product-id="${matchingProduct.id}">Save</span>
                <span class="delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct.id)}
            </div>
        </div>
    </div>
    `
})

let Update_Quantity_Link = document.querySelectorAll('.js-update-quantity-link')
const Order_Summary = document.querySelector('.order-summary')
const return_to_home_link = document.querySelector('.return-to-home-link')
Order_Summary.innerHTML = cartSummaryHTML
let Checkout_Cart_Quantity=0
CheckoutCart.forEach((value)=>{
    Checkout_Cart_Quantity+=value.Quantity
})
function deliveryOptionsHTML(matchingProductId){
    let html='';
    let priceString=''
    console.log(priceString)
    deliveryOption.forEach((deliveryOptions)=>{
        const Today = dayjs()
        deliveryDate= Today.add(deliveryOptions.deliveryDays, "days")
        deliveryDate=deliveryDate.format('dddd, MMMM D')
        if(deliveryOptions.priceCents===0){
            priceString='FREE - '
        }else if(deliveryOptions.priceCents===499){
            priceString='$4.99 - '
        }else if(deliveryOptions.priceCents===999){
            priceString='$9.99 - '
        }else{
            priceString='fail'
        }
        html+=`<div>
            <input type="radio" class="delivery-option-input"
                name="delivery-option-${matchingProductId}"
                data-delivery-choice-id="${deliveryOptions.id}"
                data-product-id="${matchingProductId}"
                value='${deliveryDate}'>
                <div>
                <div class="delivery-option-date">
                    ${deliveryDate}
                </div>
            </div>
                <div class="delivery-option-price">
                    ${priceString}Shipping
                </div>
                </div>
                `
    })
    return html;
}
return_to_home_link.innerHTML=`${Checkout_Cart_Quantity} items`
document.querySelectorAll(`.update-quantity-link`).forEach((Link)=>{
    Link.addEventListener('click', function(){
        const ProductId=Link.dataset.productId
        const quantity_Input = document.querySelector(`.quantity_Input_${ProductId}`)
        const save_quantity_link = document.querySelector(`.save-quantity-link-${ProductId}`)
        console.log(ProductId)
        quantity_Input.classList.add('Display_Update_Element')
        save_quantity_link.classList.add('Display_Update_Element')
        console.log(quantity_Input.classList)
        console.log(save_quantity_link.classList)
    })
})
let QuantityToAdd=0;
document.querySelectorAll(`.quantity_Input`).forEach((Link)=>{
    Link.addEventListener('keyup', function(e){
        QuantityToAdd+=Link.value
        
    })
})
console.log(QuantityToAdd)
document.querySelectorAll(`.save-quantity-link`).forEach((Link)=>{
    Link.addEventListener('click', function(){
        const ProductId=Link.dataset.productId
        const quantityInput = document.querySelector(`.quantity_Input_${ProductId}`);
        QuantityToAdd = Number(quantityInput.value);
        Add_To_cart(ProductId, QuantityToAdd)
        location.reload();
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
const delivery_option_input = document.querySelectorAll('.delivery-option-input')
delivery_option_input.forEach((element) => {
    element.addEventListener('change', () => {
        const deliveryChoiceId=element.dataset.deliveryChoiceId
        const ProductId=element.dataset.productId
        const Delivery_Date = document.querySelector(`.delivery-date-${ProductId}`)
        console.log(deliveryChoiceId)
        console.log(element.value)
        Delivery_Date.innerHTML=`Delivery date: ${element.value}`
    })
})