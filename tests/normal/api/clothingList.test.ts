import { describe, test, expect } from 'vitest';
import clothingListJSON from '#root/src/api/clothing.json' with { type: 'json' };

describe('clothing list api test', () => {
  test.concurrent('return right clothing list', async () => {
    const clothingList = await (
      await fetch('https://localhost:8080/api/clothingList')
    ).json();
    expect(clothingList).toEqual(clothingListJSON);
  });
});
