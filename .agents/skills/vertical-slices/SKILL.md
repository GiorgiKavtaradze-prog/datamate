---
name: vertical-slices
description: Design, implement, and review software using vertical slices (feature-first architecture) instead of horizontal layers. Use when creating a new feature, refactoring layered code (controllers/services/repositories), defining clear API-domain-data boundaries, improving slice-level testability, or reducing cross-module coupling in backend or fullstack TypeScript projects.
---

# Vertical Slices

Build features as independent slices that own contract, business rules, persistence logic, and tests.

Prefer feature-first folders and thin entrypoints. Keep business behavior inside the slice, not in transport or framework code.

Always follow stricter repository rules when present (for example `AGENTS.md`).

## Outcomes

A slice is complete only when all are true:

- One clear capability is owned by one slice.
- Behavior is implemented in the slice, not in handlers/controllers/routes.
- Persistence logic is co-located and transaction-safe.
- Tests cover behavior, boundaries, and failure paths with regression depth.
- Cross-slice coupling is explicit, minimal, and one-way.

If these are not met, do not call the slice done.

## Execution Workflow (Required)

### 1) Define the slice boundary before coding

- Name exactly one capability in business language.
- Define one owner module (for example `billing`, `session`, `question`).
- State what is intentionally out of scope for this slice.
- Limit dependencies to shared infrastructure and explicit contracts.

### 2) Write a compact Slice Design Spec before implementation

Create a short design note in your working context with:

- Capability statement: one sentence with actor + action + outcome.
- Invariants: 3-7 rules that must remain true.
- Boundary contracts: input, output, error model, idempotency behavior.
- Data ownership: tables/entities read and written by the slice.
- Dependency map: entrypoint -> slice -> infrastructure only.
- Cross-slice touchpoints: event names or explicit interfaces only.
- Failure model: validation, conflict, upstream, and persistence failures.

If this spec is missing, pause and define it first.

### 3) Define contracts before behavior

- Create input/output schemas at the boundary (HTTP, queue, CLI, RPC).
- Use the same contract definitions in adapters and tests.
- Keep contract definitions in the slice area, not spread across global folders.
- Map internal errors to boundary errors in one place.

### 4) Implement business behavior in the slice

- Keep handlers/routes thin: validate -> invoke slice -> map result/error.
- Keep orchestration and rules in slice functions.
- Avoid leaking framework request/response objects into business logic.
- Prefer explicit return types at public slice boundaries.

### 5) Co-locate persistence and side effects

- Keep slice-specific reads/writes near slice behavior.
- Use explicit transaction boundaries for multi-write flows.
- Emit side effects only after successful commit.
- Make idempotency explicit when retries can happen.

### 6) Enforce low coupling

- Use event publication for asynchronous cross-slice reactions.
- Use explicit interfaces only when immediate response is required.
- Do not deep-import another slice internals.
- Keep dependency direction one-way: entrypoint -> slice -> infrastructure.

### 7) Apply test maturity gates (required)

Do not stop at export/smoke tests. Build behavior-focused suites:

- Unit-level slice tests:
  - happy path with realistic data
  - validation failures
  - domain invariant failures
  - edge cases for optional/empty/limit inputs
- Boundary integration tests when behavior crosses boundaries:
  - transport + contract validation + error mapping
  - persistence side effects and rollback behavior
  - idempotency and duplicate request handling when relevant
- Regression tests:
  - every bug fix must add at least one failing-then-passing test
  - test must assert behavior outcome, not implementation details

### 8) Run final quality gate before completion

- Execute `references/checklist.md` fully.
- Discover verification commands from the host repository before running tests:
  - inspect package/workspace scripts for unit/integration/e2e commands
  - inspect CI workflows to identify required checks for affected paths
  - do not assume script names; infer by behavior
- Run concrete verification commands for the touched slice paths:
  - smallest relevant unit command(s)
  - integration command(s) when boundaries/persistence changed
  - e2e command(s) when user-visible workflows changed
- Prefer package/service-local commands first. Do not use repository root tests when the repo uses a root test guard.
- Keep verification aligned with required CI checks for the affected area.
- Record exact commands executed, pass/fail outcome, and intentional skips with residual risk.
- Record residual risks and follow-ups.
- Call out compatibility or migration impact.

## Choose a Blueprint

Read `references/blueprints.md` to pick folder templates for backend-only and fullstack repositories.

## Apply Naming Conventions

Read `references/naming.md` and pick canonical package and slice names before creating folders and contracts.

## Validate Slice Quality

Read `references/checklist.md` and execute the checks before finalizing changes. Do not mark complete if any required check fails.

## Build Mature Test Suites

Read `references/testing-maturity.md` when designing tests. Use it to choose test depth, avoid shallow suites, and ensure regressions are captured.

## Refactor Toward Slices

If starting from layered architecture, read `references/adoption-playbook.md` and migrate one feature at a time.
