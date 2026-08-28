# @datamate/docs

Official documentation site for Datamate, built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev).

## Development

```bash
bun run --cwd apps/docs dev
```

Open <http://localhost:3000> to view the site.

## Structure

| Path                      | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `content/`                | MDX documentation pages and product changelog entries |
| `app/(home)`              | Landing page route group                              |
| `app/docs`                | Documentation layout and pages                        |
| `app/api/search/route.ts` | Search API route handler                              |
| `lib/source.ts`           | Content source adapter (`loader()` interface)         |
| `source.config.ts`        | Frontmatter schema and MDX configuration              |

Changelog entries live in `content/changelog/*.md` using kebab-case filenames — see `.cursor/commands/changelog.md` for the entry format.

## Authoring a doc page

Documentation pages are MDX files under `content/docs` with Fumadocs frontmatter (title + optional description). Code blocks are compiled with syntax highlighting, so keep examples copy-paste-runnable and project-accurate:

````mdx
---
title: "Tracking custom events"
description: "Send your own events from the browser or server."
---

# Tracking custom events

Say you want to track signups. Add a stable, snake_case event name and
low-cardinality properties:

```tsx
import { track } from "@datamate/sdk";

track("signup_completed", { plan: "pro", source: "pricing" });
```
````

> **Tip:** track intent in the browser and completed outcomes in your backend.

Notes:

- **Frontmatter** is `title` (+ optional `description`); any extra fields must be added to the schema in `source.config.ts` first.
- **Changelog entries** are bullets only (`- change` lines) with `title`, `category` (`Feature` | `Enhancement` | `Bug Fix`), and `createdAt`.
- **Search** is powered by `app/api/search/route.ts` over the loaded source — no extra work needed for new pages.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Fumadocs Documentation](https://fumadocs.dev/docs)
