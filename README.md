```text
██████╗  █████╗ ████████╗ █████╗ ███╗   ███╗ █████╗ ████████╗███████╗
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
██║  ██║███████║   ██║   ███████║██╔████╔██║███████║   ██║   █████╗
██║  ██║██╔══██║   ██║   ██╔══██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝
██████╔╝██║  ██║   ██║   ██║  ██║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3-F9F1E1?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Elysia.js](https://img.shields.io/badge/Elysia.js-1.2-violet?style=for-the-badge)](https://elysiajs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![ClickHouse](https://img.shields.io/badge/ClickHouse-25.5-FFCC00?style=for-the-badge&logo=clickhouse&logoColor=black)](https://clickhouse.com/)
[![Redis](https://img.shields.io/badge/Redis-7.4-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square&logo=github-actions)](https://github.com/datamate-analytics/Datamate/actions)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg?style=flat-square&logo=codecov)](https://github.com/datamate-analytics/Datamate/actions)
[![Security Scan](https://img.shields.io/badge/security-A%2B-green.svg?style=flat-square&logo=snyk)](SECURITY.md)
[![Vercel OSS Program](https://img.shields.io/badge/Vercel-OSS_Program-black.svg?style=flat-square&logo=vercel)](https://vercel.com/oss)
[![Open Source](https://img.shields.io/badge/open_source-2026-blue.svg?style=flat-square)](LICENSE)

---

> [!NOTE]
> **Datamate** is a privacy-first, open-source product analytics platform. It combines real-time traffic monitoring, funnels, goals, error tracking, Web Vitals, uptime checks, and short links with an **autonomous LLM intelligence layer** that detects metrics anomalies, investigates root causes, and notifies teams.

---

## ✨ Features

| Feature                        | Description                                                               | Tech Highlight                               |
| :----------------------------- | :------------------------------------------------------------------------ | :------------------------------------------- |
| 📊 **Real-time Traffic**       | Live visitors, pageviews, sessions, geolocation, browsers, devices        | ClickHouse sub-second columnar query         |
| 🎯 **Product Funnels & Goals** | Multi-step drop-off analysis, conversion tracking & custom properties     | In-memory aggregations & custom events       |
| 🛡️ **App Health & Quality**    | Stacktrace error tracking, Core Web Vitals (LCP, CLS, INP), uptime checks | Automatic error grouping & alert triggers    |
| 🔗 **Short Links & Growth**    | UTM analytics, short link redirection & click counts                      | Edge-cached redirect engine                  |
| 🤖 **Autonomous Intelligence** | Anomaly detection worker, LLM investigation agent & Slack case sync       | Multi-provider AI (OpenAI, Groq, OpenRouter) |
| 🔐 **Enterprise Security**     | Organization tenancy, RBAC permissions, zero-cookie option, hashed IPs    | GDPR / CCPA compliant by design              |

---

## 📡 Start Tracking Your App

Integration takes under **2 minutes**. Pick your stack:

### ⚛️ React / Next.js (`tsx`)

```tsx
import { Datamate } from "@datamate/sdk/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Datamate
          clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID!}
          trackWebVitals
          trackErrors
          enableBatching
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 🟢 Vue 3 / Nuxt (`ts`)

```ts
import { createApp } from "vue";
import { createDatamate } from "@datamate/sdk/vue";
import App from "./App.vue";

const app = createApp(App);
app.use(
  createDatamate({
    clientId: import.meta.env.VITE_DATAMATE_CLIENT_ID,
    trackWebVitals: true,
    trackErrors: true,
  }),
);
app.mount("#app");
```

### 🌐 Vanilla JS / HTML Script (`html`)

```html
<script
  async
  src="https://cdn.datamate.cc/datamate.js"
  data-client-id="YOUR_CLIENT_ID"
  data-track-web-vitals="true"
  data-track-errors="true"
></script>
```

### ⚡ Custom Event Ingestion (`ts`)

```ts
import { track } from "@datamate/sdk";

track("signup_completed", {
  method: "github",
  plan: "enterprise",
  value: 99.0,
});
```

### 🟢 Server-Side Ingestion - Node.js (`ts`)

```ts
import { Datamate } from "@datamate/sdk/node";

const client = new Datamate({
  apiKey: process.env.DATAMATE_API_KEY!,
  websiteId: process.env.DATAMATE_WEBSITE_ID,
});

await client.track({
  name: "payment_processed",
  eventId: `pay-${paymentId}`, // ⚡ Deduplicated idempotently
  properties: { amount: 149.99, currency: "USD" },
});
await client.flush();
```

### 📱 iOS / macOS - Swift (`swift`)

```swift
import DatamateSDK

@main
struct MyApp: App {
    init() {
        Datamate.configure(clientId: "YOUR_CLIENT_ID", trackErrors: true)
    }
    var body: some Scene {
        WindowGroup {
            ContentView().onAppear {
                Datamate.track(name: "app_launched", properties: ["os": "iOS"])
            }
        }
    }
}
```

### 🐍 Python Backend (`python`)

```python
import requests

requests.post(
    "https://basket.datamate.cc/track",
    headers={"X-Datamate-Client-Id": "YOUR_CLIENT_ID"},
    json={
        "type": "event",
        "name": "model_inference_completed",
        "properties": {"latency_ms": 142, "tokens": 512},
    },
)
```

### 📡 Direct cURL API (`bash`)

```bash
curl -X POST https://basket.datamate.cc/track \
  -H "Content-Type: application/json" \
  -H "X-Datamate-Client-Id: YOUR_CLIENT_ID" \
  -d '{"type":"event","name":"api_ping","properties":{"env":"prod"}}'
```

---

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

## 💾 Storage Engine & Data Map

| Storage Store                        | Managed Data                                    | Purpose                                    |
| :----------------------------------- | :---------------------------------------------- | :----------------------------------------- |
| 🗄️ **PostgreSQL 17** _(Drizzle ORM)_ | Users, Orgs, Websites, API Keys, Settings       | Relational ACID transactions               |
| ⚡ **ClickHouse 25.5** _(Columnar)_  | Events, Pageviews, Errors, Web Vitals, Sessions | Instant aggregations over billions of rows |
| 🔑 **Redis 7** _(ioredis & BullMQ)_  | Query Cache, BullMQ Queues, Pub/Sub             | Sub-millisecond reads & async workers      |

---

## ⚡ Code Examples Deep Dive

### 1. Type-Safe ORPC Definition (`packages/rpc`)

```ts
import { z } from "zod";
import { trackedProcedure } from "../middleware/auth";

export const getWebsiteOverview = trackedProcedure
  .input(
    z.object({
      websiteId: z.string(),
      period: z.enum(["24h", "7d", "30d"]),
    }),
  )
  .output(
    z.object({
      pageviews: z.number(),
      visitors: z.number(),
      bounceRate: z.number(),
    }),
  )
  .query(async ({ input, ctx }) => {
    return ctx.services.analytics.getOverview(input.websiteId, input.period);
  });
```

### 2. Drizzle PostgreSQL Schema (`packages/db`)

```ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@datamate/shared";

export const websites = pgTable("websites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId("ws")),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  public: boolean("public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 3. ClickHouse SQL Table Schema (`packages/db`)

```sql
CREATE TABLE IF NOT EXISTS analytics.events (
  website_id UUID,
  session_id UUID,
  event_name LowCardinality(String),
  timestamp DateTime64(3, 'UTC'),
  properties String JSON
) ENGINE = ReplacingMergeTree()
ORDER BY (website_id, event_name, timestamp, session_id);
```

### 4. Elysia.js RPC App (`apps/api`)

```ts
import { Elysia } from "elysia";
import { fetchRequestHandler } from "@orpc/server/fetch";
import { appRouter } from "@datamate/rpc";

export const app = new Elysia()
  .all("/rpc/*", ({ request }) =>
    fetchRequestHandler({ router: appRouter, request, prefix: "/rpc" }),
  )
  .listen(3001);
```

---

## 🚀 Local Development

### 1-Step Quick Start

```bash
bun run setup
```

### Manual Setup

```bash
# Clone & Install
git clone https://github.com/GiorgiKavtaradze-prog/datamate.git
cd datamate && bun install

# Environment & Infrastructure
cp .env.example .env
docker compose up -d

# Initialize Databases & SDK
bun run db:push
bun run clickhouse:init
bun run sdk:build

# Launch App (Dashboard + API)
bun run dev:dashboard
```

### 🛠️ CLI Commands Cheat Sheet

```bash
bun run dev:dashboard     # Start Dashboard (:3000) & API (:3001)
bun run build             # Build all apps & packages
bun run check-types       # Strict TypeScript typecheck
bun run lint              # Biome linter check
bun run db:push           # Apply PostgreSQL schema changes
bun run clickhouse:init   # Create ClickHouse analytics tables
bun run db:studio         # Open Drizzle GUI database browser
bun run test              # Run unit & integration tests
```

---

## 🏠 Self-Hosting

Deploy with Docker Compose using prebuilt images:

```bash
# 1. Environment & Infrastructure
cp .env.example .env
docker compose -f docker-compose.selfhost.yml up -d postgres clickhouse redis

# 2. Database Init (First run)
bun run db:push && bun run clickhouse:init

# 3. Start Backend Services
docker compose -f docker-compose.selfhost.yml up -d
```

### Services & Ports

- 📊 **Dashboard**: `http://localhost:3000`
- ⚡ **API Server**: `http://localhost:3001`
- 📥 **Event Ingestion**: `http://localhost:4000`
- 🤖 **Insights Worker**: `http://localhost:4002`
- 🔗 **Short Links**: `http://localhost:2500`

---

## 🧪 Testing

```bash
bun run test             # Unit & integration tests
bun run test:watch       # Test watcher mode
```

---

## 🤝 Contributing & AI Policy

- Review [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a PR.
- **AI Policy (`AI_POLICY.md`):** All AI assistance must be explicitly disclosed in PR descriptions.

---

## 🔒 Security

Found a vulnerability? Report privately via [`SECURITY.md`](SECURITY.md) or email `security@datamate.cc`. Do not open public issues.

---

## 💬 Support & Community

- 💬 **Discord**: Join the [Datamate Discord Community](https://discord.gg/JTk7a38tCZ)
- 🐦 **Twitter / X**: Follow [@trydatamate](https://twitter.com/trydatamate)
- 🐛 **Bug Reports**: Open an issue on [GitHub Issues](https://github.com/GiorgiKavtaradze-prog/Datamate/issues)

---

## 📄 License

This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

Copyright © 2026 **GiorgiKavtaradze**
