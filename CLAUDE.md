# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered book discovery for local bookstores. Users search using natural language queries (e.g., "cozy mystery in a bookshop", "like Succession but a book") and Claude AI matches against a book catalog, categorizing results by atmosphere, characters, and plot.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # Run ESLint
```

## Architecture

### Multi-Tenant Store System
- Dynamic routes via `app/[storeSlug]/` - each store gets its own branded experience
- Store configuration in `lib/stores.ts` (MVP: hardcoded, Phase 2: database-backed)
- Root `/` redirects to `/demo` store

### Search Flow
1. User submits query → `POST /api/search/categorized`
2. `lib/services/claude.ts` enriches query (extracts movie references via `lib/services/tmdb.ts`)
3. Claude API (`claude-3-5-haiku`) matches books from `lib/mockData.ts` catalog
4. Results categorized into atmosphere/characters/plot sections
5. 5-minute in-memory cache for identical queries

### Key Services
- `lib/services/claude.ts` - Core AI integration: query enrichment, book matching, response parsing
- `lib/services/tmdb.ts` - Movie reference detection with theme extraction (currently mock data, prepared for TMDB API)
- `lib/types.ts` - Central type definitions (Book, SearchResult, Store, UserReadingProfile)

### UI Components
- `components/SearchBar.tsx` - Client component with loading states
- `components/VibeChips.tsx` - Quick search shortcuts
- Uses Tailwind with custom "brutal" design system (neobrutalism shadows, bold borders)

## Environment Variables

```
ANTHROPIC_API_KEY=     # Required - Claude API
GOOGLE_BOOKS_API_KEY=  # Optional - cover images
TMDB_API_KEY=          # Optional - movie reference detection
```

## Design System

Neobrutalist styling with:
- Custom color tokens in `tailwind.config.ts` (light/dark themes)
- `shadow-brutal-*` utilities for distinctive box shadows
- Bold 3-5px borders, uppercase display font
