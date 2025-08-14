let Products=[{
    Image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
    Name : 'Black and Gray Athletic Cotton Socks - 6 Pairs',
    Rating : {
        Stars : 4.5,
        Count : 87
    },
    PriceCents : 1090
},{
    Image: 'images/products/intermediate-composite-basketball.jpg',
    Name: 'Intermediate Size Basketball',
    Rating : {
        Stars : 4,
        Count : 127
    },
    PriceCents : 2095
},{
    Image: 'images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg',
    Name: 'Adults Plain Cotton T-Shirt - 2 Pack',
    Rating : {
        Stars : 4.5,
        Count : 56
    },
    PriceCents : 799
},{
    Image: 'images/products/black-2-slot-toaster.jpg',
    Name: '2 Slot Toaster - Black',
    Rating : {
        Stars : 5,
        Count : 2197
    },
    PriceCents : 1899
}]
let ProductsHTML = ''
Products.forEach((products)=>{ProductsHTML += `
        <div class="product-container">
            <div class="product-image-container">
                <img class="product-image"
                src="${products.Image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${products.Name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars"
                src="images/ratings/rating-${products.Rating.Stars * 10}.png">
                <div class="product-rating-count link-primary">
                ${products.Rating.Count}
                </div>
            </div>

            <div class="product-price">
                $${(products.PriceCents / 100).toFixed(2)}
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

            <button class="add-to-cart-button button-primary">
                Add to Cart
            </button>
            </div>
        </div>
    `
})
console.log(ProductsHTML)
const ProductsGrid = document.querySelector('.products-grid')
ProductsGrid.innerHTML = ProductsHTML