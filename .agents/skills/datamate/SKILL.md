---
name: datamate
description: Help external users integrate Datamate into their own apps. Use for SDK setup, React/Vue/vanilla browser tracking, Node/server event tracking, custom event planning, attribution, feature flag evaluation, experiments, Datamate DevTools, REST analytics queries, and event ingestion. Do not use for Datamate monorepo implementation work; use datamate-internal.
---

# Datamate

Use this skill for people adopting Datamate in their own app or backend. Optimize for a working public integration or instrumentation plan: the right package, credential, endpoint, events, placement, and verification step.

Do not expose `DATAMATE_API_KEY` in browser code. Browser integrations use a public website `clientId`; server/API integrations use an API key.

## Choose The Surface

- React or Next.js browser analytics: `@datamate/sdk/react`; mount `<Datamate />` near the app root.
- Vue or Nuxt browser analytics: `@datamate/sdk/vue`; mount `<Datamate />` once near `RouterView`/`NuxtPage` and translate props to kebab-case in templates.
- Vanilla HTML, CMS, or GTM: CDN script `https://cdn.datamate.cc/datamate.js` with `data-client-id`.
- Browser custom events: `track(...)` from `@datamate/sdk` after the tracker is installed.
- Browser helper utilities: use `trackError`, `flush`, `clear`, `getTrackingIds`, `getTrackingParams`, `getAnonymousId`, `getSessionId`, `isTrackerAvailable`, and `getTracker` from `@datamate/sdk` when users need manual errors, navigation safety, logout reset, attribution handoff, or advanced checks.
- Server-side events: `@datamate/sdk/node`; call `flush()` before a serverless/short-lived runtime exits.
- Feature flags: React/Vue flag helpers or `createServerFlagsManager` from `@datamate/sdk/node`; use stable user context, handle loading/pending states, and call `waitForInit()` before first server read.
- DevTools: `@datamate/devtools`; use for local/preview inspection of tracker status, IDs, queues, event calls, flags, overrides, diagnostics, and flag management.
- REST analytics: query API under `https://api.datamate.cc/v1`.
- Raw event ingestion: `POST https://basket.datamate.cc/track`; prefer SDKs unless the user explicitly wants HTTP.

Do not recommend `@datamate/sdk/ai/vercel`; the public SDK currently exports only core, React, Vue, and Node entry points.

If the user says "API", determine whether they mean analytics queries, event ingestion, or feature flags before writing code.

Read [public-surfaces.md](./references/public-surfaces.md) when you need exact env vars, routes, scopes, snippets, or framework routing.
Read [frameworks.md](./references/frameworks.md) for React, Next.js, Vue, Nuxt, and vanilla browser setup.
Read [server-events.md](./references/server-events.md) for browser helpers, Node/server events, raw `/track`, and attribution handoff.
Read [feature-flags.md](./references/feature-flags.md) for client flags, server flags, rollouts, experiments, flag metrics, and flag debugging.
Read [devtools.md](./references/devtools.md) for `@datamate/devtools` setup, capabilities, flag overrides, diagnostics, and flag management.
Read [event-design.md](./references/event-design.md) when the user asks what custom events to add, which properties matter, or how to avoid noisy/high-cardinality tracking.
Read [instrumentation-planning.md](./references/instrumentation-planning.md) when the user asks what to track, how to design metrics, how to wire attribution across client/server, or where to place tracking calls.
Read [troubleshooting.md](./references/troubleshooting.md) for CSP, blockers, wrong hosts, auth, missing events, and flag/debug failures.

## Credential And Endpoint Rules

| Use | Host/path | Credential | Scope |
| --- | --- | --- | --- |
| Browser analytics | `https://basket.datamate.cc` via SDK/CDN | `clientId` | none |
| Server events | `POST https://basket.datamate.cc/track` | `DATAMATE_API_KEY` | `track:events` |
| REST analytics | `https://api.datamate.cc/v1/query...` | `DATAMATE_API_KEY` | `read:data` |
| Feature flag evaluation | `https://api.datamate.cc/public/v1/flags...` | `clientId` | none |

- API auth accepts `x-api-key: dbdy_...` or `Authorization: Bearer dbdy_...`; prefer `x-api-key` for examples unless docs for that endpoint use Bearer.
- `websiteId` in event tracking means the public website client id, the same kind of value used by `data-client-id`; it is not necessarily an internal UUID.
- For server-side attribution, collect `{ anonId, sessionId }` in the browser with `getTrackingIds()`, pass them to your backend, then map them to Node SDK fields `anonymousId` and `sessionId`.
- Visitor ID privacy is configured with `anonymizeVisitorIds` (`true`/omitted = anonymized, `false` = keeps raw IDs, `"auto"` = raw only in Datamate's conservative country allowlist); avoid internal wording like storage or hashing in public examples.
- Do not invent a Datamate `identify()` helper or endpoint. If an app has an identify route, treat it as the user's own backend code carrying Datamate tracking IDs.
- Feature flag evaluation uses the main API host, not basket. It needs a website `clientId`, not API-key-only auth.
- Feature flag management uses `manage:flags` with `x-api-key`; do not expose that key in browser source. DevTools accepts it at runtime for local/preview flag management.
- `DATAMATE_API_URL` is endpoint-specific. Do not reuse a basket root for query API or flags.
- Strict CSP sites need `script-src` for `https://cdn.datamate.cc` and `connect-src` for `https://basket.datamate.cc`; add `https://api.datamate.cc` when using flags.

## Workflow

1. Identify the user's runtime and target surface.
2. Prefer the highest-level supported SDK over raw HTTP.
3. Infer the minimum credential, or ask for only the missing one.
4. Give a short install/env/code path plus one verification step.
5. For custom instrumentation, define `question -> metric -> event -> properties -> source -> placement -> verification` before adding code.

## Custom Event Rules

- Track user intent, product milestones, and operational outcomes, not every click.
- Use stable `snake_case` names and low-cardinality property keys.
- Do not track PII, secrets, raw tokens, full exception stacks, or large payloads.
- Prefer one event with useful properties over many near-duplicate event names.
- Use backend tracking for authoritative outcomes such as account creation, imports, webhooks, and jobs.
- Start with the fewest events that answer the user's question; add more only for funnel steps, important variants, or failure states.
- Do not track the same outcome in both browser and backend. Use browser events for intent and backend events for completed or failed outcomes.

## Verification

- Browser SDK:
  - confirm the script loads and requests reach `basket.datamate.cc`
  - confirm the expected `clientId` is configured
  - check CSP, ad-blockers, and registered/allowed domain settings if requests never leave the browser
- Node SDK:
  - send one test event
  - call `flush()` before exit
  - confirm no auth or queue errors
- REST API:
  - start with `GET /v1/query/websites`
  - then run the scoped query or event send
- Feature flags:
  - wait for initialization
  - test with a known flag key and user context
  - use DevTools to inspect readiness, evaluated values, variants, and overrides
- Custom instrumentation:
  - verify the event appears under the intended website
  - confirm attribution IDs are present when a server event belongs to a browser session
  - confirm the event can power the intended funnel, goal, segment, or reliability metric

## Response Style

- Default to practical integration guidance and working examples
- Avoid internal monorepo details unless the user is debugging Datamate itself.
- Keep answers short unless the user asks for a migration or full instrumentation plan.
