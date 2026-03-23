# SEO Rules

This document defines the publication rules for posts created in the admin CMS.

## Source of truth

- `title` is the editorial headline.
- `seo_title` is the SEO override.
- `excerpt` is the editorial summary.
- `seo_description` is the SEO description override.
- `cover_image_alt` is the image accessibility and SEO alt text.

## Exact rules

### Titles

- Recommended length: 50 to 60 characters for SEO titles.
- If `seo_title` is empty, derive it from `title`.
- Keep the important keyword near the start.
- Do not stuff keywords.

### Descriptions

- Recommended length: 120 to 160 characters.
- If `seo_description` is empty, derive it from `excerpt`.
- Write one clear promise of value.
- Avoid duplicate wording from the title.

### Image alt text

- Recommended length: 15 to 110 characters.
- If `cover_image_alt` is empty, derive it from the title and category.
- Describe what the image represents, not just the file.

### Image file names

- Use lowercase ASCII.
- Use hyphens instead of spaces.
- Use the post slug and title-derived tokens.
- Example pattern:
  - `slug/title-stamp-hash.ext`
- The upload helper must generate the final storage path automatically.

## Pre-publish checks

- Title exists and is readable.
- Description exists and is between the recommended limits.
- Cover image alt text exists or can be generated.
- Slug is stable and unique.
- The image file path follows the naming rule.

## Automation policy

- The admin may auto-generate defaults.
- The editor may override defaults when needed.
- If the editor leaves a field empty, the system should fill it deterministically.

