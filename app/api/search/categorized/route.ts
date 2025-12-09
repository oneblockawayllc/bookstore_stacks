import { NextRequest, NextResponse } from 'next/server';
import { findMatchingBooks, callClaude } from '@/lib/services/claude';
import { mockBooksWithMetadata } from '@/lib/mockData';
import type { SearchResult, BookSearchMatch, NaturalLanguageSearchResult, Book, UserReadingProfile, BookAvailability } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Mock availability - 70% in stock, 30% can order
function getRandomAvailability(): BookAvailability {
  return Math.random() < 0.7 ? 'in_stock' : 'can_order';
}

// Cache for search results
const searchCache = new Map<string, { results: SearchResult; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function normalizeQuery(query: string): { normalized: string; error?: string } {
  if (!query || typeof query !== 'string') {
    return { normalized: '', error: 'Query is required' };
  }

  const normalized = query.trim().replace(/\s+/g, ' ');

  if (normalized.length < 3) {
    return { normalized, error: 'Query must be at least 3 characters' };
  }

  if (normalized.length > 500) {
    return { normalized: normalized.slice(0, 500) };
  }

  return { normalized };
}

async function categorizeResults(
  query: string,
  results: NaturalLanguageSearchResult[]
): Promise<SearchResult> {
  if (results.length === 0) {
    return {
      query,
      atmosphere: { tags: [], books: [] },
      characters: { tags: [], books: [] },
      plot: { tags: [], books: [] }
    };
  }

  const bookList = results.map((r, idx) =>
    `[${idx}] "${r.book.title}" by ${r.book.author} - ${r.matchReasons.join('; ')}`
  ).join('\n');

  const prompt = `You are a book recommendation expert. Categorize these ${results.length} book recommendations into three categories: Atmosphere, Characters, and Plot.

USER'S SEARCH QUERY: "${query}"

BOOKS:
${bookList}

REQUIREMENTS:
1. Each book can ONLY appear in ONE category
2. Select exactly 2 unique books per category (6 books total)
3. Categorize based on how each book relates to "${query}"

For each category, select 2 books that best represent that aspect:
- ATMOSPHERE: Books where mood, setting, tone matches "${query}"
- CHARACTERS: Books where character types, dynamics match "${query}"
- PLOT: Books where story structure, themes match "${query}"

Format as JSON:
{
  "atmosphere": {
    "tags": ["tag1", "tag2", "tag3"],
    "books": [
      {"index": 0, "reasons": ["reason1", "reason2"]},
      {"index": 1, "reasons": ["reason1", "reason2"]}
    ]
  },
  "characters": {
    "tags": ["tag1", "tag2", "tag3"],
    "books": [
      {"index": 2, "reasons": ["reason1", "reason2"]},
      {"index": 3, "reasons": ["reason1", "reason2"]}
    ]
  },
  "plot": {
    "tags": ["tag1", "tag2", "tag3"],
    "books": [
      {"index": 4, "reasons": ["reason1", "reason2"]},
      {"index": 5, "reasons": ["reason1", "reason2"]}
    ]
  }
}

Return ONLY valid JSON.`;

  try {
    const response = await callClaude(prompt, 2000, 15000);

    let jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }

    const categorized = JSON.parse(jsonMatch[0]);
    const usedIndices = new Set<number>();

    const processCategory = (
      categoryData: { tags?: string[]; books?: Array<{ index: number; reasons?: string[] }> },
      categoryType: 'atmosphere' | 'characters' | 'plot'
    ): { tags: string[]; books: BookSearchMatch[] } => {
      const books: BookSearchMatch[] = [];
      const categoryBooks = categoryData?.books || [];

      for (const item of categoryBooks.slice(0, 2)) {
        let idx = item.index;

        if (idx < 0 || idx >= results.length || usedIndices.has(idx)) {
          // Find next available
          for (let i = 0; i < results.length; i++) {
            if (!usedIndices.has(i)) {
              idx = i;
              break;
            }
          }
        }

        if (idx >= 0 && idx < results.length && !usedIndices.has(idx)) {
          usedIndices.add(idx);
          const result = results[idx];
          if (result) {
            books.push({
              book: result.book,
              matchPercentage: result.matchScore,
              matchReasons: { [categoryType]: item.reasons || result.matchReasons },
              availability: getRandomAvailability()
            });
          }
        }
      }

      return {
        tags: categoryData?.tags || [],
        books
      };
    };

    return {
      query,
      atmosphere: processCategory(categorized.atmosphere, 'atmosphere'),
      characters: processCategory(categorized.characters, 'characters'),
      plot: processCategory(categorized.plot, 'plot')
    };
  } catch (error) {
    console.error('Categorization failed:', error);

    // Fallback: distribute evenly
    const available = results.slice(0, 6);
    return {
      query,
      atmosphere: {
        tags: [],
        books: available.slice(0, 2).map(r => ({
          book: r.book,
          matchPercentage: r.matchScore,
          matchReasons: { atmosphere: r.matchReasons },
          availability: getRandomAvailability()
        }))
      },
      characters: {
        tags: [],
        books: available.slice(2, 4).map(r => ({
          book: r.book,
          matchPercentage: r.matchScore,
          matchReasons: { characters: r.matchReasons },
          availability: getRandomAvailability()
        }))
      },
      plot: {
        tags: [],
        books: available.slice(4, 6).map(r => ({
          book: r.book,
          matchPercentage: r.matchScore,
          matchReasons: { plot: r.matchReasons },
          availability: getRandomAvailability()
        }))
      }
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    const { normalized, error: validationError } = normalizeQuery(query);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Check cache
    const cacheKey = `query:${normalized}`;
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, ...cached.results, cached: true });
    }

    // Minimal user profile (not personalized in MVP)
    const minimalProfile: UserReadingProfile = {
      userId: 'anonymous',
      favoriteGenres: [],
      favoriteAuthors: [],
      favoriteTropes: [],
      dislikedTropes: [],
      preferredMood: [],
      readingHistory: [],
      engagementHistory: { likedStackIds: [], savedStackIds: [], commentedStackIds: [] }
    };

    let searchResults: NaturalLanguageSearchResult[] = [];

    try {
      searchResults = await findMatchingBooks(normalized, minimalProfile, mockBooksWithMetadata, 8);
    } catch (error) {
      console.error('Claude search failed:', error);

      // Keyword fallback
      const queryLower = normalized.toLowerCase();
      searchResults = mockBooksWithMetadata
        .map(book => {
          let score = 0;
          const reasons: string[] = [];

          if (book.title.toLowerCase().includes(queryLower)) {
            score += 50;
            reasons.push(`Title matches`);
          }

          book.genres.forEach(g => {
            if (g.toLowerCase().includes(queryLower)) {
              score += 20;
              reasons.push(`Genre: ${g}`);
            }
          });

          book.metadata?.mood?.forEach(m => {
            if (m.toLowerCase().includes(queryLower)) {
              score += 25;
              reasons.push(`Mood: ${m}`);
            }
          });

          book.metadata?.tropes?.forEach(t => {
            if (t.toLowerCase().includes(queryLower)) {
              score += 15;
              reasons.push(`Trope: ${t}`);
            }
          });

          return {
            book,
            matchScore: Math.min(score, 85),
            matchReasons: reasons.length > 0 ? reasons : ['Partial keyword match'],
            relevanceToQuery: Math.min(score, 85)
          };
        })
        .filter(r => r.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 8);

      if (searchResults.length === 0) {
        return NextResponse.json({
          success: true,
          query: normalized,
          atmosphere: { tags: [], books: [] },
          characters: { tags: [], books: [] },
          plot: { tags: [], books: [] }
        });
      }
    }

    const categorizedResults = await categorizeResults(normalized, searchResults);

    // Cache
    searchCache.set(cacheKey, { results: categorizedResults, timestamp: Date.now() });

    if (searchCache.size > 100) {
      const oldestKey = searchCache.keys().next().value;
      if (oldestKey) searchCache.delete(oldestKey);
    }

    return NextResponse.json({ success: true, ...categorizedResults });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
