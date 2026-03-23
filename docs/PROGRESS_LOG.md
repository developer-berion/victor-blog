# Progress Log

## 2026-03-23

- Done: Added optional SEO columns to posts and exposed them in the admin editor with deterministic defaults and live preview.
- Done: Defined explicit SEO naming rules for titles, descriptions, alt text, and image filenames.
- Done: Documented the phase-2 AI review flow for SEO instead of planning local model training.
- Done: Added canonical metadata, JSON-LD, `robots.txt`, `sitemap.xml`, and `/llms.txt` for search engines and LLMs.
- Done: Cleaned up public-facing copy so the site is consistently written in Spanish with proper accents.
- Done: Installed the MUI MCP package locally and documented how to run it with the repo script.
- Done: Found and fixed the admin CSS collision by disabling CSS layer isolation on admin routes.
- Done: Refined the login screen so the MUI theme now controls typography, spacing, fields, and the primary button.
- Done: Switched to a local-first iteration rhythm to avoid repeated Vercel deploys during UI polishing.
- Done: Added `docs/LOCAL_WORKFLOW.md` as the operating contract for local QA, docs, and commits.
- Done: Validated the admin login locally in browser after fixing spacing and CTA visibility.
- Done: Built a minimal CMS on Supabase and Next.js with admin panel, CRUD posts, cover uploads, and visual feedback.
- Done: Migrated the admin to Material UI with a classic layout, cover preview, and delete confirmation.
- Done: Extracted Markdown rendering into a shared helper and added live content preview in the admin editor.
- Done: Created canonical local docs for context, decisions, progress, and integrations.
- Decisions: See [DECISIONS.md](./DECISIONS.md).
- Blockers: None active.
- Next: Split the current changes into small commits, then continue polishing the admin table/editor locally before any new deploy.
