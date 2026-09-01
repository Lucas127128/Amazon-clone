export function saveJson(key: string, value: unknown) {
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if (globalThis?.localStorage === undefined) return;
  localStorage.setItem(key, JSON.stringify(value));
}
