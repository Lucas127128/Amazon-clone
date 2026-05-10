# Dependencies Catalog

This document catalogues all centralized dependencies managed via the `workspaces.catalog` feature in the root `package.json`.

**Total Cataloged Dependencies:** 7

---

## Cataloged Dependencies

### Testing & Development Tools

#### `vitest@^4.1.5`

- **Purpose:** Unit testing framework
- **Type:** Dev Dependency
- **Used by:**
  - `web` (devDependencies)
  - `server` (devDependencies)
  - `shared` (devDependencies)
  - `root` (devDependencies)

#### `happy-dom@^20.9.0`

- **Purpose:** Lightweight DOM implementation for testing
- **Type:** Dev Dependency
- **Used by:**
  - `web` (devDependencies)
  - `server` (devDependencies)
  - `shared` (devDependencies)
  - `root` (devDependencies)

#### `@vitest/ui@^4.1.5`

- **Purpose:** Vitest UI dashboard for test reporting
- **Type:** Dev Dependency
- **Used by:**
  - `web` (devDependencies)
  - `server` (devDependencies)
  - `shared` (devDependencies)

### Core Runtime Dependencies

#### `valibot@^1.3.1`

- **Purpose:** Type-safe schema validation library
- **Type:** Dependency
- **Used by:**
  - `web` (dependencies)
  - `server` (dependencies)
  - `shared` (dependencies)

#### `temporal-polyfill-lite@^0.3.5`

- **Purpose:** Polyfill for Temporal API (dates/times)
- **Type:** Dependency
- **Used by:**
  - `web` (dependencies)
  - `server` (dependencies)
  - `shared` (dependencies)
  - `root` (devDependencies)

#### `vite@^8.0.10`

- **Purpose:** Build tool and dev server
- **Type:** Dev Dependency
- **Used by:**
  - `web` (devDependencies)
  - `root` (devDependencies)

#### `@tanstack/store@^0.11.0`

- **Purpose:** Lightweight state management library
- **Type:** Dependency
- **Used by:**
  - `web` (dependencies)

---

## Package Usage Matrix

| Package                  | Web | Server | Shared | Root |
| ------------------------ | --- | ------ | ------ | ---- |
| `vitest`                 | ✅  | ✅     | ✅     | ✅   |
| `happy-dom`              | ✅  | ✅     | ✅     | ✅   |
| `@vitest/ui`             | ✅  | ✅     | ✅     | —    |
| `valibot`                | ✅  | ✅     | ✅     | —    |
| `temporal-polyfill-lite` | ✅  | ✅     | ✅     | ✅   |
| `vite`                   | ✅  | —      | —      | ✅   |
| `@tanstack/store`        | ✅  | —      | —      | —    |

---
