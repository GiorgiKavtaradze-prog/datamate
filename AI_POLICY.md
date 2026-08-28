# AI Usage Policy

Datamate has clear, deliberate rules for how artificial intelligence may be used in contributions. These exist to protect maintainers' time and to keep contribution quality high — **not** because we are anti-AI.

## Rules for Contributors

1. **Disclose all AI usage.**
   Every form of AI assistance must be stated explicitly. Name the tool(s) used — e.g. Claude Code, Cursor, GitHub Copilot, ChatGPT — and describe the extent to which the work was AI-assisted.

2. **AI-created pull requests are only accepted for approved issues.**
   Pull requests created in any way by AI must reference an accepted issue. Drive-by PRs without a referenced issue will be closed. If undisclosed AI usage is suspected, the PR will be closed. To share code outside an accepted issue, open a discussion or attach it to an existing one.

3. **Human verification is mandatory.**
   AI-generated PRs must be fully verified by actual human use before submission. Do not ship hypothetically correct code that was never executed — and never have AI write code for platforms or environments you cannot manually test yourself.

4. **Issues and discussions require a human in the loop.**
   AI assistance is permitted, but every AI-generated submission must be reviewed _and edited_ by a human first. AI tends toward verbosity and noise; humans are responsible for doing the research and trimming submissions down to the point.

5. **No AI-generated media.**
   Artwork, images, video, audio, and similar media created by AI are not accepted. Text and code are the only permitted forms of AI-generated content, subject to the rules above.

6. **Consequences.**
   Low-effort, low-quality AI driving may result in bans. We genuinely want to help early-career developers learn and grow — if that's your goal, skip the AI entirely and we'll gladly help you directly.

## Quick Reference

| Situation                                 | Allowed?                       | What's required                                                          |
| ----------------------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| You wrote the code, AI helped polish it   | ✅                             | Disclose the tool(s) and the extent in the PR                            |
| AI produced a full PR                     | ✅ only with an accepted issue | Reference the issue, disclose, human-verify everything before submitting |
| Drive-by AI PR without a referenced issue | ❌                             | It will be closed                                                        |
| AI-written issue or discussion post       | ✅                             | A human must review **and edit** it before posting                       |
| AI-generated images, video, or audio      | ❌                             | Text and code are the only accepted AI media                             |
| Undisclosed AI use discovered later       | ❌                             | PR is closed; repeated behavior risks a ban                              |

## Disclosure Template

Copy this into your PR description — it takes ten seconds and satisfies rule 1:

```markdown
## AI disclosure

- **Tools used:** Claude Code 2.x (agentic coding), ChatGPT (research only)
- **Extent:** boilerplate and test scaffolding were AI-drafted; all logic, review, and verification were human
- **Verification:** `bun run lint`, `bun run check-types`, and `bun run test` pass; feature manually exercised in the dashboard at `<URL / steps>`
- **Linked issue:** #<accepted issue number>
```

A PR whose disclosure is honest but thin is welcome; a PR whose disclosure is missing is not.

## Scope

These rules apply to outside contributions. Maintainers are exempt and may use AI tools at their discretion; they have earned the trust to exercise good judgment.

## There Are Humans Here

Datamate is maintained by people. Every discussion, issue, and pull request is read and reviewed by humans (sometimes with machine help). These touchpoints are where people meet each other's work — approaching them with low-effort, unqualified output shifts the burden of validation onto volunteers, and that is disrespectful.

In an ideal world, AI would produce accurate, high-quality work every time. Today, that outcome depends entirely on the skill and diligence of the person driving it. Until drivers — or models — improve, these guardrails protect maintainers.

## AI Is Welcome Here

Datamate itself is written with substantial AI assistance, and many maintainers embrace AI tooling daily.

**Our strict policy exists because of highly unqualified AI usage — not because of an anti-AI stance.** The problem is people who use AI carelessly, not the technology itself. This section exists to be transparent with those who might disagree, and to correct the misconception that this policy is anti-AI.
