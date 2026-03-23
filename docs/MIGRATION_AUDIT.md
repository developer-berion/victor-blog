# Migration Audit

## Migration

- `add_post_seo_fields`

## Summary

- Added nullable SEO fields to `public.posts`:
  - `seo_title`
  - `seo_description`
  - `cover_image_alt`
- No existing data was removed.
- Existing posts remain valid because the new fields are optional.

## Safety assessment

- Risk level: Low
- Lock impact: Low
- Rollback complexity: Low

## Notes

- This migration is expand-only.
- The app code now reads the new fields when present and falls back to deterministic defaults when absent.

