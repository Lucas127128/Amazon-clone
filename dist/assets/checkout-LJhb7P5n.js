import"./general-CztoS-1X.js";import{f,g,b as k,P as S,c as l,a as E,r as T,u as L,e as P}from"./cart-CziQYbih.js";import D from"https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";import{a as I}from"./orders-nJh7Lm-Y.js";const w=[{id:"1",deliveryDays:7,priceCents:0},{id:"2",deliveryDays:3,priceCents:499},{id:"3",deliveryDays:1,priceCents:999}],C=D();function m(a){let d=C,r=0;for(;r<a;){d=d.add(1,"day");const n=d.day();n!==6&&n!==0&&r++}return d}function H(a){let d="";return a==="1"?d=m(7).format("dddd, MMMM D"):a==="2"?d=m(3).format("dddd, MMMM D"):a==="3"&&(d=m(1).format("dddd, MMMM D")),d}function O(a,d){return a===0?d="FREE - ":a===499?d="$4.99 - ":a===999&&(d="$9.99 - "),d}function u(){const a=g();let d=0,r=0,n=0;const p=document.querySelector(".payment-summary");a.forEach(t=>{const i=k(S,t.ProductId).priceCents*t.Quantity;d+=i,n+=t.Quantity}),a.forEach(t=>{let e=0;t.deliveryOptionId==="1"?e=0:t.deliveryOptionId==="2"?e=499:t.deliveryOptionId==="3"&&(e=999),r+=e});const c=r+d,s=c/10,$=c+s,h=`
    <div class="payment-summary-title">
        Order Summary
        </div>
        <div class="payment-summary-row">
        <div class="cart-item-quantity">Items (${n}):</div>
        <div class="payment-summary-money total-products-price">$${l(d)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money total-delivery-fee">$${l(r)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money total-price-before-tax">$${l(c)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money total-tax">$${l(s)}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money total-cost">$${l($)}</div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>
    `;p.innerHTML=h;const v=a;v.map(t=>(t.productId=t.ProductId,t.quantity=t.Quantity,delete t.Quantity,delete t.ProductId,t)),document.querySelector(".place-order-button").addEventListener("click",async()=>{try{const e=await(await fetch("https://localhost:3001/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(v)})).json();I(e),localStorage.setItem("cart",JSON.stringify([])),location.href="/orders.html"}catch(t){console.log(`Unexpected network issue: ${t}`)}})}async function b(){try{await f(),u()}catch(a){console.log(`unexpected network error: ${a}`)}}b();function y(){const a=g();let d="";a.forEach(t=>{const e=k(S,t.ProductId);d+=`
    <div class="cart-item-container cart-item-container-${e.id}">
      <div class="delivery-date-${e.id} delivery-date" data-product-id="${e.id}">
        ${q(e.id)}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
        src="${e.image}">

        <div class="cart-item-details">
        <div class="product-name">
          ${e.name}
        </div>
        <div class="product-price product-price-${e.id} ">
          $${e.getPrice()}
        </div>
        <div class="product-quantity">
          <span class="js-product-quantity-${e.id}">
          Quantity: <span class="quantity-label">${t.Quantity}</span>
          </span>
          <span class="update-quantity-link link-primary" data-product-id="${e.id}">
          Update
          </span>
          <input type="number" class="quantity_Input_${e.id} quantity_Input" style="width: 40px;">
          <span class="save-quantity-link-${e.id} link-primary save-quantity-link" 
          data-product-id="${e.id}">Save</span>
          <span class="delete-quantity-link delete-quantity-link-${e.id} link-primary" data-product-Id="${e.id}">
          Delete
          </span>
        </div>
        </div>
        <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${c(e.id)}
        </div>
      </div>
    </div>
    `});const r=document.querySelector(".order-summary"),n=document.querySelector(".return-to-home-link");r.innerHTML=d;let p=0;a.forEach(t=>{p+=t.Quantity});function c(t){let e="",i="";return w.forEach(o=>{const M=m(o.deliveryDays).format("dddd, MMMM D");i=O(o.priceCents,i),e+=`<div>
            <input type="radio" class="delivery-option-input"
                name="delivery-option-${t}"
                data-delivery-choice-id="${o.id}"
                data-product-id="${t}"
                value='${M}'
                id="${o.id}-${t}">
                <div>
                <div class="delivery-option-date">
                    ${M}
                </div>
            </div>
                <div class="delivery-option-price">
                    ${i}Shipping
                </div>
                </div>
                `}),e}n.innerHTML=`${p} items`,document.querySelectorAll(".update-quantity-link").forEach(t=>{t.addEventListener("click",function(){const e=t.dataset.productId,i=document.querySelector(`.quantity_Input_${e}`),o=document.querySelector(`.save-quantity-link-${e}`);i.classList.add("Display_Update_Element"),o.classList.add("Display_Update_Element")})});let s="";document.querySelectorAll(".quantity_Input").forEach(t=>{t.addEventListener("change",e=>{s=Number(e.target.value)})}),document.querySelectorAll(".save-quantity-link").forEach(t=>{t.addEventListener("click",function(){const e=t.dataset.productId;E(e,s),y(),u()})}),document.querySelectorAll(".delete-quantity-link").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.productId;T(e),y(),u()})}),document.querySelectorAll(".delivery-option-input").forEach(t=>{t.addEventListener("change",()=>{const e=t.dataset.deliveryChoiceId,i=t.dataset.productId;L(i,e,a),y(),u()})}),a.forEach(t=>{document.getElementById(`${t.deliveryOptionId}-${t.ProductId}`).checked=!0});function q(t){let e=P(a,t);return`Delivery date: ${H(e.deliveryOptionId)}`}}async function x(){try{await f(),y()}catch(a){console.log(`unexpected network error: ${a}`)}}x();async function Q(){try{await f(),y(),u()}catch(a){console.log(`unexpected network error: ${a}`)}}Q();
