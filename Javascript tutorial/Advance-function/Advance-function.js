//function are values

function Greeting(){
    console.log('hello')
}
const function1 = function (){
    console.log('hello2')
}
function1()
Greeting()
Object1 = {
    Func : function(){
        console.log('Hello')
    } 
}
Object1.Func()

//pass function to function
function function2(param){
param()
}
function2(function(){
    console.log('hello world')
})

//settimeout()
setTimeout(function(){
    console.log('Hello World')
}, 3000)
console.log('hi')
setInterval(function(){
    //console.log('Hello world')
},3000)

//forEach()
const Arrays = ['hello','hi','Hello']
Arrays.forEach((value,index)=>{
    if(value==='hi'){
        return;
    }
    console.log(index)
    console.log(value)
})

//arrow function
const ArrowFunction = ()=>{
    console.log('Arrow function test')
}
ArrowFunction()
const OneLine = ()=> 2+3

const MutipleLine = ()=> {
   return 2+3;
}
//OneLine and MultipleLine is actually the same
const ClickButotn = document.querySelector('.ClickButton')
ClickButotn.addEventListener('click',()=>{
    console.log('click')
})
let FilterArray=[1,2,-5]
console.log(FilterArray)
FilterArray=FilterArray.filter((value,index)=>{
    if(value>=0){
        return true 
    }else{ 
        return false
    }
})
console.log(FilterArray)
const MapArray=[1,1,3]
console.log(MapArray.map(value=>{
    return value*10;
}))