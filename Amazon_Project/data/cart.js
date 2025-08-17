export let Cart = [{
    ProductId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    Quantity: 2
},{
    ProductId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    Quantity: 1
}]
export function Add_To_cart(productId, quantityToAdd){
    let MatchingItem;
    Cart.forEach((cartItem)=>{
        if(productId===cartItem.ProductId){
            MatchingItem=cartItem
        }
    })
    if(MatchingItem){
        MatchingItem.Quantity++
    }else{
        Cart.push({
        ProductId: productId,
        Quantity: quantityToAdd
    })
    }
    localStorage.setItem('local_Storage_Cart',JSON.stringify(Cart))
}

export function RemoveFromCart(productId){
    let newCart=[]
    JSON.parse(localStorage.getItem('local_Storage_Cart'))
    .forEach((Product)=>{
        if(Product.ProductId!=productId){
            newCart.push(Product)
        }
    })
    localStorage.setItem('local_Storage_Cart',JSON.stringify(newCart))
    Cart=newCart
}