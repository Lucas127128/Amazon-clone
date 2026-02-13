import { describe, test } from 'vitest';
import clothingList from '../../../src/api/clothing.json' with { type: 'json' };
import { kyExternal } from '../../../src/data/ky';

describe('clothing list api test', () => {
  test.concurrent('return right clothing list', async ({ expect }) => {
    expect(await kyExternal.get('clothingList').json()).toEqual(
      clothingList,
    );
  });
});
