---
title: 'Fix LLM analytics tab pages runtime error'
category: 'Bug Fix'
createdAt: '2026-01-15'
---

- Fixed runtime error where Server Components were passing functions to Client Components
- Added `"use client"` directive to LLM tab pages (performance, cost, errors, traces)
- Updated `LlmTabPageWrapper` to use `useParams()` directly instead of receiving params prop
