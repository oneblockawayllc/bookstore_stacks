/**
 * Core type definitions for Bookstore Discover
 */

// Book types
export interface BookMetadata {
  synopsis: string;
  themes: string[];
  tropes: string[];
  mood: string[];
  similarMovies?: string[];
  pageCount: number;
  publishYear: number;
  amazonRating?: number;
  goodreadsRating?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  googleBooksCoverUrl?: string;
  genres: string[];
  tropes: string[];
  pageCount: number;
  publishYear: number;
  metadata?: BookMetadata;
}

// Search types
export interface NaturalLanguageSearchResult {
  book: Book;
  matchScore: number;
  matchReasons: string[];
  relevanceToQuery: number;
}

export type BookAvailability = 'in_stock' | 'can_order';

export interface BookSearchMatch {
  book: Book;
  matchPercentage: number;
  matchReasons: {
    atmosphere?: string[];
    characters?: string[];
    plot?: string[];
  };
  availability: BookAvailability;
}

export interface SearchResult {
  query: string;
  atmosphere: {
    tags: string[];
    books: BookSearchMatch[];
  };
  characters: {
    tags: string[];
    books: BookSearchMatch[];
  };
  plot: {
    tags: string[];
    books: BookSearchMatch[];
  };
}

// Store types
export interface Store {
  slug: string;
  name: string;
  logo?: string;
  tagline?: string;
  // Phase 2: inventory integration
  buyUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
}

// Minimal user profile for search (not personalized in MVP)
export interface UserReadingProfile {
  userId: string;
  favoriteGenres: string[];
  favoriteAuthors: string[];
  favoriteTropes: string[];
  dislikedTropes: string[];
  preferredMood: string[];
  readingHistory: Array<{ bookId: string; rating?: number }>;
  engagementHistory: {
    likedStackIds: string[];
    savedStackIds: string[];
    commentedStackIds: string[];
  };
}
