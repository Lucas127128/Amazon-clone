# AGENTS.md

## Monorepo Structure

Five packages in `packages/`:

- **`server`**: Elysia backend (HTTP API, clustering, HTTP3)
- **`web`**: Vite frontend (HTML + TypeScript, Rolldown build)
- **`shared`**: Common types, schemas, utilities, tagged errors
- **`api-client`**: Eden Treaty client with caching/retry
- **`testData`**: Test fixtures (imported as `"testdata"` workspace)

## Package Manager

**Use Bun, not npm or yarn.**

- Install: `bun i`
- CI installs with: `bun i --frozen-lockfile`
- Run scripts: `bun run <script>`
- Run in workspace: `bun run --cwd ./packages/<name> <script>`

## Build & Dev

All orchestration via **Turbo** (`turbo.json`):

| Command                       | Effect                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `bun run build`               | Builds all packages (`turbo run build`)                                          |
| `bun run dev`                 | Runs server+web in parallel via turbo (`turbo run web#dev server#dev --ui tui`)  |
| `bun run start`               | Production server from `./packages/server/start-server.ts` (compiles+code-signs) |
| `bun run test:coverage`       | Runs all tests with coverage                                                     |
| `bun run test:merge-coverage` | Merges coverage reports                                                          |
| `bun run test:check-coverage` | Checks coverage thresholds (90% lines/functions, 80% branches)                   |

Dev server runs HTTPS locally; `mkcert` certs at `packages/server/certs/` (required for CI).

## Testing

**Per-package Vitest configs** (no central `vitest.config.ts`):

- `packages/shared/vitest.config.ts`: `bun` environment (data/utils) + `happy-dom` (typeChecker)
- `packages/server/vitest.config.ts`: `bun` environment (unit) + `api` (integration, needs live server)
- `packages/web/vitest.config.ts`: `bun` environment (data/htmlGenerators) + `happy-dom` (checkout/url/cart)
- `packages/api-client/vitest.config.ts`: `bun` environment (single project)

Run tests:

| Command             | Effect                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `bun run test`      | All packages watch mode (`turbo run web#test:watch server#test:watch shared#test:watch api-client#test:watch --ui tui`) |
| `bun run test:unit` | Unit tests via turbo (`turbo run test:unit`)                                                                            |
| `bun run test:api`  | API integration tests (`bun run test ./normal/server/api --watch`)                                                      |

Tests use `happy-dom` with SSL disabled (`disableStrictSSL`, `disableSameOriginPolicy`). Common vitest config across all packages: `pool: threads`, `maxConcurrency: 150`, `sequence: concurrent`, `typecheck: enabled`, `detectAsyncLeaks: true`, coverage via `istanbul` to `../../coverage/<pkg>`.

## Linting & Formatting

- **Lint**: `bun lint` → oxlint (config at `oxlint.config.ts`, runs eslint + TypeScript + unicorn + oxc + promise + import + vitest plugins)
- **Format**: `bun fmt` → oxfmt (in-place code formatting)

**Key lint rules to watch:**

- `oxc/no-barrel-file`: Barrel imports banned (`index.ts` re-exports)
- `max-lines`: 180 lines per file (strict)
- `typescript/consistent-type-definitions`: Use `type`, never `interface`
- `typescript/consistent-type-imports`: Import types as `import type`
- `simple-import-sort/imports`: Auto-sort imports (enforced by oxlint)
- `vitest/max-nested-describe`: Max 3 levels of `describe()` nesting
- `import/no-cycle`: Max dependency depth 3

## Pre-Commit Hooks

Husky runs before commit (`.husky/pre-commit`):

```sh
bun fmt & bun pre-commit & bunx turbo boundaries & bun i --frozen-lockfile
wait
```

Where `bun pre-commit` = `bunx turbo run lint knip test:unit`.

Commits fail if any step fails.

## CI Workflow

`.github/workflows/ci.yaml` on every push, two jobs:

**test job:**

1. Checkout (`actions/checkout@v5`)
2. Cache (`actions/cache@v5` — node_modules, bun, certs, turbo cache, coverage)
3. Install Bun (`oven-sh/setup-bun@v2`)
4. `bun i --frozen-lockfile`
5. `bun run build` (compiles web)
6. Download `mkcert` from Filippo's releases, generate HTTPS certs
7. Start server in background (`Lucas127128/background-action@v1`, wait for `https://localhost:8080`)
8. `bunx turbo run test` (all tests, server must be live)

**audit job:**

1. Checkout, install Bun, `bun i --frozen-lockfile`
2. `bun audit --prod`

## Schemas & Validation

Uses **Valibot** for runtime validation (not Zod):

- Main schema: `shared/src/schema.ts` (exported as `"shared/schema"`)
- Elysia server uses Valibot for request/response validation
- `@valibot/to-json-schema` for OpenAPI conversion
- OpenAPI docs at `https://localhost:8080/openapi` (dev only)

## Server Details

- **Framework**: Elysia with TypeScript AOT + precompile enabled, HTTP3 support
- **Entry**: `packages/server/src/api/server.ts`
- **Clustering**: `packages/server/src/api/index.ts` forks via `cluster.fork()` for all CPUs
- **Dev mode**: `DEV=true bun run --watch ./src/api/server.ts`
- **Compiled start**: `start-server.ts` builds with `Bun.build({ compile: true, bytecode: true })`, code-signs on macOS
- **Data**: JSON files in `rawData/` (products, clothing)
- **Logging**: evlog with FS drain pipeline in prod, user-agent/request-size enrichers, Elysia middleware via `evlog/elysia`
- **Security headers**: CSP (`require-trusted-types-for 'script'`), `Speculation-Rules`, COOP, HSTS, CORS with 3 origins from `GLOBAL_CONFIG`
- **Plugins**: orders (Effect-based), products (Option-based), search (Orama + Bun.cron cache), static (gzip compression per type)
- **Load testing**: `bombardier -c 5000 -n 50000` script available

## Web Details

- **Framework**: Vite with Rolldown, raw TypeScript (no SPA framework)
- **Entry points**: `packages/web/src/*.html` (index, checkout, orders, tracking)
- **Build**: `vite build` outputs to `packages/web/dist`
- **Imports**: `#pages/*`, `#utils/*`, `#data/*`, `#viewModels/*` (path aliases in `package.json:6-11`)
- **CSS**: LightningCSS transformer (targets safari 15+, chrome 100+, firefox 100+)
- **Plugins** (build only): html-minifier, purgecss, sonda (bundle analysis), jsShaker, comptime

## Effect Integration

- **effect@^4.0.0-beta.83** in catalog, used across `server`, `web`, `shared`, `api-client`
- `Data.TaggedError` for structured errors: `UnexpectedError`, `JsonParseError`, `ValidationError`, `PriceCalculationError`, `MatchingCartError`, etc.
- `Effect.succeed`/`Effect.fail` in `calculatePrices()` and order creation
- `Option.fromNullishOr` for nullable product lookups in products service
- `Effect.runSync` + `Effect.match` for turning Effect results into HTTP responses

## Knip Configuration

Config file: `knip.ts`. Entry points per workspace:

- `packages/server`: `src/api/index.ts`
- `packages/web`: `src/scripts/pages/*.ts`, `vitest.setup.ts`
- `packages/shared`: `vitest.setup.ts`
- `packages/api-client`: `vitest.setup.ts`

Ignored deps: `@types/trusted-types`, `husky`, `@socketsecurity/bun-security-scanner`, `vite`.
Ignored binaries: `bombardier`, `codesign`.

## TypeScript Config

`tsconfig.json` (root):

- `target: esnext`, `module: esnext`
- `allowImportingTsExtensions: true` (import `.ts` directly)
- `moduleResolution: bundler`
- No emit (`noEmit: true`)
- Strict mode enabled, `strictNullChecks: true`
- `skipLibCheck: true`
- `forceConsistentCasingInFileNames: true`
- Allow synthetic default imports for compatibility

## Environment & Secrets

- **Dev mode** detected by `DEV=true` env var
- **Prod mode** uses `Bun.env.PROD` (set in `start-server.ts`)
- **Test mode** detected by `NODE_ENV=test`
- SSL certs in CI: `packages/server/certs/` (must exist, generated by mkcert)
- No `.env` file pattern; config via `shared/config/constants.ts` (exported as `"shared/constants"`)
- Constants include: `UI_TIMEOUTS`, `FETCH_CONFIG`, `CART_CONFIG`, `PRICE_CONFIG`, `STORAGE_KEYS`, `GLOBAL_CONFIG`

## Workspace Dependencies

Use workspace protocol: `"package": "workspace:*"` (always semver-compatible).
Packages are strict about exports; only use public API.

- `server` exports: `"."` (main API), `"./rawProducts"`, `"./clothing"`
- `web` exports: specific modules under `"./module-name"` (via imports)
- `shared` exports: `"./schema"`, `"./taggedError"`, `"./products"`, `"./deliveryOption"`, `"./typeChecker"`, `"./constants"`, `"./payment"`, `"./money"`
- `api-client` exports: `"."` (Eden treaty client)
- `testData` exports via `"testdata"` workspace name

## Common Pitfalls for Agents

1. **Bun, not npm**: `npm install` will fail; use `bun i`
2. **Barrel files banned**: No `index.ts` with `export * from '...'`
3. **Line limit 180**: Split long files; oxlint enforces this
4. **Per-package vitest configs**: Each package controls its own test projects; no central `vitest.config.ts`
5. **Server must run for CI tests**: `bunx turbo run test` expects `https://localhost:8080` live
6. **Valibot only**: No Zod; learn Valibot's API
7. **Max nesting 3 in tests**: Flatten deeply nested `describe()` calls
8. **Type imports**: Always use `import type` for types, `import` for values
9. **No cycles allowed**: Max depth 3; refactor if you hit this
10. **Pre-commit blocks pushes**: If tests fail locally, fix them before commit
11. **Turbo for orchestration**: Use `turbo run` for cross-package scripts, not direct commands
12. **Effect is in catalog and used**: `Data.TaggedError`, `Effect`, `Option` patterns are valid
