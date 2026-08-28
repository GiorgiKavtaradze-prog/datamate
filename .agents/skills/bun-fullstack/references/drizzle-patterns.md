# Drizzle Patterns

Use this reference for schema, migration, and query quality decisions.

## Canonical Documentation

- Drizzle overview: https://orm.drizzle.team/docs/overview
- Drizzle schema declaration: https://orm.drizzle.team/docs/sql-schema-declaration
- Drizzle migrations: https://orm.drizzle.team/docs/migrations
- Drizzle indexes and constraints: https://orm.drizzle.team/docs/indexes-constraints

## Schema Design

- Keep table and column names consistent and predictable.
- Prefer explicit foreign keys and on-delete behavior.
- Add unique constraints only when they represent real domain invariants.
- Avoid overloading nullable columns to represent multiple states.

## Migration Safety

- Split risky migrations into phases:
  1. Additive changes first (new columns/tables/indexes).
  2. Backfill data in controlled steps.
  3. Switch reads/writes.
  4. Remove deprecated fields after validation.
- Prefer reversible migrations when possible.
- Document expected lock/performance impact for large tables.

## Query Quality

- Select only required columns on hot paths.
- Encode filters and joins so intent is obvious to reviewers.
- Keep pagination deterministic (stable ordering).
- Treat optional relations explicitly to avoid accidental cartesian or null surprises.

## Transaction Boundaries

- Group related writes in a transaction when partial writes would corrupt state.
- Keep transactions short and side-effect free.
- Avoid calling external systems from inside a DB transaction.

## Data Integrity Checks

- Validate assumptions before destructive updates.
- Include guard conditions in update/delete operations.
- For one-off scripts, produce dry-run output before apply mode.

## Testing Drizzle Changes

- Add integration tests for query behavior and constraints.
- Verify migration up/down (or rollback alternative) in non-prod environments.
- Test with representative edge data: nulls, duplicates, missing relations, and large sets.
