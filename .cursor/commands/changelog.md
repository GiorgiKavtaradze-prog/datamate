## Create a changelog

Creates a changelog entry for recent work.

### Before Writing

1. Read `apps/docs/content/changelog/` to match current style
2. Run `git log --oneline -10` if context is unclear

### File Details

- **Location**: `apps/docs/content/changelog/`
- **Filename**: `kebab-case-title.md`

### Format

```md
---
title: 'Short title'
category: 'Feature' | 'Enhancement' | 'Bug Fix'
createdAt: 'YYYY-MM-DD'
---

- What changed
- Another thing that changed
```

### Style

- Bullet points only, no paragraphs
- One line per change
- Skip fluff, just facts
- Use backticks for `code`
