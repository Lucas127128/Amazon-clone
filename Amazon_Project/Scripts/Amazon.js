let ProductsHTML = ''
Products.forEach((products)=>{ProductsHTML += `
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
                src="images/ratings/rating-${products.rating.stars * 10}.png">
                <div class="product-rating-count link-primary">
                ${products.rating.count}
                </div>
            </div>

            <div class="product-price">
                $${(products.priceCents / 100).toFixed(2)}
            </div>

            <div class="product-quantity-container">
                <select>
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

            <div class="product-spacer"></div>

            <div class="added-to-cart">
                <img src="images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary"
            data-product-id="${products.id}">
                Add to Cart
            </button>
            </div>
        </div>
    `
})
const ProductsGrid = document.querySelector('.products-grid')
ProductsGrid.innerHTML = ProductsHTML
let AddToCartButton = document.querySelectorAll('.add-to-cart-button')
AddToCartButton.forEach((Button) => {
    Button.addEventListener('click', ()=>{
        let ProductId = Button.dataset.productId
        let  MatchingItem 
        Cart.forEach((Item)=>{
            if(ProductId===Item.ProductId){
                MatchingItem=Item
            }
        })
        if(MatchingItem){
            MatchingItem.Quantity++
        }else{
            Cart.push({
            ProductId: ProductId,
            Quantity: 1
        })
        }
        console.log(Cart)
    })
})