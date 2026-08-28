---
name: datamate
description: Integrate Datamate analytics using the SDK, REST API, or MCP. Use when implementing analytics tracking, feature flags, custom events, Web Vitals, error tracking, LLM observability, MCP agents, or querying analytics data programmatically.
metadata:
  author: datamate
  version: "2.3"
---

# Datamate

Datamate is a privacy-first analytics platform. This skill covers both the SDK (`@datamate/sdk`) and the REST API.

## External Documentation

For the most up-to-date documentation, fetch: **https://datamate.cc/llms.txt**

## When to Use This Skill

Use this skill when:
- Setting up analytics in React/Next.js/Vue applications
- Implementing server-side tracking in Node.js
- Adding feature flags to an application
- Tracking custom events, errors, or Web Vitals
- Integrating LLM observability with Vercel AI SDK
- Querying analytics data via the REST API or MCP
- Building MCP agents or AI-powered analytics workflows
- Building custom dashboards or reports

## SDK Entry Points

| Import Path | Environment | Description |
|-------------|-------------|-------------|
| `@datamate/sdk` | Browser (Core) | Core tracking utilities and types |
| `@datamate/sdk/react` | React/Next.js | React component and hooks |
| `@datamate/sdk/node` | Node.js/Server | Server-side tracking with batching |
| `@datamate/sdk/vue` | Vue.js | Vue plugin and composables |
| `@datamate/sdk/ai/vercel` | AI/LLM | Vercel AI SDK middleware for LLM analytics |

## Quick Start

### React/Next.js

```tsx
import { Datamate } from "@datamate/sdk/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Datamate
          clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID}
          trackWebVitals
          trackErrors
          trackPerformance
        />
      </body>
    </html>
  );
}
```

### Node.js Server-Side

```typescript
import { Datamate } from "@datamate/sdk/node";

const client = new Datamate({
  clientId: process.env.DATAMATE_CLIENT_ID,
  enableBatching: true,
});

await client.track({
  name: "api_call",
  properties: { endpoint: "/users", method: "GET" },
});

// Important: flush before process exit in serverless
await client.flush();
```

### Feature Flags

```tsx
import { FlagsProvider, useFlag, useFeature } from "@datamate/sdk/react";

// Wrap your app
<FlagsProvider clientId="..." user={{ userId: "123" }}>
  <App />
</FlagsProvider>

// In components
function MyComponent() {
  const { on, loading } = useFeature("dark-mode");
  if (loading) return <Skeleton />;
  return on ? <DarkTheme /> : <LightTheme />;
}
```

### LLM Analytics

```typescript
import { datamateLLM } from "@datamate/sdk/ai/vercel";
import { openai } from "@ai-sdk/openai";

const { track } = datamateLLM({
  apiKey: process.env.DATAMATE_API_KEY,
});

const model = track(openai("gpt-4o"));
// All LLM calls are now automatically tracked
```

## Key Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `clientId` | `string` | Auto-detect | Project client ID |
| `disabled` | `boolean` | `false` | Disable all tracking |
| `trackWebVitals` | `boolean` | `false` | Track Web Vitals metrics |
| `trackErrors` | `boolean` | `false` | Track JavaScript errors |
| `trackPerformance` | `boolean` | `true` | Track performance metrics |
| `enableBatching` | `boolean` | `true` | Enable event batching |
| `samplingRate` | `number` | `1.0` | Sampling rate (0.0-1.0) |
| `skipPatterns` | `string[]` | — | Glob patterns to skip tracking |

## Common Patterns

### Disable in Development

```tsx
<Datamate
  disabled={process.env.NODE_ENV === "development"}
  clientId="..."
/>
```

### Skip Sensitive Paths

```tsx
<Datamate
  clientId="..."
  skipPatterns={["/admin/**", "/internal/**"]}
  maskPatterns={["/users/*", "/orders/*"]}
/>
```

### Custom Event Tracking

```typescript
// Browser
import { track } from "@datamate/sdk/react";

track("purchase", {
  product_id: "sku-123",
  amount: 99.99,
  currency: "USD",
});

// Node.js
await client.track({
  name: "subscription_renewed",
  properties: { plan: "pro", amount: 29.99 },
});
```

### Global Properties

```typescript
// Browser
window.datamate?.setGlobalProperties({
  plan: "enterprise",
  abVariant: "checkout-v2",
});

// Node.js
client.setGlobalProperties({
  environment: "production",
  version: "1.0.0",
});
```

## REST API

### Base URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Analytics API | `https://api.datamate.cc/v1` | Query analytics data |
| Event Tracking | `https://basket.datamate.cc` | Send custom events |

### Authentication

Use API key in the `x-api-key` header:

```bash
curl -H "x-api-key: dbdy_your_api_key" \
  https://api.datamate.cc/v1/query/websites
```

Get API keys from: [Dashboard → Organization Settings → API Keys](https://app.datamate.cc/organizations/settings#api-keys)

### Query Analytics Data

```bash
curl -X POST -H "x-api-key: dbdy_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": ["summary", "pages"],
    "preset": "last_30d"
  }' \
  "https://api.datamate.cc/v1/query?website_id=web_123"
```

**Available Query Types:**

| Type | Description |
|------|-------------|
| `summary` | Overall website metrics and KPIs |
| `pages` | Page views and performance by URL |
| `traffic` | Traffic sources and referrers |
| `browser_name` | Browser usage breakdown |
| `device_types` | Device category breakdown |
| `countries` | Visitors by country |
| `errors` | JavaScript errors |
| `performance` | Web vitals and load times |
| `custom_events` | Custom event data |

**Date Presets:** `today`, `yesterday`, `last_7d`, `last_30d`, `last_90d`, `this_month`, `last_month`

### MCP (Model Context Protocol)

Datamate exposes an MCP server for AI agents (Cursor, Claude Desktop, etc.) to query analytics. Use for natural-language questions, automated reports, or structured data extraction.

**Endpoint:** `POST https://api.datamate.cc/v1/mcp` (local: `http://localhost:3001/v1/mcp`)

**Auth:** API key with `read:data` scope via `x-api-key` or `Authorization: Bearer <key>`

**Tools:**
- `ask` – Natural-language analytics questions (e.g. "top 5 pages last week")
- `list_websites` – List accessible website IDs
- `get_data` – Pre-built query with `websiteId`, `type`, and `preset` or `from`/`to`
- `get_schema` – ClickHouse schema docs (tables, columns)
- `capabilities` – Query types with descriptions, date presets, hints

**Date presets for get_data:** `last_7d`, `last_30d`, `last_90d`, `today`, `yesterday`, `this_week`, `this_month`, etc.

**Cursor setup** (mcp.json): Add a Datamate MCP entry with the API URL and your API key.

### Send Events via API

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "type": "custom",
    "name": "purchase",
    "properties": {
      "value": 99.99,
      "currency": "USD"
    }
  }' \
  "https://basket.datamate.cc/?client_id=web_123"
```

### Batch Events

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '[
    {"type": "custom", "name": "event1", "properties": {...}},
    {"type": "custom", "name": "event2", "properties": {...}}
  ]' \
  "https://basket.datamate.cc/batch?client_id=web_123"
```

## Reference Documentation

For detailed documentation, see:

- [Core SDK Reference](references/core.md) - Browser tracking utilities and types
- [React Integration](references/react.md) - React/Next.js component and hooks
- [Node.js Integration](references/node.md) - Server-side tracking with batching
- [Feature Flags](references/flags.md) - Feature flags for all platforms
- [AI/LLM Tracking](references/ai-vercel.md) - Vercel AI SDK integration
- [REST API Reference](references/api.md) - Full REST API documentation

## Source Code

- SDK: `packages/sdk/`
- API: `apps/api/`
- API Docs: `apps/docs/content/docs/api/`
