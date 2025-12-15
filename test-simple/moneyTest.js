import { formatCurrency } from "../Scripts/Utils/Money.js";
console.log("test suite: FormatCurrency");
console.log("converts cents into dollars");
console.log(formatCurrency(2095) === "20.95");
console.log("works with 0");
console.log(formatCurrency(0) === "0.00");
console.log("round up to nearest cents");
console.log(formatCurrency(2000.5) === "20.01");
