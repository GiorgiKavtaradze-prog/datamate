# Datamate Dashboard

The primary Next.js web application of the Datamate analytics platform: real-time dashboards, funnels, goals, error tracking, Web Vitals, uptime monitors, links, settings, and the Intelligence experience.

**Stack:** Next.js 16 · React 19 · TailwindCSS 4 · TanStack Query · Jotai · Playwright

## Development

Run from the repository root (see the [root README](../../README.md#-local-development) for one-time setup):

```bash
bun run dev:dashboard            # Dashboard + API (most common)
bun run --cwd apps/dashboard dev # Dashboard only
```

The app runs on <http://localhost:3000>.

Other useful commands:

```bash
bun run --cwd apps/dashboard build          # Production build
bun run lint                                # Lint (Ultracite/Biome)
bun run check-types                         # Type-check
```

> The dashboard talks to the API through typed ORPC contracts defined in [`packages/rpc`](../../packages/rpc). To regenerate types after RPC changes, restart both apps (`bun run dev:dashboard`).

## Typed API access (ORPC + TanStack Query)

Every RPC procedure is exposed on the `orpc` client in `apps/dashboard/lib/orpc.ts` with full input/output types inferred from `packages/rpc`. Feature code reads data through `queryOptions`/`key` and writes through `mutationOptions`:

```tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export function ApiKeysList({ websiteId }: { websiteId: string }) {
  const queryClient = useQueryClient();

  // Read — fully typed input, output, loading, and error states
  const { data, isLoading } = useQuery(
    orpc.apikeys.list.queryOptions({ input: { websiteId } }),
  );

  // Write — invalidate the exact query key on success
  const createMutation = useMutation({
    ...orpc.apikeys.create.mutationOptions(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: orpc.apikeys.list.key({ input: { websiteId } }),
      }),
  });

  return (
    <button
      onClick={() =>
        createMutation.mutate({ websiteId, name: "CI", scopes: ["read:data"] })
      }
    >
      Create key
    </button>
  );
}
```

**Rules of thumb:**

- Never hand-roll `fetch` to the API from dashboard feature code — the RPC layer owns auth, error mapping, and type safety.
- Invalidate with the procedure's own `key()` so mutations and queries stay in sync; scope it to the same `input` shape.
- If a procedure is missing, add it in `packages/rpc` (schema → procedure → `orpc.<router>.<name>` appears automatically), then restart `bun run dev:dashboard` to refresh generated types.

## Design System Rules

Dashboard UI must use the local design system in `components/ds`.

- Do not use raw form/control elements (`button`, `input`, `select`, `textarea`, native dialogs), Base UI/Radix primitives, or one-off styled controls in feature components.
- If a needed control or variant is missing, add or extend the DS primitive first, then consume it from the feature.
- Use `DropdownMenu` for menu-style folder/status/filter/sort/action pickers.
- Use `Select` only for an actual select/combobox pattern.
- Read `components/ds/README.md` before creating or updating dashboard UI.

## Testing

- **Unit/integration:** colocated `*.test.ts(x)` files, run with `bun run test`.
- **End-to-end:** Playwright suites under [`test/e2e`](./test/e2e) with an isolated per-run database. See the e2e [`README`](./test/e2e/README.md) and [`STANDARDS`](./test/e2e/STANDARDS.md) before adding tests:

```bash
bun run --cwd apps/dashboard test:e2e:local
```

## Deployment

The dashboard builds a standard standalone Next.js output via [`dashboard.Dockerfile`](../../dashboard.Dockerfile). `NEXT_PUBLIC_*` values are baked in at build time, so production deployments must build from source with final env vars set (the root [`docker-compose.selfhost.yml`](../../docker-compose.selfhost.yml) and Railway template in [`infra/railway-template.md`](../../infra/railway-template.md) handle this).

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Root README](../../README.md) · [Contributing](../../CONTRIBUTING.md)
