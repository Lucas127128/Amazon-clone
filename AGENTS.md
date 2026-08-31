# AGENTS.md

## Project structure

- A svelte kit application with typescript and tailwand.
- Routes are placed in src/routes with svelte kit file-based routing.
- All buisness logic is placed in src/lib/data or src/lib/utils and all UI components are placed in src/lib/components.

## Common Pitfalls for Agents

1. **Valibot only**: No Zod; learn Valibot's API
2. **Max nesting 3 in tests**: Flatten deeply nested `describe()` calls
3. **Type imports**: Always use `import type` for types, `import` for values
4. **Package manager**: Use bun but not npm or yarn
5. **max line**: 180 lines per file
6. **Type imports**: Always use `import type` for types, `import` for values
7. **Module enforcement**: No cyclic dependencies
8. **Consistent type definition**: Always use `type`, never `interface`
9. **Barrel imports**: No barrel files
