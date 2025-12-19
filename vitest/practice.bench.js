import { bench } from "vitest";

//const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const numbers = [];
for (let i = 0; i < 10000; i++) {
  const randomNumber = Number(Math.round(Math.random() * 10).toFixed(0));
  numbers[i] = randomNumber;
}
bench("forEach", () => {
  numbers.forEach((number) => {
    if (number === 5) {
      return number;
    }
  });
});

bench("find", () => {
  return numbers.find((number) => number === 5);
});
