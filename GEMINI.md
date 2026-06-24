# GEMINI.md

This file provides priority mandates for Gemini CLI when working on this repository.

## Blog Post Operations

- The only blog rule source is `draft-posts/rules/OPERATIONS.md` (frontmatter, naming, output location, internal links, pre-publish checks). Read it before creating or editing any post.
- Always output new or edited posts to `draft-posts/` first — never write directly into `posts/`.

## Versioning & Releases

- Follow `docs/versioning-release.md` (source of truth) for SemVer, releases, the changelog, and the public update history.
- When shipping a user-visible change, keep `package.json` `version`, `CHANGELOG.md`, and `src/components/features/roadmap/UpdateList.tsx` consistent.
- Never delete a feature from the update history; mark removed features with `removed: true` / `removedNote` so the UI shows them as discontinued.
- Keep `src/data/roadmap.tsx` statuses aligned with reality (only one `CURRENT_TARGET`).

## Documentation Maintenance

- Shared development and operations docs live in `docs/` and are the source of truth for repository workflow and structure.
- When implementation changes architecture, workflow, page responsibilities, or content operations, Gemini must update the relevant files in `docs/` in the same change.
- If the change affects AI behavior or working rules, Gemini must also update `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` together in the same change.
