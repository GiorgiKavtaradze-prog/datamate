# Datamate Devtools

Moveable browser overlay for inspecting Datamate analytics during local development, QA, and previews.

## Install

```sh
bun add -d @datamate/devtools
```

## React

```tsx
import { DatamateDevtools } from "@datamate/devtools/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

## Manual Mount

```ts
import { mountDevtools } from "@datamate/devtools/react";

const unmount = mountDevtools();
```

## Shortcut

Press `Cmd/Ctrl + Shift + D` to toggle the overlay.

## V1 Scope

- Runtime status
- Client, anonymous, and session IDs
- Observed `track`, `screenView`, `flush`, and `clear` calls
- Manual test event, screen view, flush, and clear actions
- Feature flag inspection, local overrides, and refresh actions
- Flag definition management with a runtime API key that has `manage:flags`
- Queue, identity, storage, and diagnostic panels
- Moveable, minimized overlay with local position persistence
