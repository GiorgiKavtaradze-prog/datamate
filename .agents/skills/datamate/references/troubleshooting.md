# Datamate Troubleshooting

Use this file for CSP, blockers, auth, host confusion, missing events, missing attribution, and feature flag debugging.

## Checks

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Script blocked by CSP | Missing CDN in `script-src` | Add `https://cdn.datamate.cc` to `script-src` |
| Events fail under strict CSP | Missing basket in `connect-src` | Add `https://basket.datamate.cc` to `connect-src` |
| Flags fail under strict CSP | Missing API host in `connect-src` | Add `https://api.datamate.cc` to `connect-src` |
| Pixel mode fails | Missing basket in `img-src` | Add `https://basket.datamate.cc` to `img-src` when `usePixel` is enabled |
| Script never appears | Component mounted too low or only on one route | Mount once near the root layout, `RouterView`, or `NuxtPage` |
| No browser events | Wrong or missing `clientId` | Check env var and rendered `data-client-id` |
| Requests blocked before network | Ad/tracker blocker or privacy extension | Test in a clean profile and document expected blockers |
| 401 from API | Missing or invalid API key | Use `x-api-key: dbdy_...` or Bearer server-side only |
| 403 from API or `/track` | API key lacks scope | Use `read:data` for queries, `track:events` for server events, `manage:flags` for flag management |
| Query API works but events do not | Wrong host | Queries use `api.datamate.cc`; events use `basket.datamate.cc` |
| Server events sent but not visible for a site | No website scope | Provide `websiteId`, `DATAMATE_WEBSITE_ID`, or a resource-scoped key |
| Server event visible but unattributed | Browser IDs not passed through | Send `getTrackingIds()` output to the server and map `anonId` to `anonymousId` |
| Events lost in serverless | Queue not flushed | Call `await client.flush()` before the function exits |
| Flags always return defaults | Read before init, wrong client id, or blocked API host | Call `waitForInit()` on server; verify `clientId`, user context, and CSP |
| Browser requests rejected by Datamate | Domain/origin not allowed for the website | Verify the website domain and allowed origins in Datamate settings |
| DevTools flag override changes behavior | Local override is active | Clear the override before validating real flag results |

## CSP Baseline

```http
Content-Security-Policy:
  script-src 'self' https://cdn.datamate.cc;
  connect-src 'self' https://basket.datamate.cc https://api.datamate.cc;
```

Add `img-src https://basket.datamate.cc` if `usePixel` is enabled.
