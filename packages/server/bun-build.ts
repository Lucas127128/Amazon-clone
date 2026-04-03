await Bun.build({
  compile: true,
  minify: true,
  sourcemap: true,
  bytecode: true,
  format: 'esm',
  entrypoints: ['./src/api/index.ts'],
  target: 'bun',
});
export {};
