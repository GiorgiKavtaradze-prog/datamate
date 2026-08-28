# Datamate Framework Setup

Use this file for browser analytics setup in React, Next.js, Vue, Nuxt, vanilla HTML, CMSs, and tag managers.

## React / Next.js

Use a client-capable component boundary when needed in Next.js App Router.

```tsx
import { Datamate } from "@datamate/sdk/react";

<Datamate
  clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID!}
  trackWebVitals
  trackErrors
/>
```

Custom event:

```tsx
import { track } from "@datamate/sdk";

track("signup_completed", { method: "google", source: "homepage" });
```

## Vue

Use the Vue component in `App.vue` near `RouterView` so it mounts once for the app.

```vue
<script setup>
import { Datamate } from "@datamate/sdk/vue";
const clientId = import.meta.env.VITE_DATAMATE_CLIENT_ID;
</script>

<template>
  <Datamate
    :client-id="clientId"
    track-web-vitals
    track-errors
  />
  <RouterView />
</template>
```

Vue templates use kebab-case props: `client-id`, `track-web-vitals`, `track-errors`, `track-outgoing-links`, `enable-batching`, `batch-size`, `skip-patterns`, and `mask-patterns`.

Custom event:

```vue
<script setup>
import { track } from "@datamate/sdk";

function handleSignup() {
  track("signup_clicked", { source: "header" });
}
</script>

<template>
  <button @click="handleSignup">Sign up</button>
</template>
```

## Nuxt 3

Register the Vue component in a client-only plugin, then use runtime config in `app.vue`.

```ts
// plugins/datamate.client.ts
import { Datamate } from "@datamate/sdk/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Datamate", Datamate);
});
```

```vue
<!-- app.vue -->
<script setup>
const runtimeConfig = useRuntimeConfig();
</script>

<template>
  <Datamate
    :client-id="runtimeConfig.public.datamateClientId"
    track-web-vitals
  />
  <NuxtPage />
</template>
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      datamateClientId: process.env.NUXT_PUBLIC_DATAMATE_CLIENT_ID,
    },
  },
});
```

## Vanilla / CMS / GTM

```html
<script
  src="https://cdn.datamate.cc/datamate.js"
  data-client-id="your-client-id"
  data-track-web-vitals
  async
></script>
```

Use the CDN path for plain HTML, CMS templates, and tag managers. For strict CSP, see [troubleshooting.md](./troubleshooting.md).
