function Subscribe(){
    const SubscribeButton = document.querySelector('.SubscribeButton')
    console.log(SubscribeButton)
    console.log(SubscribeButton.innerHTML)
    if (SubscribeButton.innerHTML === 'Subscribe'){
        SubscribeButton.innerHTML = 'Subscribed'
        SubscribeButton.classList.add('is-subscribed')
    }else{
        SubscribeButton.innerHTML = 'Subscribe'
        SubscribeButton.classList.remove('is-subscribed')
    }
}
const TextInput = document.querySelector('.TextInput')
const Calculate = document.querySelector('.Calculate')
const CostOfOrder = document.querySelector('.CostOfOrder')
let OrderAmount = TextInput
function Detect_If_Input_Is_Invalid(){
    if(TextInput.value===''){
        return
    }
}
Calculate.addEventListener('click' , function(){
    Detect_If_Input_Is_Invalid()
    if (TextInput.value<40){
        OrderAmount = `${TextInput.value}+10`
        console.log(OrderAmount)
        OrderAmount = eval(OrderAmount)
        OrderAmount = Math.floor(OrderAmount*100)/100
        console.log(OrderAmount)
        CostOfOrder.innerHTML = `
        $${OrderAmount}`
    }else{
        Detect_If_Input_Is_Invalid()
        CostOfOrder.innerHTML = `
        $${TextInput.value} `
    }
})
TextInput.addEventListener('keyup', function(e)  {
    console.log(e.key)
    CostOfOrder.innerHTML = TextInput.value
    if (e.key === 'Enter' ){
        Detect_If_Input_Is_Invalid()
        Usertyping = ''
        if (TextInput.value<40){
            OrderAmount = `${TextInput.value}+10`
            console.log(OrderAmount)
            OrderAmount = eval(OrderAmount)
            OrderAmount = Math.floor(OrderAmount*100)/100
            console.log(OrderAmount)
            CostOfOrder.innerHTML = `
            $${OrderAmount}`
        }else{
            Detect_If_Input_Is_Invalid()
            CostOfOrder.innerHTML = `
            $${TextInput.value} `
        }
    }
})