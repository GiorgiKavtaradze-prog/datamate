# Vertical Slice Checklist

Run this checklist before calling a slice complete. Treat all bullets as required unless explicitly marked conditional.

## N/A Protocol (Required)

- For each conditional item, mark either:
  - PASS (implemented and verified), or
  - N/A with one-line justification.
- Do not leave conditional items unaddressed.
- Include the PASS/N/A decisions in the final verification notes.

## Boundary and Ownership

- Slice has one clear capability and one owner module.
- Capability statement is explicit (actor + action + outcome).
- Slice scope and non-goals are documented.
- Public API is explicit (entry functions and contracts only).
- Internal helpers are not imported outside the slice.

## Contracts

- Input and output contracts are defined once in the slice.
- Transport adapters validate against slice contracts.
- Error mapping is explicit at the boundary.
- Idempotency behavior is defined for retry-prone operations. (conditional)

## Behavior

- Business rules live in slice code, not route/controller code.
- Entrypoints remain thin and deterministic.
- Shared state is scoped; no hidden global mutable state.
- Domain invariants are enforced in one place and covered by tests.

## Persistence

- Slice-specific reads and writes are co-located. (conditional: when persistence is involved)
- Write operations use explicit transaction boundaries. (conditional: when writes exist)
- Side effects happen after successful persistence. (conditional: when side effects exist)
- Multi-step writes have rollback-safe behavior on failure. (conditional: when multi-step writes exist)

## Coupling

- Dependency direction is one-way: entrypoint -> slice -> infra.
- Cross-slice interactions happen via events or explicit interfaces.
- No circular imports between slices.
- No deep imports from another slice internals.

## Tests: Minimum Maturity Bar

- Test paths mirror source slice paths.
- Tests cover happy path, validation failures, and domain invariant failures.
- Tests cover edge cases (empty/optional/max-limit/conflict paths where relevant).
- Integration coverage exists when behavior spans transport + persistence. (conditional)
- Error translation is tested at boundaries (transport/API to domain/public errors). (conditional: when transport/API exists)
- Bug fixes include at least one regression test (fails before fix, passes after fix).
- Tests assert business outcomes and contracts, not internal implementation details.

## Quality Gate

- Naming is consistent across contract, code, and persistence.
- Package names are capability-based and use lowercase `kebab-case`.
- Slice names are singular capability nouns (not layers or generic utility names).
- Behavior changes and compatibility impact are called out.
- Risks and follow-ups are documented with concrete next actions.
- Verification notes include exactly what was tested vs intentionally skipped.
- Verification notes include command-level evidence for unit/integration/e2e where applicable.
