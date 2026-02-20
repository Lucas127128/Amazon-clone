import { $ } from 'bun';

const filesName = (await $`find ./tests/normal -type f`.text())
  .split('\n')
  .filter(
    (fileName) => fileName.length > 4 && !fileName.includes('.DS_Store'),
  );

for (const fileName of filesName) {
  const file = await Bun.file(fileName).text();
  const replacedFile = file.replaceAll('{ expect }', '');
  await Bun.write(fileName, replacedFile);
}
