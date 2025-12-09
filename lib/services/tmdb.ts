const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export interface ExtractedThemes {
  themes: string[];
  tropes: string[];
  mood: string[];
}

// Cache for movie themes
const movieThemeCache = new Map<string, { themes: ExtractedThemes; timestamp: number }>();
const MOVIE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Extract themes from movie (with fallback for known movies)
 */
export async function extractThemesFromMovie(movieTitle: string): Promise<ExtractedThemes> {
  const cacheKey = movieTitle.toLowerCase().trim();
  const cached = movieThemeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < MOVIE_CACHE_TTL) {
    return cached.themes;
  }

  // Fallback mapping for common movie references
  const mockThemeMapping: Record<string, ExtractedThemes> = {
    'Succession': {
      themes: ['family drama', 'corporate intrigue', 'power struggles', 'betrayal', 'wealth'],
      tropes: ['dysfunctional family', 'corporate thriller', 'morally grey characters', 'dark comedy'],
      mood: ['dark', 'intense', 'character-driven', 'satirical']
    },
    'Gone Girl': {
      themes: ['marriage', 'deception', 'media manipulation', 'revenge'],
      tropes: ['unreliable narrator', 'twist ending', 'psychological thriller', 'toxic relationship'],
      mood: ['dark', 'suspenseful', 'twisted', 'psychological']
    },
    'The Social Network': {
      themes: ['ambition', 'friendship betrayal', 'success', 'innovation'],
      tropes: ['rise to power', 'genius protagonist', 'friendship breakup'],
      mood: ['fast-paced', 'intense', 'smart', 'dialogue-heavy']
    },
    'Interstellar': {
      themes: ['survival', 'love transcends time', 'sacrifice', 'family'],
      tropes: ['space exploration', 'time dilation', 'father-daughter bond'],
      mood: ['epic', 'emotional', 'thought-provoking']
    },
    'The Martian': {
      themes: ['survival', 'problem-solving', 'isolation', 'human ingenuity'],
      tropes: ['lone survivor', 'science saves the day', 'rescue mission'],
      mood: ['uplifting', 'humorous', 'thrilling', 'sciencey']
    },
    'Paddington': {
      themes: ['found family', 'kindness', 'belonging', 'community'],
      tropes: ['fish out of water', 'heartwarming', 'wholesome'],
      mood: ['cozy', 'heartwarming', 'whimsical', 'uplifting']
    }
  };

  const result = mockThemeMapping[movieTitle] || { themes: [], tropes: [], mood: [] };
  movieThemeCache.set(cacheKey, { themes: result, timestamp: Date.now() });
  return result;
}

/**
 * Extract movie references from natural language query
 */
export function extractMovieReferences(query: string): string[] {
  const commonPhrases = [
    /(?:books?\s+)?like\s+(?:the\s+)?(?:movie|film|show|series)\s+([A-Z][a-zA-Z0-9\s]+?)(?:\s+but|\s+book|,|$|\.)/gi,
    /like\s+([A-Z][a-zA-Z\s]+?)(?:\s+but|,|$|\.)/gi,
    /similar\s+to\s+([A-Z][a-zA-Z\s]+?)(?:\s+but|,|$|\.)/gi,
    /(\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+vibes/gi,
  ];

  const matches = new Set<string>();

  for (const pattern of commonPhrases) {
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(query)) !== null) {
      if (!match[1]) continue;
      let extracted = match[1].trim();
      extracted = extracted.replace(/^(the|a|an)\s+/i, '').trim();
      extracted = extracted.replace(/\s+(movie|film|show|series|book|books)$/i, '').trim();

      const extractedLower = extracted.toLowerCase();
      if (extracted && extracted.length > 2 &&
          !['the', 'movie', 'film', 'show', 'series', 'book', 'books'].includes(extractedLower)) {
        matches.add(extracted);
      }
    }
  }

  return Array.from(matches);
}
