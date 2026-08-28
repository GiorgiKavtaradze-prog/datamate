# Datamate Devtools

Moveable browser overlay for inspecting Datamate analytics during local development, QA, and previews.

## Install

```sh
bun add -d @datamate/devtools
```

## React

```tsx
import { DatamateDevtools } from "@datamate/devtools/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <DatamateDevtools enabled={process.env.NODE_ENV !== "production"} />
      </body>
    </html>
  );
}
```

The overlay observes the current Datamate browser globals:

- `window.datamate`
- `window.db`
- `window.datamateConfig`

It does not require changes to `@datamate/sdk` or the tracker script.

## Vue / Nuxt

```vue
<script setup lang="ts">
import { DatamateDevtools } from "@datamate/devtools/vue";
</script>

<template>
  <DatamateDevtools :enabled="import.meta.env.DEV" />
</template>
```

The Vue wrapper is a renderless component that mounts the overlay once next to your `RouterView`/`NuxtPage`, watches its `enabled`/`keyboardShortcut` props, and unmounts on `onBeforeUnmount`.

## Manual Mount

```ts
import { mountDevtools } from "@datamate/devtools/react";

const unmount = mountDevtools();
```

```ts
// Vue entry — same API
import { mountDevtools } from "@datamate/devtools/vue";

const unmount = mountDevtools({ keyboardShortcut: false });
```

`mountDevtools()` is safe to call any number of times — it is reference-counted, renders inside a shadow DOM to avoid style leakage, and returns a cleanup function:

```ts
const cleanup = mountDevtools();

// Later, when the panel should disappear:
cleanup();
```

## Shortcut

Press `Cmd/Ctrl + Shift + D` to toggle the overlay, and `Esc` to close it. Disable the shortcut per-mount with `keyboardShortcut: false` (for example when your app already owns that binding).

## Troubleshooting

- **Overlay never appears?** Confirm the SDK/tracker script actually loaded — check for a `datamate.js` network request. DevTools observes the globals; without them it shows the "tracker not detected" state.
- **Flags panel shows no flags?** The overlay uses the same `clientId`-scoped flag endpoint. Verify the website has flags defined, and wait for `isReady` before evaluating. Flag-management actions additionally need a runtime API key with `manage:flags` scope (never commit it to the bundle).
- **Event log looks empty?** Events are captured as they are observed — refresh the page after mounting DevTools so the tracker boots under observation.
- **Styling conflicts?** The overlay is shadow-DOM isolated; the only intentional page-level footprint is a fixed `0×0` host element.

## V1 Scope

- Runtime status
- Client, anonymous, and session IDs
- Observed `track`, `screenView`, `flush`, and `clear` calls
- Manual test event, screen view, flush, and clear actions
- Feature flag inspection, local overrides, and refresh actions
- Flag definition management with a runtime API key that has `manage:flags`
- Queue, identity, storage, and diagnostic panels
- Moveable, minimized overlay with local position persistence
