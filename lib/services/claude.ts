import Anthropic from '@anthropic-ai/sdk';
import type { UserReadingProfile, Book, NaturalLanguageSearchResult } from '../types';
import { extractMovieReferences, extractThemesFromMovie } from './tmdb';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 10000,
});

const MODEL = 'claude-3-5-haiku-20241022';

/**
 * Generic Claude API call with timeout
 */
export async function callClaude(prompt: string, maxTokens: number = 1024, timeoutMs: number = 10000): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set in environment');
  }

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });

    const apiPromise = anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const message = await Promise.race([apiPromise, timeoutPromise]);
    const textContent = message.content.find(block => block.type === 'text');
    return textContent ? textContent.text : '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

/**
 * Enrich query with TMDB data for movie references
 */
export async function enrichQueryWithContext(
  rawQuery: string,
  userProfile: UserReadingProfile
): Promise<{
  enrichedQuery: string;
  userContextSummary: string;
  movieThemes: string[];
}> {
  const movieRefs = extractMovieReferences(rawQuery);

  if (movieRefs.length > 0) {
    console.log(`[TMDB] Movie references detected: ${movieRefs.join(', ')}`);
  }

  const movieThemePromises = movieRefs.map(movieTitle => extractThemesFromMovie(movieTitle));
  const movieThemeResults = await Promise.all(movieThemePromises);

  const movieThemes: string[] = [];
  movieThemeResults.forEach((themes) => {
    movieThemes.push(...themes.themes, ...themes.tropes, ...themes.mood);
  });

  const userContextSummary = `Favorite genres: ${userProfile.favoriteGenres.join(', ')}
Favorite tropes: ${userProfile.favoriteTropes.join(', ')}
Preferred mood: ${userProfile.preferredMood.join(', ')}`;

  const prompt = `Book recommendation expert. User search: "${rawQuery}"

${movieRefs.length > 0 ? `Movie references detected: ${movieRefs.join(', ')}
Movie themes/tropes/mood: ${movieThemes.join(', ')}` : ''}

Expand the USER'S QUERY "${rawQuery}" into what they seek (2-3 sentences).
Focus PRIMARILY on the QUERY'S themes, tropes, and mood.

Return ONLY the description.`;

  const enrichedQuery = await callClaude(prompt, 300, 8000);

  return {
    enrichedQuery,
    userContextSummary,
    movieThemes
  };
}

/**
 * Find matching books using Claude's semantic understanding
 */
export async function findMatchingBooks(
  query: string,
  userProfile: UserReadingProfile,
  bookCatalog: Book[],
  limit: number = 10
): Promise<NaturalLanguageSearchResult[]> {
  const enrichment = await enrichQueryWithContext(query, userProfile);

  const bookDescriptions = bookCatalog
    .map((book, index) => {
      const metadata = book.metadata;
      return `
[${index}] "${book.title}" by ${book.author} (${book.publishYear})
Genres: ${book.genres.join(', ')}
Tropes: ${metadata?.tropes?.join(', ') || book.tropes.join(', ')}
Themes: ${metadata?.themes?.join(', ') || 'N/A'}
Mood: ${metadata?.mood?.join(', ') || 'N/A'}
Synopsis: ${metadata?.synopsis || 'N/A'}
Pages: ${book.pageCount}
      `.trim();
    })
    .join('\n\n');

  const movieContext = enrichment.movieThemes.length > 0
    ? `\nMOVIE THEMES DETECTED: ${enrichment.movieThemes.join(', ')}`
    : '';

  const prompt = `You are a book recommendation expert. Match books to the user's search query.

USER'S SEARCH QUERY: "${query}"
${movieContext}

AVAILABLE BOOKS:
${bookDescriptions}

INSTRUCTIONS:
1. Match books based SOLELY on the user's search query "${query}"
2. Look for books where genres, mood, themes, and tropes match the QUERY
3. Score based on how well the book matches "${query}"

Find the top ${limit} books. For each:
1. Provide the book index [0-${bookCatalog.length - 1}]
2. Give a match score (0-100)
3. Explain 2-3 reasons why it matches

Format: [index]|score|reason 1; reason 2; reason 3

Return ONLY the recommendations.`;

  const response = await callClaude(prompt, 2000);
  return parseClaudeResponse(response, bookCatalog, limit);
}

function parseClaudeResponse(
  response: string,
  bookCatalog: Book[],
  limit: number
): NaturalLanguageSearchResult[] {
  const lines = response.trim().split('\n').filter(line => line.trim());
  const results: NaturalLanguageSearchResult[] = [];
  const seenIndices = new Set<number>();

  for (const line of lines) {
    let match = line.match(/\[(\d+)\]\s*[|]\s*(\d+)\s*[|]\s*(.*)/);

    if (!match) {
      match = line.match(/(\d+)\s*[|]\s*(\d+)\s*[|]\s*(.*)/);
    }

    if (!match) continue;

    const [, indexStr, scoreStr, reasonsStr] = match;
    if (!indexStr || !scoreStr) continue;
    const bookIndex = parseInt(indexStr, 10);
    const matchScore = Math.min(Math.max(parseInt(scoreStr, 10) || 0, 0), 100);

    if (isNaN(bookIndex) || bookIndex < 0 || bookIndex >= bookCatalog.length) continue;

    const book = bookCatalog[bookIndex];
    if (!book || seenIndices.has(bookIndex)) continue;

    seenIndices.add(bookIndex);

    const matchReasons = (reasonsStr || '')
      .split(/[;|]/)
      .map(r => r.trim())
      .filter(r => r.length > 0);

    if (matchReasons.length === 0) {
      matchReasons.push('Matches your search criteria');
    }

    results.push({
      book,
      matchScore,
      matchReasons: matchReasons.slice(0, 3),
      relevanceToQuery: matchScore
    });
  }

  results.sort((a, b) => b.matchScore - a.matchScore);
  return results.slice(0, limit);
}
