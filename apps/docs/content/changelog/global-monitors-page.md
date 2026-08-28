---
title: 'Global monitors page and schedule-based analytics'
category: 'Feature'
createdAt: '2026-01-13'
---

- Added global `/monitors` page to view and manage all uptime monitors
- Added `/monitors/[id]` page for detailed monitor stats and configuration
- Support for custom monitors with custom URLs independent of websites
- Added `schedule_id` query parameter support for analytics queries
- Monitors can now be created without being linked to a website
- Monitor rows are clickable to navigate to detail pages
- Added 5-minute check frequency option
- Improved monitor configuration UI with sheet component
- Added JSON response parsing for health check endpoints
- Support for extracting status and latency from nested JSON responses
- Refactored query route with reusable access verification helpers
