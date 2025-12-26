import"./general-CztoS-1X.js";/* empty css                      */import{f as r,P as n,a as s,d as l}from"./cart-CziQYbih.js";let d="";function u(){n.forEach(t=>{d+=`
        <div class="product-container">
            <div class="product-image-container">
                <img class="product-image"
                src="${t.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${t.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars"
                src="${t.getStarsUrl()}">
                <div class="product-rating-count link-primary">
                ${t.rating.count}
                </div>
            </div>

            <div class="product-price">
                $${t.getPrice()}
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
            ${t.extraInfoHTML()}

            <div class="product-spacer"></div>

            <div class="added-to-cart added-to-cart-${t.id}">
                <img src="/images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary"
            data-product-id="${t.id}">
                Add to Cart
            </button>
            </div>
        </div>
    `});const a=document.querySelector(".products-grid");a.innerHTML=d;function e(t){const o=document.querySelector(`.added-to-cart-${t}`);o.classList.add("display-added-to-cart"),setTimeout(()=>{o.classList.remove("display-added-to-cart")},1500)}document.querySelectorAll(".add-to-cart-button").forEach(t=>{t.addEventListener("click",()=>{const o=t.dataset.productId,i=t.closest(".product-container").querySelector(".ProductQuantitySelector"),c=parseInt(i.value);s(o,c),l(),e(o)})})}async function p(){try{await r(),u()}catch(a){console.log(`unexpected network error: ${a}`)}}p();
