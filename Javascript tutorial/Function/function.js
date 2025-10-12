//Already know how to do, no need to follow
//return statement
function Testing(){
    alert('This is an funtion')
    return 5
}
console.log(Testing())
function Testing2(){
    alert('This is an funtion')
    return ;
    console.log('5')
}
console.log(Testing2())
//parameters
function CalculateTax(Cost, TaxPercent=0.1){
    console.log(Cost*TaxPercent)
}
CalculateTax(2000)
CalculateTax(5000)
