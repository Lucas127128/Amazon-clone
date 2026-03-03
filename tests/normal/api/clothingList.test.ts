import { describe, test, expect } from 'bun:test';
import clothingListJSON from '#root/src/api/clothing.json' with { type: 'json' };
import { app } from '#data/edenTreaty.ts';

describe('clothing list api test', () => {
  test.concurrent('return right clothing list', async () => {
    const { data: clothingList, error } = await app.api.clothingList.get();
    if (error) throw error;
    expect(clothingList).toEqual(clothingListJSON);
  });
});
