import { FormatCurrency } from "../../Scripts/Utils/Money.js";

describe("test suite: FormatCurrency", () => {
  it("converts cents into dollars", () => {
    expect(FormatCurrency(2095)).toEqual("20.95");
  });
  it("works with 0", () => {
    expect(FormatCurrency(0)).toEqual("0.00");
  });
  it("round up to nearest cents", () => {
    expect(FormatCurrency(2000.5)).toEqual("20.01");
  });
  it("round down to nearest cents", () => {
    expect(FormatCurrency(2000.4)).toEqual("20.00");
  });
  it("converts negative cents to dollar", () => {
    expect(FormatCurrency(-2095)).toEqual("-20.95");
  });
});
