import { Elysia } from 'elysia';
import { log } from 'evlog';
import { FileExtensionSchema } from 'shared/schema';
import { safeParse } from 'valibot';

import { handler } from './service.ts';

const glob = new Bun.Glob('**/*');
const filesName = [...glob.scanSync('../web/dist')];

export const staticPlugin = new Elysia({
  precompile: true,
  nativeStaticResponse: true,
})
  .get(
    '/',
    ({ redirect }) => {
      return redirect('/index.html');
    },
    { detail: { description: 'Redirect to /index.html' } },
  )
  .get('/speculationRules.json', async ({ set }) => {
    set.headers['content-type'] = 'application/speculationrules+json';
    return await Bun.file('../shared/config/speculationRules.json').text();
  });

await Promise.all(
  filesName.map(async (fileName) => {
    const { output: fileExtension, issues } = safeParse(
      FileExtensionSchema,
      fileName.split('.').pop()?.toLowerCase(),
    );
    if (issues) {
      console.log(fileExtension, fileName);
      throw issues;
    }

    const fileObj = Bun.file(`../web/dist/${fileName}`);
    const file =
      handler[fileExtension].type === 'text'
        ? Bun.gzipSync(await fileObj.text())
        : await fileObj.bytes();

    const route = fileName.replace('./dist', '');
    const cacheControl = handler[fileExtension].cacheTTL;
    const { compress } = handler[fileExtension];
    const { mimeType } = handler[fileExtension];

    staticPlugin.get(route, ({ set }) => {
      set.headers['content-type'] = mimeType;
      set.headers['cache-control'] = cacheControl;
      set.headers['content-encoding'] = compress;
      log.info({ event: 'static.serve', route });
      return file;
    });
  }),
);
