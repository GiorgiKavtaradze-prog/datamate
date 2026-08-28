## Commit and push to staging

Commits all changes and pushes to staging branch.

### Before Committing

1. Run `git status` to see what's changed
2. Run `git diff --stat` to understand the scope
3. Run `git log --oneline -5` to match commit message style

### Commit Message Style

- Short, lowercase, no period
- Start with: `fix:`, `feat:`, `cleanup:`, `chore:`, `docs:`
- Describe what changed, not how

### Examples

```
fix: empty state consistency in events pages
feat: add dark mode toggle
cleanup: remove unused imports
chore: update dependencies
docs: update readme
```

### Commands

```bash
git add -A
git commit -m "message here"
git push origin staging
```

### Rules

- Only push to `staging`, never `main`
- One commit per logical change
- Don't commit `.env` or secrets
