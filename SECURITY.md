# Security Policy

Datamate takes security seriously. As an analytics platform trusted with website traffic data, we treat vulnerabilities in this project as high-priority issues.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Email** [security@datamate.cc](mailto:security@datamate.cc) with details — including reproduction steps, affected components, and any proof-of-concept where appropriate.
2. **Do not disclose the issue publicly** until it has been addressed and a fix has been released.
3. **Do not test against production infrastructure** belonging to Datamate or its customers.

We will acknowledge your report and respond as quickly as possible, keep you informed as we investigate, and credit you in the eventual disclosure if you wish.

## Severity & Response Targets

Triage uses a four-level scale; targets start when your report arrives:

| Severity           | Examples                                                                                             | First response | Target fix                                |
| ------------------ | ------------------------------------------------------------------------------------------------------ | -------------- | ------------------------------------------- |
| **S1 — Critical**  | Cross-tenant data leakage, auth bypass, RCE, secret exposure                                            | 24 hours       | 7 days, with an interim mitigation if needed |
| **S2 — High**      | Privilege escalation within one tenant, broken access control on a resource, injection in a privileged surface | 48 hours       | 30 days                                     |
| **S3 — Medium**    | Reflected XSS, SSRF with limited reach, rate-limit or billing-limit bypass                               | 5 days         | Next release cycle                          |
| **S4 — Low**       | Missing hardening headers, verbose errors, best-practice drift                                           | 10 days        | Best effort, tracked publicly after the fix |

These SLAs are good-faith targets for an open-source project, not contractual guarantees.

## Safe Harbor

We consider security research conducted in good faith and within this policy to be authorized: we will not pursue or support action against you for accidentally crossing a boundary while probing, and we will treat coordinated-disclosure requests fairly. Activity that disrupts production traffic, touches other customers' data, or extorts users falls outside this harbor.

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

## Security by Design

Understanding the model helps you write a better report — and reports that break one of these stated guarantees are triaged one level higher:

- **Privacy at the edge** — visitor IPs are salted and hashed (`IP_HASH_SALT`) before storage; raw addresses are never persisted.
- **Secrets encrypted at rest** — third-party integration credentials are sealed with `DATAMATE_ENCRYPTION_KEY`.
- **Tenant isolation in the data layer** — every query path enforces organization scope server-side; agent-generated SQL is restricted to `analytics.*` with a required tenant filter (`validateAgentSQL` / `requiresTenantFilter`).
- **Permission scopes everywhere** — API keys carry explicit scopes; role grants live in `packages/auth/src/permissions.ts`.
- **Fail-safe process lifecycle** — fatal errors exit non-zero; graceful shutdown runs under a timeout with a concurrent-signal guard.
- **Forward-only schema evolution** — shipped ClickHouse tables are never edited in place; drift is caught by `ch:verify`.

Thank you for helping keep Datamate and its users safe.
