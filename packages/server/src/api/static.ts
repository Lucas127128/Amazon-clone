import { Elysia } from 'elysia';
import { checkNullish } from 'shared/typeChecker';
import { match, P } from 'ts-pattern';

const glob = new Bun.Glob('**/*');
const filesName = [...glob.scanSync('../web/dist')];

export const staticPlugin = new Elysia({ precompile: true })
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
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    const contentType = match(fileExtension)
      .with('html', () => 'text/html')
      .with('css', () => 'text/css')
      .with('js', () => 'text/javascript')
      .with('webp', () => 'image/webp')
      .with('png', () => 'image/png')
      .with('svg', () => 'image/svg+xml')
      .with('jpg', 'jpeg', () => 'image/jpeg')
      .with('ico', () => 'image/x-icon')
      .with(P._, P.nullish, () => undefined)
      .exhaustive();

    const fileObj = Bun.file(`../web/dist/${fileName}`);
    const file = await match(fileExtension)
      .with('html', 'css', 'js', async () => await fileObj.text())
      .with(
        'webp',
        'png',
        'jpg',
        'jpeg',
        'svg',
        async () => await fileObj.bytes(),
      )
      .with(P._, P.nullish, async () => await fileObj.bytes())
      .exhaustive();

    const compressedFile = Bun.gzipSync(file);

    const cacheControl = match(fileExtension)
      .with('html', () => 'public, no-cache')
      .with('css', 'js', () => 'public, max-age=15552000')
      .with(
        'webp',
        'png',
        'jpg',
        'jpeg',
        'svg',
        () => 'public, max-age=15552000',
      )
      .with(P._, P.nullish, () => undefined)
      .exhaustive();

    const route = fileName.replace('./dist', '');

    staticPlugin.get(route, ({ set }) => {
      checkNullish(contentType);
      set.headers['content-type'] = contentType;
      set.headers['cache-control'] = cacheControl;
      set.headers['content-encoding'] = 'gzip';
      set.headers['strict-transport-security'] =
        'max-age=31536000; includeSubDomains; preload';
      set.headers['cross-origin-opener-policy'] =
        'same-origin-allow-popups';
      set.headers['content-security-policy'] =
        "default-src 'none'; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self' data:; frame-ancestors 'none'; require-trusted-types-for 'script';";
      set.headers['Speculation-Rules'] = '"/speculationRules.json"';
      return compressedFile;
    });
  }),
);
