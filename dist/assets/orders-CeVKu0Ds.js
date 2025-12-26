import"./general-CztoS-1X.js";/* empty css                      */import{f as l,b as g,P as v,c as y,a as m,d as c}from"./cart-CziQYbih.js";import{g as o}from"./orders-nJh7Lm-Y.js";function p(){const i=JSON.parse(localStorage.getItem("orders"))||[],n=document.querySelector(".orders-grid");let r="";i.forEach(a=>{let t="";a.products.forEach(e=>{const s=g(v,e.productId),u=o(e.estimatedDeliveryTime);t+=`
                <div class="product-image-container">
                  <img src="${s.image}" />
                </div>

                <div class="product-details">
                  <div class="product-name">
                    ${s.name}
                  </div>
                  <div class="product-delivery-date">Arriving on: ${u}</div>
                  <div class="product-quantity">Quantity: ${e.quantity}</div>
                  <button class="buy-again-button button-primary" data-product-id="${e.productId}">
                    <img class="buy-again-icon" src="images/icons/buy-again.png" />
                    <span class="buy-again-message buy-again-message-${e.productId}">Buy it again</span>
                    <span class="buy-again-success buy-again-success-${e.productId}">✓ Added</span>
                  </button>
                </div>

                <div class="product-actions">
                  <a href="tracking.html?orderId=${a.id}&productId=${e.productId}">
                    <button class="track-package-button button-secondary">
                      Track package
                    </button>
                  </a>
                </div>
        `});const d=o(a.orderTime);r+=`
          <div class="order-container order-container-${a.id}">
          <div class="order-header">
                <div class="order-header-left-section">
                  <div class="order-date">
                    <div class="order-header-label">Order Placed: ${d}</div>
                    <div></div>
                  </div>
                  <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${y(a.totalCostCents)}</div>
                  </div>
                </div>

                <div class="order-header-right-section">
                  <div class="order-header-label">Order ID:</div>
                  <div>${a.id}</div>
                </div>
              </div>
              <div class="order-details-grid order-details-grid-${a.id}">
              ${t}
              </div>
          </div>
    `}),n.innerHTML=r,document.querySelectorAll(".buy-again-button").forEach(a=>{const t=a.dataset.productId,d=document.querySelector(`.buy-again-success-${t}`),e=document.querySelector(`.buy-again-message-${t}`);a.addEventListener("click",()=>{let s=JSON.parse(localStorage.getItem(`${t}-productQuantity`))||0;s+=1,localStorage.setItem(`${t}-productQuantity`,s),m(t,s),d.classList.add("display-buy-again-success"),e.classList.add("hide-buy-again-message"),c(),setTimeout(()=>{d.classList.remove("display-buy-again-success"),e.classList.remove("hide-buy-again-message")},1500)})}),c()}async function b(){try{await l(),p()}catch(i){console.log(`unexpected network error: ${i}`)}}b();
