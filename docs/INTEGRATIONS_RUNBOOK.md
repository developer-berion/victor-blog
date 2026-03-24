# Integrations Runbook

## Services

- Supabase project: `cxufpsvcbbczngzsfxin`
- Supabase URL: `https://cxufpsvcbbczngzsfxin.supabase.co`
- Storage bucket for covers: `blog-covers`
- Vercel project is already linked through the local `.vercel` folder and env vars.

## Required Environment Variables

Local `.env.local` and Vercel must include:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADMIN_ENTRY_PATH` (recommended: `/studio`)
- `RESEND_API_KEY` for newsletter transactional delivery

## Local Commands

```bash
npm run dev
npm run lint
npm run build
```

## Admin Flow

- `NEXT_PUBLIC_ADMIN_ENTRY_PATH/login` sets a signed HTTP-only cookie.
- `NEXT_PUBLIC_ADMIN_ENTRY_PATH/posts` lists posts and shows feedback.
- `NEXT_PUBLIC_ADMIN_ENTRY_PATH/posts/new` creates a post.
- `NEXT_PUBLIC_ADMIN_ENTRY_PATH/posts/:id/edit` updates a post.
- Deleting a post uses a confirmation dialog and a server action.

## Newsletter Flow

- Newsletter subscribers are stored in Supabase table `subscribers`.
- After a successful subscription, the server sends a welcome email with the blog's editorial template.
- The email sender is `Victor Garcia <victor@berioncompany.com>`.
- The email content includes recent posts, a consulting note, and a small Berion Company link in the footer.
- If `RESEND_API_KEY` is missing, the subscription still saves, but the email cannot be delivered.

## Troubleshooting

- If public pages fail, check Supabase env vars first.
- If admin login fails, verify `ADMIN_PASSWORD` and session signing secret.
- If cover upload fails, confirm the `blog-covers` bucket exists and is public.
- If newsletter mail is not being delivered, confirm `RESEND_API_KEY` is set and `victor@berioncompany.com` is allowed by your mail provider.
- If builds fail on admin pages, check MUI provider placement inside `src/app/admin/AdminProviders.tsx`.
