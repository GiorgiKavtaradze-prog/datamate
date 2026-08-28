```text
██████╗  █████╗ ████████╗ █████╗ ███╗   ███╗ █████╗ ████████╗███████╗
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
██║  ██║███████║   ██║   ███████║██╔████╔██║███████║   ██║   █████╗
██║  ██║██╔══██║   ██║   ██╔══██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝
██████╔╝██║  ██║   ██║   ██║  ██║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.9-blue.svg)](https://turbo.build/repo)
[![Bun](https://img.shields.io/badge/Bun-1.3-blue.svg)](https://bun.sh/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-blue.svg)](https://tailwindcss.com/)

[![Code Coverage](https://img.shields.io/badge/coverage-85%25-green.svg)](https://github.com/datamate-analytics/Datamate/actions/workflows/coverage.yml)
[![Security Scan](https://img.shields.io/badge/security-A%2B-green.svg)](https://github.com/datamate-analytics/Datamate/actions/workflows/security.yml)
[![Dependency Status](https://img.shields.io/badge/dependencies-up%20to%20date-green.svg)](https://github.com/datamate-analytics/Datamate/actions/workflows/dependencies.yml)

[<img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />](https://vercel.com/oss)

[![Open Source Since 2026](https://img.shields.io/badge/open_source_since-2026-blue.svg)](LICENSE)

> **Datamate** is a privacy-first, open-source analytics platform for teams that want to deeply understand their products — without invading their users' privacy.

It combines real-time traffic analytics, funnels, goals, error tracking, Web Vitals, uptime monitoring, and short links with an intelligence layer that detects material changes, investigates them against your own data, and turns findings into durable work that stays open until resolved.

## ✨ Features

| Area                | Capabilities                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Analytics**       | Real-time dashboard, pageviews & screen views, sessions, referrers, devices, geolocation                                           |
| **Product insight** | Funnels, goals & conversion tracking, custom events, outgoing-link tracking                                                        |
| **Quality**         | Error tracking, Web Vitals, uptime monitors, public status pages                                                                   |
| **Growth tools**    | Short links with full click analytics                                                                                              |
| **Intelligence**    | Automated signal detection, agentic investigation, durable cases across Dashboard & Slack                                          |
| **Platform**        | Multi-tenant organizations with role-based permissions, type-safe RPC API, data export, GDPR-friendly by design, encrypted secrets |

On the roadmap: advanced visualization builder, live streaming updates, custom metric definitions, cohort analysis, and A/B testing — see [`ROADMAP.md`](ROADMAP.md) for direction and [`SPEC.md`](SPEC.md) for the product contract.

## 📋 Jump To

|                                                         |                                                      |                                             |
| ------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| [Features](#-features)                                  | [Start Tracking Your App](#-start-tracking-your-app) | [Repository Guide](#-repository-guide)      |
| [How It Works](#-how-it-works)                          | [Architecture](#-architecture)                       | [Tech Stack](#-tech-stack)                  |
| [Local Development](#-local-development)                | [Self-Hosting](#-self-hosting)                       | [Testing](#-testing)                        |
| [Contributing](#-contributing) · [Security](#-security) | [FAQ](#-faq)                                         | [Support](#-support) · [License](#-license) |

## 📡 Start Tracking Your App

Adding analytics takes about two minutes. Create a website in the Dashboard, copy its client ID, then pick your integration:

**React / Next.js** — install the SDK and mount the component at your app root:

```tsx
import { Datamate } from "@datamate/sdk/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <Datamate
        clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID!}
        trackWebVitals
        trackErrors
        enableBatching
      />
      <body>{children}</body>
    </html>
  );
}
```

**Any other stack (vanilla / CMS / tag managers)** — load the tracker script straight from CDN:

```html
<script
  async
  src="https://cdn.datamate.cc/datamate.js"
  data-client-id="YOUR_CLIENT_ID"
></script>
```

**Custom events anywhere in your app:**

```ts
import { track } from "@datamate/sdk";

track("signup_completed", { method: "google", plan: "pro" });
```

**Server-side events (Node.js / cron / webhooks)** — authenticate with your API key and always `flush()` before the process exits:

```ts
import { Datamate } from "@datamate/sdk/node";

const client = new Datamate({
  apiKey: process.env.DATAMATE_API_KEY!,
  websiteId: process.env.DATAMATE_WEBSITE_ID,
  source: "backend",
});

await client.track({
  name: "job_completed",
  eventId: `job-${jobId}`, // ⚡ re-sends of the same eventId are deduplicated
  properties: { queue: "emails", total: 128 },
});
const result = await client.flush();
if (!result.success) console.error("Failed to flush analytics:", result.error);
```

> Vue/Nuxt components, server-side tracking (`@datamate/sdk/node`) with batching & `flush()`, feature flags, and a native Swift package are also available — see [`packages/sdk`](packages/sdk/README.md) and the full guides under [`apps/docs/content/docs/sdk`](apps/docs/content/docs/sdk/index.mdx).

## 📚 Repository Guide

| Document                                                     | What's inside                                           |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)                         | Contribution workflow, PR standards, commit conventions |
| [`AI_POLICY.md`](AI_POLICY.md)                               | Formal rules for disclosing AI assistance               |
| [`SECURITY.md`](SECURITY.md)                                 | Responsible vulnerability disclosure                    |
| [`ROADMAP.md`](ROADMAP.md) · [`SPEC.md`](SPEC.md)            | Product direction & product contract                    |
| [`AGENTS.md`](AGENTS.md)                                     | Coding conventions for AI coding agents in this repo    |
| [`.env.example`](.env.example)                               | Reference list of every supported environment variable  |
| [`apps/docs`](apps/docs/content/docs/index.mdx)              | Full product, API & SDK documentation (Fumadocs site)   |
| [`docker-compose.selfhost.yml`](docker-compose.selfhost.yml) | Production self-hosting compose file                    |

### Not sure where to start?

```mermaid
flowchart TD
    Q{"What brings you here?"}
    Q -->|"I want analytics in my app"| Track["Start Tracking Your App — this page"]
    Q -->|"I want to run Datamate locally"| Run["Local Development — this page"]
    Q -->|"I want it on my own servers"| Self["Self-Hosting — this page + docker-compose.selfhost.yml"]
    Q -->|"I want to ship code"| Ship["CONTRIBUTING.md, then AGENTS.md"]
    Q -->|"I used AI to build my contribution"| AIPol["AI_POLICY.md — disclosure is mandatory"]
    Q -->|"I found a vulnerability"| Vuln["SECURITY.md — report privately, never publicly"]
    Q -->|"I want to know where this is going"| Vision["ROADMAP.md for direction + SPEC.md for the contract"]
```

Every path ends in a section on this page or a document in the repository root — no dead ends.

## 🔧 How It Works

### Authentication & Session Flow

```mermaid
flowchart LR
    LoginUI["User submits Email / Magic Link / OTP form"] --> AuthClient["Better Auth Client (@datamate/auth/client)"]
    AuthClient --> AuthRoute["POST /api/auth/* (Next.js Route Handler)"]
    AuthRoute --> BetterAuth["Better Auth Server (packages/auth) with organizations & audit plugins"]
    BetterAuth --> Drizzle["Drizzle ORM validates & persists User, Session & Organization"]
    Drizzle --> PG[(PostgreSQL Database)]
    AuthRoute --> Cookie["Signed HTTP-only Session Cookie Issued"]
    Cookie --> Hydrate["authClient hydrates session & active organization state"]
    Hydrate --> Guard["Role-based permissions guard every route & mutation"]
    Guard --> Dash["User lands in the analytics workspace"]
```

### Live Analytics Event Ingestion Flow

```mermaid
flowchart LR
    Load["Tracker script loads (cdn.datamate.cc/datamate.js)"] --> Batch["@datamate SDK batches pageviews, custom events, errors & web vitals"]
    Batch --> Post["POST https://basket.datamate.cc/track"]
    Post --> Validate["Zod schema validation & bot detection"]
    Validate --> Authorize["Website lookup, origin/IP authorization & billing limit check"]
    Authorize --> WriteCH["ClickHouse client inserts event spans"]
    WriteCH --> CH[(ClickHouse Analytics Warehouse)]
    Authorize --> UpsertSession["Drizzle ORM upserts sessions & relational records"]
    UpsertSession --> PG[(PostgreSQL)]
    CH --> Live["Dashboards query fresh data in real time"]
```

### Typed Query Layer & Caching Flow

```mermaid
flowchart LR
    Hook["Dashboard component calls TanStack Query hook"] --> OrpcClient["ORPC Client executes typed procedure (packages/rpc)"]
    OrpcClient --> Ctx["API request carries Better Auth session cookie"]
    Ctx --> Elysia["API procedure handler (apps/api, Elysia.js)"]
    Elysia --> Scope["Organization scope & permission check"]
    Scope --> Hit{"Redis cache hit?"}
    Hit -->|"yes"| Resp["Cached result returned instantly"]
    Hit -->|"no"| Query["Drizzle SQL or ClickHouse analytics query"]
    Query --> Set["Result cached with TTL & table-aware keys"]
    Set --> Resp
    Mut["Any write mutation"] --> Inv["Invalidates affected cache namespaces"]
    Inv --> Refetch["Open dashboards auto-refetch"]
    Resp --> Render["Charts render with live metrics"]
```

### Intelligence Investigation Flow

```mermaid
flowchart LR
    Detect["Insights scheduler detects a signal: error spike, goal drop, funnel shift"] --> Turn["One exact agent turn starts per signal"]
    Turn --> Inspect["Agent inspects analytics, errors, sessions, funnels, deploys & code (read-only)"]
    Inspect --> Obs["Append-only observation saved to insight_observations"]
    Obs --> Outcome{"act / ask / watch / resolve"}
    Outcome -->|"act or ask"| Case["Investigation case opened & teammate notified"]
    Outcome -->|"watch"| Quiet["Quiet scheduled recheck, no interruption"]
    Outcome -->|"resolve"| Close["Case closed, recovery recorded"]
    Case --> Sync["Slack thread & dashboard timeline share one durable case"]
    Quiet --> Remetric["Same signal remeasured even below threshold"]
    Remetric --> ResolveClose["Recovered cases close instead of disappearing"]
```

### Database & Migration CLI Flow

```mermaid
flowchart TB
    SchemaEdit["Modify packages/db Drizzle schemas"] --> Push["bun run db:push (dev iteration, no files)"]
    SchemaEdit --> Migrate["bun run db:migrate / db:deploy (apply committed SQL migrations)"]
    Migrate --> PG[(Apply to PostgreSQL)]
    Push --> PG
    Codegen["bun run generate-db"] --> Regenerated["ClickHouse schema codegen regenerated (tables.generated.ts)"]
    ChSchema["ClickHouse .sql reference schema (packages/db/src/clickhouse/schema)"] --> Init["bun run clickhouse:init (idempotent CREATE IF NOT EXISTS)"]
    Init --> CH[(Create ClickHouse tables & materialized views)]
    Seed["bun run db:seed WEBSITE_ID COUNT"] --> Populate["Seeds events, outgoing links, errors & web vitals"]
    Studio["bun run db:studio"] --> Visual["Drizzle Studio GUI inspector"]
```

### Architecture Topology Overview

```mermaid
flowchart LR
    Visitor(["Website visitor"]) --> Tracker["@datamate SDK + tracker script (CDN)"]
    Tracker -->|"batched POST /track"| Basket["basket - event ingestion :4000"]
    Dashboard["Dashboard - Next.js 16 :3000"] -->|"typed RPC + TanStack Query"| Orpc["ORPC contracts (packages/rpc)"]
    Orpc --> Api["api - Elysia.js :3001"]
    Dashboard --> Auth["Better Auth (packages/auth)"]
    StatusApp["Status pages :3002"] --> Api
    LinksApp["Short links :2500"] --> Api
    SlackApp["Slack app"] --> Api
    Basket --> CH[(ClickHouse warehouse)]
    Basket --> PG[(PostgreSQL)]
    Api --> Drizzle["Drizzle ORM engine"]
    Drizzle --> PG
    Api -->|"analytics SQL"| CH
    Api <--> Redis["Redis - cache, queues, pub/sub"]
    InsightsApp["insights - scheduler + worker :4002"] -->|"read-only investigation tools"| Api
    InsightsApp --> CH
    InsightsApp --> Notif["Multi-channel notifications - Slack, Discord, Teams, Telegram, Email"]
    Notif --> Team(["Teammates in Slack & inbox"])
```

---

## 🏗️ Architecture

### Repository layout

| Path                                                                                                         | Purpose                                                            |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `apps/dashboard`                                                                                             | Next.js 16 web application (React 19, TailwindCSS 4)               |
| `apps/api`                                                                                                   | Elysia.js RPC/API server (port 3001)                               |
| `apps/basket`                                                                                                | High-throughput analytics event ingestion (port 4000)              |
| `apps/insights`                                                                                              | Investigation scheduler & worker (port 4002)                       |
| `apps/status`                                                                                                | Public status pages (port 3002)                                    |
| `apps/links`                                                                                                 | Short-link redirects & tracking (port 2500)                        |
| `apps/uptime`                                                                                                | Uptime monitoring checks                                           |
| `apps/cron`                                                                                                  | Scheduled jobs                                                     |
| `apps/slack`                                                                                                 | Slack app integration                                              |
| `apps/docs`                                                                                                  | Documentation site (Fumadocs)                                      |
| `apps/video`                                                                                                 | Remotion product video workspace                                   |
| `packages/rpc`                                                                                               | ORPC router — the type-safe API contract between dashboard and API |
| `packages/db`                                                                                                | Drizzle ORM schemas & clients (PostgreSQL + ClickHouse)            |
| `packages/auth`                                                                                              | Better-Auth integration & permission system                        |
| `packages/sdk`                                                                                               | Public analytics SDK (React, Vue, Node.js)                         |
| `packages/sdk-swift`                                                                                         | Native Swift package for Apple apps                                |
| `packages/tracker`                                                                                           | Lightweight client tracking script (`datamate.js`) served from CDN |
| `packages/cache`                                                                                             | Redis-backed Drizzle query caching                                 |
| `packages/redis`                                                                                             | Redis client, pub/sub, BullMQ queues                               |
| `packages/ui`                                                                                                | Shared design system                                               |
| `packages/validation`                                                                                        | Zod schemas                                                        |
| `packages/ai`                                                                                                | LLM integrations (OpenAI, Groq, OpenRouter)                        |
| `packages/services`                                                                                          | Cross-cutting business logic                                       |
| `packages/email`                                                                                             | Transactional email via Resend                                     |
| `packages/notifications`                                                                                     | Multi-channel alerting (Slack, Discord, Teams, Telegram…)          |
| `packages/shared` · `mapper` · `query` · `api-keys` · `encryption` · `env` · `migrate` · `devtools` · `test` | Shared types, utilities, and infrastructure                        |

### What lives where

Storage is split by access pattern — and every query in the codebase follows this map:

| Store                    | Owns                                                                                                                                   | Why it fits                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **PostgreSQL** (Drizzle) | Users, organizations, memberships, websites, settings, API keys, relational product state                                              | Transactions, referential integrity, row-level queries |
| **ClickHouse**           | Events, pageviews, sessions, custom events, errors, Web Vitals, outgoing-link clicks, insight observations & investigation projections | Columnar scans and aggregations over billions of rows  |
| **Redis**                | Query cache, BullMQ job queues, pub/sub fan-out                                                                                        | Sub-millisecond reads and durable async work           |

Rule of thumb: aggregating traffic over time → ClickHouse; identity, configuration, or durable product state → PostgreSQL through Drizzle + `@datamate/cache`.

## 💻 Tech Stack

| Layer                     | Technology                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Runtime & package manager | Bun 1.3.14+                                                                          |
| Frontend                  | Next.js 16 · React 19 · TailwindCSS 4 · Radix UI · Recharts · Jotai · TanStack Query |
| Backend                   | Elysia.js (Bun-native HTTP framework)                                                |
| API layer                 | ORPC (type-safe RPC with OpenAPI generation)                                         |
| Auth                      | Better-Auth                                                                          |
| Data                      | PostgreSQL 17 · ClickHouse 25.5 · Redis 7 · Drizzle ORM                              |
| Validation                | Zod 4                                                                                |
| Quality                   | Biome via Ultracite · Playwright · Turborepo                                         |

## 🚀 Local Development

### Prerequisites

- [Bun](https://bun.sh) 1.3.14+ and Node.js 20+
- Docker (for PostgreSQL, ClickHouse, and Redis)

### Setup

Prefer a guided experience? Run **`bun run setup`** — an interactive wizard that verifies prerequisites (Bun, Docker) and prepares your `.env`. Otherwise, follow the manual steps below.

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp .env.example .env

# 3. Start infrastructure
docker compose up -d          # PostgreSQL, ClickHouse, Redis

# 4. Initialize databases
bun run db:push               # Push the PostgreSQL schema
bun run clickhouse:init       # Create the ClickHouse analytics schema

# 5. Build the public SDK (required once, and after any SDK change)
bun run sdk:build

# 6. Start developing
bun run dev:dashboard         # Dashboard + API (most common workflow)
```

Optionally seed realistic sample data for a website:

```bash
bun run db:seed <WEBSITE_ID> [EVENT_COUNT]   # default event count: 10,000
```

> All root scripts load `.env` automatically via a `dotenv --` prefix — always run them from the repository root.

### Common commands

| Command                                             | Description                                        |
| --------------------------------------------------- | -------------------------------------------------- |
| `bun run dev`                                       | Start all applications in development mode         |
| `bun run dev:dashboard`                             | Start the dashboard + API only                     |
| `bun run build`                                     | Production build of every app                      |
| `bun run lint` / `bun run format`                   | Lint / format with Ultracite (Biome)               |
| `bun run check-types`                               | Type-check the entire monorepo                     |
| `bun run test` / `test:watch`                       | Run all tests                                      |
| `bun run db:push`                                   | Apply schema changes directly (no migration files) |
| `bun run db:migrate` / `db:deploy`                  | Run / deploy migration files                       |
| `bun run db:studio`                                 | Open Drizzle Studio GUI                            |
| `bun run sdk:build`                                 | Build the SDK package                              |
| `bun run email:dev`                                 | Email template development server                  |
| `bun run setup`                                     | Interactive prerequisite check & `.env` wizard     |
| `bun run dev:insights` / `dev:status` / `dev:slack` | Run individual workspaces                          |
| `bun run test:coverage`                             | Run tests with coverage report                     |
| `bun run generate-db`                               | Regenerate ClickHouse schema codegen               |
| `bun run clean`                                     | Remove build artifacts and `node_modules`          |

## 🏠 Self-Hosting

Datamate can be self-hosted using Docker Compose. The repo includes two compose files:

| File                          | Purpose                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `docker-compose.yaml`         | **Development only** — starts infrastructure (Postgres, ClickHouse, Redis) for local dev |
| `docker-compose.selfhost.yml` | **Production / self-hosting** — backend services from GHCR images                        |

### Quick Start

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env — set IMAGE_TAG, URL-safe database/cache passwords, public URLs,
# BETTER_AUTH_SECRET, DATAMATE_ENCRYPTION_KEY, IP_HASH_SALT, and
# AI_GATEWAY_API_KEY. Make the local database URLs use the same credentials
# before running the initialization commands below.

# 2. Start databases and cache
docker compose -f docker-compose.selfhost.yml up -d postgres clickhouse redis

# 3. Initialize databases from the repo checkout (first run only)
bun install --frozen-lockfile
bun run db:push
bun run clickhouse:init

# 4. Start backend services
docker compose -f docker-compose.selfhost.yml up -d
```

Services started:

- **API** → `localhost:3001`
- **Basket** (event ingestion) → `localhost:4000`
- **Insights** (investigation worker) → `localhost:4002`
- **Links** (short links) → `localhost:2500`

All ports are configurable via env vars (`API_PORT`, `BASKET_PORT`, etc.). See the compose file comments for the full env var reference.

## 🧪 Testing

```bash
bun run test           # unit & integration tests across workspaces
bun run test:watch     # watch mode
```

Dashboard end-to-end tests use Playwright with an isolated per-run database — see [`apps/dashboard/test/e2e`](apps/dashboard/test/e2e) for the runner and standards.

## 🤝 Contributing

Contributions are welcome! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request — note that the project has a formal [`AI_POLICY.md`](AI_POLICY.md) that requires disclosure of any AI assistance.

## 🔒 Security

Found a vulnerability? Please report it responsibly via [`SECURITY.md`](SECURITY.md) — do not open a public issue.

**What is Datamate?**
A privacy-first, open-source analytics platform covering traffic analytics, product funnels, quality signals (errors, Web Vitals, uptime), short links, and an agentic intelligence layer that investigates meaningful changes for you.

**What are the system requirements?**
Bun 1.3.14+, Node.js 20+, and Docker for the three backing stores. See [Local Development](#-local-development).

**Is it privacy-friendly?**
Privacy-first is a core design constraint, not a marketing flag: visitor IPs are salted and hashed before storage, third-party integration secrets are encrypted at rest, data export is built in, and self-hosting keeps every byte on infrastructure you control.

**Which frameworks does the SDK support?**
React / Next.js, Vue / Nuxt, Node.js server apps, a native Swift package for Apple platforms, and a plain CDN script for anything else (including Google Tag Manager).

**Can I contribute AI-assisted code?**
Yes — but all AI usage must be disclosed per [`AI_POLICY.md`](AI_POLICY.md). See [Contributing](#-contributing) before opening a pull request.

## 💬 Support

- [Discord community](https://discord.gg/JTk7a38tCZ)
- [@trydatamate on X/Twitter](https://twitter.com/trydatamate)
- [GitHub Issues](https://github.com/GiorgiKavtaradze-prog/Datamate/issues) for bug reports and feature requests

## 📄 License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.

Copyright © 2026 GiorgiKavtaradze
