# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Japanese travel diary blog ("ともきちの旅行日記") built with Next.js 16 and deployed on Netlify. Features markdown-based posts, photo galleries, series organization, and destination-based navigation.

## Development Commands

```bash
pnpm dev           # Start dev server (webpack mode)
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
dates: string[]
category: "tourism" | "itinerary" | "series" | "one-off"
series?: string        # Links posts into a series
location?: string[]    # Region tags for destination filtering
tags?: string[]
journey?: string       # Links to journey data
```

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

- **PWA**: Serwist for service worker (`src/app/sw.ts`)
- **Images**: Custom Netlify loader (`netlify-loader.ts`) with Netlify Image CDN
- **Theming**: next-themes with light/dark mode
- **Animations**: framer-motion
- **Forms**: react-hook-form + zod validation
- **AI Chat**: Vercel AI SDK with Google AI (`src/app/api/chat/`)

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
