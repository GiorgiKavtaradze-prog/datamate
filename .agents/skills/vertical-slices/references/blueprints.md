# Vertical Slice Blueprints

Use these templates as starting points. Adapt names to the host repository.
Before creating files, apply the naming rules in `references/naming.md`.

## Backend Slice Blueprint

```text
src/
  <slice>/
    index.ts                 # Public slice API (functions, contracts, events)
    contract.ts              # Slice input/output/error schemas
    behavior.ts              # Core use-case orchestration/rules
    persistence.ts           # Slice-local query helpers
    <slice>.sql.ts           # Slice-local tables/entities (if needed)
    errors.ts                # Slice-specific error types
  server/
    routes/
      <slice>.ts             # Thin transport mapping
test/
  <slice>/
    <slice>.unit.test.ts     # Slice behavior unit tests
    <slice>.boundary.test.ts # Contract + adapter + error mapping tests
    <slice>.int.test.ts      # Persistence/transaction integration tests
```

## Fullstack Slice Blueprint

```text
apps/web/src/
  features/
    <slice>/
      api.ts                 # Client transport wrappers
      model.ts               # UI-local state/selectors
      view.tsx               # UI composition
      contract.ts            # Shared schema import/re-export
packages/api/src/
  <slice>/
    index.ts                 # Domain behavior + contracts
    contract.ts              # API/domain contracts
    behavior.ts              # Use-case behavior and orchestration
    persistence.ts           # DB/query logic
    <slice>.sql.ts           # Persistence schema (if needed)
  server/routes/
    <slice>.ts               # Thin route adapters
packages/api/test/
  <slice>/
    <slice>.unit.test.ts
    <slice>.boundary.test.ts
    <slice>.int.test.ts
```

## Slice Contract Pattern

1. Define schemas in the slice.
2. Reuse schemas in adapters (validator/OpenAPI/tool contract).
3. Reuse schemas in tests for setup and assertions.
4. Avoid redefining equivalent shapes in multiple layers.

## Test Placement Pattern

- Keep test folders mirrored to slice folders.
- Default to unit + boundary tests for every non-trivial slice change.
- Add integration tests whenever persistence or transport mapping changes.
- Place regression tests adjacent to the behavior they protect.

## Naming Notes for Templates

- Replace `<slice>` with one canonical singular capability name (for example `billing`, `session`).
- Keep that same token in route files, tests, and persistence files.
- Use capability-based package names (for example `@acme/billing`) over layer-based names (for example `@acme/services`).

## Cross-Slice Communication Pattern

- Prefer event publication for low-coupling reactions.
- Prefer explicit interface calls only when immediate response is required.
- Do not import deep internals from another slice.
