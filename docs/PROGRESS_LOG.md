# Progress Log

## 2026-03-23

- Done: Rolled back the admin SEO verification layer, AI phase-2 docs, and SEO-specific CMS fields.
- Done: Kept the technical SEO foundation in place: canonical metadata, JSON-LD, robots, sitemap, and llms.txt.
- Done: Added canonical metadata, JSON-LD, `robots.txt`, `sitemap.xml`, and `/llms.txt` for search engines and LLMs.
- Done: Cleaned up public-facing copy so the site is consistently written in Spanish with proper accents.
- Done: Completed a second SEO pass on public content with stronger internal linking, breadcrumbs, topic hubs, and article leads.
- Done: Fixed the category slug mismatch so `ai-empresas` now matches Supabase and all internal navigation/routes.
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
- Next: Continue with the simple blog/editor workflow and only add more SEO depth if it stays lightweight and truly useful.

## 2026-03-24

- Done: Kept the public article body semantic and readable for humans, search engines, and LLMs.
- Done: Moved the share block to the end of the editorial flow and condensed it into a minimal one-line module.
- Done: Recorded the public-content readability decision in [DECISIONS.md](./DECISIONS.md).
- Blockers: Notion MCP is not available in this session, so the external Notion publish step could not be completed here.
- Next: Commit the docs and code updates to GitHub and continue using the local docs as the source of truth.
