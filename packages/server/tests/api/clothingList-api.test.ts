import { describe, expect, it } from 'vitest';

import clothingListJSON from '../../rawData/clothing.json' with { type: 'json' };
import { app } from '../../src/utils/edenTreaty.ts';

describe.concurrent('clothing list api test', () => {
  it('return right clothing list', async () => {
    const { data: clothingList } = await app.api.clothingList.get();
    expect(clothingList).toEqual(clothingListJSON);
  });
});
