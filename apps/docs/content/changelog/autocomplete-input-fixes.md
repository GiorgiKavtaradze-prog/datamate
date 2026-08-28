---
title: 'Fixed autocomplete input focus and dropdown issues'
category: 'Bug Fix'
createdAt: '2026-01-13'
---

- Fixed autocomplete input losing focus while typing in funnel steps
- Created reusable `AutocompleteInput` component in `@/components/ui/autocomplete-input`
- Fixed React key prop causing unnecessary re-renders in funnel steps
- Fixed dropdown width being too narrow in grid layouts
- Added minimum width and text wrapping to dropdown suggestions
- Removed unstable callback dependencies causing focus loss
