//truthy and falsy 
if(0){
    console.log('Hello')
}else{
    console.log("Bye")
}
//if-statement(tenary)
const Test = false ? "truthy" : "falsy"
console.log(Test)
//if-statement(guard &&)
const Message = 5 && 'hello'
console.log(Message)
//default || , Similar with guard &&
const Currency = 0||"USD"
console.log(Currency)