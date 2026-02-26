import { Elysia } from 'elysia';
import { match, P } from 'ts-pattern';

const filesName = (await Bun.$`find ./dist -type f`.text())
  .split('\n')
  .filter(
    (fileName) => fileName.length > 7 && !fileName.includes('.DS_Store'),
  );

export const staticPlugin = new Elysia({ precompile: true })
  .get('/', async ({ set }) => {
    set.headers['content-type'] = 'text/html';
    set.headers['cache-control'] = 'public, max-age=15552000';
    return await Bun.file('./dist/index.html').text();
  })
  .mapResponse(async ({ responseValue }) => {
    const body = <string | ArrayBuffer>await responseValue;
    const compressed = Bun.gzipSync(body);
    return new Response(compressed, {
      headers: {
        'Content-Encoding': 'gzip',
      },
    });
  });

for (const fileName of filesName) {
  const fileExtention = fileName.split('.')[2].toLowerCase();
  const contentType = match(fileExtention)
    .with('html', () => 'text/html')
    .with('css', () => 'text/css')
    .with('js', () => 'text/javascript')
    .with('webp', () => 'image/webp')
    .with('png', () => 'image/png')
    .with('svg', () => 'image/svg+xml')
    .with('jpg', 'jpeg', () => 'image/jpeg')
    .with(P._, P.nullish, () => undefined)
    .exhaustive();

  const fileObj = Bun.file(fileName);
  const file = match(fileExtention)
    .with('html', 'css', 'js', async () => await fileObj.text())
    .with('webp', 'png', 'jpg', 'jpeg', async () => await fileObj.bytes())
    .with(P._, P.nullish, async () => await fileObj.bytes())
    .exhaustive();

  const cacheControl = match(fileExtention)
    .with('html', () => 'public, no-cache')
    .with('css', 'js', () => 'public, max-age=15552000')
    .with('webp', 'png', 'jpg', 'jpeg', () => 'public, max-age=15552000')
    .with(P._, P.nullish, () => undefined)
    .exhaustive();

  const route = fileName.replace('./dist', '');

  staticPlugin.get(route, ({ set }) => {
    if (contentType) {
      set.headers['content-type'] = contentType;
    }
    set.headers['cache-control'] = cacheControl;
    set.headers['strict-transport-security'] =
      'max-age=31536000; includeSubDomains; preload';
    set.headers['cross-origin-opener-policy'] = 'same-origin-allow-popups';
    set.headers['content-security-policy'] =
      "default-src 'none'; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; require-trusted-types-for 'script';";
    return file;
  });
}
