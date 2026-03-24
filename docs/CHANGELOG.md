# Changelog

## 2026-03-23

- Rolled back the admin SEO verification layer and AI phase-2 planning docs.
- Kept the technical SEO foundation: canonical metadata, JSON-LD, `robots.txt`, `sitemap.xml`, and `/llms.txt`.
- Added canonical SEO metadata, JSON-LD, `robots.txt`, `sitemap.xml`, and a `/llms.txt` endpoint.
- Cleaned up public copy so titles, summaries, and newsletter text are consistently in Spanish.
- Added SEO content hubs, breadcrumbs, article leads, and related-category navigation on public pages.
- Fixed the category slug mismatch to use `ai-empresas` consistently across the site, sitemap, and llms file.
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
- Added a semantic public article flow with a compact one-line share block placed after the editorial content.
- Added a branded newsletter welcome email with recent posts, consulting copy, and a Berion Company footer link.
