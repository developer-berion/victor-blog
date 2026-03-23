# Changelog

## 2026-03-23

- Added optional SEO fields to the CMS and a live SEO preview in the admin editor.
- Added explicit rules for SEO title, meta description, cover alt text, and SEO-friendly image filenames.
- Added phase-2 AI SEO planning docs that position the model as a reviewer, not an autonomous publisher.
- Added canonical SEO metadata, JSON-LD, `robots.txt`, `sitemap.xml`, and a `/llms.txt` endpoint.
- Cleaned up public copy so titles, summaries, and newsletter text are consistently in Spanish.
- Adjusted the admin MUI provider so public site CSS no longer overrides component styling.
- Refined the login card to use MUI defaults for field rhythm, typography, and the primary button.
- Added local MUI MCP setup documentation and a repo script for compatible clients.
- Added minimal admin CMS for posts.
- Added Supabase-backed create, update, delete, and list flows.
- Added cover image uploads to Supabase Storage bucket `blog-covers`.
- Added confirmation dialog for delete actions.
- Added snackbar feedback for save, delete, and validation outcomes.
- Added MUI-based admin surface with a classic, simple layout.
- Added a shared Markdown rendering helper and live content preview in the admin editor.
- Improved the admin login surface with local-first visual validation, clearer spacing, and a visible CTA button.
