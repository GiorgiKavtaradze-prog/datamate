# Datamate SDK

[![npm version](https://img.shields.io/npm/v/@datamate/sdk?style=flat-square)](https://www.npmjs.com/package/@datamate/sdk)
[![License](https://img.shields.io/npm/l/@datamate/sdk?style=flat-square)](./LICENSE)
[![Docs](https://img.shields.io/badge/docs-datamate.cc-blue?style=flat-square)](https://www.datamate.cc/docs)

> **The easiest, privacy-first way to add analytics to your web app.**

---

## ✨ Features

- 📊 **Automatic page/screen view tracking**
- ⚡ **Performance, Web Vitals, and error tracking**
- 🧑‍💻 **Custom event tracking**
- 🧩 **Drop-in React/Next.js and Vue components**
- 🖥️ **Node.js server-side event tracking**
- 🚩 **Client and server-side feature flags**
- 🛡️ **Privacy-first: anonymized by default, sampling, batching, and more**
- 🛠️ **Type-safe config and autocompletion**
- 📋 **Observability: logging, error tracking, and distributed tracing**

---

## 🚀 Quickstart

```sh
bun add @datamate/sdk
# or
npm install @datamate/sdk
```

Add to your root layout (Next.js/React):

```tsx
import { Datamate } from "@datamate/sdk/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <Datamate
        clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID!}
        trackWebVitals
        trackErrors
        enableBatching
        batchSize={20}
      />
      <body>{children}</body>
    </html>
  );
}
```

---

## 📄 Vanilla HTML / CDN

No bundler required. Drop the script tag into any page, CMS, or tag manager:

```html
<script
  defer
  src="https://cdn.datamate.cc/datamate.js"
  data-client-id="YOUR_CLIENT_ID"
  data-track-web-vitals
  data-track-errors
  data-track-outgoing-links
  data-enable-batching="true"
  data-batch-size="20"
></script>
```

The tracker exposes a global `window.datamate` (aliased as `window.db`) API that mirrors the SDK's browser helpers:

```js
window.db.track("button_click", { button_text: "Get Started" });
window.db.screenView({ page_count: 3 });
window.db.identify("user_123", { plan: "pro" });
window.db.flush();
window.db.clear();
```

> **Privacy note:** the browser bundle is configured with a public `clientId` — never put an API key on the client.

## 🧰 Browser Helper Utilities

The `@datamate/sdk` core exports module-level helpers that are safe to call before the tracker script finishes loading — calls are queued and replayed automatically:

```ts
import {
  track,
  trackError,
  identify,
  setTraits,
  setGlobalProperties,
  clear,
  clearProfile,
  flush,
  getTracker,
  isTrackerAvailable,
  getAnonymousId,
  getSessionId,
  getTrackingIds,
  getTrackingParams,
  getProfileId,
} from "@datamate/sdk";
```

Typical usage in a React/Next.js event handler:

```tsx
"use client";

import { track, trackError, getTrackingIds } from "@datamate/sdk";

export function CheckoutButton({ productId }: { productId: string }) {
  return (
    <button
      onClick={() => {
        // ✍️ Track the intent (browser side — user actions live here)
        track("checkout_started", {
          product_id: productId,
          currency: "usd",
        });
      }}
    >
      Checkout
    </button>
  );
}

// Catch application errors manually
try {
  await api.order.create();
} catch (error) {
  trackError("order_create_failed", {
    stack: error instanceof Error ? error.stack : String(error),
    product_id: productId,
  });
}
```

**Attribution hand-off to your backend:**

```ts
// Client: collect the tracking IDs…
export async function POST(request: Request) {
  const { anonId, sessionId } = getTrackingIds(request.nextUrl.searchParams);
  // …and send them with the server request so the Node SDK can continue the same session.
  await fetch("/api/checkout", {
    headers: { "x-anon-id": anonId, "x-session-id": sessionId },
  });
}
```

Navigation safety, logout reset, and checkups:

```ts
import {
  flush,
  clear,
  identify,
  isTrackerAvailable,
  getTracker,
} from "@datamate/sdk";

// Before a client-side navigation that unloads the current page
window.addEventListener("pagehide", () => flush());

// On logout: forget the identified user, keep the anonymous ID
identify("user_123", { plan: "pro" });
// …later…
clearProfile();

// Worst case, drive the underlying tracker directly
if (isTrackerAvailable()) {
  getTracker()?.track("debug_manual", { ok: true });
}
```

## 🚩 React Feature Flags

Wrap your app with `FlagsProvider`, then read flags anywhere with `useFlag`:

```tsx
"use client";

import { FlagsProvider, useFlag } from "@datamate/sdk/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FlagsProvider clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID!}>
      {children}
    </FlagsProvider>
  );
}

function PricingSection() {
  const flag = useFlag("new-pricing");

  if (flag.loading) return <div className="animate-pulse" aria-hidden />;
  return flag.on ? <NewPricing /> : <LegacyPricing />;
}
```

Value and variant-aware rendering:

```tsx
const hero = useFlag("hero-variant"); // → { on, value, variant, status, loading }

// variant-aware copy
const headline =
  hero.value === "long" ? "Analytics you can trust." : "Analyze.";
```

`useFlags()` exposes the full context — `getFlag`, `isOn`, `getValue`, `fetchFlag`, `fetchAllFlags`, `updateUser`, `refresh`, `isReady`, and `lastError`. Use `updateUser` after login so user-scoped flags re-evaluate:

```tsx
const { updateUser, isReady, refresh } = useFlags();

useEffect(() => {
  if (user) updateUser({ userId: user.id, organizationId: user.orgId });
}, [user, updateUser]);
```

## ✍️ Designing Custom Events

Track **intent, milestones, and outcomes** — not every click. Use stable `snake_case` names and low-cardinality property keys:

```ts
track("checkout_started", {
  checkout_type: "express",
  currency: "usd",
  products_count: 3,
});
```

- ✅ Prefer one event with useful properties over many near-duplicate names.
- ✅ Use backend tracking for authoritative outcomes (e.g. `order_completed` after the charge succeeds).
- ❌ Don't track PII, tokens, raw exception stacks, or large payloads.
- ❌ Don't track the same outcome in both browser and backend — use the browser for intent and the server for completion/failure.

## 🎛️ Sampling, Masking & Filtering

Control volume and privacy with `samplingRate`, `maskPatterns`, `skipPatterns`, and `filter`:

```tsx
<Datamate
  clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID!}
  trackWebVitals
  trackErrors
  enableBatching
  batchSize={20}
  samplingRate={0.1} // 10% of events
  skipPatterns={["/admin/**", "/healthz"]}
  maskPatterns={["/checkout/confirm"]}
  filter={(event) => event.name !== "heartbeat"}
/>
```

---

## 🖥️ Node.js Events

```ts
import { Datamate } from "@datamate/sdk/node";

const client = new Datamate({
  apiKey: process.env.DATAMATE_API_KEY!,
  websiteId: process.env.DATAMATE_WEBSITE_ID,
  source: "server",
});

await client.track({
  name: "job_completed",
  eventId: "job-123",
  properties: { queue: "emails" },
});

const result = await client.flush();
if (!result.success) {
  console.error("Failed to flush analytics:", result.error);
}
```

### Middleware, deduplication & serverless

The Node client supports **middleware** (transform or drop events), **`eventId` deduplication** (default on), namespacing, and per-request timeouts:

```ts
import { Datamate } from "@datamate/sdk/node";

const client = new Datamate({
  apiKey: process.env.DATAMATE_API_KEY!,
  websiteId: process.env.DATAMATE_WEBSITE_ID,
  source: "backend",
  namespace: "orders",
  enableDeduplication: true,
  middleware: [
    // Return null to drop the event, or return a (modified) event.
    async (event) => {
      if (event.name === "debug_ping") return null;
      return { ...event, properties: { ...event.properties, env: "prod" } };
    },
  ],
});

await client.track({
  name: "order_completed",
  eventId: `order-${orderId}`, // re-sends of the same eventId are deduplicated
  profileId: user.id,         // link to an identified profile
  properties: { total_usd: 129.0, currency: "usd" },
});
```

**Always `flush()` before the runtime exits.** In a serverless function or cron job, flush at the end of the handler with await:

```ts
export default async function webhookHandler(request: Request) {
  const payload = await request.json();

  await client.track({
    name: "webhook_received",
    eventId: payload.event_id,
    properties: { provider: payload.provider },
  });

  const result = await client.flush();
  if (!result.success) {
    console.error("Analytics flush failed:", result.error);
  }
}
```

If the queue is full the client returns a retryable `QUEUE_FULL` failure instead of dropping silently — `result.retryable === true` means you can safely back off and retry.

## 🚩 Server-Side Flags

```ts
import { createServerFlagsManager } from "@datamate/sdk/node";

const flags = createServerFlagsManager({
  clientId: process.env.DATAMATE_CLIENT_ID!,
  maxCacheSize: 5000,
});

const result = await flags.getFlag("new-dashboard", {
  userId: "user-123",
  organizationId: "org-456",
});
```

### In a Next.js route handler

Wait for initial evaluation before the first read — flags are cached server-side (default `maxCacheSize: 5000`, `cacheTtl: 60s`), so repeated reads are cheap:

```ts
import { createServerFlagsManager } from "@datamate/sdk/node";

const flags = createServerFlagsManager({
  clientId: process.env.DATAMATE_CLIENT_ID!,
});

export async function GET(request: Request) {
  await flags.waitForInit();

  const hero = await flags.getFlag("pricing-hero", {
    userId: "user-123",
    organizationId: "org-456",
  });

  return Response.json({ enabled: hero.enabled, value: hero.value });
}
```

Use a **stable user context** (the same `userId`/`organizationId` keys) so cache hits stay high, and always handle the loading/pending state — `FlagsRequestError` provides typed failure details (code, status, retryable, requestId).

## 🛠️ Browser Configuration Options

All options are type-safe and documented in `DatamateConfig`:

| Option               | Type     | Default                               | Description                                     |
| -------------------- | -------- | ------------------------------------- | ----------------------------------------------- |
| `clientId`           | string   | —                                     | **Required.** Your Datamate Client ID.          |
| `apiUrl`             | string   | `https://basket.datamate.cc`          | Custom API endpoint.                            |
| `scriptUrl`          | string   | `https://cdn.datamate.cc/datamate.js` | Custom script URL.                              |
| `sdk`                | string   | `web`                                 | SDK name. Only override for custom builds.      |
| `sdkVersion`         | string   | _auto_                                | SDK version. Defaults to package version.       |
| `disabled`           | boolean  | `false`                               | Disable all tracking.                           |
| `debug`              | boolean  | `false`                               | Enable debug logging (SDK-only).                |
| `trackHashChanges`   | boolean  | `false`                               | Track hash changes in URL.                      |
| `trackAttributes`    | boolean  | `false`                               | Track data-\* attributes on elements.           |
| `trackOutgoingLinks` | boolean  | `false`                               | Track clicks on outgoing links.                 |
| `trackInteractions`  | boolean  | `false`                               | Track user interactions.                        |
| `trackWebVitals`     | boolean  | `false`                               | Track Web Vitals metrics.                       |
| `trackErrors`        | boolean  | `false`                               | Track JavaScript errors.                        |
| `ignoreBotDetection` | boolean  | `false`                               | Ignore bot detection.                           |
| `usePixel`           | boolean  | `false`                               | Use pixel tracking instead of script.           |
| `samplingRate`       | number   | `1.0`                                 | Sampling rate (0.0–1.0).                        |
| `enableRetries`      | boolean  | `true`                                | Enable retries for failed requests.             |
| `maxRetries`         | number   | `3`                                   | Max retries.                                    |
| `initialRetryDelay`  | number   | `500`                                 | Initial retry delay (ms).                       |
| `enableBatching`     | boolean  | `true`                                | Enable event batching.                          |
| `batchSize`          | number   | `10`                                  | Events per batch (1–50).                        |
| `batchTimeout`       | number   | `5000`                                | Batch timeout (ms, 100–30000).                  |
| `skipPatterns`       | string[] | —                                     | Array of glob patterns to skip tracking.        |
| `maskPatterns`       | string[] | —                                     | Array of glob patterns to mask sensitive paths. |
| `filter`             | function | —                                     | Filter function to conditionally skip events.   |

---

## 💡 FAQ

**Q: Is Datamate privacy-friendly?**  
A: Yes! All analytics are anonymized by default. No cookies, no fingerprinting, no PII.

**Q: Can I use this in Next.js, Remix, or plain React?**  
A: Yes! `<Datamate />` works in any React app. For non-React, use the script tag directly.

**Q: How do I disable analytics in development?**  
A: Use the `disabled` prop: `<Datamate disabled={process.env.NODE_ENV === 'development'} ... />`

**Q: Where do I find my `clientId`?**  
A: In your [Datamate dashboard](https://app.datamate.cc).

---

## 🧑‍💻 Troubleshooting

- **Script not loading?**
  - Make sure your `clientId` is correct and the script URL is reachable.
- **No events in dashboard?**
  - Check your config, especially `clientId` and network requests in the browser dev tools.
- **Type errors?**
  - All config options are type-safe. Use your IDE's autocomplete for help.
- **SSR/Next.js?**
  - The component is safe for SSR/React Server Components. It only injects the script on the client.

---

## 📚 Documentation & Support

- [Datamate Docs](https://www.datamate.cc/docs)
- [Dashboard](https://app.datamate.cc)
- [Contact Support](https://www.datamate.cc/contact)

---

© Datamate. All rights reserved.
