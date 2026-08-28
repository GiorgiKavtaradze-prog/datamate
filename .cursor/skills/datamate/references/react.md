# React SDK Reference

The React SDK (`@datamate/sdk/react`) provides a drop-in component and hooks for React/Next.js applications.

## Installation

```bash
bun add @datamate/sdk
```

## Datamate Component

The `<Datamate />` component injects the tracking script. Place it in your root layout.

### Next.js App Router

```tsx
// app/layout.tsx
import { Datamate } from "@datamate/sdk/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Datamate
          clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID}
          trackWebVitals
          trackErrors
          trackPerformance
        />
      </body>
    </html>
  );
}
```

### Next.js Pages Router

```tsx
// pages/_app.tsx
import { Datamate } from "@datamate/sdk/react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Datamate
        clientId={process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID}
        trackWebVitals
        trackErrors
      />
    </>
  );
}
```

### Props

All props from `DatamateConfig` are supported. See [Core SDK Reference](./core.md) for full options.

Key props:

| Prop                 | Type      | Default     | Description            |
| -------------------- | --------- | ----------- | ---------------------- |
| `clientId`           | `string`  | Auto-detect | Your project client ID |
| `disabled`           | `boolean` | `false`     | Disable tracking       |
| `trackWebVitals`     | `boolean` | `false`     | Track Web Vitals       |
| `trackErrors`        | `boolean` | `false`     | Track JS errors        |
| `trackPerformance`   | `boolean` | `true`      | Track performance      |
| `trackOutgoingLinks` | `boolean` | `false`     | Track outgoing clicks  |
| `debug`              | `boolean` | `false`     | Enable debug logging   |

### Auto-detection

The component auto-detects `clientId` from `NEXT_PUBLIC_DATAMATE_CLIENT_ID` environment variable.

### SSR Safety

The component is SSR-safe. It only injects the script on the client side and renders nothing to the DOM.

## Exported Functions

Re-exported from core for convenience:

```typescript
import {
  track,
  trackError,
  flush,
  clear,
  getTracker,
  isTrackerAvailable,
  getAnonymousId,
  getSessionId,
  getTrackingIds,
  getTrackingParams,
} from "@datamate/sdk/react";
```

## Examples

### Disable in Development

```tsx
<Datamate disabled={process.env.NODE_ENV === "development"} clientId="..." />
```

### With All Tracking Features

```tsx
<Datamate
  clientId="..."
  trackWebVitals
  trackErrors
  trackPerformance
  trackOutgoingLinks
  trackInteractions
  trackHashChanges
/>
```

### With Filtering

```tsx
<Datamate
  clientId="..."
  skipPatterns={["/admin/**", "/_next/**"]}
  maskPatterns={["/users/*", "/orders/*"]}
  filter={(event) => !event.path?.includes("/internal")}
/>
```

### With Batching Configuration

```tsx
<Datamate clientId="..." enableBatching batchSize={20} batchTimeout={5000} />
```

### With Sampling

```tsx
<Datamate
  clientId="..."
  samplingRate={0.5} // Track 50% of sessions
/>
```

## Custom Event Tracking

Use the `track` function or `window.datamate.track`:

```tsx
import { track } from "@datamate/sdk/react";

function PurchaseButton({ product }) {
  const handlePurchase = async () => {
    await completePurchase(product);

    track("purchase", {
      product_id: product.id,
      product_name: product.name,
      amount: product.price,
      currency: "USD",
    });
  };

  return <button onClick={handlePurchase}>Buy Now</button>;
}
```

## Error Tracking

```tsx
import { trackError } from "@datamate/sdk/react";

function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      onError={(error, errorInfo) => {
        trackError({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```
