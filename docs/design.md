# Bookstore Discovery - Product Design

## Overview

Standalone book discovery product for local bookstores. Embeddable iframe or linkable page that showcases AI-powered natural language book search.

**MVP Goal**: Demo the search algorithm quality to bookstores. No inventory connection initially.

**Phase 2**: Connect store inventory via CSV upload for availability overlays and buy CTAs.

## Business Model

1. **Demo Phase**: Free demos showing search quality
2. **Paid Phase**: Monthly subscription for inventory integration + custom branding

## Technical Architecture

### Deployment
- **Primary**: iframe embed - `<iframe src="https://discover.stacks.com/joes-books"></iframe>`
- **Fallback**: Direct link to same URL
- Works on any website (Squarespace, Wix, WordPress, Shopify)

### Multi-tenant Routing
- `/[storeSlug]/` - Main discover page
- `/[storeSlug]/results` - Search results (3 categories)
- `/[storeSlug]/book/[id]` - Book detail modal

## Features

### MVP (Demo)
- Natural language search ("cozy mystery in a bookshop")
- Vibe chips for quick searches
- 3-category results: Atmosphere, Characters, Plot
- Book detail modal with metadata
- Store logo branding (fixed brutalist design)

### Phase 2 (Inventory Connected)
- CSV inventory upload
- "In Stock" / "Check Store" badges on results
- Buy button or "Call to Order" CTA
- Admin dashboard for inventory management

## Search Results Structure

```typescript
interface SearchResult {
  query: string;
  atmosphere: {
    tags: string[];           // ["Cozy", "Small Town"]
    books: BookSearchMatch[];
  };
  characters: {
    tags: string[];           // ["Amateur Sleuth", "Found Family"]
    books: BookSearchMatch[];
  };
  plot: {
    tags: string[];           // ["Mystery", "Romance Subplot"]
    books: BookSearchMatch[];
  };
}

interface BookSearchMatch {
  book: Book;
  matchPercentage: number;
  matchReasons: Record<string, string[]>;
}
```

### Visual Sections
- 🌟 **Atmosphere** - cyan accent tags
- 💫 **Characters** - purple accent tags
- 📖 **Plot** - coral accent tags

## Data Model

### Store Config (MVP: manual JSON files)
```typescript
interface Store {
  slug: string;           // "joes-books"
  name: string;           // "Joe's Books"
  logo?: string;          // "/stores/joes-books/logo.png"
  // Phase 2:
  buyUrl?: string;        // "https://joes-books.com/buy/{isbn}"
  contactPhone?: string;
}
```

### Inventory (Phase 2)
```typescript
interface InventoryBook {
  isbn: string;
  title: string;
  author: string;
  inStock: boolean;
  price?: number;
  quantity?: number;
}
```

**CSV Format**:
```csv
isbn,title,author,in_stock,price
9780141439518,Pride and Prejudice,Jane Austen,true,14.99
```

## Design System

Inherits brutalist design from Stacks:
- Offset shadows (left-down)
- Bold borders (5px cards, 3px badges)
- Vibrant gradients
- Mobile-first (390px viewport)

**Store Customization (MVP)**: Logo swap only, fixed design.

## Responsive Layout

### Desktop (≥768px)
- **Hero Search**: Large centered search bar with generous whitespace
- **Vibe Chips**: Wrap to multiple rows below search
- **Results**: 3 books per category row (grid layout)
- **Book Detail**: Centered modal overlay

### Mobile (<768px)
- **Hero Search**: Full width, compact
- **Vibe Chips**: Horizontal scroll
- **Results**: Single column, stacked cards
- **Book Detail**: Full screen overlay

### Category Results Layout
```
┌─────────────────────────────────────────────────────────────┐
│  🌟 ATMOSPHERE                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Book 1  │  │  Book 2  │  │  Book 3  │                  │
│  │  Author  │  │  Author  │  │  Author  │                  │
│  │ In Stock │  │ Can Order│  │ In Stock │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                             │
│  💫 CHARACTERS                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Book 4  │  │  Book 5  │  │  Book 6  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                             │
│  📖 PLOT                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Book 7  │  │  Book 8  │  │  Book 9  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## Availability Badges

Display on both book cards and detail modal:

| Status | Badge | Color |
|--------|-------|-------|
| In Stock | "✓ IN STOCK" | Green (bg-green-500) |
| Can Order | "📦 CAN ORDER" | Yellow (bg-yellow-500) |

**Mock Implementation**: Random assignment for demo (70% in stock, 30% can order)

## Book Detail Modal

```
┌─────────────────────────────────────────────┐
│  ✕                                          │
│                                             │
│      ┌─────────────┐                        │
│      │   Cover     │   Title of Book        │
│      │             │   by Author Name       │
│      │             │                        │
│      └─────────────┘   ┌─────────────────┐  │
│                        │ ✓ IN STOCK      │  │
│                        └─────────────────┘  │
│                                             │
│  Description text here...                   │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Request Book    │  │ Contact Shop    │  │
│  └─────────────────┘  └─────────────────┘  │
│                                             │
│  Genres: Mystery • Cozy • Fiction           │
│  Pages: 320                                 │
└─────────────────────────────────────────────┘
```

**Modal Actions**:
- "Request This Book" - Opens email/form to request order
- "Contact Shop" - Opens phone/email contact

## File Structure

```
bookstore-discover/
├── app/
│   ├── [storeSlug]/
│   │   ├── page.tsx              # Main discover
│   │   ├── results/page.tsx      # 3-category results
│   │   └── book/[id]/page.tsx    # Book detail
│   ├── api/
│   │   └── search/
│   │       └── categorized/route.ts
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx                  # Redirect to demo store
├── components/
│   ├── SearchBar.tsx
│   ├── VibeChips.tsx
│   ├── BookCard.tsx
│   ├── BookDetailModal.tsx
│   └── ResultSection.tsx
├── lib/
│   ├── stores.ts
│   └── services/
│       ├── claude.ts
│       └── googleBooks.ts
├── stores/
│   └── demo-store.json
├── public/
│   └── stores/
│       └── demo-store/
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

## Components to Extract from stacks-app

| Component | Source | Modifications |
|-----------|--------|---------------|
| SearchBar | `components/SearchBar.tsx` | None |
| VibeChips | `components/VibeChips.tsx` | None |
| BookCard | `components/BookCard.tsx` | Remove match level (MVP) |
| BookDetailModal | `components/BookDetailModal.tsx` | Remove social features |
| ResultSection | `app/discover/results/page.tsx` | Extract as component |

## API Dependencies

- **Claude API**: Natural language search interpretation
- **Google Books API**: Book metadata and covers
- **TMDB API**: Movie/TV reference detection (optional)

## Success Metrics

1. Search result relevance (qualitative demo feedback)
2. Bookstore conversion rate (demos → paid)
3. Customer engagement (searches per session)
