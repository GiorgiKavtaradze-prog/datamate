# Datamate Server Events And Attribution

Use this file for Node/server tracking, raw event ingestion, browser helper utilities, and client-to-server attribution.

## Browser Helpers

Import browser helpers from `@datamate/sdk` after installing the browser tracker.

| Helper | Use |
| --- | --- |
| `track(name, properties?)` | Send a browser custom event; safe no-op before the tracker loads |
| `trackError(message, properties?)` | Manually send an error event; automatic errors use `trackErrors` |
| `flush()` | Force queued browser events to send before navigation |
| `clear()` | Reset anonymous/session IDs after logout |
| `getAnonymousId(urlParams?)` | Read the persistent anonymous ID from URL params or localStorage |
| `getSessionId(urlParams?)` | Read the current session ID from URL params or sessionStorage |
| `getTrackingIds(urlParams?)` | Get `{ anonId, sessionId }` together for server attribution |
| `getTrackingParams(urlParams?)` | Build `anonId=...&sessionId=...` for cross-domain links |
| `isTrackerAvailable()` | Check whether `window.datamate` is loaded |
| `getTracker()` | Access the raw tracker for advanced methods; prefer helpers by default |

Use `getTrackingParams()` when linking or redirecting to another domain you own. The destination tracker reads `anonId` and `sessionId` from URL params.

## Node Events

```ts
import { Datamate } from "@datamate/sdk/node";

const client = new Datamate({
  apiKey: process.env.DATAMATE_API_KEY!,
  websiteId: process.env.DATAMATE_WEBSITE_ID,
});

await client.track({
  name: "webhook_processed",
  properties: { provider: "github", status: "success" },
  source: "server",
});

await client.flush();
```

Serverless and short-lived runtimes must call `flush()` before returning.

## Server-Side Attribution

For a browser action that completes on the server, pass browser IDs to the server and map them onto the Node SDK event. API keys stay server-side; anonymous/session IDs can cross the wire.

| Flow | Pattern |
| --- | --- |
| Browser `fetch` to API route | send `anonId` and `sessionId` from `getTrackingIds()` in the JSON body |
| Form post or server action | populate hidden fields from `getTrackingIds()` before submit |
| Redirect to another owned domain | append `getTrackingParams()` to the URL and install Datamate on the destination |
| Async job started by a user | persist `anonId` and `sessionId` with the job record; reuse them on completion/failure |
| External webhook after user setup | persist Datamate IDs during setup and reuse them if the webhook can be tied back |
| Pure server event | omit session IDs; include `source`, `namespace`, `status`, and operational properties |

```tsx
// client
import { getTrackingIds } from "@datamate/sdk";

async function createProject(projectType: string) {
  const { anonId, sessionId } = getTrackingIds();

  await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      anonId,
      sessionId,
      projectType,
    }),
  });
}
```

```ts
// server
import { Datamate } from "@datamate/sdk/node";

const datamate = new Datamate({
  apiKey: process.env.DATAMATE_API_KEY!,
  websiteId: process.env.DATAMATE_WEBSITE_ID!,
});

export async function POST(request: Request) {
  const { anonId, sessionId, projectType } = await request.json();

  await datamate.track({
    name: "project_created",
    anonymousId: anonId,
    sessionId,
    properties: { project_type: projectType },
    source: "server",
  });

  await datamate.flush();

  return Response.json({ ok: true });
}
```

For form posts, put the same IDs into hidden inputs before submit:

```tsx
import { getTrackingIds } from "@datamate/sdk";

function addTrackingFields(form: HTMLFormElement) {
  const { anonId, sessionId } = getTrackingIds();

  for (const [name, value] of Object.entries({ anonId, sessionId })) {
    if (!value) {
      continue;
    }

    let input = form.elements.namedItem(name);
    if (!(input instanceof HTMLInputElement)) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.append(input);
    }

    input.value = value;
  }
}
```

Attribution can still work partially when one ID is missing, but both IDs give the strongest session continuity. The server event also needs website scoping through `websiteId`, `DATAMATE_WEBSITE_ID`, or API key resource scoping.

Do not invent a Datamate `identify()` helper. If the app has an identify route, it is user-owned backend code that can store or forward Datamate `anonymousId` and `sessionId`.

## Raw Event Tracking

Prefer SDKs unless the user explicitly wants HTTP.

```bash
curl -X POST https://basket.datamate.cc/track \
  -H "Authorization: Bearer dbdy_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"name":"signup_completed","websiteId":"your-client-id"}'
```

Raw `/track` payload fields mirror the Node SDK shape: `name`, `properties`, `anonymousId`, `sessionId`, `timestamp`, `namespace`, `source`, and `websiteId`.
