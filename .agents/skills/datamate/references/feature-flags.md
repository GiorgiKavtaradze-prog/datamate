# Datamate Feature Flags

Use this file for React, Vue, and server-side flag evaluation, rollouts, experiments, flag metrics, and flag debugging.

## Mental Model

- Evaluation uses `https://api.datamate.cc/public/v1/flags/bulk`.
- Evaluation needs a website `clientId`, not an API key.
- Creating, editing, and deleting flags requires an API key with `manage:flags`.
- Browser flags cache in localStorage unless `skipStorage` is true.
- Browser flags auto-enrich anonymous users with a persistent anonymous `userId` if no `userId` or `email` is supplied.
- Browser single-flag fetches can emit `$flag_evaluated` with `flag`, `value`, `variant`, and `enabled` when the browser tracker exists. Bulk-prefetched or cached reads may not emit a fresh exposure event.
- Outcome events still need to be tracked separately and should include the relevant `flag_key` and `variant` when measuring an experiment.

## React

```tsx
import { FlagsProvider, useFlag, useFlags } from "@datamate/sdk/react";

function Providers({ children, session, isPending }) {
  return (
    <FlagsProvider
      clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID!}
      apiUrl="https://api.datamate.cc"
      isPending={isPending}
      user={session?.user ? {
        userId: session.user.id,
        organizationId: session.user.organizationId,
        teamId: session.user.teamId,
        properties: {
          role: session.user.role,
          workspace_type: session.user.workspaceType,
        },
      } : undefined}
    >
      {children}
    </FlagsProvider>
  );
}

function FeatureGate() {
  const flag = useFlag("new-dashboard");

  if (flag.loading) {
    return <Skeleton />;
  }

  return flag.on ? <NewDashboard /> : <OldDashboard />;
}
```

Use `isPending` while auth/session data loads. This prevents an anonymous evaluation followed by a real-user evaluation that flashes the wrong UI.

`useFlags()` exposes `isOn`, `getFlag`, `getValue`, `fetchFlag`, `fetchAllFlags`, `updateUser`, `refresh`, and `isReady`.

## Vue

Install the plugin before calling `useFlag` or `useFlags`.

```ts
import { createApp } from "vue";
import { createFlagsPlugin } from "@datamate/sdk/vue";
import App from "./App.vue";

createApp(App)
  .use(createFlagsPlugin({
    clientId: import.meta.env.VITE_DATAMATE_CLIENT_ID,
    apiUrl: "https://api.datamate.cc",
    user: {
      userId: currentUser.id,
      organizationId: currentUser.organizationId,
    },
  }))
  .mount("#app");
```

```vue
<script setup>
import { useFlag } from "@datamate/sdk/vue";

const newNav = useFlag("new-nav");
</script>

<template>
  <Skeleton v-if="newNav.loading.value" />
  <NewNav v-else-if="newNav.on.value" />
  <OldNav v-else />
</template>
```

Vue `useFlag` returns computed refs: `on`, `loading`, and `state`.

## Server Flags

```ts
import { createServerFlagsManager } from "@datamate/sdk/node";

const flags = createServerFlagsManager({
  clientId: process.env.DATAMATE_CLIENT_ID!,
  apiUrl: "https://api.datamate.cc",
  environment: "production",
  user: {
    userId: "user-123",
    organizationId: "org-456",
  },
});

await flags.waitForInit();
const result = await flags.getFlag("new-feature");
const enabled = result.enabled;
```

Server managers default `autoFetch` to false. `getFlag()` fetches asynchronously; `fetchAllFlags()` preloads all flags for fast `isEnabled()` and `getValue()` reads.

For long-lived servers, create one shared manager per app/runtime and pass user overrides to `getFlag(key, user)` when needed. For per-request server rendering, it is fine to construct a manager with request user context.

## Config Cheat Sheet

| Option | Use |
| --- | --- |
| `clientId` | Website client id; required for all flag evaluation |
| `apiUrl` | Main API host; defaults to `https://api.datamate.cc` |
| `user.userId` | Stable user targeting and per-user rollouts |
| `user.email` | Supported, but prefer opaque IDs when possible |
| `user.organizationId` | Group rollouts where all organization members should match |
| `user.teamId` | Group rollouts where all team members should match |
| `user.properties` | Low-cardinality targeting attributes |
| `environment` | Select environment-specific definitions |
| `isPending` | Defer browser evaluation while auth/session loads |
| `defaults` | Local fallback values by flag key |
| `disabled` | Force all flags off |
| `cacheTtl` / `staleTime` | Control cache expiry and background revalidation |
| `skipStorage` | Avoid persistent browser flag cache |

## Targeting And Evaluation Order

Rules can match `userId`, `email`, or `user.properties` with operators such as `equals`, `contains`, `starts_with`, `ends_with`, `in`, and `not_in`. Property rules also support `exists` and `not_exists`.

Evaluation order:

1. Direct user targeting rules.
2. Attached target group rules.
3. Multivariant assignment.
4. Rollout percentage.
5. Boolean default value.

Direct rules and target group matches are force on/off gates. They are not variant selectors. For A/B/n experiments that need clean variant metrics, avoid force rules on the multivariant flag itself or use a separate boolean eligibility flag plus a second multivariant assignment flag.

## Experiment Metrics

Do not stop at rendering variants. Track the outcome that proves the variant mattered.

```tsx
import { track } from "@datamate/sdk";
import { useFlag } from "@datamate/sdk/react";

function ExportButton() {
  const exportFlow = useFlag("export-flow");

  async function handleExport() {
    const result = await runExport();
    track("report_exported", {
      flag_key: "export-flow",
      variant: exportFlow.variant ?? "control",
      status: result.ok ? "success" : "failed",
      format: result.format,
    });
  }

  return exportFlow.variant === "compact" ? (
    <CompactExportButton onClick={handleExport} />
  ) : (
    <DefaultExportButton onClick={handleExport} />
  );
}
```

Good flag metrics:

- Exposure: automatic `$flag_evaluated` where available, or one explicit `feature_exposed` event for experiments that need complete exposure accounting.
- Outcome: a product event such as `project_created`, `report_exported`, `integration_connected`, or `job_completed`.
- Failure: same event with `status: "failed"` and `error_type`, or a distinct terminal failure event when that is clearer.
- Properties: `flag_key`, `variant`, `status`, and one or two useful segmentation fields.

Avoid tracking every render. Track the action or outcome once.

For strict exposure accounting, track an explicit exposure once per meaningful view:

```tsx
track("feature_exposed", {
  flag_key: "export-flow",
  variant: exportFlow.variant ?? "control",
  feature: "report_export",
});
```

## Flag Design Checklist

Before recommending or adding a flag, choose:

- Stable key: product concept, not component name.
- Default behavior: what happens if evaluation fails.
- Rollout unit: user, organization, or team.
- Required targeting context: `userId`, `organizationId`, `teamId`, and low-cardinality `properties`.
- Variants: omit weights for even assignment; add weights only when a weighted split is intentional.
- Success metric: one outcome event with `flag_key` and `variant`.
- Cleanup path: remove the flag or make it permanent after the rollout.

## Good Patterns

- Use `isPending` during auth and `loading` UI for first paint.
- Use stable opaque user IDs for deterministic assignment.
- Add `organizationId` or `teamId` only when the rollout unit should be grouped.
- Use `getValue<T>(key, defaultValue)` for config-style flags.
- Use `refresh(true)` when identity changes and you need to clear stale cache.
- Keep flag keys stable and semantic: `new-dashboard`, `export-flow`, `onboarding-checklist`.
- Use DevTools to inspect config, readiness, cache, evaluated values, variants, and overrides.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Flags always default | wrong `clientId`, API blocked, or read before init | verify `clientId`, `connect-src`, and `waitForInit()` on server |
| User sees anonymous flag first | session loaded after evaluation | pass `isPending` until session resolves |
| Group rollout inconsistent | missing `organizationId` or `teamId` | pass the same group id for all members |
| Variant does not change in dev | local override or cached value | clear DevTools override or call `refresh(true)` |
| DevTools cannot manage flags | missing admin key or scope | paste an API key with `manage:flags` |
| Server flag reads stale | manager cache still valid | lower `cacheTtl`, call `refresh(true)`, or use per-request context |
