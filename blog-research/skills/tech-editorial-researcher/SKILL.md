---
name: tech-editorial-researcher
description: Investigate technology news, product launches, official posts, articles, and YouTube videos to produce original editorial research briefings and, when requested, full blog articles based on a selected headline, audience, and thesis. Use when Codex needs to validate a tech claim, compare an announcement with related coverage or prior releases, separate verified facts from interpretation, extract business and implementation implications, generate blog angles, or turn the research into an original article for general readers.
---

# Tech Editorial Researcher

## Overview

Use this skill to turn raw technology reporting into an original editorial briefing with evidence, context, hypotheses, and business meaning. Optimize for insight, not paraphrase.

## Success Criteria

A strong output:
- identifies the real claim behind the source
- checks whether the source is first-hand, derivative, or promotional
- triangulates with primary and reputable sources
- separates fact, inference, hypothesis, and unknowns
- explains what is genuinely new, what is recycled messaging, and what matters in practice
- gives both an expert-facing briefing and a plain-language explanation

## Working Modes

Use the same core workflow, but shift emphasis depending on the task:
- Single-source verification: validate one article, post, or thread and supply context.
- Launch comparison: compare a new announcement against prior releases from the same company.
- Video-to-brief: extract the signal from a YouTube video, then verify externally.
- Trend triangulation: synthesize several related sources into one narrative map.

## Mandatory Workflow

### 1. Frame the assignment

Identify:
- the main source and its type
- the central claim
- the supporting claims
- entities, products, versions, dates, numbers, and geographies involved
- what is genuinely new versus background context

### 2. Audit source quality

Use `references/source-evaluation.md`.
Classify the main source as:
- primary
- secondary
- commentary
- promotional

State the main reliability risks in one short paragraph.

### 3. Build the source map

Triangulate with:
- official company blogs, docs, changelogs, repos, pricing pages, or statements
- reputable secondary coverage
- prior related launches or earlier versions
- corrections, counterpoints, or contradictions if relevant

When browsing is available, verify current claims with exact dates and preserve direct source links.
If only one credible source exists, say so explicitly and lower confidence.

### 4. Create an evidence ledger

Sort claims into four buckets:
- Verified fact: directly supported by reliable evidence
- Interpretation: a reasonable reading of evidence, but not directly stated
- Hypothesis: a plausible claim with incomplete evidence
- Unknown: missing evidence, unanswered questions, or unresolved contradictions

Do not collapse these categories.

### 5. Extract the analytical value

Explain:
- why this matters now
- what the headline overstates or hides
- what is operationally or technically important
- who benefits, who is exposed, and who is likely unaffected
- what second-order effects may appear in product, engineering, business, policy, or adoption

### 6. Pressure-test the narrative

Ask:
- what incentives the speaker or publisher has
- what evidence is missing
- whether the announcement describes capability, availability, or proven adoption
- whether the story is signal, hype, positioning, or noise
- whether the same pattern has appeared before

### 7. Generate hypotheses

Produce 3 to 5 hypotheses. For each one include:
- statement
- why it may be true
- supporting evidence
- missing evidence
- confidence: low, medium, or high

### 8. Translate for writing

Use `references/blog-angle-framework.md` and `references/report-template.md`.
Deliver a report that helps a blog writer decide what to say, not just what happened.

## Output Contract

Unless the user asks for something else, deliver sections in this order:
1. Executive summary
2. Source assessment
3. What happened
4. What is verified
5. What is interpretation
6. What is still unclear
7. Related context and comparable news
8. Hypotheses and scenarios
9. Business implications
10. Implementation implications
11. LATAM angle when relevant
12. Blog angles
13. Headline options
14. Plain-language explanation
15. Source list

## Article Request Extension

When the user asks for the blog post itself, append:
16. Blog article draft
17. Editorial notes

Treat the selected headline as the working title and the report thesis as the editorial spine.
Do not mirror the source order or phrasing.

## Source-Type Handling

### YouTube or shorts

- Extract the speaker's central thesis.
- Separate reporting from opinion, speculation, and selling.
- Treat clipped rhetoric as weak evidence until it is verified elsewhere.
- If the transcript is partial or unavailable, state the confidence limitation.

### Official launch or company blog

- Distinguish new capability from repackaged positioning.
- Compare with prior releases, roadmap claims, and documented availability.
- Check whether the substance appears in docs, product pages, pricing, repos, or changelogs.

### Media article or analyst piece

- Identify whether it adds original reporting or only restates another source.
- Trace important claims back to primary evidence when possible.

## Writing Style

- Write in a professional, analytical, sober tone.
- Avoid hype, guru language, or theatrical framing.
- Match the user's language.
- Translate complexity into clear prose without flattening nuance.
- Prefer precise claims over sweeping conclusions.

## Hard Rules

- Never invent facts, links, or citations.
- Never present speculation as certainty.
- Never rewrite the source as a disguised summary.
- Never draft the final blog article unless the user explicitly asks for it.
- Never rely on a single volatile source if the claim can be verified elsewhere.

## Resource Map

Read these files only when needed:
- `references/source-evaluation.md`: source quality and reliability questions
- `references/report-template.md`: section-by-section briefing structure
- `references/blog-angle-framework.md`: angle selection and thesis framing
- `references/blog-draft-framework.md`: how to turn the report into an original article draft
- `assets/output-schema.md`: normalized report scaffold for saved research artifacts

## Invocation Examples

- If the user does not specify a format, default to this delivery structure:
  1. executive summary
  2. verified facts
  3. interpretations
  4. hypotheses
  5. related context
  6. blog angles
  7. plain-language explanation
- If the user asks for a blog post, ask for or confirm:
  - selected headline option
  - target audience
  - desired depth or length
  - desired stance or tone
  - optional region focus or SEO angle
- `Use $tech-editorial-researcher on this article and tell me what is actually new versus recycled messaging.`
- `Use $tech-editorial-researcher on this YouTube video. Cross-check the claims and give me blog angles, not an article draft.`
- `Use $tech-editorial-researcher to compare this announcement with the company's last two launches and explain what matters for real-world adoption.`
- `Use $tech-editorial-researcher to turn this report into an original blog post using the headline "..." for a general audience.`
