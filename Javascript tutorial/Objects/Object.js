/*const Product = {
        name: 'Socks', 
        price:100
    }
console.log(Product)
console.log(Product.price)

Product.name = 'Cotton Socks'
console.log(Product)
Product.NewProperty = true
console.log(Product)
delete Product.NewProperty
console.log(Product)
*/
const Product2 = {
    name: "shirt",
    'dilivery-time' : '1 day',
    rating:{
        Stars: 4.4,
        Count: 87
    }
}
console.log(Product2.name)
console.log(Product2["name"])
console.log(Product2['dilivery-time'])
console.log(Product2.rating.Stars)

//JSON
console.log(JSON.stringify(Product2))

const JsonString = JSON.stringify(Product2)
console.log(JSON.parse(JsonString))

//Local Storage

localStorage.setItem('message', 'Hello!')
console.log(localStorage.getItem('message'))

//Other methods in JS
console.log('Hello!'.toUpperCase())
console.log('Hello!!!!'.toLowerCase())
console.log('Hello World! '.repeat(3))

/* Object do not store the data. It will just store the reference(shortcut)
 of the data inside. Therefore, we can can use const for object and 
 change the value inside without any error. See the example below.
 */
const Object1 = {
    message: "Hello!"
}
console.log(Object1.message)
Object1.message = "good job!"
console.log(Object1.message)

const Object2 = {
    message:"good job!"
}
console.log(Object1 === Object2)
/*It is comparing the reference, not the data of two Object.
Therefore, answer is false. */

//Destruct objects
const { message } = Object2
console.log(message)