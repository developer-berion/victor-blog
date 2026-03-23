# Progress Log

## 2026-03-23

- Done: Switched to a local-first iteration rhythm to avoid repeated Vercel deploys during UI polishing.
- Done: Added `docs/LOCAL_WORKFLOW.md` as the operating contract for local QA, docs, and commits.
- Done: Validated the admin login locally in browser after fixing spacing and CTA visibility.
- Done: Built a minimal CMS on Supabase and Next.js with admin panel, CRUD posts, cover uploads, and visual feedback.
- Done: Migrated the admin to Material UI with a classic layout, cover preview, and delete confirmation.
- Done: Extracted Markdown rendering into a shared helper and added live content preview in the admin editor.
- Done: Created canonical local docs for context, decisions, progress, and integrations.
- Decisions: See [DECISIONS.md](./DECISIONS.md).
- Blockers: None active.
- Next: Split the current changes into small commits, then continue with the remaining admin polish locally before any new deploy.
