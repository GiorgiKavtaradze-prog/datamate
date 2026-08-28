---
title: 'Link shortener service'
category: 'Feature'
createdAt: '2026-01-16'
---

- Added standalone `@datamate/links` Elysia app for link redirects
- Created `links` table in Postgres with `organizationId`, `createdBy`, `slug`, `name`, `targetUrl`
- Created `link_visits` table in ClickHouse for click analytics with CODECs and TTL
- Added RPC router with `list`, `get`, `create`, `update`, `delete`, and `stats` endpoints
- Stats include total clicks, clicks by day, top referrers, and top countries
- Public redirect endpoint resolves slug and tracks visit asynchronously
- Added `links.Dockerfile` for containerized deployment
