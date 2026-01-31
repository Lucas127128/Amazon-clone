import { describe, test } from "vitest";
import clothingList from "../../../src/api/clothing.json" with { type: "json" };
import { external } from "../../../src/data/axios";

describe("clothing list api test", () => {
  test.concurrent("return right clothing list", async ({ expect }) => {
    expect((await external.get("/clothingList")).data).toEqual(clothingList);
  });
});
