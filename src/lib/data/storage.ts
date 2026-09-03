import { type BaseIssue, type BaseSchema, parse } from 'valibot';

export function saveJson(key: string, value: unknown) {
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if (globalThis?.localStorage === undefined) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadJson<
  TInput$1,
  TOutput$1,
  TIssue extends BaseIssue<unknown>,
>(
  key: string,
  schema: BaseSchema<TInput$1, TOutput$1, TIssue>,
  defaultValue: TOutput$1 = [] as TOutput$1,
) {
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if (globalThis?.localStorage === undefined) return defaultValue;
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;
  return parse(schema, JSON.parse(value));
}
