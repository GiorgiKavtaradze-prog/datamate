# Contributing to Datamate

Thank you for investing your time in Datamate! This guide covers everything you need to get a productive development environment running and to ship changes that land smoothly in review.

## Ground Rules

Before you write any code, please read two documents — they are enforced for every contribution:

1. **[Code of Conduct](CODE_OF_CONDUCT.md)** — our community standards.
2. **[AI Usage Policy](AI_POLICY.md)** — all AI assistance must be disclosed, PRs created by AI must reference an accepted issue, and all AI-generated code must be human-verified. **This policy is strictly enforced.**

## Prerequisites

| Requirement           | Version | Purpose                       |
| --------------------- | ------- | ----------------------------- |
| [Bun](https://bun.sh) | 1.3.14+ | Package manager & runtime     |
| Node.js               | 20+     | Tooling compatibility         |
| Docker                | latest  | PostgreSQL, ClickHouse, Redis |

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/GiorgiKavtaradze-prog/datamate.git
   cd datamate
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start infrastructure (development services):

   ```bash
   docker compose up -d
   ```

   > **Note:** this starts the local **development** stack (`docker-compose.yaml`) — PostgreSQL, ClickHouse, Redis.
   > To self-host the full application instead, use `docker compose -f docker-compose.selfhost.yml up -d`; see [Self-Hosting](README.md#-self-hosting) in the README.

5. Initialize the databases:

   ```bash
   bun run db:push          # Push the Drizzle schema to PostgreSQL
   bun run clickhouse:init  # Create the ClickHouse analytics schema
   ```

6. Build the public SDK (required once, and after any SDK change):

   ```bash
   bun run sdk:build
   ```

7. Start developing:

   ```bash
   bun run dev:dashboard    # Dashboard (Next.js) + API (Elysia)
   ```

8. _(Optional)_ Seed sample analytics data for a website:

   ```bash
   bun run db:seed <WEBSITE_ID> [EVENT_COUNT]
   ```

   **Examples:**

   ```bash
   bun run db:seed g0zlgMtBaXzIP1EGY2ieG 10000
   bun run db:seed d7zlgMtBaSzIL1EGR2ieR 5000
   ```

   Seeding notes:
   - The website domain is fetched automatically from the database via the given website ID.
   - The default event count is `10,000`.
   - Seeds events, outgoing links, errors, and Web Vitals data.
   - You can find your website ID in the website overview settings.

## Development Workflow

### Useful scripts

You can also `cd` into any package or app and run its scripts directly; check each workspace's `package.json`.

### Branch and PR lifecycle

Keep every branch short-lived: **one branch = one independently reviewable, revertible slice = one pull request**. Never use a branch as a general work queue.

1. Check open PRs for overlapping surfaces first, then branch fresh from an up-to-date `staging`:

   ```bash
   git switch staging
   git pull --ff-only origin staging
   git switch -c codex/short-slice
   ```

   Do not branch from another feature branch. An exception requires an explicit `Depends on #…` in both PRs and agreement with its owner — land the prerequisite first.

2. Keep the branch to its stated slice. If part of the change could be reviewed or reverted independently, put it in a separate PR. Leave unrelated cleanup out.

3. Push early and open a **draft PR against `staging`** describing the problem being solved plus any dependency or known overlap. Ownership should be visible before parallel work drifts into the same files.

4. Before requesting review, rebase onto current `origin/staging` and resolve conflicts within the slice. Do not merge `staging` into the branch just to refresh it. If a rebase alters already-reviewed code, request a fresh review.

5. Run the quality gates:

   ```bash
   bun run lint
   bun run check-types
   bun run test
   ```

6. Add a changeset if the change affects a published package:

   ```bash
   bun run changeset
   ```

7. Commit with a conventional message (see below), then push:

   ```bash
   git add .
   git commit -m "feat(dashboard): add export button"
   git push -u origin codex/short-slice
   ```

8. When the PR merges or closes, retire the branch. Merged source branches are deleted automatically; delete closed branches manually. Never repurpose or reopen an old branch — start again from current `staging`.

For parallel work, use one worktree per active branch, and never let two people or agents mutate the same branch simultaneously.

### Commit conventions

Use `<type>(<scope>): <description>` — e.g. `feat(dashboard): add export button`, `fix(api): handle null session`. Common scopes: `dashboard`, `api`, `rpc`, `basket`, `docs`, `db`, `sdk`, `tracker`, `deps`, `ci`. Split commits by intent (feature / bug fix / refactor / style copy / migration slice); keep unrelated surfaces in separate commits even when edited in the same session.

## End-to-End: Shipping a Feature Slice

A typical read→write feature crosses all three layers. Concretely:

1. **Contract first.** Define the procedure in `packages/rpc` (Zod input/output, router endpoint, and — for mutations — `trackedProcedure`/`auditedSessionProcedure` so usage and audit events are recorded). Typecheck — the dashboard client (`apps/dashboard/lib/orpc.ts`) picks up the new typed procedure automatically.
2. **Backend second.** If the procedure needs new data access, add the resolver/query builder in the API side or `packages/db`, keeping tenant isolation enforced in the shared layer (never rely on client-supplied IDs alone).
3. **Frontend last.** Consume it from the dashboard with `orpc.<router>.<name>.queryOptions()` / `.mutationOptions()`, invalidate with the procedure's own `key()`, and render with the design system (`components/ds`).
4. **Prove it.** Colocate a unit/integration test next to the changed code; add a Playwright spec (`apps/dashboard/test/e2e/specs/...`) when a real browser journey is covered.
5. **Branch it.** One slice per branch/PR against `staging`; keep commits intent-scoped with conventional messages.

### Pre-Push Checklist

- [ ] `bun run lint` and `bun run check-types` pass (formatter drift can fail CI)
- [ ] Relevant tests pass — `bun run test`, or a targeted `cd apps/api && bun test path/to/test.ts`
- [ ] `git diff --stat` shows only this slice; no unrelated cleanup
- [ ] `git status --short` has no `.env` or secrets staged
- [ ] A changeset was added for any published package (`bun run changeset`)

## Code Style

- Formatting & linting: **Ultracite (Biome)** — run `bun run lint` / `bun run format` before pushing; formatter-only drift can fail CI.
- TypeScript: strict mode, no `any`, proper types everywhere.
- Dashboard UI: consume the shared design system (`@datamate/ui` / `apps/dashboard/components/ds`). Don't hand-roll native controls or import Radix/Base UI primitives directly in feature code — extend the design system first.
- Explicit dependencies: keep workspace dependencies declared in each package's own `package.json`; hoisting can hide boundaries that fail in CI.

Questions? Open a [discussion](https://github.com/GiorgiKavtaradze-prog/Datamate/discussions) — we're happy to help before you write a line of code.

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
