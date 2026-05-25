import { ClothingListSchema, RawProductsSchema } from 'shared/schema';
import { parse } from 'valibot';

export async function createProdDataProvider() {
  const [rawJson, clothingJson] = await Promise.allSettled([
    Bun.file('./rawData/rawProducts.json').json(),
    Bun.file('./rawData/clothing.json').json(),
  ]);
  if (rawJson.status === 'rejected') {
    return { error: { message: rawJson.reason as unknown } };
  }
  if (clothingJson.status === 'rejected') {
    return { error: { message: clothingJson.reason as unknown } };
  }
  return {
    error: undefined,
    rawProducts: parse(RawProductsSchema, rawJson.value),
    clothings: parse(ClothingListSchema, clothingJson.value),
  };
}

export type DataProvider = Awaited<
  ReturnType<typeof createProdDataProvider>
>;
