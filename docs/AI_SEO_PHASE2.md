# AI SEO Phase 2

This document defines the next phase for AI-assisted SEO governance.

## Goal

Use an OpenAI model to review, suggest, and normalize SEO metadata before publish.

## Recommended model split

- Use `gpt-5.4` for higher-quality SEO drafting, rewrite suggestions, and final copy refinement.
- Use `gpt-5-nano` for fast classification, validation, and rule checking.
- Do not treat “GPT-5.4 nano” as the default plan unless the product docs explicitly expose that model ID in the target environment.

## What the AI should do

- Review title, excerpt, and body before publish.
- Suggest SEO title and description.
- Suggest a clean cover alt text.
- Flag overlong titles, weak descriptions, or missing keyword focus.
- Produce a short pre-publish checklist for the editor.

## What the AI should not do

- It should not publish directly without review.
- It should not invent facts, metrics, or claims.
- It should not override the editor silently.

## Integration shape

- Keep deterministic rules in local code first.
- Use the model as a reviewer and suggestion engine.
- Store final approved SEO fields in Supabase.
- Log AI suggestions so they can be audited later.

## Training note

- Do not plan on “training the model locally.”
- OpenAI docs support fine-tuning for specific supported models, not as a local training workflow.
- For this project, start with prompt rules, validation heuristics, and eval samples before considering fine-tuning.

## Suggested workflow

1. Editor writes the post.
2. Local SEO rules generate a first draft.
3. AI reviews and suggests edits.
4. Editor approves or edits.
5. Publish only after the checklist passes.

