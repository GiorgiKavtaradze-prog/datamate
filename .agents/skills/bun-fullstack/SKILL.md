---
name: typescript-bun-drizzle-quality
description: Build or review Bun fullstack TypeScript code with Drizzle-backed SQL. Use for backend or cross-layer changes touching API/domain logic, schema or query design, migrations, runtime/type debugging, and boundary validation between contracts, business rules, and persistence.
---

# TypeScript Bun Drizzle Quality

Use this as an umbrella fullstack skill for Bun + TypeScript + Drizzle work.

For slop-reduction/refactor passes focused on deleting custom helpers/types/assertions, use
[`../desloppify/SKILL.md`](../desloppify/SKILL.md) alongside this skill.

Deliver production-grade code by optimizing for:

- type safety and clarity
- predictable runtime behavior in Bun
- correct and reversible data changes with Drizzle
- clean contract boundaries between API, domain logic, and persistence

## Repository Overrides (Required When Present)

Always follow repository-level agent rules (for example `AGENTS.md`) when they are stricter than this skill.

In this repository, enforce these defaults while using this skill:

- keep things in one function unless extraction is clearly reusable
- avoid `try`/`catch` where practical; prefer explicit control flow
- avoid `else`; prefer early returns
- avoid `any` and broad assertions
- prefer single-word names when possible
- avoid unnecessary destructuring; prefer dot access
- prefer functional array methods over loops when practical
- prefer Bun-native APIs like `Bun.file()` where practical
- run tests from package directories, not repository root, when root test is guarded

## Track Selection

Choose the track before coding:

1. App/API logic track
   - Use when changing handlers, services, orchestration, auth, or domain rules.
2. Data layer track
   - Use when changing Drizzle schema, migrations, indexes, transactions, or query shape.
3. Fullstack integration track
   - Use when changes cross boundaries (API contract + domain behavior + database effects).

If multiple tracks apply, run App/API first, then Data layer, then Integration checks.

## 1) Define Constraints First

Before coding, pin down:

- runtime: Bun version and package manager commands
- database: SQL dialect (Postgres/MySQL/SQLite/Turso) and migration flow
- API shape: request/response contracts and error model
- compatibility: expected behavior changes vs strict backward compatibility

If context is missing, ask only for blocking details. Otherwise proceed with explicit assumptions.

## 2) Adapt to the Host Repository

Distill practices into the target repository instead of assuming fixed commands or structure.

Before implementation or review:

- inspect workspace scripts to discover quality gates (typecheck, lint/format, test)
- inspect CI workflows to confirm which checks are required in pull requests
- identify local test taxonomy and map commands to:
  - unit tests
  - integration tests
  - e2e tests
- run only the smallest relevant subset for touched code paths

Do not assume naming conventions like `test:unit` or `test:e2e`; infer from scripts and workflow usage.

## 3) Fullstack Testing with Bun (Required)

Treat test design and test execution as first-class implementation work.

Use this decision flow:

1. classify repository test commands by behavior into unit, integration, and e2e
2. map touched files/modules to the smallest package/service-local commands
3. if root `test` is guarded (for example intentionally fails), do not run tests from root
4. run required layers in order: unit -> integration -> e2e, based on scope/risk
5. ensure CI-required checks for pull requests are represented in local verification
6. if no explicit integration suite exists, treat boundary tests (API + real DB or equivalent) as integration coverage and call it out

Technical expectations for Bun repositories:

- use Bun test runner features intentionally (`bun test`, `--watch`, `--preload`, `--timeout`, path filters)
- keep unit tests deterministic and fast; avoid network and global time randomness
- for integration tests, run real migrations/schema setup and isolate test data
- for e2e, run realistic app wiring and capture artifacts on failure

Do not mark work complete unless one of these is true:

- relevant tests were executed and results were recorded
- execution was blocked by environment constraints and the block + residual risk were stated explicitly

For deeper guidance, read `references/testing-patterns.md`.
For copyable boundary snippets, read `references/examples/integration-boundary-test.md`.

## 4) App/API Logic Track

Prefer:

- narrow, composable functions with explicit inputs and outputs
- inferred types where clear, explicit types at boundaries (public functions, adapters, exported utilities)
- discriminated unions for branching states
- `unknown` + schema validation for untrusted input
- early returns over deeply nested branching

Avoid:

- `any` unless unavoidable and scoped with justification
- broad `as` assertions that bypass type checks
- duplicated business logic between handlers, services, and tests

Use Zod (or equivalent) to enforce runtime contracts at process boundaries.
For copyable handler patterns, read `references/examples/api-boundary.md`.

Use Bun-native patterns when they simplify runtime behavior:

- file I/O: `Bun.file`, `Bun.write`
- scripting and process execution: Bun shell APIs
- tests and fixtures: Bun test runner patterns

Keep Node compatibility shims only when required by dependencies or deployment targets.

## 5) Data Layer Track

When touching schema, models, or queries:

- keep naming stable and consistent across schema and code
- preserve backward compatibility unless migration plan explicitly breaks it
- create reversible migrations where possible
- include indexes/constraints intentionally, not implicitly
- validate nullability/default changes against existing data

For deeper patterns, read `references/drizzle-patterns.md`.
For copyable transaction/query patterns, read `references/examples/drizzle-transaction.md`.

## 6) Fullstack Integration Track

When a change crosses boundaries, explicitly validate:

- API contract to domain mapping (validation, defaults, and error translation)
- domain rules to persistence behavior (transactions, consistency, rollback behavior)
- persistence results to API output shape (including empty and partial data cases)
- backward compatibility for clients and existing data
- corresponding test coverage across unit/integration/e2e layers where applicable

Use the review rubric in `references/quality-checklist.md` to structure findings.
For end-to-end mapping examples, read `references/examples/fullstack-flow.md`.

## Output Format

Use this as the canonical output template for this skill:

1. What changed and why
2. Risk assessment (behavioral, data, performance)
3. Verification performed or intentionally skipped
4. Required fixes vs optional improvements
5. Remaining gaps or follow-ups

Keep output concise and concrete. Avoid generic "looks good" conclusions without evidence.

## Canonical Documentation

Use official docs when clarifying edge behavior:

- Bun docs: https://bun.sh/docs
- Drizzle ORM docs: https://orm.drizzle.team/docs/overview
- Drizzle migrations docs: https://orm.drizzle.team/docs/migrations
- Zod docs: https://zod.dev
- Turbo docs: https://turbo.build/repo/docs
