# Datamate Swift SDK

Native Swift package for sending Datamate analytics events from Apple apps.

```swift
import Datamate

Datamate.configure(clientId: "YOUR_CLIENT_ID")

Datamate.track("app_launched", properties: [
    "surface": "menubar",
])

Datamate.trackScreen("settings")

await Datamate.trackAsync("extension_completed")
await Datamate.flush()
```

The Swift SDK uses the public Datamate client ID and sends events to `https://basket.datamate.cc/track`. Do not put a Datamate API key in a client app.

Events are queued and flushed automatically. Call `flush()` when an app extension or other short-lived process needs delivery before exit.

## Install

Until the first tagged Swift SDK release, add the package from the Datamate repository's `main` branch:

```swift
.package(url: "https://github.com/datamate-analytics/datamate.git", branch: "main")
```

Then add `Datamate` to your app target dependencies.

## Configuration

Tune batching, queueing, and identity for your app at startup:

```swift
Datamate.configure(
    clientId: "YOUR_CLIENT_ID",
    source: "ios",               // origin label — e.g. "ios", "macos", "extension"
    namespace: "paywall",        // logical grouping for filtering
    enabled: true,               // set false globally to disable tracking
    flushAt: 10,                 // flush after N buffered events
    flushInterval: 2.0,          // …or after 2s, whichever comes first
    maxQueueSize: 1_000          // events kept before dropping (oldest first)
)
```

You can reconfigure at any point with the same call — the new settings apply to the shared client.

## Tracking

Use `track` for product milestones and `trackScreen` for screen views. Prefer the `async` variants in async contexts so ordering is preserved:

```swift
// Fire-and-forget from UI code
Datamate.track("checkout_started", properties: [
    "checkout_type": "express",
    "currency": "usd",
    "products_count": 3,
])

// Async — await completion before continuing
await Datamate.trackAsync("order_completed", properties: [
    "total_usd": 129.0,
    "currency": "usd",
])

// Screen views
await Datamate.trackScreenAsync("settings")
```

**Supported property values:** `String`, `Int`, `Double`, `Bool`, and optional/arrays thereof — keep payloads small and PII-free.

## Short-lived processes

App extensions and widget extensions can be terminated at any time. Flush before your work ends:

```swift
// Inside an app extension…
let result = await Datamate.flush()
if !result.success {
    // result.error is populated; remaining events are still queued locally
    print("Failed to flush: \(String(describing: result.error))")
}
```

## Privacy

Track product events and milestones, not sensitive content. Avoid PII, secrets, tokens, raw search queries, full error stacks, and large payloads.

## Troubleshooting

- **No events in the dashboard?** Confirm the `clientId` matches a website in your Datamate account, then check the network tab of your debugger / Console for `https://basket.datamate.cc` requests.
- **Events disappear on extension exit?** Make sure you `await Datamate.flush()` before returning from the extension's entry point.
- **Want to disable tracking at runtime?** Call `await Datamate.setEnabled(false)` (for example, after the user opts out) — the queue stops, storage remains untouched.
