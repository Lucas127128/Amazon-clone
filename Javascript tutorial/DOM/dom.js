//Try to use dom(Document Objects Model represents the webpage)

/*document.title = 'DOM'
document.body.innerHTML = 'Hello!'
console.log(document.title)*/

//document.querySelecter & .innerHTML (already know)
console.log(document.querySelector('button').innerHTML)
document.querySelector('button').innerHTML = 'changed'

//Number()
let StringVariable = "100"
console.log(typeof StringVariable)
let NumberVariable = StringVariable
console.log(typeof NumberVariable)
NumberVariable = Number(StringVariable)
console.log(typeof NumberVariable)

//onkeydown = ''
/*Similar to onclick, but onkeydown detect the keyboard event (already know)*/

//Type Coercion
/*   If a string only contains a number, and we '-' '*' '/' =>
it will be converted into a number(but not reccommend)   */
console.log('25' - 5)

//window objects(represent the whole browser)
window.console.log('window')
