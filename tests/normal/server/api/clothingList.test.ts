import { describe, test, expect } from 'bun:test';
import clothingListJSON from '#root/server//src/api/clothing.json' with { type: 'json' };
import { app } from '#root/shared/src/data/edenTreaty.ts';
describe.concurrent('clothing list api test', () => {
  test('return right clothing list', async () => {
    const { data: clothingList, error } = await app.api.clothingList.get();
    if (error) throw error;
    expect(clothingList).toEqual(clothingListJSON);
  });
});
