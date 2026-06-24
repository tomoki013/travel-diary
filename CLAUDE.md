# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Japanese travel diary blog ("ともきちの旅行日記") built with Next.js 16 and deployed on Netlify. Features markdown-based posts, photo galleries, series organization, and destination-based navigation.

## Development Commands

```bash
pnpm dev           # Start dev server (webpack mode)
pnpm prebuild      # Generate image/post caches manually
pnpm build         # Full build (generates caches, builds Next.js, generates sitemap)
pnpm lint          # Run ESLint
pnpm start         # Start production server
```

The build process runs prebuild scripts that generate:

- `.posts.cache.json` - Post content cache from `scripts/generate-post-cache.js`
- Image index from `scripts/generate-image-index.js`

## Architecture

### Content System

**Posts** are stored as Markdown files directly in the repository's `posts/` directory. Drafts are stored in `draft-posts/`.

Post files use Markdown (.md/.mdx) with gray-matter frontmatter:

```yaml
title: string
publishedAt: string                       # 記事公開日 (YYYY-MM-DD)
updatedAt?: string                        # 記事更新日 (YYYY-MM-DD) ※更新時のみ設定
travelDates?: { start: string; end?: string }  # 訪問日 (旅行期間)
category: "tourism" | "itinerary" | "series" | "one-off"
description?: string   # SEO/メタ用の説明
excerpt?: string       # 一覧・導入文用の抜粋
tags?: string[]
heroImage?: string     # アイキャッチ画像パス
heroAlt?: string
regionIds?: string[]   # Region tags for destination filtering
author?: string
series?: { slug: string; order?: number } # Links posts into a series
journeyId?: string     # Links to journey data
travelTopics?: ("money" | "visa" | "transport" | "booking" | "sim" | "insurance")[]
draft?: boolean
noindex?: boolean
```

> **日付は3種を区別する**: `publishedAt`(公開日) / `updatedAt`(更新日) / `travelDates`(訪問日)。これらは別概念なので混同しないこと。UI では公開日・更新日を記事ヘッダーに、訪問日を記事末尾の自己紹介カードに表示する。

**Post Loading**: `src/lib/markdown.ts` reads posts from configured directories. `src/lib/posts.ts` provides filtered/sorted access via React `cache()` functions.

### Data Layer

Static data files in `src/data/`:

- `region.ts` - Hierarchical continent/country/city structure for destination pages
- `series.ts` - Featured series definitions
- `categories.ts`, `photoCategories.ts` - Category configurations
- `journey.ts` - Journey timeline data

### Page Structure

Uses Next.js App Router with route groups:

- `src/app/(pages)/` - Main pages (about, posts, gallery, destination, series, journey, etc.)
- `src/app/api/` - API routes (search, send-email, chat)

Many pages follow a Server Component + Client Component pattern:

- `page.tsx` - Server component for data fetching
- `Client.tsx` - Client component for interactivity

### Component Organization

- `src/components/ui/` - shadcn/ui primitives (button, card, form, etc.)
- `src/components/common/` - Shared components (theme provider, icons, share buttons)
- `src/components/features/` - Feature-specific components organized by domain (article, gallery, destination, journey, etc.)
- `src/components/layouts/` - Header, Footer
- `src/components/pages/` - Page-level section components

### Key Integrations

- **Images**: Custom Netlify loader (`netlify-loader.ts`) with Netlify Image CDN
- **Theming**: next-themes with light/dark mode
- **Animations**: スクロール連動フェードインは CSS + IntersectionObserver (`src/components/common/Reveal.tsx`)。退場アニメーション(`AnimatePresence`)・共有要素(`layoutId`)・FLIP(`layout`)が必要な箇所のみ framer-motion を使用し、必ず `LazyMotion` 配下で `m.*` を使うこと(`motion.*` は使用禁止。`src/components/common/MotionProvider.tsx` 参照)
- **Forms**: react-hook-form + zod validation

## Blog Post Operations

- 記事制作の正本は `draft-posts/rules/OPERATIONS.md`（frontmatter・命名・出力先・内部リンク・公開前チェック）。記事を新規作成・編集する前に必ず確認する。
- 新規作成や修正した記事は、いきなり `posts/` へ置かず、必ず一旦 `draft-posts/` に出力して確認を挟む。
- frontmatter の項目とカテゴリ要件は `OPERATIONS.md` に従う（このファイルの Content System も参照）。

### External Services

- Rewrites to `travel-map-for-tomokichidiary.netlify.app` for `/map` route
- Google Analytics, Google Adsense, GetYourGuide, Agoda integrations in layout

## Types

Core types defined in `src/types/types.ts`:

- `Post` / `PostMetadata` - Blog post structure
- `Photo` - Gallery photo
- `ContinentData`, `Country`, `City` - Destination hierarchy
- `Series` - Series definition
- `TravelPlan` - AI planner output structure

## Path Aliases

- `@/` maps to `src/`

## Versioning & Releases

- Follow `docs/versioning-release.md` (source of truth) for SemVer, release steps, the changelog, and the public update history.
- When shipping a user-visible change, keep `package.json` `version`, `CHANGELOG.md`, and the public update history in `src/components/features/roadmap/UpdateList.tsx` consistent.
- Never delete a feature from the update history. Mark removed features with `removed: true` / `removedNote` so the UI shows them as discontinued (e.g. Generative UI, Focus Mode, PWA offline).
- Keep the public roadmap (`src/data/roadmap.tsx`) statuses aligned with reality; only one `CURRENT_TARGET` at a time.

## Documentation Maintenance

- Shared development and operations docs live in `docs/`. Treat them as the source of truth for repository workflow and structure.
- When implementation changes architecture, workflow, page responsibilities, or content operations, update the relevant files in `docs/` in the same change.
- If the change affects AI behavior or collaboration rules, update `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` together in the same change.
