---
title: 'Billing overage display and usage email fixes'
category: 'Enhancement'
createdAt: '2026-02-21'
---

- Skip usage limit emails for paid plan users (free tier only receives limit alerts)
- Added `products` check in Autumn webhook to detect paid plans from `customer.products`
- Redesigned billed overage display with segmented progress bar (included vs overage)
- Added `BilledOverageRow` for features with priced overage (e.g. Scale plan events)
- Inline pricing tiers tooltip and "View breakdown" link for billed overage
- Hide "Upgrade" link when user is on max plan (`isMaxPlan` prop)
- Added `hasPricedOverage` and `pricingTiers` to `FeatureUsage` for overage cost display
