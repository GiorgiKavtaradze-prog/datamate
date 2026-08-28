# Tracker Script Package

Internal monorepo package for building, testing, and deploying the core analytics tracker script (`datamate.js`).

**⚠️ Internal Use Only**: This package is not published to NPM for public consumption. It generates the static assets served via our CDN.

## Workflows

### 1. Development

Run the build in watch mode while developing:

```bash
bun run dev
```

### 2. Comparison

Before deploying, verify how your local changes compare to the live production script:

```bash
bun run diff
```

This fetches the current script from `https://datamate.b-cdn.net`, compares hashes, and highlights differences.

### 3. Deployment

To deploy the built artifacts to Bunny.net (Production CDN):

```bash
bun run release
```

Release variables belong in the root `.env`:

- Required: `BUNNY_STORAGE_ZONE_NAME`, `BUNNY_STORAGE_ACCESS_KEY`
- Optional cache purge: `BUNNY_API_KEY`, `BUNNY_PULL_ZONE_ID`
- Optional: `BUNNY_STORAGE_REGION`, `DISCORD_WEBHOOK_URL`

## Project Structure

- **`src/core/`**: The backbone of the tracker (`BaseTracker`, `HttpClient`, `utils`).
- **`src/plugins/`**: Modular feature extensions (Web Vitals, Errors, etc.).
- **`src/index.ts`**: The main entry point that assembles the `datamate.js` bundle.
- **`build.ts`**: Bun build script configuration.
- **`deploy.ts`**: Internal CLI for handling Bunny.net uploads.
- **`compare-release.ts`**: Internal tool for auditing local vs. remote scripts.

## Adding New Features

### Plugin Architecture

We use a plugin-based architecture to keep the core lightweight.

1. **Create Plugin**: Add a new file in `src/plugins/` (e.g., `my-feature.ts`).
2. **Implement Logic**: Export an init function receiving `BaseTracker`.
   ```typescript
   export function initMyFeature(tracker: BaseTracker) {
     if (tracker.isServer()) return;
     // ... add event listeners
   }
   ```
3. **Register**: Import and call it in `src/index.ts` based on configuration flags.

### Example: a fully wired plugin

Plugins are expected to guard against server/no-window environments and return a cleanup function so the tracker can be destroyed cleanly:

```typescript
// src/plugins/clipboard.ts
import type { BaseTracker } from "../core/tracker";
import { logger } from "../core/utils";

export function initClipboardTracking(tracker: BaseTracker): () => void {
  if (tracker.isServer()) {
    return () => {};
  }

  const handler = (event: ClipboardEvent) => {
    if (tracker.options.disabled || tracker.isLikelyBot) {
      return;
    }
    tracker.track("clipboard_copy", {
      target_tag: (event.target as HTMLElement | null)?.tagName ?? "unknown",
    });
  };

  document.addEventListener("copy", handler);
  logger.log("Clipboard tracking initialized");

  // Cleanup is invoked by establishTracker infrastructure on destroy()
  return () => {
    document.removeEventListener("copy", handler);
  };
}
```

```typescript
// src/index.ts — register behind a config flag
if (this.options.trackClipboard) {
  const cleanup = initClipboardTracking(this);
  this.cleanupFns.push(cleanup);
}
```

Every plugin follows the same contract:

- Check `tracker.isServer()` and no-op on the server.
- Respect `tracker.options.disabled` and `tracker.isLikelyBot` before tracking.
- Never guard state outside the tracker — read `this.options.*` at call time.
- Return a `() => void` cleanup that removes listeners, so `destroy()` is leak-free.

## Debugging

- **Local Server**: `bun run serve` spins up a test page at `http://localhost:3000` to manually verify tracking.
- **E2E Tests**: `bun run test:e2e` runs Playwright suites.
- **DevTools**: the [datamate devtools](../devtools/README.md) overlay observes `window.datamate` / `window.db`, so you can inspect the live tracker, its IDs, queues, and calls without console spelunking.
- **Opt-out/opt-in**: the bundle exposes `window.datamateOptOut()` and `window.datamateOptIn()` for consent flows. Calling opt-out purges stored tracking state and replaces the tracker with a no-op stub.
- **Debug mode**: when `debug: true` is configured, the tracker logs queue operations and exposes the raw instance at `window.__tracker` (plus `__getMaxScrollDepth()` for diagnostics).
