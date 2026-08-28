# Quality Checklist

Use this checklist when implementing, refactoring, or reviewing code in TypeScript + Bun + Drizzle apps.

## Correctness

- Inputs are validated at boundaries (HTTP handlers, queue consumers, cron entrypoints).
- Business rules are implemented once in shared logic, not copied across layers.
- Error cases are explicit and typed.
- Date/time handling is timezone-safe and consistent.

## Type Safety

- Public APIs and exported modules expose clear types.
- `any` is absent or tightly scoped with a reason.
- Unsafe assertions (`as`) are minimized and localized.
- Union branches are exhaustively handled where possible.

## Bun Runtime

- Bun-native APIs are used where practical (`Bun.file`, `Bun.write`, Bun test/shell).
- Node-only APIs are introduced only with compatibility justification.
- Resource handling (files/processes) is explicit and does not leak.

## Drizzle and Data Layer

- Schema and query changes are migration-backed.
- New indexes and constraints are intentional and justified by access patterns.
- Nullability/default changes are safe for existing rows.
- Query behavior on empty/partial data is handled and tested.

## Tests and Verification

- Repository-defined quality gates are discovered before execution (scripts + CI workflow requirements).
- Typecheck, lint/format, and relevant tests are run using repository-native commands.
- New behavior has focused tests near changed logic.
- Data-related changes include integration coverage when feasible.
- Unit, integration, and e2e scope is inferred from each repository's script/workflow taxonomy rather than assumed names.
- Test selection and sequencing follows `references/testing-patterns.md`.
- Unverified areas are documented with concrete next steps.

## Review Output Template

Use the canonical template in `SKILL.md` under `Output Format`.

Apply these review-specific expectations within that template:

- list major risks ordered by severity
- include concrete verification evidence (what ran and pass/fail status)
- separate required fixes from optional improvements
