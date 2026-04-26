import { $ } from 'bun';

Bun.env.PROD = true;

await Bun.build({
  env: 'inline',
  compile: true,
  minify: true,
  sourcemap: true,
  bytecode: true,
  format: 'esm',
  entrypoints: ['./src/api/index.ts'],
  target: 'bun',
});

if (process.platform === 'darwin') {
  await $`codesign --remove-signature ./api`;
  await $`codesign --force --sign - ./api`;
}

await Promise.all([
  $`find . -name '*.bun-build' -type f -delete`,
  $`PROD=true ./api`,
]);
