# Local Workflow

This document defines the working rhythm for editing, validating, and releasing the blog/CMS.

## Goal

Keep iteration fast locally and reduce noisy deploys.

## Cycle

1. Edit locally.
2. Run targeted UI checks in the browser.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Review the diff.
6. Commit in a small, traceable batch.
7. Update docs if the change affects behavior, integration, or decision-making.
8. Deploy only after local approval.

## Commit Rules

- One logical change per commit.
- Prefer short commits with a clear intent.
- If a fix is visual only, keep it separate from docs or infra changes.
- If a decision changes, record it in `DECISIONS.md` before or alongside the code.

## Documentation Rules

- `PROGRESS_LOG.md`: current state, blockers, next step.
- `DECISIONS.md`: only real decisions and tradeoffs.
- `CHANGELOG.md`: visible UX or functional changes.
- `INTEGRATIONS_RUNBOOK.md`: env vars, auth, deploy, and integration troubleshooting.

## Local QA Rules

- Prefer local browser verification for layout and spacing.
- Use screenshots only as temporary evidence.
- If a screenshot is no longer needed, delete it before committing.
- Always validate the admin login and one public route before a deploy.

## Release Gate

Do not deploy if:

- lint fails
- build fails
- the admin has visual regressions
- the working tree contains accidental artifacts

