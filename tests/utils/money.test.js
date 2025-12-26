import { test, describe, vi, expect, bench, expectTypeOf } from "vitest";
import { formatCurrency } from "../../Scripts/Utils/Money.ts";

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

  test("not to convert string", async ({ expect }) => {
    expect(formatCurrency("money")).toBe("NaN");
  });

  test("return string", async ({ expect }) => {
    expectTypeOf(formatCurrency("2095")).toBeString();
  });
});
