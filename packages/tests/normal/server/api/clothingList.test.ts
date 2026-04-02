import { describe, test, expect } from 'bun:test';
import clothingListJSON from 'server/clothing' with { type: 'json' };
import { app } from 'shared/edenTreaty';
describe.concurrent('clothing list api test', () => {
  test('return right clothing list', async () => {
    const { data: clothingList, error } = await app.api.clothingList.get();
    if (error) throw error;
    expect(clothingList).toEqual(clothingListJSON);
  });
});
