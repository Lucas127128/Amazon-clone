import { describe, test, vi, beforeAll, expect } from "vitest";
import {
  addWeekDays,
  getDeliveryDate,
  deliveryOptions,
  getPriceString,
  getDeliveryPriceCents,
} from "../../../src/data/deliveryOption";
import { Temporal } from "temporal-polyfill";
import { match } from "ts-pattern";

describe("Delivery time test", () => {
  beforeAll(() => {
    const fakeTime = new Date("2026-02-09T16:00:00.000");
    vi.useFakeTimers();
    vi.setSystemTime(fakeTime);
  });
  test.concurrent("addWeekDays", ({ expect }) => {
    for (const [index, deliveryOption] of deliveryOptions.entries()) {
      const correctAddedDate = match(deliveryOption.id)
        .returnType<string>()
        .with("1", () => "2026-02-18")
        .with("2", () => "2026-02-12")
        .with("3", () => "2026-02-10")
        .otherwise(() => {
          throw new Error(`deliveryOptionId ${deliveryOption.id} is not valid`);
        });
      const localNow = Temporal.Now.plainDateISO();
      const daysToAdd = match(index)
        .returnType<number>()
        .with(0, () => 7)
        .with(1, () => 3)
        .with(2, () => 1)
        .otherwise(() => {
          throw new Error(`Index ${index} is not valid`);
        });
      const addedDate = addWeekDays(daysToAdd, localNow).toJSON();
      expect(addedDate).toBe(correctAddedDate);
    }
  });

  test.concurrent("getDeliveryDate", ({ expect }) => {
    for (const [index, deliveryOption] of deliveryOptions.entries()) {
      const correctDeliveryDate = match(deliveryOption.id)
        .returnType<string>()
        .with("1", () => "Wednesday, February 18")
        .with("2", () => "Thursday, February 12")
        .with("3", () => "Tuesday, February 10")
        .otherwise(() => {
          throw new Error(`deliveryOptionId ${deliveryOption.id} is not valid`);
        });
      const deliveryDate = getDeliveryDate(`${index + 1}`);
      expect(deliveryDate).toBe(correctDeliveryDate);
    }
  });
});

describe("Delivery price test", () => {
  test.concurrent("getPriceString", ({ expect }) => {
    expect(getPriceString(0)).toBe("FREE - ");
    expect(getPriceString(499)).toBe("$4.99 - ");
    expect(getPriceString(999)).toBe("$9.99 - ");
  });

  test.concurrent("getDeliveryPriceCents", ({ expect }) => {
    expect(getDeliveryPriceCents("1")).toBe(0);
    expect(getDeliveryPriceCents("2")).toBe(499);
    expect(getDeliveryPriceCents("3")).toBe(999);
  });
});
