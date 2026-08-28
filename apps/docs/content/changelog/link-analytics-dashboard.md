---
title: 'Link analytics dashboard'
category: 'Feature'
createdAt: '2026-01-16'
---

- Added link analytics page at `/links/[id]` with stats content and toolbar
- Migrated from oRPC stats endpoint to dynamic query system for link analytics
- Added `link_id` support to API query route alongside `website_id` and `schedule_id`
- Created query builders for `link_total_clicks`, `link_clicks_by_day`, `link_referrers_by_day`, `link_countries_by_day`
- Added geographic query builders for `link_top_countries`, `link_top_regions`, `link_top_cities` with `normalizeGeo` plugin
- Created `link_top_referrers` query builder with `ReferrerSourceCell` component support
- Stats cards display mini charts for clicks, unique referrers, and unique countries over time
- Geographic table includes tabs for Countries, Regions, and Cities with country flags
- Added date range toolbar with quick filters (24h, 7d, 30d, 90d) and refresh button
- Removed redundant `stats` endpoint from oRPC links router
