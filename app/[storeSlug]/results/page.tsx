"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import ResultSection from "@/components/ResultSection";
import BookDetailModal from "@/components/BookDetailModal";
import type { SearchResult, BookSearchMatch, Book } from "@/lib/types";
import { getStore } from "@/lib/stores";
import { notFound } from "next/navigation";

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SearchResultsContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
    </div>
  );
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const store = getStore(storeSlug);
  if (!store) {
    notFound();
  }

  const query = searchParams?.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedBook, setSelectedBook] = useState<BookSearchMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);

      fetch('/api/search/categorized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Search failed (${res.status})`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            setResults({
              query: data.query || query,
              atmosphere: data.atmosphere || { tags: [], books: [] },
              characters: data.characters || { tags: [], books: [] },
              plot: data.plot || { tags: [], books: [] }
            });
          } else {
            throw new Error(data.error || 'Search failed');
          }
        })
        .catch((err) => {
          console.error('Search error:', err);
          setError(err instanceof Error ? err.message : 'Failed to load search results');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/${storeSlug}/results?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleBookClick = (bookMatch: BookSearchMatch) => {
    setSelectedBook(bookMatch);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  if (loading || !results) {
    return (
      <div className="min-h-screen bg-light-primary dark:bg-dark-primary">
        <div className="sticky top-0 z-40 bg-light-secondary dark:bg-dark-secondary border-b-[5px] border-light-border dark:border-dark-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-2xl font-black text-light-text dark:text-dark-text"
              >
                <ArrowLeft size={24} strokeWidth={3} />
              </button>
              <h1 className="font-display font-black text-xl text-light-text dark:text-dark-text">Search Results</h1>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mb-4" strokeWidth={2.5} />
          <p className="text-light-text dark:text-dark-text font-bold text-lg mb-2">
            {loading ? 'Searching for books...' : 'Loading results...'}
          </p>
          {query && (
            <p className="text-light-textSecondary dark:text-dark-textSecondary font-semibold text-sm">
              "{query}"
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-primary dark:bg-dark-primary">
        <div className="sticky top-0 z-40 bg-light-secondary dark:bg-dark-secondary border-b-[5px] border-light-border dark:border-dark-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="text-2xl font-black text-light-text dark:text-dark-text">
                <ArrowLeft size={24} strokeWidth={3} />
              </button>
              <h1 className="font-display font-black text-xl text-light-text dark:text-dark-text">Search Results</h1>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="max-w-lg mx-auto p-6 bg-red-100 dark:bg-red-900/30 border-[5px] border-red-600 dark:border-red-500 rounded-xl">
            <p className="font-bold text-red-900 dark:text-red-200 mb-2">Error loading results</p>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            <button
              onClick={() => router.push(`/${storeSlug}`)}
              className="mt-4 px-6 py-3 bg-accent-cyan border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-sm text-white shadow-brutal-badge hover:shadow-brutal-button transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasNoResults = results.atmosphere.books.length === 0 &&
                       results.characters.books.length === 0 &&
                       results.plot.books.length === 0;

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-light-secondary dark:bg-dark-secondary border-b-[5px] border-light-border dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.push(`/${storeSlug}`)}
              className="text-2xl font-black text-light-text dark:text-dark-text"
            >
              <ArrowLeft size={24} strokeWidth={3} />
            </button>
            <h1 className="font-black text-xl md:text-2xl text-light-text dark:text-dark-text flex-1">
              Search Results
            </h1>
          </div>
          {query && (
            <p className="text-sm md:text-base font-semibold text-light-textSecondary dark:text-dark-textSecondary mb-2 px-1">
              "{query}"
            </p>
          )}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="describe your reading vibe..."
              className="w-full px-4 py-3 border-[3px] border-light-border dark:border-dark-border rounded-xl font-semibold bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text shadow-brutal-badge focus:outline-none focus:shadow-brutal-input-focus focus:border-accent-cyan transition-all"
            />
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {hasNoResults ? (
          <div className="text-center py-16">
            <p className="font-bold text-xl text-light-text dark:text-dark-text mb-2">No books found</p>
            <p className="font-semibold text-light-textSecondary dark:text-dark-textSecondary mb-6">
              Try a different search
            </p>
            <button
              onClick={() => router.push(`/${storeSlug}`)}
              className="px-6 py-3 bg-accent-cyan border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-sm text-white shadow-brutal-badge hover:shadow-brutal-button transition-all"
            >
              Start New Search
            </button>
          </div>
        ) : (
          <>
            {/* Atmosphere */}
            <ResultSection
              icon="🌟"
              title="Atmosphere"
              tags={results.atmosphere.tags}
              tagColor="bg-accent-cyan"
              books={results.atmosphere.books}
              onBookClick={handleBookClick}
            />

            {/* Characters */}
            <ResultSection
              icon="💫"
              title="Characters"
              tags={results.characters.tags}
              tagColor="bg-accent-purple text-white"
              books={results.characters.books}
              onBookClick={handleBookClick}
            />

            {/* Plot */}
            <ResultSection
              icon="📖"
              title="Plot"
              tags={results.plot.tags}
              tagColor="bg-accent-coral text-white"
              books={results.plot.books}
              onBookClick={handleBookClick}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => router.push(`/${storeSlug}`)}
                className="flex-1 px-6 py-4 bg-accent-cyan border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-sm text-white shadow-brutal-badge hover:shadow-brutal-button transition-all"
              >
                New Search
              </button>
            </div>
          </>
        )}
      </div>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook?.book || null}
        isOpen={isModalOpen}
        onClose={closeModal}
        matchPercentage={selectedBook?.matchPercentage}
        matchReasons={selectedBook ? Object.values(selectedBook.matchReasons).flat() : undefined}
        availability={selectedBook?.availability}
      />
    </div>
  );
}
