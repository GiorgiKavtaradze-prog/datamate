# Adoption Playbook

Use this when migrating from horizontal layers (`controllers`, `services`, `repositories`) to slices.

## Step 1: Pick One Candidate Feature

- Choose a feature with clear entrypoints and moderate complexity.
- Avoid starting with the most coupled feature.
- Define success criteria (tests passing, same external behavior, reduced coupling).

## Step 2: Create the Slice Skeleton

- Create a new feature folder.
- Choose canonical package and slice names using `references/naming.md` before moving files.
- Move contracts first (request/response and key types).
- Add a temporary adapter layer to keep old calls working during migration.

## Step 3: Move Behavior Incrementally

- Move one use case at a time into the slice module.
- Keep old entrypoints delegating to new slice functions until complete.
- Preserve behavior by porting tests first or in lockstep.
- For each moved use case, add/keep:
  - unit tests for happy + failure paths
  - boundary tests for contract and error mapping
  - integration tests when persistence/transport is touched

## Step 4: Move Persistence Near Behavior

- Relocate feature-specific queries and schema definitions near the slice.
- Introduce transaction wrappers for multi-write flows.
- Keep compatibility shims if external callers still expect old interfaces.

## Step 5: Shift Cross-Feature Calls to Events/Interfaces

- Replace deep imports with event publication or explicit interfaces.
- Keep synchronous direct calls only for required request/response flows.
- Remove implicit coupling and shared mutable dependencies.

## Step 6: Remove Old Layered Paths

- Delete dead controller/service/repository code for the migrated feature.
- Remove duplicate contracts and duplicated validations.
- Update docs and architecture notes to reflect new ownership.
- Remove obsolete tests that assert old layering internals, keep behavior-focused coverage.

## Step 7: Roll Out Slice-by-Slice

- Repeat for the next feature.
- Avoid a whole-codebase "big bang" move.
- Track migration metrics: cycle time, defects, and module coupling.
