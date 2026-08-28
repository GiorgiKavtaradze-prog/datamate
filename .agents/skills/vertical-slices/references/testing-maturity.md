# Testing Maturity for Vertical Slices

Use this guide to avoid shallow test suites and enforce behavior-level confidence.

## 1) Choose the minimum suite by change type

Apply the highest level that matches your change:

- Level A (pure internal refactor, no behavior change)
  - Update/keep existing unit tests for touched behavior.
  - Add tests only when coverage gaps are discovered.
- Level B (new or changed slice behavior)
  - Add unit tests for happy path, validation, invariants, and edge cases.
  - Add regression test for each fixed defect.
- Level C (boundary changes: API/transport/contracts/persistence)
  - Do Level B plus integration tests for boundary mapping and persistence effects.
- Level D (critical money/auth/limits/permissions/idempotency changes)
  - Do Level C plus failure-path and replay/idempotency scenarios.

If uncertain, choose the higher level.

## 2) Required test case matrix per slice use case

For each primary slice use case, cover:

1. Success path
   - Valid input produces expected output and side effects.
2. Validation failure
   - Invalid or missing input fails with expected boundary error.
3. Invariant failure
   - Business rule violation returns expected domain/public error.
4. Edge case
   - Empty/optional/max-limit/conflict or duplicate request path.
5. Persistence behavior (if writes exist)
   - Writes are committed on success and rolled back on failure.
6. Integration boundary (if transport exists)
   - Adapter validation and error translation are correct.

## 2.1) Minimum scenario count (required)

For each primary slice use case:

- Always include at least 4 scenarios:
  - success
  - validation failure
  - invariant failure
  - one edge case
- Include persistence scenario when writes exist (minimum becomes 5).
- Include integration-boundary scenario when transport exists (minimum becomes 5).
- If both writes and transport exist, minimum is 6 scenarios for that use case.

Do not collapse multiple required categories into one broad test.

## 3) Maturity signals (what good looks like)

- Assertions target behavior and contract shape, not private internals.
- Fixture data is realistic enough to exercise real branching rules.
- Tests include negative and failure paths, not only "is defined" checks.
- Integration tests exercise real storage boundaries when practical.
- Names describe user-observable behavior, not implementation steps.

## 4) Mandatory regression rule

When fixing a bug:

- Add a regression test that would fail without the fix.
- Keep the test near the affected slice behavior.
- Assert the externally observable behavior change.

Do not close a bugfix task without this.

## 5) Anti-patterns to reject

- Export/smoke tests as primary coverage (for example only `expect(module).toBeDefined()`).
- Duplicating implementation logic in tests.
- Over-mocking core domain logic that can run directly.
- Testing private helper structure rather than slice outcomes.
- Broad "happy path only" suites for critical slice flows.

## 6) Lightweight planning template

Before writing tests, draft this compact plan:

- Use case: `<name>`
- Risk level: `low|medium|high`
- Required level: `A|B|C|D`
- Unit scenarios:
  - `<scenario 1>`
  - `<scenario 2>`
- Integration scenarios:
  - `<scenario 1>`
  - `<scenario 2>`
- Regression scenarios:
  - `<scenario 1>`

Execute the plan and update with actual coverage before completion.

## 7) Verification command log (required)

Before finalizing, include:

- exact unit command(s) run
- exact integration command(s) run (or N/A with reason)
- exact e2e command(s) run (or N/A with reason)
- pass/fail result for each command
- intentional skips and residual risk

Prefer package/service-local commands. If the repository has a root test guard, do not run tests from root.
