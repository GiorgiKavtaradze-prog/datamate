---
title: 'Real Experience Score for Web Vitals'
category: 'Feature'
createdAt: '2026-01-11'
---

- Added Real Experience Score (RES) gauge using Vercel's weighted scoring methodology
- RES combines FCP (15%), LCP (30%), INP (30%), and CLS (25%) into a single 0-100 score
- Score uses log-normal distribution mapping similar to Lighthouse 10 scoring
- Shows breakdown of each Core Web Vital's contribution with individual scores
- Displays trend comparison vs previous period in points
- Extended percentile selector to include P95 and P99 alongside P50, P75, P90
- Percentile selector now integrated into the RES card
