# Testing Patterns

Use this reference to apply practical unit, integration, and e2e testing patterns in Bun fullstack repositories.

## Bun Test Mechanics (Technical Baseline)

Use Bun test features intentionally:

- run tests: `bun test`
- run scoped tests by path/glob to reduce cycle time
- watch mode for local iteration: `bun test --watch`
- preload runtime setup when needed (DOM polyfills, globals): `bun test --preload <file>`
- tune long-running tests explicitly: `bun test --timeout <ms>`

Keep test setup explicit and local. Avoid hidden global side effects in preload files.

## Goal by Test Layer

- Unit: prove local logic and edge cases quickly.
- Integration: prove boundaries between API, domain logic, and persistence.
- E2E: prove user-critical workflows in realistic runtime conditions.

## Classify Existing Test Commands

Infer test type from behavior:

- Unit indicators:
  - test runner executes source or module tests directly
  - no external services required
  - fast runtime, high volume
- Integration indicators:
  - uses real DB (or close equivalent), migrations, transactional setup, or API server wiring
  - validates query behavior, constraint handling, or handler-to-storage paths
- E2E indicators:
  - browser automation or multi-process app execution
  - validates complete user flows, navigation, auth/session, or system orchestration

Do not depend on command names alone. A script named `test` may run unit, integration, or both.

## Layer-Specific Patterns

## Unit Patterns

- Focus on pure domain logic and adapters.
- Keep fixtures small and explicit.
- Prefer deterministic inputs over random data.
- Cover edge conditions that are easy to regress (null/empty, parsing, branching, permissions).
- Stub only true external boundaries; do not mock business logic you can execute directly.
- Prefer table-driven tests for branching logic with many variants.

## Integration Patterns

- Use real schema and migration paths where feasible.
- Validate transaction semantics and rollback behavior.
- Verify data invariants, constraints, and index-sensitive query behavior.
- Include boundary cases: missing relations, nullability changes, duplicate keys, partial updates.
- Ensure test data isolation (unique IDs, per-test setup/teardown, or transactional cleanup).
- Assert both write-side effects and read-side visibility where flows are stateful.

## E2E Patterns

- Prioritize a minimal set of user-critical journeys.
- Keep each scenario business-meaningful and stable.
- Assert user-visible outcomes, not implementation details.
- Capture artifacts (logs/screenshots/reports) on failure when tooling allows it.
- Keep e2e suite small but high-signal; push combinatorial cases down to integration/unit layers.

## Execution Strategy

Run progressively based on change scope:

1. Unit first for immediate feedback.
2. Integration when boundaries or persistence are touched.
3. E2E for fullstack user-impacting changes.

In monorepos, prefer package/service-local test commands for touched areas before broad root-level test commands, unless CI parity requires broader execution.
If repository root `test` is a guard command (for example "do not run tests from root"), always run tests from package/service directories.

If time is constrained, run the smallest representative subset and document what was skipped.

## Command Planning Template

Before running tests, build a concrete plan:

- touched paths:
  - `<path1>`
  - `<path2>`
- unit command(s):
  - `<cmd>`
- integration command(s):
  - `<cmd>`
- e2e command(s):
  - `<cmd>`
- required CI parity command(s):
  - `<cmd>`
- justified skips:
  - `<reason>`

Use this to avoid vague "tests look fine" conclusions.

## Completion Gate

Before finalizing work:

- run the smallest relevant unit suite for touched logic
- run integration tests when contracts/persistence/boundaries changed
- run e2e tests for user-visible workflow changes or cross-service orchestration
- report exact commands run, outcomes, and intentional skips with risk

If execution is blocked, state the blocker and provide exact follow-up commands.

## Canonical Documentation

- Bun test docs: https://bun.sh/docs/cli/test
- Turbo task running docs: https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks
- Playwright docs: https://playwright.dev/docs/intro

## Reporting Expectations

When summarizing validation:

- list commands run and pass/fail status
- map each command to unit/integration/e2e classification
- explain intentional skips and residual risk
