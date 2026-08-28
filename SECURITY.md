# Security Policy

Datamate takes security seriously. As an analytics platform trusted with website traffic data, we treat vulnerabilities in this project as high-priority issues.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Email** [security@datamate.cc](mailto:security@datamate.cc) with details — including reproduction steps, affected components, and any proof-of-concept where appropriate.
2. **Do not disclose the issue publicly** until it has been addressed and a fix has been released.
3. **Do not test against production infrastructure** belonging to Datamate or its customers.

We will acknowledge your report and respond as quickly as possible, keep you informed as we investigate, and credit you in the eventual disclosure if you wish.

## Supported Versions

Only the latest major release receives security updates. Older versions may no longer receive fixes.

## What to Include in a Report

A strong report dramatically speeds up triage:

- **Affected components** — app (`dashboard`, `api`, `basket`, `upsert`, `links`, …), package, commit or version.
- **Reproduction steps** — or a minimal proof-of-concept; include the exact request/response if the bug is API-level.
- **Impact assessment** — data exposure, privilege escalation, availability, cross-tenant leakage.
- **Suggested fix** (optional) — a patch or root-cause hypothesis is always welcome.

Everything you share stays confidential until we publish an advisory, and we will credit your research if you want that.

| Version                  | Supported |
| ------------------------ | --------- |
| Latest release on `main` | ✅        |
| Older releases           | ❌        |

Thank you for helping keep Datamate and its users safe.
