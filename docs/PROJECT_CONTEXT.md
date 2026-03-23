# Project Context

## Product

Victor Blog is a personal brand site for Victor Garcia. The editorial focus is entrepreneurship, AI for companies, and the reality of Latin America as a market and operating context.

## Current System

- Public blog built with Next.js App Router.
- Supabase used for Postgres, auth-adjacent server control, and storage.
- Vercel used for deployment.
- Minimal admin panel under `/admin` for single-user publishing.
- Storage bucket `blog-covers` used for post cover images.

## Current State

- Public pages are connected to Supabase content.
- Admin has login, list, create, edit, delete, upload cover image, and feedback snackbars.
- MUI is used only inside the admin surface.
- The repo is on a `codex/` branch for traceable follow-up work.

## Source of Truth

- Code in `src/`
- Local env in `.env.local`
- Integration notes in `docs/INTEGRATIONS_RUNBOOK.md`
