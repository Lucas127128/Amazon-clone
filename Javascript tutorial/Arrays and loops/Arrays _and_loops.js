/*const MyArray = [10,20,30]
console.log(MyArray)
console.log(MyArray[0])

MyArray[2] = 99
console.log(MyArray)

//Arrays in arrays
console.log(['hello', 20,[1,2]])

console.log(Array.isArray([1,2]))
//array methods

console.log(MyArray.length)
MyArray.push(100)
console.log(MyArray)
MyArray.splice(0, 1)
console.log(MyArray)

//while loop
let i =0
while(i <= 3){
    console.log(i)
    i++
}

//for loop (reccomend)
for(let i = 0; i <= 3; i++){
    console.log(i)
}

//cases we use while loop
let RandomNumber1 = Math.random(); 

while (RandomNumber1 > 0.5) {
    console.log (typeof RandomNumber1); 
    console.log(RandomNumber1);  
    RandomNumber1 = Math.random(); 
}

//Example of loop
let nums = [1, 1, 3]
let total = 0
for(let i = 0; i < nums.length; i++){
    let num = nums[i]
    total+=num
}
console.log(total)

let numsdouble = []
for(let i = 0; i < nums.length; i++){
numsdouble[i] = nums[i]*2 

}
console.log(numsdouble)
*/
//arrays are just reference, similar to object.

//destructure of arrays
const [FirstCopy, SecondCopy] = [1,2,3,4]
console.log(`${FirstCopy}, ${SecondCopy}`)

//break and continue of loop
for(let i = 0; i <= 6; i++){
    if(i === 3){
        continue;
    }
    console.log(i)
    if(i === 5){
        break;
    }
}
let i = 0
while(i<=10){
    if(i % 3 ===0){
        i++
        continue
    }
    console.log(i)
    i++;
}

function DoubleAnArray(nums){
let numsdouble = []
for(let i = 0; i < nums.length; i++){
numsdouble[i] = nums[i]*2 

}
console.log(numsdouble)
return numsdouble;
}
DoubleAnArray([1,5,7])
console.log(DoubleAnArray([1,5,7]))

//11o
let NumberOfSearch = 0
function CheckSearchIndex (CheckArray){
for(let i=0; i<CheckArray.length; i++){
    if(CheckArray[i]==='search'){
        console.log(i);
        NumberOfSearch++
    }
}
if(NumberOfSearch === 0){
    console.log('-1')
}
}
CheckSearchIndex(['gyhbhb','vghvgv','search'])

let NumberOfIndexedWord = 0
//Find index
function FindIndex(Arrays,Word){
    for(let i=1; i<Word.length; i++){
        if(Arrays[i] === Word){
            console.log(i)
            NumberOfIndexedWord++
        }
    }
    if(NumberOfIndexedWord===0){
        console.log('-1')
    }
}
FindIndex(['hello','Hi', 'Good morning'], 'Hi')
//FizzBuzz

let Numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] 
console.log(typeof Numbers)
let ConsoleMessage = Numbers
console.log(ConsoleMessage)
for(let i=1;i<ConsoleMessage.length;i++){
    if(ConsoleMessage[i]%5===0&&ConsoleMessage[i]%3 === 0){
        ConsoleMessage[i]='FizzBuzz'
        console.log(ConsoleMessage[i])
    }
    if(ConsoleMessage[i]%5 === 0){
        ConsoleMessage[i]='Buzz'
        console.log(ConsoleMessage[i])
    }
    if(ConsoleMessage[i]%3 === 0){
        ConsoleMessage[i]='Fizz'
        console.log(ConsoleMessage[i])
    }
}
console.log(JSON.stringify(ConsoleMessage))
//unique array

function UnipueArray(Array){
    let Result = {}
    let UniqeWords = []
    for(let i=0; i<Array.length; i++){
            const word = Array[i];
          // result[word] adds/accesses a property using whatever is
          // saved inside the 'word' variable.
          // If word = 'apple', result[word] will do result['apple']
          // If word = 'grape', result[word] will do result['grape']
          if (!Result[word]) {
            UniqeWords.push(word)
            Result[word] = true
          } 
    }
    return UniqeWords;
}
console.log(UnipueArray(['hello','Hi', 'Good morning', 'hello']))