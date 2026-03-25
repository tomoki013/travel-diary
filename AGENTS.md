# AGENTS.md

This file defines the shared rules and mandates for all AI agents (Gemini, Claude, etc.) operating in this repository.

## Blogging Mandates (AI Rules)

All AI agents MUST adhere to the following rules for blog post creation, editing, and formatting.

### Rule Source
- **Primary Rules:** `draft-posts/rules/*.md`
- Agents MUST always check and adhere to the latest instructions in `draft-posts/rules/` before creating or editing any blog posts.
- Specifically, use `draft-posts/rules/EDITORIAL_BASELINE.md` as the general editorial baseline, apply `draft-posts/rules/CONTENT_STRATEGY.md` for category intent, and apply `draft-posts/rules/TRAVEL_DIARY_RULES.md` whenever working on `series: travel-diary`.

### Core Principles
- **Style Consistency:** Match the existing patterns in the `posts/` directory.
- **Fixed Targets:** Always define the target file path before starting edits.
- **Structural Integrity:** Use proper Markdown headings (`##`, `###`), unified "Desu/Masu" (です・ます) tone, and chronological re-organization.
- **Noise Removal:** Rigorously remove all non-essential elements (Images, ToC, CTAs, external links).
- **Verification:** Double-check for residual noise keywords (URLs, "ToC", "images", etc.) before finalizing any post.

## Technical Context
- **Framework:** Next.js (App Router)
- **Content:** Markdown with YAML frontmatter in `posts/`
- **Drafts:** Markdown in `draft-posts/`
- **Build Step:** Prebuild scripts generate caches from posts.
- **Regions:** Valid locations must be defined in `src/data/region.ts`.
