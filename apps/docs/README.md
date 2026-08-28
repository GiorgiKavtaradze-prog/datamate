# @datamate/docs

Official documentation site for Datamate, built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev).

## Development

```bash
bun run --cwd apps/docs dev
```

Open <http://localhost:3000> to view the site.

## Structure

| Path | Description |
| --- | --- |
| `content/` | MDX documentation pages and product changelog entries |
| `app/(home)` | Landing page route group |
| `app/docs` | Documentation layout and pages |
| `app/api/search/route.ts` | Search API route handler |
| `lib/source.ts` | Content source adapter (`loader()` interface) |
| `source.config.ts` | Frontmatter schema and MDX configuration |

Changelog entries live in `content/changelog/*.md` using kebab-case filenames — see `.cursor/commands/changelog.md` for the entry format.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Fumadocs Documentation](https://fumadocs.dev/docs)

