# AGENTS.md

## Linting

**Key lint rules to watch:**

- `oxc/no-barrel-file`: Barrel imports banned (`index.ts` re-exports)
- `max-lines`: 180 lines per file (strict)
- `typescript/consistent-type-definitions`: Use `type`, never `interface`
- `typescript/consistent-type-imports`: Import types as `import type`
- `simple-import-sort/imports`: Auto-sort imports (enforced by oxlint)
- `vitest/max-nested-describe`: Max 3 levels of `describe()` nesting
- `import/no-cycle`: No cyclic dependencies

## Pre-Commit Hooks

Husky runs before commit (`.husky/pre-commit`):

```sh
bun fmt & bun pre-commit & bunx turbo boundaries & bun i --frozen-lockfile
wait
```

Where `bun pre-commit` = `bunx turbo run lint knip test:unit`.

Commits fail if any step fails.

## CI Workflow

Two jobs:

- test
- audit

## Common Pitfalls for Agents

1. **Valibot only**: No Zod; learn Valibot's API
2. **Max nesting 3 in tests**: Flatten deeply nested `describe()` calls
3. **Type imports**: Always use `import type` for types, `import` for values
4. **Package manager**: Use bun but not npm or yarn
