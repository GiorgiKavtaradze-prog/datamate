# Naming Recommendations

Use consistent names so package boundaries and slice ownership stay obvious.

## Core Rules

- Use lowercase `kebab-case` for package names and folder names.
- Use singular nouns for slice names.
- Name slices by user-facing capability, not by technical layer.
- Keep names short and stable; avoid version or implementation details in names.
- Reuse the same slice token across contracts, persistence, tests, and routes.

## Package Naming

- Prefer capability-scoped package names:
  - `@acme/billing`
  - `@acme/session`
  - `@acme/question-bank`
- Reserve shared/infrastructure packages for true cross-slice concerns:
  - `@acme/shared-contracts`
  - `@acme/infra-db`
  - `@acme/infra-events`
- Avoid horizontal-layer package names that hide ownership:
  - `@acme/services`
  - `@acme/repositories`
  - `@acme/controllers`

## Slice Naming

- Prefer capability names that map to business language:
  - `billing`
  - `session`
  - `question`
- Avoid generic or overloaded names:
  - `common`
  - `utils`
  - `manager`
  - `core`
- Keep one canonical slice name and mirror it in related files:
  - `billing/index.ts`
  - `billing/billing.sql.ts`
  - `server/routes/billing.ts`
  - `test/billing/billing.test.ts`

## Event and Contract Names

- Prefix event names with the slice:
  - `billing.invoice_paid`
  - `session.created`
- Keep request/response contract names explicit and capability-based:
  - `CreateSessionInput`
  - `CreateSessionOutput`
  - `ListQuestionsInput`

## Decision Heuristics

- If a name sounds like a team or layer, rename to capability.
- If two slices want the same name, split by domain vocabulary, not suffixes like `v2`.
- If a slice name needs `and`, split it into two slices.
