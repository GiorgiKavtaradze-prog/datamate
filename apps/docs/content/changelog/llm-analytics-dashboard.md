---
title: 'LLM analytics dashboard'
category: 'Feature'
createdAt: '2026-01-14'
---

- Added multi-page LLM analytics dashboard with Overview, Cost, Performance, Reliability, Tooling, and Traces pages
- Created ClickHouse query builders for LLM analytics metrics (KPIs, time series, breakdowns)
- Added LLM-specific filter options (provider, model, type, finish_reason, error_name, http_status, user_id, trace_id)
- Implemented type-safe interfaces for all LLM query result types
- Added navigation section for LLM Analytics gated by `llm` feature flag
- Created utility functions for formatting durations, percentages, tokens, and currency
- Added column definitions for LLM analytics data tables
- Implemented time series pivoting for multi-series chart visualization
- Added support for nullable `website_id` in LLM queries with fallback to `user_id`
