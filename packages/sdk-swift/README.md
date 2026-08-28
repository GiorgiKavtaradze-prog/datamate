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

## Privacy

Track product events and milestones, not sensitive content. Avoid PII, secrets, tokens, raw search queries, full error stacks, and large payloads.
