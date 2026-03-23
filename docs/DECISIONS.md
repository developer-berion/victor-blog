# Decisions

## 2026-03-23 - Local-first iteration rhythm

**Context:** The admin UI was being tuned through repeated production deploys, which made visual iteration noisy and slow.

**Decision:** Work locally first, validate layout and behavior in the browser, then commit and deploy only after the local test gate passes.

**Alternatives:** Continue deploying every visual tweak, or pause all work until a larger batch is ready.

**Why:** This reduces latency during design fixes, keeps Vercel traffic stable, and makes debugging easier because each local change can be inspected before release.

**Impact:** Faster UI iteration, fewer accidental production updates, and a cleaner commit history.

**Follow-up/TODO:** Keep screenshots and temporary QA artifacts out of git; delete them or ignore them before committing.

## 2026-03-23 - Supabase + Next.js as the CMS stack

**Context:** The project needed a lightweight CMS, not a separate heavyweight backend.

**Decision:** Use Supabase as the data layer and Next.js as the app/backend layer via server routes and server actions.

**Alternatives:** Separate API service, headless CMS, or a custom admin backend.

**Why:** This keeps the stack simple for a solo founder, reduces moving parts, and keeps the project easy to maintain.

**Impact:** Content, auth-sensitive actions, and uploads live server-side. Public reads stay simple. Admin remains narrow and controlled.

**Follow-up/TODO:** Keep RLS, service-role usage, and env vars documented and server-only.

## 2026-03-23 - Single-user admin with MUI

**Context:** The admin needed clearer operators' UX without changing the public site design language.

**Decision:** Use Material UI only for the admin surface and keep the public site on the existing custom visual system.

**Alternatives:** Rewrite the whole site in MUI or keep raw CSS only.

**Why:** The admin benefits from structured tables, dialogs, and snackbars, while the public blog should keep its editorial tone.

**Impact:** Better edit/manage UX with low risk to the public surface.

**Follow-up/TODO:** Keep admin components classic, simple, and reusable.

## 2026-03-23 - Admin MUI must not be layered behind global CSS

**Context:** The admin login was inheriting the public site's global CSS rules, which distorted typography and button rendering inside MUI components.

**Decision:** Disable CSS layer isolation for the admin MUI provider so the theme and MUI component styles stay authoritative on admin routes.

**Alternatives:** Keep CSS layers enabled and fight the global site stylesheet with ad hoc overrides, or rewrite the public stylesheet first.

**Why:** The admin surface needs predictable component rendering now, and the public CSS should not be able to override MUI buttons, headings, or fields.

**Impact:** Admin typography, buttons, and form controls now follow the MUI theme instead of inherited public-site element rules.

**Follow-up/TODO:** Keep admin-only layout and styling in the admin theme or component wrappers, not in the public globals.

## 2026-03-23 - Server-only cover uploads

**Context:** Post covers needed a stable storage path and public URLs.

**Decision:** Store cover images in Supabase Storage bucket `blog-covers`, uploaded only from server-side code.

**Alternatives:** External URL only, client-side signed uploads, or a separate asset service.

**Why:** Server-side upload keeps credentials out of the client and gives the admin a direct workflow.

**Impact:** Cover image upload is part of the CMS flow; public posts can resolve images by public URL.

**Follow-up/TODO:** Keep the bucket public and document file handling in the runbook.
