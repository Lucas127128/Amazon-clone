import { test, describe, vi, expect } from "vitest";
import { formatCurrency } from "../../Scripts/Utils/Money.js";

describe.concurrent("test suite: FormatCurrency", () => {
  test("converts cents into dollars", async ({ expect }) => {
    expect(formatCurrency(2095)).toBe("20.95");
  });

  test("works with 0", async ({ expect }) => {
    expect(formatCurrency(0)).toBe("0.00");
  });

  test("round up to nearest cents", async ({ expect }) => {
    expect(formatCurrency(2000.5)).toBe("20.01");
  });

  test("round down to nearest cents", async ({ expect }) => {
    expect(formatCurrency(2000.4)).toBe("20.00");
  });

  test("converts negative cents to dollar", async ({ expect }) => {
    expect(formatCurrency(-2095)).toBe("-20.95");
  });

  test("not convert text", async ({ expect }) => {
    expect(formatCurrency("money")).toBe("NaN");
  });

  test("mocking practice", async ({ expect }) => {
    let apples = 0;
    const cart = {
      getApples: () => 42,
    };
    const spy = vi.spyOn(cart, "getApples").mockImplementation(() => apples);
    apples = 1;
    expect(cart.getApples()).toBe(1);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturnedWith(1)
  });
});
