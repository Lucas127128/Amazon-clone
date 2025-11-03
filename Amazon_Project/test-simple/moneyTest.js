import { FormatCurrency } from "../Scripts/Utils/Money.js";
console.log("test suite: FormatCurrency");
console.log("converts cents into dollars");
console.log(FormatCurrency(2095) === "20.95");
console.log("works with 0");
console.log(FormatCurrency(0) === "0.00");
console.log("round up to nearest cents");
console.log(FormatCurrency(2000.5) === "20.01");
