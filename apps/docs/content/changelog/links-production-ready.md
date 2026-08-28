---
title: 'Links production ready'
category: 'Enhancement'
createdAt: '2026-01-17'
---

- Added Redis-based rate limiting (100 req/min per IP) with sliding window algorithm
- Added click deduplication (1 unique click per IP per hour)
- Added device targeting with `iosUrl` and `androidUrl` fields for app store redirects
- Added comprehensive bot detection for 50+ crawler patterns
- Social bots receive OG metadata page, other bots skip tracking
- Extracted redirect logic into `bot-detection.ts`, `device-targeting.ts`, `og-html.ts`
- Added integration tests for links RPC router validation schemas
- Device targeting UI in link creation sheet with Apple/Android icons
- Fixed OG tags with proper `og:image:width`, `og:image:height`, `og:image:type` for Facebook/Twitter
- Added `ogVideoUrl` field for video embeds with `og:video` and `twitter:player` support
- OG preview now shows image validation status (loading, valid, invalid) with retry button
- Added character counters for title (120) and description (240)
- Added reset to default button for custom OG fields
