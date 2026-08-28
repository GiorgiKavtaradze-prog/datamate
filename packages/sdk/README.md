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
import { Datamate } from '@datamate/sdk/react';

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

## 🖥️ Node.js Events

```ts
import { Datamate } from "@datamate/sdk/node";

const client = new Datamate({
  apiKey: process.env.DATAMATE_API_KEY!,
  websiteId: process.env.DATAMATE_WEBSITE_ID,
  source: "server"
});

await client.track({
  name: "job_completed",
  eventId: "job-123",
  properties: { queue: "emails" }
});

const result = await client.flush();
if (!result.success) {
  console.error("Failed to flush analytics:", result.error);
}
```

## 🚩 Server-Side Flags

```ts
import { createServerFlagsManager } from "@datamate/sdk/node";

const flags = createServerFlagsManager({
  clientId: process.env.DATAMATE_CLIENT_ID!,
  maxCacheSize: 5000
});

const result = await flags.getFlag("new-dashboard", {
  userId: "user-123",
  organizationId: "org-456"
});
```

## 🛠️ Browser Configuration Options

All options are type-safe and documented in `DatamateConfig`:

| Option                | Type      | Default      | Description |
|-----------------------|-----------|--------------|-------------|
| `clientId`            | string    | —            | **Required.** Your Datamate Client ID. |
| `apiUrl`              | string    | `https://basket.datamate.cc` | Custom API endpoint. |
| `scriptUrl`           | string    | `https://cdn.datamate.cc/datamate.js` | Custom script URL. |
| `sdk`                 | string    | `web`        | SDK name. Only override for custom builds. |
| `sdkVersion`          | string    | *auto*       | SDK version. Defaults to package version. |
| `disabled`            | boolean   | `false`      | Disable all tracking. |
| `debug`               | boolean   | `false`      | Enable debug logging (SDK-only). |
| `trackHashChanges`    | boolean   | `false`      | Track hash changes in URL. |
| `trackAttributes`     | boolean   | `false`      | Track data-* attributes on elements. |
| `trackOutgoingLinks`  | boolean   | `false`      | Track clicks on outgoing links. |
| `trackInteractions`   | boolean   | `false`      | Track user interactions. |
| `trackWebVitals`      | boolean   | `false`      | Track Web Vitals metrics. |
| `trackErrors`         | boolean   | `false`      | Track JavaScript errors. |
| `ignoreBotDetection`  | boolean   | `false`      | Ignore bot detection. |
| `usePixel`            | boolean   | `false`      | Use pixel tracking instead of script. |
| `samplingRate`        | number    | `1.0`        | Sampling rate (0.0–1.0). |
| `enableRetries`       | boolean   | `true`       | Enable retries for failed requests. |
| `maxRetries`          | number    | `3`          | Max retries. |
| `initialRetryDelay`   | number    | `500`        | Initial retry delay (ms). |
| `enableBatching`       | boolean   | `true`       | Enable event batching. |
| `batchSize`           | number    | `10`         | Events per batch (1–50). |
| `batchTimeout`        | number    | `5000`       | Batch timeout (ms, 100–30000). |
| `skipPatterns`        | string[]  | —            | Array of glob patterns to skip tracking. |
| `maskPatterns`        | string[]  | —            | Array of glob patterns to mask sensitive paths. |
| `filter`               | function  | —            | Filter function to conditionally skip events. |

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
