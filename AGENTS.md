# AGENTS.md

This file defines the shared rules and mandates for all AI agents (Gemini, Claude, etc.) operating in this repository.

## Blog Post Operations

- The only blog rule source is `draft-posts/rules/OPERATIONS.md` (frontmatter, naming, output location, internal links, pre-publish checks). Read it before creating or editing any post.
- Always output new or edited posts to `draft-posts/` first — never write directly into `posts/`.

## Technical Context

- **Framework:** Next.js (App Router)
- **Content:** Markdown with YAML frontmatter in `posts/`
- **Drafts:** Markdown in `draft-posts/`
- **Build Step:** Prebuild scripts generate caches from posts.
- **Regions:** Valid locations must be defined in `src/data/region.ts`.

## Versioning & Releases

- Versioning, release steps, the changelog, and the public update history follow `docs/versioning-release.md` (source of truth). Versions use SemVer.
- When shipping a user-visible change, keep `package.json` `version`, `CHANGELOG.md`, and the public update history in `src/components/features/roadmap/UpdateList.tsx` consistent.
- Never delete a feature from the update history. Mark a removed feature with `removed: true` / `removedNote` so the UI shows it as discontinued (例: Generative UI, Focus Mode, PWA offline).
- Keep the public roadmap (`src/data/roadmap.tsx`) statuses aligned with reality (only one `CURRENT_TARGET`).

## Documentation Maintenance

- Development and operations docs live under `docs/` and are the source of truth for shared workflow and repository structure.
- When architecture, workflow, page responsibilities, or content operations change, agents MUST update the relevant files in `docs/` in the same change.
- If a change affects agent behavior or working rules, agents MUST also update `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` together in the same change.
