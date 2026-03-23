# Safe Deploy Checklist

Before deploying the SEO phase:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Verify `/robots.txt`.
4. Verify `/sitemap.xml`.
5. Verify `/llms.txt`.
6. Check a post page for canonical metadata and JSON-LD.
7. Check the admin form for SEO title, description, alt text, and image filename preview.
8. Confirm Supabase contains the SEO columns.
9. Confirm a published post still loads correctly with fallback SEO values.

