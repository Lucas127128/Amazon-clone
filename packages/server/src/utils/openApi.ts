import { openapi } from '@elysiajs/openapi';
import { toJsonSchema } from '@valibot/to-json-schema';
import Elysia from 'elysia';

export const openApi = () => {
  if (Bun.env.DEV) {
    return new Elysia().use(
      openapi({
        mapJsonSchema: { valibot: toJsonSchema },
      }),
    );
  } else {
    return new Elysia();
  }
};
